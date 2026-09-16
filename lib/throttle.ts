import { sql } from "drizzle-orm";
import { db } from "./db";
import { rateLimits } from "./schema";

/**
 * Counts one hit against a fixed time window and returns the total including
 * this one. The read-and-increment is a single upsert, so two concurrent
 * requests can't both see the old count and slip under a limit.
 */
export async function hit(key: string, windowSeconds: number): Promise<number> {
  const expired = sql`${rateLimits.windowStart} < now() - make_interval(secs => ${windowSeconds})`;

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart: sql`now()` })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${expired} then 1 else ${rateLimits.count} + 1 end`,
        windowStart: sql`case when ${expired} then now() else ${rateLimits.windowStart} end`,
      },
    })
    .returning({ count: rateLimits.count });

  return row.count;
}
