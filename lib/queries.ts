import { asc, count, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "./db";
import * as s from "./schema";

export const getProfile = cache(async () => {
  const [row] = await db.select().from(s.profile).limit(1);
  return row ?? null;
});

export const getSkills = cache(async () => {
  const rows = await db.select().from(s.skills).orderBy(asc(s.skills.order));

  const byCategory = new Map<string, typeof rows>();
  for (const row of rows) {
    const bucket = byCategory.get(row.category);
    if (bucket) bucket.push(row);
    else byCategory.set(row.category, [row]);
  }
  return byCategory;
});

export const getEducation = cache(async () => {
  const entries = await db
    .select()
    .from(s.education)
    .orderBy(asc(s.education.order));

  const achievements = await db
    .select()
    .from(s.educationAchievements)
    .orderBy(asc(s.educationAchievements.order));

  return entries.map((entry) => ({
    ...entry,
    achievements: achievements.filter((a) => a.educationId === entry.id),
  }));
});

export const getExperience = cache(async () =>
  db.select().from(s.experience).orderBy(asc(s.experience.order)),
);

export const getProjects = cache(async () =>
  db.select().from(s.projects).orderBy(asc(s.projects.order)),
);

export const getFeaturedProjects = cache(async () =>
  db
    .select()
    .from(s.projects)
    .where(eq(s.projects.featured, true))
    .orderBy(asc(s.projects.order)),
);

export const getProjectBySlug = cache(async (slug: string) => {
  const [row] = await db
    .select()
    .from(s.projects)
    .where(eq(s.projects.slug, slug))
    .limit(1);
  return row ?? null;
});

export const getExtracurricular = cache(async () =>
  db.select().from(s.extracurricular).orderBy(asc(s.extracurricular.order)),
);

export const getMessages = cache(async () =>
  db.select().from(s.messages).orderBy(desc(s.messages.createdAt)),
);

export const getUnreadMessageCount = cache(async () => {
  const [row] = await db
    .select({ value: count() })
    .from(s.messages)
    .where(eq(s.messages.isRead, false));
  return row?.value ?? 0;
});

export const getGoals = cache(async () => {
  const rows = await db
    .select()
    .from(s.goals)
    .where(eq(s.goals.isPublic, true))
    .orderBy(asc(s.goals.order));

  return {
    short: rows.filter((g) => g.term === "short_term"),
    long: rows.filter((g) => g.term === "long_term"),
  };
});
