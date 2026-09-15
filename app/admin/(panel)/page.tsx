import Link from "next/link";
import { PageHeading } from "@/components/admin/Panel";
import {
  getEducation,
  getExperience,
  getExtracurricular,
  getGoals,
  getProjects,
  getSkills,
  getUnreadMessageCount,
} from "@/lib/queries";

export default async function AdminDashboard() {
  const [skills, education, experience, projects, extracurricular, goals, unread] =
    await Promise.all([
      getSkills(),
      getEducation(),
      getExperience(),
      getProjects(),
      getExtracurricular(),
      getGoals(),
      getUnreadMessageCount(),
    ]);

  const cards = [
    { label: "Skills", value: [...skills.values()].flat().length, href: "/admin/skills" },
    { label: "Education", value: education.length, href: "/admin/education" },
    { label: "Experience", value: experience.length, href: "/admin/experience" },
    { label: "Projects", value: projects.length, href: "/admin/projects" },
    {
      label: "Extracurricular",
      value: extracurricular.length,
      href: "/admin/extracurricular",
    },
    {
      label: "Goals",
      value: goals.short.length + goals.long.length,
      href: "/admin/goals",
    },
  ];

  return (
    <>
      <PageHeading
        title="Dashboard"
        description="Everything here writes straight to the live site."
      />

      <Link
        href="/admin/messages"
        className="mb-5 flex items-baseline gap-3 rounded-xl border border-line bg-panel/50 p-5 transition-colors hover:border-accent/40"
      >
        <span className="font-mono text-xs text-line-2">Messages</span>
        <span className="ml-auto text-2xl font-medium">
          {unread}
          <span className="ml-2 text-sm font-normal text-muted">unread</span>
        </span>
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-line bg-panel/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
          >
            <p className="font-mono text-xs text-line-2">{card.label}</p>
            <p className="mt-2 text-2xl font-medium">{card.value}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
