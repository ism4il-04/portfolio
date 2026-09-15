import { getFormatter, getTranslations } from "next-intl/server";
import type { LegalDoc } from "@/content/legal";
import { Reveal } from "./Reveal";

export async function LegalDocument({ doc }: { doc: LegalDoc }) {
  const t = await getTranslations("legal");
  const format = await getFormatter();

  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="font-mono text-muted">{"// "}</span>
          {doc.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-line-2">
          {t("lastUpdated", {
            date: format.dateTime(new Date(doc.updated), {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          })}
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-10">
        {doc.sections.map((section, i) => (
          <Reveal key={section.heading} delay={i * 0.04}>
            <section>
              <h2 className="mb-4 flex items-baseline gap-3 text-lg font-medium">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>

              <div className="flex flex-col gap-3 border-l border-line pl-5">
                {section.paragraphs?.map((paragraph, j) => (
                  <p
                    key={j}
                    className="text-pretty text-sm leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-1 flex flex-col gap-2">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-xs text-line-2">
                          ▸
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </article>
  );
}
