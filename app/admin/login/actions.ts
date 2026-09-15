"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { checkLockout, clientKey, type Lockout } from "@/lib/rate-limit";

export type LoginState = { error?: string };

function lockoutMessage(lockout: Lockout): string {
  const wait = humanDuration(lockout.retryAfterSeconds);
  return lockout.scope === "global"
    ? `Sign-in is temporarily disabled after repeated failed attempts across the site. Try again in ${wait}.`
    : `Too many failed attempts. Try again in ${wait}.`;
}

function humanDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.ceil(seconds / 3600);
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Bots fill every field they find; humans never see this one.
  if (typeof formData.get("company") === "string" && formData.get("company")) {
    return { error: "Invalid credentials." };
  }

  // authorize() enforces the lockout independently. This check exists only so a
  // blocked visitor gets told how long to wait instead of a generic rejection.
  const key = clientKey(new Request("http://local", { headers: await headers() }));
  const lockout = await checkLockout(key);
  if (lockout.blocked) return { error: lockoutMessage(lockout) };

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      totp: formData.get("totp") ?? "",
      rememberMe: formData.get("rememberMe") ?? "",
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    // A successful sign-in throws NEXT_REDIRECT, which must propagate.
    if (error instanceof AuthError) {
      const after = await checkLockout(key);
      if (after.blocked) return { error: lockoutMessage(after) };
      // Deliberately does not say which field was wrong.
      return { error: "Invalid credentials." };
    }
    throw error;
  }
}
