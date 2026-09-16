"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  parseOrBounce,
  requireAdmin,
  revalidateAllLocales,
} from "@/lib/admin";
import { db } from "@/lib/db";
import {
  bool,
  csv,
  imageLink,
  imageLinks,
  int,
  link,
  localized,
  slugify,
  str,
} from "@/lib/form";
import { projects } from "@/lib/schema";

function done(slug?: string) {
  revalidateAllLocales();
  revalidateAllLocales("/projects");
  if (slug) revalidateAllLocales(`/projects/${slug}`);
  redirect("/admin/projects?saved=1");
}

/** Slugs are unique in the schema; a collision would otherwise throw mid-save. */
async function uniqueSlug(desired: string, excludeId?: string) {
  const base = desired || "project";
  let candidate = base;

  for (let suffix = 2; suffix < 100; suffix += 1) {
    const clash = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        excludeId
          ? and(eq(projects.slug, candidate), ne(projects.id, excludeId))
          : eq(projects.slug, candidate),
      )
      .limit(1);

    if (clash.length === 0) return candidate;
    candidate = `${base}-${suffix}`;
  }

  return `${base}-${Date.now()}`;
}

function fields(formData: FormData) {
  return parseOrBounce("/admin/projects", () => ({
    title: str(formData, "title"),
    description: localized(formData, "description"),
    technologies: csv(formData, "technologies"),
    featured: bool(formData, "featured"),
    thumbnailUrl: imageLink(formData, "thumbnailUrl"),
    gallery: imageLinks(formData, "gallery"),
    demoUrl: link(formData, "demoUrl"),
    repoUrl: link(formData, "repoUrl"),
    order: int(formData, "order"),
  }));
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const values = fields(formData);
  const slug = await uniqueSlug(slugify(str(formData, "slug") || values.title));
  await db.insert(projects).values({ ...values, slug });
  done(slug);
}

export async function updateProject(formData: FormData) {
  await requireAdmin();
  const values = fields(formData);
  const id = str(formData, "id");
  const previousSlug = str(formData, "previousSlug");
  const slug = await uniqueSlug(
    slugify(str(formData, "slug") || values.title),
    id,
  );

  await db
    .update(projects)
    .set({ ...values, slug })
    .where(eq(projects.id, id));

  // A renamed project leaves a stale page behind at the old path.
  if (previousSlug && previousSlug !== slug) {
    revalidateAllLocales(`/projects/${previousSlug}`);
  }
  done(slug);
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const slug = str(formData, "slug");
  await db.delete(projects).where(eq(projects.id, str(formData, "id")));
  done(slug);
}
