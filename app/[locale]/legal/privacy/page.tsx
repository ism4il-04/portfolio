import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/LegalDocument";
import { privacyPolicy } from "@/content/legal";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const doc = privacyPolicy[locale as keyof typeof privacyPolicy];

  return {
    title: doc?.title,
    robots: { index: false, follow: true },
    alternates: alternates("/legal/privacy", locale),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const doc = privacyPolicy[locale as (typeof routing.locales)[number]];
  if (!doc) notFound();

  return <LegalDocument doc={doc} />;
}
