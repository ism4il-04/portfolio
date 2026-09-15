import type { NextAuthConfig } from "next-auth";

export const REMEMBERED = 30 * 24 * 60 * 60;
export const NOT_REMEMBERED = 12 * 60 * 60;

// Kept free of bcrypt, otpauth and database imports so middleware can run it on
// the edge. The jwt callback must live here rather than alongside the provider:
// middleware builds its own NextAuth instance from this config, and a session
// check it doesn't share would let expired tokens through the guard.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: REMEMBERED },
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const remembered = "rememberMe" in user && Boolean(user.rememberMe);
        token.expiresAt =
          Math.floor(Date.now() / 1000) +
          (remembered ? REMEMBERED : NOT_REMEMBERED);
      }

      // Auth.js signs every token with the global maxAge, so the shorter
      // unremembered session is enforced here: null drops the session.
      const expiresAt = token.expiresAt;
      if (typeof expiresAt === "number" && Date.now() / 1000 > expiresAt) {
        return null;
      }

      return token;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
