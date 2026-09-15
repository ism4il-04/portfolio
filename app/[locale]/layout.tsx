import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Backdrop } from "@/components/Backdrop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { routing } from "@/i18n/routing";
import { pick } from "@/lib/localized";
import { getProfile } from "@/lib/queries";
import { siteUrl } from "@/lib/seo";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfile();

  const name = profile?.name ?? "Portfolio";
  const title = pick(profile?.title, locale);
  const description = pick(profile?.tagline, locale);

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title ? `${name} — ${title}` : name, template: `%s · ${name}` },
    description,
    authors: [{ name }],
    creator: name,
    openGraph: {
      type: "profile",
      siteName: name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
      title: title ? `${name} — ${title}` : name,
      description,
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${name} — ${title}` : name,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [profile, t] = await Promise.all([
    getProfile(),
    getTranslations("common"),
  ]);

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
          >
            {t("skipToContent")}
          </a>
          <Backdrop />
          <Header />
          <main id="main">{children}</main>
          {profile && <Footer profile={profile} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
