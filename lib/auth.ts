import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as OTPAuth from "otpauth";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { checkLockout, clearFailures, clientKey, recordFailure } from "./rate-limit";
import { authState } from "./schema";

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  totp: z.string().optional(),
  rememberMe: z.string().optional(),
});

const AUTH_STATE_ID = "admin";

export function totpEnabled() {
  return Boolean(process.env.ADMIN_TOTP_SECRET);
}

function totpDelta(code: string | undefined): number | null {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return 0;
  if (!code) return null;

  const totp = new OTPAuth.TOTP({
    issuer: "Portfolio Admin",
    label: process.env.ADMIN_EMAIL ?? "admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  // window: 1 tolerates one 30s step of clock drift either way.
  return totp.validate({ token: code.replace(/\s/g, ""), window: 1 });
}

/**
 * Burns the time step a code belongs to, so the same code cannot be replayed
 * during the ~90s it stays arithmetically valid. Only called once the password
 * has already passed, otherwise an attacker could burn steps to lock the owner
 * out of their own codes.
 */
async function consumeTotpStep(delta: number): Promise<boolean> {
  if (!process.env.ADMIN_TOTP_SECRET) return true;

  const step = Math.floor(Date.now() / 1000 / 30) + delta;

  const [state] = await db
    .select()
    .from(authState)
    .where(eq(authState.id, AUTH_STATE_ID))
    .limit(1);

  if (state) {
    if (state.lastTotpStep !== null && step <= state.lastTotpStep) return false;
    await db
      .update(authState)
      .set({ lastTotpStep: step })
      .where(eq(authState.id, AUTH_STATE_ID));
  } else {
    await db.insert(authState).values({ id: AUTH_STATE_ID, lastTotpStep: step });
  }

  return true;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totp: { label: "Authentication code", type: "text" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(raw, request) {
        // Enforced here rather than in the login action because
        // /api/auth/callback/credentials can be posted to directly.
        const key = clientKey(request);
        if ((await checkLockout(key)).blocked) return null;

        const parsed = LoginSchema.safeParse(raw);
        if (!parsed.success) {
          await recordFailure(key);
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        // A bcrypt hash is full of "$", which dotenv-expand reads as variable
        // references, so .env.local stores it backslash-escaped. Platform env
        // UIs (Vercel) pass the raw value through instead — accept both.
        const passwordHash = process.env.ADMIN_PASSWORD_HASH?.replaceAll(
          "\\$",
          "$",
        );
        if (!adminEmail || !passwordHash) return null;

        // Every check always runs, so a wrong email costs the same time as a
        // wrong password and can't be distinguished from the outside.
        const emailMatches =
          parsed.data.email.toLowerCase() === adminEmail.toLowerCase();
        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          passwordHash,
        );
        const delta = totpDelta(parsed.data.totp);

        if (!emailMatches || !passwordMatches || delta === null) {
          await recordFailure(key);
          return null;
        }

        if (!(await consumeTotpStep(delta))) {
          await recordFailure(key);
          return null;
        }

        await clearFailures(key);

        return {
          id: "admin",
          email: adminEmail,
          name: "Admin",
          rememberMe: parsed.data.rememberMe === "on",
        };
      },
    }),
  ],
});
