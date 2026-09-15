import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { profile as profileTable } from "@/lib/schema";

type Profile = typeof profileTable.$inferSelect;

export async function Footer({ profile }: { profile: Profile }) {
  const t = await getTranslations("legal");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-muted transition-colors hover:text-accent"
            >
              {profile.email}
            </a>
          )}
          {profile.githubUrl && (
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              GitHub
            </a>
          )}
          {profile.phone && <span className="text-line-2">{profile.phone}</span>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-line pt-6 font-mono text-xs">
          <p className="text-line-2">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/legal/notice"
              className="text-muted transition-colors hover:text-accent"
            >
              {t("notice")}
            </Link>
            <Link
              href="/legal/privacy"
              className="text-muted transition-colors hover:text-accent"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
