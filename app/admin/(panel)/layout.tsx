import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logout } from "../actions";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/extracurricular", label: "Extracurricular" },
  { href: "/admin/goals", label: "Goals" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware guards /admin too, but a page must never render its contents
  // without a verified session of its own.
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-[0.2] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]"
      />

      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-mono text-sm">
            <span className="size-2 rounded-full bg-term animate-pulse-dot" />
            <span className="text-muted">~/ismail/admin</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-panel hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-xs text-line-2 transition-colors hover:text-accent"
            >
              View site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line bg-panel/60 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-fg"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
