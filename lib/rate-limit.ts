import { inArray } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { loginAttempts } from "./schema";

const MAX_ATTEMPTS = 3;

// Each successive lockout for the same key steps further down this ladder and
// stays on the last rung.
const LADDER_SECONDS = [5 * 60, 30 * 60, 60 * 60, 24 * 60 * 60];

// A key that behaves for this long is forgiven and starts again from the top.
const DECAY_SECONDS = 24 * 60 * 60;

// Ceiling that per-IP throttling alone cannot provide: an attacker rotating
// addresses gets a fresh ladder every time, so total failures are capped too.
// Set high enough that ordinary mistyping never reaches it, and deliberately
// non-escalating and short — a hostile party can trip it to lock the owner out,
// and 15 minutes bounds how much that is worth.
const GLOBAL_KEY = "__global__";
const GLOBAL_WINDOW_SECONDS = 15 * 60;
const GLOBAL_MAX_FAILURES = 50;
const GLOBAL_LOCK_SECONDS = 15 * 60;

export type Lockout = {
  blocked: boolean;
  retryAfterSeconds: number;
  scope?: "key" | "global";
};

const OPEN: Lockout = { blocked: false, retryAfterSeconds: 0 };

/**
 * Identifies the caller for throttling.
 *
 * Order matters: x-vercel-forwarded-for and x-real-ip are written by Vercel's
 * edge and cannot be set by the client. x-forwarded-for can — a client may send
 * its own, and the proxy appends the true address, so the RIGHTMOST entry is
 * the trustworthy one. Reading the leftmost would hand the attacker control of
 * their own throttle key.
 */
export function clientKey(request?: Request): string {
  const headers = request?.headers;
  if (!headers) return "unknown";

  const vercel = headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) return vercel.slice(0, 120);

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 120);

  const chain = headers.get("x-forwarded-for");
  if (chain) {
    const parts = chain.split(",").map((part) => part.trim()).filter(Boolean);
    const rightmost = parts.at(-1);
    if (rightmost) return rightmost.slice(0, 120);
  }

  return "unknown";
}

export async function checkLockout(key: string): Promise<Lockout> {
  const rows = await db
    .select()
    .from(loginAttempts)
    .where(inArray(loginAttempts.key, [key, GLOBAL_KEY]));

  const now = Date.now();

  const global = rows.find((row) => row.key === GLOBAL_KEY);
  if (global?.lockedUntil) {
    const remaining = global.lockedUntil.getTime() - now;
    if (remaining > 0) {
      return {
        blocked: true,
        retryAfterSeconds: Math.ceil(remaining / 1000),
        scope: "global",
      };
    }
  }

  const own = rows.find((row) => row.key === key);
  if (own?.lockedUntil) {
    const remaining = own.lockedUntil.getTime() - now;
    if (remaining > 0) {
      return {
        blocked: true,
        retryAfterSeconds: Math.ceil(remaining / 1000),
        scope: "key",
      };
    }
  }

  return OPEN;
}

async function bumpGlobal(now: Date): Promise<void> {
  const [row] = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.key, GLOBAL_KEY))
    .limit(1);

  if (!row) {
    await db.insert(loginAttempts).values({
      key: GLOBAL_KEY,
      failures: 1,
      level: 0,
      lastFailureAt: now,
    });
    return;
  }

  const quietFor =
    (now.getTime() - (row.lastFailureAt?.getTime() ?? 0)) / 1000;
  const failures = (quietFor > GLOBAL_WINDOW_SECONDS ? 0 : row.failures) + 1;

  if (failures < GLOBAL_MAX_FAILURES) {
    await db
      .update(loginAttempts)
      .set({ failures, lastFailureAt: now })
      .where(eq(loginAttempts.key, GLOBAL_KEY));
    return;
  }

  await db
    .update(loginAttempts)
    .set({
      failures: 0,
      lastFailureAt: now,
      lockedUntil: new Date(now.getTime() + GLOBAL_LOCK_SECONDS * 1000),
    })
    .where(eq(loginAttempts.key, GLOBAL_KEY));
}

export async function recordFailure(key: string): Promise<void> {
  const now = new Date();

  await bumpGlobal(now);

  const [existing] = await db
    .select()
    .from(loginAttempts)
    .where(eq(loginAttempts.key, key))
    .limit(1);

  if (!existing) {
    await db.insert(loginAttempts).values({
      key,
      failures: 1,
      level: 0,
      lastFailureAt: now,
    });
    return;
  }

  const quietFor =
    (now.getTime() - (existing.lastFailureAt?.getTime() ?? 0)) / 1000;
  const decayed = quietFor > DECAY_SECONDS;

  const failures = (decayed ? 0 : existing.failures) + 1;
  const level = decayed ? 0 : existing.level;

  if (failures < MAX_ATTEMPTS) {
    await db
      .update(loginAttempts)
      .set({ failures, level, lastFailureAt: now })
      .where(eq(loginAttempts.key, key));
    return;
  }

  const seconds = LADDER_SECONDS[Math.min(level, LADDER_SECONDS.length - 1)];

  await db
    .update(loginAttempts)
    .set({
      failures: 0,
      level: level + 1,
      lockedUntil: new Date(now.getTime() + seconds * 1000),
      lastFailureAt: now,
    })
    .where(eq(loginAttempts.key, key));
}

export async function clearFailures(key: string): Promise<void> {
  // The global counter is left alone: one person signing in successfully is no
  // evidence that an ongoing attack has stopped.
  await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
}
