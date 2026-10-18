import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProfile, getProjects } from "@/lib/queries";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, profile] = await Promise.all([getProjects(), getProfile()]);
  // A lastmod that changes on every build teaches Google to ignore it; only
  // the profile row records real edits, so only the home page claims one.
  const homeModified = profile?.updatedAt ?? undefined;

  const paths = [
    "",
    "/projects",
    ...projects.map((project) => `/projects/${project.slug}`),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      ...(path === "" && homeModified && { lastModified: homeModified }),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((code) => [code, `${siteUrl}/${code}${path}`]),
        ),
      },
    })),
  );
}
