"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import { int, str } from "@/lib/form";
import { skills } from "@/lib/schema";

function done() {
  revalidateAllLocales();
  redirect("/admin/skills?saved=1");
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  await db.insert(skills).values({
    name: str(formData, "name"),
    category: str(formData, "category"),
    order: int(formData, "order"),
  });
  done();
}

export async function updateSkill(formData: FormData) {
  await requireAdmin();
  await db
    .update(skills)
    .set({
      name: str(formData, "name"),
      category: str(formData, "category"),
      order: int(formData, "order"),
    })
    .where(eq(skills.id, str(formData, "id")));
  done();
}

export async function deleteSkill(formData: FormData) {
  await requireAdmin();
  await db.delete(skills).where(eq(skills.id, str(formData, "id")));
  done();
}
