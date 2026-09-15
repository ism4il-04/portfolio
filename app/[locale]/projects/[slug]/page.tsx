import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Chip } from "@/components/Chip";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localized";
import { getProjectBySlug, getProjects } from "@/lib/queries";
import { alternates } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: pick(project.description, locale) || undefined,
    alternates: alternates(`/projects/${slug}`, locale),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const description = pick(project.description, locale);

  return (
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Reveal>
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          {t("backToProjects")}
        </Link>
      </Reveal>

      <Reveal delay={0.06}>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {project.title}
        </h1>
      </Reveal>

      {project.technologies && project.technologies.length > 0 && (
        <Reveal delay={0.12}>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </Reveal>
      )}

      {(project.demoUrl || project.repoUrl) && (
        <Reveal delay={0.18}>
          <div className="mt-7 flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-ink transition-transform duration-200 hover:-translate-y-0.5"
              >
                {t("viewDemo")}
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-line bg-panel/60 px-4 py-2 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
              >
                {t("viewCode")}
              </a>
            )}
          </div>
        </Reveal>
      )}

      {project.thumbnailUrl && (
        <Reveal delay={0.22}>
          <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-line">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </Reveal>
      )}

      {description && (
        <Reveal delay={0.26}>
          <div className="mt-10 rounded-xl border border-line bg-panel/50 p-6 sm:p-8">
            <p className="text-pretty leading-relaxed text-muted">
              {description}
            </p>
          </div>
        </Reveal>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <Reveal delay={0.3}>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-lg border border-line"
              >
                <Image
                  src={src}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </article>
  );
}
