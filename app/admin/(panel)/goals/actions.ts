"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import { bool, int, localized, str } from "@/lib/form";
import { goals } from "@/lib/schema";

function done() {
  revalidateAllLocales();
  redirect("/admin/goals?saved=1");
}

function fields(formData: FormData) {
  return {
    text: localized(formData, "text"),
    term: str(formData, "term") || "short_term",
    isPublic: bool(formData, "isPublic"),
    order: int(formData, "order"),
  };
}

export async function createGoal(formData: FormData) {
  await requireAdmin();
  await db.insert(goals).values(fields(formData));
  done();
}

export async function updateGoal(formData: FormData) {
  await requireAdmin();
  await db
    .update(goals)
    .set(fields(formData))
    .where(eq(goals.id, str(formData, "id")));
  done();
}

export async function deleteGoal(formData: FormData) {
  await requireAdmin();
  await db.delete(goals).where(eq(goals.id, str(formData, "id")));
  done();
}
