"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-line bg-panel/70 p-0.5 font-mono text-[11px]">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          aria-current={locale === active ? "true" : undefined}
          className={
            locale === active
              ? "rounded-[5px] bg-accent/15 px-2 py-1 text-accent"
              : "rounded-[5px] px-2 py-1 text-muted transition-colors hover:text-fg"
          }
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
