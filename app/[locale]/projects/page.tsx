import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { getProjects } from "@/lib/queries";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections" });
  return { title: t("projects"), alternates: alternates("/projects", locale) };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("sections");
  const tp = await getTranslations("projects");
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-5xl px-6 pt-32 pb-24">
      <Reveal>
        <h1 className="text-4xl font-semibold tracking-tight">
          <span className="font-mono text-muted">{"// "}</span>
          {t("projects")}
        </h1>
        <p className="mt-3 font-mono text-sm text-line-2">
          {tp("count", { count: projects.length })}
        </p>
      </Reveal>

      {projects.length === 0 ? (
        <p className="mt-16 text-muted">{tp("empty")}</p>
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.04} className="h-full">
              <ProjectCard project={project} locale={locale} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
