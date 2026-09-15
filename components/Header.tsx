"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

const SECTIONS = ["about", "skills", "experience", "contact"] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-sm"
        >
          <span className="size-2 rounded-full bg-term animate-pulse-dot" />
          <span className="text-muted transition-colors group-hover:text-fg">
            ~/ismail
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => (
            <a
              key={section}
              href={`/${locale}#${section}`}
              className="rounded-md px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-panel hover:text-fg"
            >
              {t(section)}
            </a>
          ))}
          <Link
            href="/projects"
            className="rounded-md px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-panel hover:text-fg"
          >
            {t("projects")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="rounded-md border border-line bg-panel/70 p-2 md:hidden"
          >
            <span className="block h-px w-4 bg-fg" />
            <span className="mt-1 block h-px w-4 bg-fg" />
            <span className="mt-1 block h-px w-4 bg-fg" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-ink/95 px-6 py-3 backdrop-blur-md md:hidden">
          {SECTIONS.map((section) => (
            <a
              key={section}
              href={`/${locale}#${section}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2 font-mono text-sm text-muted hover:text-fg"
            >
              {t(section)}
            </a>
          ))}
          <Link
            href="/projects"
            onClick={() => setOpen(false)}
            className="block rounded-md px-2 py-2 font-mono text-sm text-muted hover:text-fg"
          >
            {t("projects")}
          </Link>
        </nav>
      )}
    </header>
  );
}
