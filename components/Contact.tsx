import { getTranslations } from "next-intl/server";
import type { profile as profileTable } from "@/lib/schema";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

type Profile = typeof profileTable.$inferSelect;

export async function Contact({ profile }: { profile: Profile }) {
  const t = await getTranslations("sections");
  const tc = await getTranslations("contact");

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeading index="08" title={t("contact")} />

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr]">
        <Reveal>
          <p className="text-pretty leading-relaxed text-muted">
            {tc("lead")}
          </p>

          <dl className="mt-8 flex flex-col gap-4 font-mono text-sm">
            {profile.email && (
              <div>
                <dt className="text-xs text-line-2">email</dt>
                <dd>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </dd>
              </div>
            )}
            {profile.githubUrl && (
              <div>
                <dt className="text-xs text-line-2">github</dt>
                <dd>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {profile.githubUrl.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
            {profile.location && (
              <div>
                <dt className="text-xs text-line-2">location</dt>
                <dd className="text-muted">{profile.location}</dd>
              </div>
            )}
          </dl>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-xl border border-line bg-panel/50 p-6 sm:p-7">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
