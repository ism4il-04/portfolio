import { getTranslations } from "next-intl/server";
import { pick } from "@/lib/localized";
import type { extracurricular as extracurricularTable } from "@/lib/schema";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Entry = typeof extracurricularTable.$inferSelect;

export async function Extracurricular({
  entries,
  locale,
}: {
  entries: Entry[];
  locale: string;
}) {
  const t = await getTranslations("sections");
  const tx = await getTranslations("extracurricular");

  if (entries.length === 0) return null;

  return (
    <section id="extracurricular" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="06" title={t("extracurricular")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.05} className="h-full">
            <article className="flex h-full flex-col rounded-xl border border-line bg-panel/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-line-2">
              {entry.type && tx.has(entry.type) && (
                <span className="mb-3 self-start rounded border border-accent/25 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                  {tx(entry.type)}
                </span>
              )}
              <h3 className="text-sm font-medium leading-snug">
                {pick(entry.role, locale)}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{entry.organization}</p>
              <p className="mt-auto pt-4 font-mono text-xs text-line-2">
                {pick(entry.period, locale)}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
