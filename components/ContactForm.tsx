"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import {
  submitContact,
  type ContactField,
  type ContactState,
} from "@/lib/actions";

const INITIAL: ContactState = { status: "idle" };

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

const fieldClass =
  "w-full rounded-lg border bg-panel-2/50 px-3.5 py-2.5 text-sm text-fg placeholder:text-line-2 transition-colors duration-200 focus:outline-none focus:border-accent";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, action, pending] = useActionState(submitContact, INITIAL);

  // Turnstile tokens are single-use, so a rejected submission needs a fresh one
  // or the next attempt fails for a reason the visitor cannot see.
  useEffect(() => {
    if (state.status === "error") window.turnstile?.reset();
  }, [state]);

  const invalid = (field: ContactField) =>
    state.status === "error" && state.invalidFields?.includes(field);

  const border = (field: ContactField) =>
    invalid(field) ? "border-[#ff6b6b]/60" : "border-line";

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-term/30 bg-term/5 p-8 text-center">
        <p className="font-mono text-2xl text-term">✓</p>
        <p className="mt-3 text-sm text-fg">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="name"
          label={t("name")}
          error={invalid("name") ? t("errors.name") : undefined}
        >
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={`${fieldClass} ${border("name")}`}
          />
        </Field>

        <Field
          id="email"
          label={t("email")}
          error={invalid("email") ? t("errors.email") : undefined}
        >
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={`${fieldClass} ${border("email")}`}
          />
        </Field>
      </div>

      <Field
        id="subject"
        label={t("subject")}
        hint={t("optional")}
        error={invalid("subject") ? t("errors.subject") : undefined}
      >
        <input
          id="subject"
          name="subject"
          maxLength={200}
          placeholder={t("subjectPlaceholder")}
          className={`${fieldClass} ${border("subject")}`}
        />
      </Field>

      <Field
        id="body"
        label={t("message")}
        error={invalid("body") ? t("errors.body") : undefined}
      >
        <textarea
          id="body"
          name="body"
          required
          rows={6}
          maxLength={5000}
          placeholder={t("messagePlaceholder")}
          className={`${fieldClass} ${border("body")} resize-y`}
        />
      </Field>

      {SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div
            className="cf-turnstile"
            data-sitekey={SITE_KEY}
            data-theme="dark"
            data-language={locale}
          />
        </>
      )}

      {state.status === "error" && state.captchaFailed && (
        <p role="alert" className="text-sm text-[#ff6b6b]">
          {t("captchaFailed")}
        </p>
      )}

      {state.status === "error" && state.rateLimited && (
        <p role="alert" className="text-sm text-[#ff6b6b]">
          {t("rateLimited")}
        </p>
      )}

      {state.status === "error" &&
        !state.invalidFields &&
        !state.captchaFailed &&
        !state.rateLimited && (
          <p role="alert" className="text-sm text-[#ff6b6b]">
            {t("error")}
          </p>
        )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xs text-xs leading-relaxed text-line-2">
          {t("privacyNote")}{" "}
          <Link
            href="/legal/privacy"
            className="text-muted underline underline-offset-2 transition-colors hover:text-accent"
          >
            {t("privacyLink")}
          </Link>
        </p>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {pending ? t("sending") : t("send")}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 font-mono text-xs text-muted"
      >
        {label}
        {hint && <span className="text-line-2">({hint})</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-[#ff6b6b]">
          {error}
        </p>
      )}
    </div>
  );
}
