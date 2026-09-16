import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  bigint,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export type Localized = { fr: string; en: string };
export type LocalizedList = { fr: string[]; en: string[] };

export const profile = pgTable("profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  title: jsonb("title").$type<Localized>(),
  tagline: jsonb("tagline").$type<Localized>(),
  location: varchar("location", { length: 120 }),
  email: varchar("email", { length: 160 }),
  phone: varchar("phone", { length: 40 }),
  githubUrl: text("github_url"),
  availability: jsonb("availability").$type<Localized>(),
  aboutSummary: jsonb("about_summary").$type<LocalizedList>(),
  avatarUrl: text("avatar_url"),
  resumeUrlFr: text("resume_url_fr"),
  resumeUrlEn: text("resume_url_en"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 80 }).notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  order: integer("order").default(0),
});

export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  degree: jsonb("degree").$type<Localized>().notNull(),
  field: jsonb("field").$type<Localized>(),
  institution: varchar("institution", { length: 200 }),
  location: varchar("location", { length: 120 }),
  period: jsonb("period").$type<Localized>(),
  order: integer("order").default(0),
});

export const educationAchievements = pgTable("education_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  educationId: uuid("education_id")
    .references(() => education.id, { onDelete: "cascade" })
    .notNull(),
  achievement: jsonb("achievement").$type<Localized>().notNull(),
  order: integer("order").default(0),
});

export const experience = pgTable("experience", {
  id: uuid("id").primaryKey().defaultRandom(),
  position: jsonb("position").$type<Localized>().notNull(),
  company: varchar("company", { length: 160 }),
  location: varchar("location", { length: 120 }),
  period: jsonb("period").$type<Localized>(),
  duration: jsonb("duration").$type<Localized>(),
  type: varchar("type", { length: 30 }).default("internship"),
  description: jsonb("description").$type<Localized>(),
  responsibilities: jsonb("responsibilities").$type<LocalizedList>(),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  order: integer("order").default(0),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: jsonb("description").$type<Localized>(),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  thumbnailUrl: text("thumbnail_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  order: integer("order").default(0),
});

export const extracurricular = pgTable("extracurricular", {
  id: uuid("id").primaryKey().defaultRandom(),
  role: jsonb("role").$type<Localized>().notNull(),
  organization: varchar("organization", { length: 160 }),
  period: jsonb("period").$type<Localized>(),
  type: varchar("type", { length: 30 }),
  order: integer("order").default(0),
});

export const loginAttempts = pgTable("login_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 120 }).notNull().unique(),
  failures: integer("failures").notNull().default(0),
  // How many lockouts this key has already served; indexes into the ladder.
  level: integer("level").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  lastFailureAt: timestamp("last_failure_at").defaultNow(),
});

// Fixed-window counters for throttling anything other than login, e.g.
// "contact:<ip>" or "contact-email:day". Rows are disposable; a purge job
// removes stale windows.
export const rateLimits = pgTable("rate_limits", {
  key: varchar("key", { length: 160 }).primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start").notNull().defaultNow(),
});

// Single row. Tracks the newest consumed TOTP step so a captured code cannot be
// replayed inside its validity window.
export const authState = pgTable("auth_state", {
  id: varchar("id", { length: 20 }).primaryKey(),
  lastTotpStep: bigint("last_totp_step", { mode: "number" }),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 160 }).notNull(),
  subject: varchar("subject", { length: 200 }),
  body: text("body").notNull(),
  locale: varchar("locale", { length: 5 }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: jsonb("text").$type<Localized>().notNull(),
  term: varchar("term", { length: 20 }),
  isPublic: boolean("is_public").default(true),
  order: integer("order").default(0),
});
