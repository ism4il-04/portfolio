import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localized";
import type { profile as profileTable } from "@/lib/schema";
import { Reveal } from "./Reveal";
import { TypingText } from "./TypingText";

type Profile = typeof profileTable.$inferSelect;

export async function Hero({
  profile,
  locale,
}: {
  profile: Profile;
  locale: string;
}) {
  const t = await getTranslations("hero");
  const resume = locale === "en" ? profile.resumeUrlEn : profile.resumeUrlFr;
  const availability = pick(profile.availability, locale);

  return (
    <section
      className={`mx-auto grid max-w-5xl items-center gap-14 px-6 pt-32 pb-20 lg:pt-36 lg:pb-28 ${
        profile.avatarUrl ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
      }`}
    >
      <div>
        {availability && (
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-term/30 bg-term/[0.07] px-3.5 py-1.5 font-mono text-xs text-term">
              <span className="size-1.5 shrink-0 rounded-full bg-term animate-pulse-dot" />
              {availability}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-sheen sm:text-6xl">
            {profile.name}
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-3 font-mono text-lg text-accent">
            {pick(profile.title, locale)}
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mt-6 max-w-lg text-pretty leading-relaxed text-muted">
            <TypingText text={pick(profile.tagline, locale)} />
          </p>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t("viewProjects")}
            </Link>
            <a
              href="#contact"
              className="rounded-lg border border-line bg-panel/60 px-5 py-2.5 text-sm text-fg transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
            >
              {t("contactMe")}
            </a>
            {resume && (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line bg-panel/60 px-5 py-2.5 text-sm text-fg transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
              >
                {t("downloadResume")}
              </a>
            )}
          </div>
        </Reveal>
      </div>

      {profile.avatarUrl && (
        <Reveal delay={0.2} y={28}>
          <Portrait
            src={profile.avatarUrl}
            alt={t("portraitAlt", { name: profile.name })}
          />
        </Reveal>
      )}
    </section>
  );
}

function Portrait({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative mx-auto w-full max-w-xs">
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-violet/20 opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative overflow-hidden rounded-xl border border-line bg-panel">
        <div className="flex items-center gap-2 border-b border-line bg-panel-2/70 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-xs text-muted">portrait</span>
        </div>
        <div className="relative aspect-square">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="20rem"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
