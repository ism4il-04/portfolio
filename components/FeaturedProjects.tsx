import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { projects as projectsTable } from "@/lib/schema";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Project = typeof projectsTable.$inferSelect;

export async function FeaturedProjects({
  projects,
  locale,
}: {
  projects: Project[];
  locale: string;
}) {
  const t = await getTranslations("sections");
  const tp = await getTranslations("projects");

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="05" title={t("featuredProjects")} />

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.06} className="h-full">
            <ProjectCard project={project} locale={locale} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 rounded-lg border border-line bg-panel/60 px-5 py-2.5 font-mono text-sm text-muted transition-all duration-200 hover:border-accent/50 hover:text-fg"
          >
            {tp("all")}
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
