import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/schema";
import {
  profileData,
  skillsData,
  educationData,
  experienceData,
  projectsData,
  extracurricularData,
  goalsData,
} from "./data";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set — add it to .env.local first.");
}

// Seeding deletes every row before inserting. Pointed at the wrong database it
// wipes the live site, so it refuses to run without an explicit --force and
// names the host it would clear.
const host = new URL(process.env.DATABASE_URL).host;
if (!process.argv.includes("--force")) {
  console.error(
    [
      `Refusing to seed ${host}.`,
      "This DELETES every profile, skill, education, experience, project,",
      "extracurricular and goal row, then re-inserts the seed data.",
      "Check that host is not production, then run:",
      "  npm run db:seed -- --force",
    ].join("\n"),
  );
  process.exit(1);
}
console.log(`Seeding ${host}`);

const db = drizzle(neon(process.env.DATABASE_URL), { schema });

async function main() {
  console.log("Clearing existing rows...");
  await db.delete(schema.educationAchievements);
  await db.delete(schema.education);
  await db.delete(schema.experience);
  await db.delete(schema.projects);
  await db.delete(schema.extracurricular);
  await db.delete(schema.goals);
  await db.delete(schema.skills);
  await db.delete(schema.profile);

  console.log("Inserting profile...");
  await db.insert(schema.profile).values(profileData);

  console.log(`Inserting ${skillsData.length} skills...`);
  await db
    .insert(schema.skills)
    .values(skillsData.map((s, i) => ({ ...s, order: i })));

  console.log(`Inserting ${educationData.length} education entries...`);
  for (const [i, entry] of educationData.entries()) {
    const { achievements, ...rest } = entry;
    const [inserted] = await db
      .insert(schema.education)
      .values({ ...rest, order: i })
      .returning({ id: schema.education.id });

    if (achievements.length > 0) {
      await db.insert(schema.educationAchievements).values(
        achievements.map((achievement, j) => ({
          educationId: inserted.id,
          achievement,
          order: j,
        })),
      );
    }
  }

  console.log(`Inserting ${experienceData.length} experience entries...`);
  await db
    .insert(schema.experience)
    .values(experienceData.map((e, i) => ({ ...e, order: i })));

  console.log(`Inserting ${projectsData.length} projects...`);
  await db
    .insert(schema.projects)
    .values(projectsData.map((p, i) => ({ ...p, order: i })));

  console.log(
    `Inserting ${extracurricularData.length} extracurricular entries...`,
  );
  await db
    .insert(schema.extracurricular)
    .values(extracurricularData.map((x, i) => ({ ...x, order: i })));

  console.log(`Inserting ${goalsData.length} goals...`);
  await db
    .insert(schema.goals)
    .values(goalsData.map((g, i) => ({ ...g, order: i })));

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
