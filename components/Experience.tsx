import { getTranslations } from "next-intl/server";
import { pick, pickList } from "@/lib/localized";
import type { experience as experienceTable } from "@/lib/schema";
import { Chip } from "./Chip";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Entry = typeof experienceTable.$inferSelect;

export async function Experience({
  entries,
  locale,
}: {
  entries: Entry[];
  locale: string;
}) {
  const t = await getTranslations("sections");
  const te = await getTranslations("experience");

  if (entries.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="04" title={t("experience")} />

      <div className="flex flex-col gap-5">
        {entries.map((entry, i) => {
          const responsibilities = pickList(entry.responsibilities, locale);

          return (
            <Reveal key={entry.id} delay={i * 0.06}>
              <article className="rounded-xl border border-line bg-panel/50 p-6 transition-colors duration-300 hover:border-line-2">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-medium">
                    {pick(entry.position, locale)}
                  </h3>
                  <p className="font-mono text-xs text-accent">
                    {pick(entry.period, locale)}
                    {entry.duration && (
                      <span className="text-line-2">
                        {" · "}
                        {pick(entry.duration, locale)}
                      </span>
                    )}
                  </p>
                </div>

                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="text-fg">{entry.company}</span>
                  {entry.location && (
                    <span className="text-line-2">· {entry.location}</span>
                  )}
                  {entry.type && te.has(entry.type) && (
                    <span className="rounded border border-violet/30 bg-violet/10 px-1.5 py-0.5 font-mono text-[10px] text-violet">
                      {te(entry.type)}
                    </span>
                  )}
                </p>

                {entry.description && (
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-muted">
                    {pick(entry.description, locale)}
                  </p>
                )}

                {responsibilities.length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2">
                    {responsibilities.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm text-muted">
                        <span className="mt-0.5 shrink-0 font-mono text-xs text-accent/70">
                          ▸
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {entry.technologies && entry.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.technologies.map((tech) => (
                      <Chip key={tech}>{tech}</Chip>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
