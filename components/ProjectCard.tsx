import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localized";
import type { projects as projectsTable } from "@/lib/schema";
import { Chip } from "./Chip";

type Project = typeof projectsTable.$inferSelect;

export async function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: string;
}) {
  const t = await getTranslations("projects");
  const description = pick(project.description, locale);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-panel"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium leading-snug transition-colors duration-300 group-hover:text-accent">
          {project.title}
        </h3>
        <span className="mt-1 shrink-0 font-mono text-xs text-line-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
          →
        </span>
      </div>

      {description && (
        <p className="mt-3 line-clamp-3 text-pretty text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.technologies.slice(0, 4).map((tech) => (
            <Chip key={tech}>{tech}</Chip>
          ))}
          {project.technologies.length > 4 && (
            <span className="self-center font-mono text-xs text-line-2">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      )}

      <span className="sr-only">{t("viewProject")}</span>
    </Link>
  );
}
