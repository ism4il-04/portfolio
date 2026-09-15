import createMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./lib/auth.config";
import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const signedIn = Boolean(req.auth);

    if (pathname === "/admin/login") {
      return signedIn
        ? NextResponse.redirect(new URL("/admin", req.nextUrl))
        : NextResponse.next();
    }

    return signedIn
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
