import { timingSafeEqual } from "node:crypto";
import { and, isNull, lt, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginAttempts, messages, rateLimits } from "@/lib/schema";

export const dynamic = "force-dynamic";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

/**
 * Enforces the retention periods stated in the privacy policy. Vercel Cron
 * calls this daily with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedMessages = await db
    .delete(messages)
    .where(lt(messages.createdAt, sql`now() - interval '3 years'`))
    .returning({ id: messages.id });

  // Never drop a row whose lockout is still running — that would lift it early.
  const deletedAttempts = await db
    .delete(loginAttempts)
    .where(
      and(
        lt(loginAttempts.lastFailureAt, sql`now() - interval '30 days'`),
        or(
          isNull(loginAttempts.lockedUntil),
          lt(loginAttempts.lockedUntil, sql`now()`),
        ),
      ),
    )
    .returning({ id: loginAttempts.id });

  // The longest window is one day; anything older can't affect a count.
  const deletedLimits = await db
    .delete(rateLimits)
    .where(lt(rateLimits.windowStart, sql`now() - interval '2 days'`))
    .returning({ key: rateLimits.key });

  return NextResponse.json({
    messages: deletedMessages.length,
    loginAttempts: deletedAttempts.length,
    rateLimits: deletedLimits.length,
  });
}
