"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import { int, lines, localized, optional, str } from "@/lib/form";
import { education, educationAchievements } from "@/lib/schema";

function done() {
  revalidateAllLocales();
  redirect("/admin/education?saved=1");
}

function fields(formData: FormData) {
  return {
    degree: localized(formData, "degree"),
    field: localized(formData, "field"),
    institution: optional(formData, "institution"),
    location: optional(formData, "location"),
    period: localized(formData, "period"),
    order: int(formData, "order"),
  };
}

/**
 * Achievements are edited as two parallel line-per-item lists and rewritten
 * wholesale, which avoids a second layer of per-row CRUD. Lists are paired by
 * index; a missing counterpart becomes an empty string rather than dropping the
 * item, so an uneven paste is visible in the form instead of silently lost.
 */
async function replaceAchievements(educationId: string, formData: FormData) {
  const fr = lines(formData, "achievements.fr");
  const en = lines(formData, "achievements.en");

  await db
    .delete(educationAchievements)
    .where(eq(educationAchievements.educationId, educationId));

  const count = Math.max(fr.length, en.length);
  if (count === 0) return;

  await db.insert(educationAchievements).values(
    Array.from({ length: count }, (_, index) => ({
      educationId,
      achievement: { fr: fr[index] ?? "", en: en[index] ?? "" },
      order: index,
    })),
  );
}

export async function createEducation(formData: FormData) {
  await requireAdmin();
  const [row] = await db
    .insert(education)
    .values(fields(formData))
    .returning({ id: education.id });
  await replaceAchievements(row.id, formData);
  done();
}

export async function updateEducation(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await db.update(education).set(fields(formData)).where(eq(education.id, id));
  await replaceAchievements(id, formData);
  done();
}

export async function deleteEducation(formData: FormData) {
  await requireAdmin();
  // Achievements cascade via the foreign key.
  await db.delete(education).where(eq(education.id, str(formData, "id")));
  done();
}
