import { getTranslations } from "next-intl/server";
import { pick } from "@/lib/localized";
import type { goals as goalsTable } from "@/lib/schema";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Goal = typeof goalsTable.$inferSelect;

export async function Goals({
  short,
  long,
  locale,
}: {
  short: Goal[];
  long: Goal[];
  locale: string;
}) {
  const t = await getTranslations("sections");
  const tg = await getTranslations("goals");

  if (short.length === 0 && long.length === 0) return null;

  const columns = [
    { key: "short_term", items: short },
    { key: "long_term", items: long },
  ].filter((column) => column.items.length > 0);

  return (
    <section id="goals" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="07" title={t("goals")} />

      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((column, i) => (
          <Reveal key={column.key} delay={i * 0.08} className="h-full">
            <div className="h-full rounded-xl border border-line bg-panel/50 p-6">
              <h3 className="mb-5 font-mono text-sm text-accent">
                {tg(column.key)}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.items.map((goal) => (
                  <li
                    key={goal.id}
                    className="group flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs text-line-2 transition-colors duration-200 group-hover:text-term">
                      [ ]
                    </span>
                    {pick(goal.text, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
