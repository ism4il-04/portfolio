import { pick } from "@/lib/localized";
import { siteUrl } from "@/lib/seo";
import type { profile as profileTable } from "@/lib/schema";

type Profile = typeof profileTable.$inferSelect;

export function PersonSchema({
  profile,
  locale,
  knowsAbout,
  alumniOf,
}: {
  profile: Profile;
  locale: string;
  knowsAbout: string[];
  alumniOf: string[];
}) {
  const [locality, country] = (profile.location ?? "")
    .split(",")
    .map((part) => part.trim());

  const pageUrl = `${siteUrl}/${locale}`;

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    jobTitle: pick(profile.title, locale),
    description: pick(profile.tagline, locale),
    url: pageUrl,
    ...(profile.avatarUrl && {
      image: profile.avatarUrl.startsWith("/")
        ? `${siteUrl}${profile.avatarUrl}`
        : profile.avatarUrl,
    }),
    ...(profile.email && { email: `mailto:${profile.email}` }),
    ...(locality && {
      address: {
        "@type": "PostalAddress",
        addressLocality: locality,
        ...(country && { addressCountry: country }),
      },
    }),
    ...(profile.githubUrl && { sameAs: [profile.githubUrl] }),
    ...(alumniOf.length > 0 && {
      alumniOf: alumniOf.map((name) => ({
        "@type": "EducationalOrganization",
        name,
      })),
    }),
    knowsAbout,
  };

  // ProfilePage is the type Google documents for a page about one person; the
  // WebSite node is what it reads to show the site's name instead of the bare
  // domain in results.
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: profile.name,
        inLanguage: ["fr", "en"],
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        inLanguage: locale,
        isPartOf: { "@id": `${siteUrl}/#website` },
        ...(profile.updatedAt && {
          dateModified: profile.updatedAt.toISOString(),
        }),
        mainEntity: person,
      },
    ],
  };

  // JSON.stringify leaves "</script>" intact, so a profile field containing it
  // would close this tag and run whatever follows. < is still a valid "<"
  // to any JSON parser but can never end the script element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
