"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import {
  csv,
  int,
  localized,
  localizedList,
  optional,
  str,
} from "@/lib/form";
import { experience } from "@/lib/schema";

function done() {
  revalidateAllLocales();
  redirect("/admin/experience?saved=1");
}

function fields(formData: FormData) {
  return {
    position: localized(formData, "position"),
    company: optional(formData, "company"),
    location: optional(formData, "location"),
    period: localized(formData, "period"),
    duration: localized(formData, "duration"),
    type: str(formData, "type") || "internship",
    description: localized(formData, "description"),
    responsibilities: localizedList(formData, "responsibilities"),
    technologies: csv(formData, "technologies"),
    order: int(formData, "order"),
  };
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  await db.insert(experience).values(fields(formData));
  done();
}

export async function updateExperience(formData: FormData) {
  await requireAdmin();
  await db
    .update(experience)
    .set(fields(formData))
    .where(eq(experience.id, str(formData, "id")));
  done();
}

export async function deleteExperience(formData: FormData) {
  await requireAdmin();
  await db.delete(experience).where(eq(experience.id, str(formData, "id")));
  done();
}
