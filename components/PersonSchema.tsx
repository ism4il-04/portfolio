import { pick } from "@/lib/localized";
import { siteUrl } from "@/lib/seo";
import type { profile as profileTable } from "@/lib/schema";

type Profile = typeof profileTable.$inferSelect;

export function PersonSchema({
  profile,
  locale,
  knowsAbout,
}: {
  profile: Profile;
  locale: string;
  knowsAbout: string[];
}) {
  const [locality, country] = (profile.location ?? "")
    .split(",")
    .map((part) => part.trim());

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: pick(profile.title, locale),
    description: pick(profile.tagline, locale),
    url: `${siteUrl}/${locale}`,
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
    knowsAbout,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
