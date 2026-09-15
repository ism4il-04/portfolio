import { routing } from "@/i18n/routing";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

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
