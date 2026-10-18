import { routing } from "@/i18n/routing";
import { pick } from "@/lib/localized";
import type { profile as profileTable } from "@/lib/schema";

// VERCEL_PROJECT_PRODUCTION_URL is set by Vercel itself, so a forgotten
// NEXT_PUBLIC_SITE_URL still yields real canonical links rather than localhost.
const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelProduction ? `https://${vercelProduction}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Next merges metadata shallowly: a page that sets only `title` inherits the
 * layout's whole openGraph block, so shared links would show the home page's
 * title and URL. Pages with their own identity must set these explicitly.
 */
export function socialMetadata({
  title,
  description,
  path,
  locale,
}: {
  title: string;
  description?: string;
  path: string;
  locale: string;
}) {
  // Overriding openGraph also drops the image inherited from the file-based
  // app/[locale]/opengraph-image, so it has to be restated here.
  const image = {
    url: `${siteUrl}/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
  };

  return {
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}${path}`,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
      type: "website" as const,
      images: [image],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image.url],
    },
  };
}

export function alternates(path: string, locale: string) {
  return {
    canonical: `/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((code) => [code, `/${code}${path}`]),
      ),
      "x-default": `/${routing.defaultLocale}${path}`,
    },
  };
}

/**
 * The tagline alone (~75 characters) leaves most of the snippet Google shows
 * unused. Name, role, city and availability are what a recruiter searches for,
 * so they go first; the result stays under ~160 characters in practice.
 */
export function metaDescription(
  profile: typeof profileTable.$inferSelect,
  locale: string,
) {
  const title = pick(profile.title, locale);
  const city = profile.location?.split(",")[0]?.trim();
  const tagline = pick(profile.tagline, locale);
  const availability = pick(profile.availability, locale);

  const lead = [profile.name, title].filter(Boolean).join(", ");
  return [city ? `${lead} (${city})` : lead, tagline, availability]
    .filter(Boolean)
    .map((part) => part.replace(/[.\s]+$/, ""))
    .join(". ")
    .concat(".");
}

/** Cloudinary resizes on delivery; social cards and OG renders want small JPEGs. */
export function cloudinaryThumb(url: string, size: number) {
  if (!url.startsWith("https://res.cloudinary.com/")) return url;
  return url.replace(
    "/image/upload/",
    `/image/upload/c_fill,g_face,w_${size},h_${size},f_jpg,q_85/`,
  );
}
