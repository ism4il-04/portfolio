import { getTranslations } from "next-intl/server";
import { pick } from "@/lib/localized";
import type {
  education as educationTable,
  educationAchievements as achievementsTable,
} from "@/lib/schema";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Entry = typeof educationTable.$inferSelect & {
  achievements: (typeof achievementsTable.$inferSelect)[];
};

export async function Education({
  entries,
  locale,
}: {
  entries: Entry[];
  locale: string;
}) {
  const t = await getTranslations("sections");

  if (entries.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="03" title={t("education")} />

      <div className="relative border-l border-line pl-8">
        {entries.map((entry, i) => (
          <Reveal key={entry.id} delay={i * 0.06}>
            <article className="group relative pb-10 last:pb-0">
              <span className="absolute top-1.5 -left-[2.28rem] size-3 rounded-full border-2 border-line bg-ink transition-colors duration-300 group-hover:border-accent" />

              <p className="font-mono text-xs text-accent">
                {pick(entry.period, locale)}
              </p>
              <h3 className="mt-1.5 text-lg font-medium">
                {pick(entry.degree, locale)}
                {entry.field && (
                  <span className="text-muted">
                    {" — "}
                    {pick(entry.field, locale)}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-sm text-muted">
                {entry.institution}
                {entry.location && (
                  <span className="text-line-2"> · {entry.location}</span>
                )}
              </p>

              {entry.achievements.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1.5">
                  {entry.achievements.map((achievement) => (
                    <li
                      key={achievement.id}
                      className="flex gap-2 text-sm text-muted"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-line-2" />
                      {pick(achievement.achievement, locale)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
