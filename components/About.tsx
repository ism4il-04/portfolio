import { getTranslations } from "next-intl/server";
import { pickList } from "@/lib/localized";
import type { LocalizedList } from "@/lib/schema";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export async function About({
  summary,
  locale,
}: {
  summary: LocalizedList | null;
  locale: string;
}) {
  const t = await getTranslations("sections");
  const paragraphs = pickList(summary, locale);

  if (paragraphs.length === 0) return null;

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="01" title={t("about")} />

      <Reveal>
        <div className="rounded-xl border border-line bg-panel/50 p-6 sm:p-8">
          <p className="mb-5 font-mono text-xs text-muted">{"/**"}</p>
          <div className="flex flex-col gap-5 border-l border-line pl-5">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-pretty leading-relaxed text-muted">
                <span className="mr-2 font-mono text-line-2 select-none">*</span>
                {paragraph}
              </p>
            ))}
          </div>
          <p className="mt-5 font-mono text-xs text-muted">{"*/"}</p>
        </div>
      </Reveal>
    </section>
  );
}
