import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-6 text-2xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="mt-3 text-muted">{t("notFoundDescription")}</p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-line bg-panel/60 px-5 py-2.5 font-mono text-sm text-muted transition-all duration-200 hover:border-accent/50 hover:text-fg"
      >
        {t("backHome")}
      </Link>
    </section>
  );
}
