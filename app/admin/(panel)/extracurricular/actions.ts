"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import { int, localized, optional, str } from "@/lib/form";
import { extracurricular } from "@/lib/schema";

function done() {
  revalidateAllLocales();
  redirect("/admin/extracurricular?saved=1");
}

function fields(formData: FormData) {
  return {
    role: localized(formData, "role"),
    organization: optional(formData, "organization"),
    period: localized(formData, "period"),
    type: str(formData, "type") || "leadership",
    order: int(formData, "order"),
  };
}

export async function createExtracurricular(formData: FormData) {
  await requireAdmin();
  await db.insert(extracurricular).values(fields(formData));
  done();
}

export async function updateExtracurricular(formData: FormData) {
  await requireAdmin();
  await db
    .update(extracurricular)
    .set(fields(formData))
    .where(eq(extracurricular.id, str(formData, "id")));
  done();
}

export async function deleteExtracurricular(formData: FormData) {
  await requireAdmin();
  await db
    .delete(extracurricular)
    .where(eq(extracurricular.id, str(formData, "id")));
  done();
}
