import { getTranslations } from "next-intl/server";
import type { skills as skillsTable } from "@/lib/schema";
import { Chip } from "./Chip";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Skill = typeof skillsTable.$inferSelect;

const CATEGORY_ORDER = ["languages", "frameworks", "databases", "tools"];

export async function Skills({ grouped }: { grouped: Map<string, Skill[]> }) {
  const t = await getTranslations("sections");
  const tc = await getTranslations("skills");

  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  if (categories.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="02" title={t("skills")} />

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category, i) => (
          <Reveal key={category} delay={i * 0.06}>
            <div className="h-full rounded-xl border border-line bg-panel/50 p-5 transition-colors duration-300 hover:border-line-2">
              <h3 className="mb-4 flex items-center gap-2 font-mono text-sm text-fg">
                <span className="text-accent">#</span>
                {tc.has(category) ? tc(category) : category}
                <span className="ml-auto text-xs text-line-2">
                  {grouped.get(category)!.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {grouped.get(category)!.map((skill) => (
                  <Chip key={skill.id}>{skill.name}</Chip>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
