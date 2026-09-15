import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Extracurricular } from "@/components/Extracurricular";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { Goals } from "@/components/Goals";
import { Hero } from "@/components/Hero";
import { PersonSchema } from "@/components/PersonSchema";
import { Skills } from "@/components/Skills";
import {
  getEducation,
  getExperience,
  getExtracurricular,
  getFeaturedProjects,
  getGoals,
  getProfile,
  getSkills,
} from "@/lib/queries";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternates("", locale) };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    profile,
    skills,
    education,
    experience,
    featured,
    extracurricular,
    goals,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getEducation(),
    getExperience(),
    getFeaturedProjects(),
    getExtracurricular(),
    getGoals(),
  ]);

  if (!profile) notFound();

  const allSkills = [...skills.values()].flat().map((skill) => skill.name);

  return (
    <>
      <PersonSchema
        profile={profile}
        locale={locale}
        knowsAbout={allSkills}
      />
      <Hero profile={profile} locale={locale} />
      <About summary={profile.aboutSummary} locale={locale} />
      <Skills grouped={skills} />
      <Education entries={education} locale={locale} />
      <Experience entries={experience} locale={locale} />
      <FeaturedProjects projects={featured} locale={locale} />
      <Extracurricular entries={extracurricular} locale={locale} />
      <Goals short={goals.short} long={goals.long} locale={locale} />
      <Contact profile={profile} />
    </>
  );
}
