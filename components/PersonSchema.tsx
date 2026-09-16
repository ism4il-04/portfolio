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
