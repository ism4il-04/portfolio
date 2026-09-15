"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireAdmin, revalidateAllLocales } from "@/lib/admin";
import { db } from "@/lib/db";
import { localized, localizedList, optional, str } from "@/lib/form";
import { profile } from "@/lib/schema";

export async function saveProfile(formData: FormData) {
  await requireAdmin();

  const values = {
    name: str(formData, "name"),
    title: localized(formData, "title"),
    tagline: localized(formData, "tagline"),
    availability: localized(formData, "availability"),
    location: optional(formData, "location"),
    email: optional(formData, "email"),
    phone: optional(formData, "phone"),
    githubUrl: optional(formData, "githubUrl"),
    aboutSummary: localizedList(formData, "aboutSummary"),
    avatarUrl: optional(formData, "avatarUrl"),
    resumeUrlFr: optional(formData, "resumeUrlFr"),
    resumeUrlEn: optional(formData, "resumeUrlEn"),
    updatedAt: new Date(),
  };

  const id = str(formData, "id");
  if (id) {
    await db.update(profile).set(values).where(eq(profile.id, id));
  } else {
    await db.insert(profile).values(values);
  }

  revalidateAllLocales();
  redirect("/admin/profile?saved=1");
}
