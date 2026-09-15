"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { z } from "zod";
import { db } from "./db";
import { messages } from "./schema";

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(160),
  subject: z.string().max(200),
  body: z.string().min(10).max(5000),
});

export type ContactField = keyof z.infer<typeof ContactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  invalidFields?: ContactField[];
  captchaFailed?: boolean;
};

/**
 * Cloudflare Turnstile. Tokens are single-use and tied to the issuing site key,
 * so a replayed or forged one fails here. Skipped entirely when no secret is
 * configured, which keeps local development workable — set both keys before
 * going live or the form has no bot protection at all.
 */
async function captchaPassed(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    // A Cloudflare outage should not silently disable the check.
    console.error("Turnstile verification unreachable", error);
    return false;
  }
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Bots fill every field they find; humans never see this one.
  if (text(formData, "website")) return { status: "success" };

  const headerList = await headers();
  const ip =
    headerList.get("x-vercel-forwarded-for") ??
    headerList.get("x-real-ip") ??
    null;

  if (!(await captchaPassed(text(formData, "cf-turnstile-response"), ip))) {
    return { status: "error", captchaFailed: true };
  }

  const parsed = ContactSchema.safeParse({
    name: text(formData, "name"),
    email: text(formData, "email"),
    subject: text(formData, "subject"),
    body: text(formData, "body"),
  });

  if (!parsed.success) {
    const invalidFields = [
      ...new Set(
        parsed.error.issues
          .map((issue) => issue.path[0])
          .filter((path): path is ContactField => typeof path === "string"),
      ),
    ];
    return { status: "error", invalidFields };
  }

  const locale = text(formData, "locale") || "fr";

  try {
    await db.insert(messages).values({ ...parsed.data, locale });
  } catch {
    return { status: "error" };
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
      });

      await transport.sendMail({
        // Gmail rewrites any other sender to the authenticated account, so the
        // visitor's address goes in replyTo instead.
        from: `"Portfolio" <${user}>`,
        to: process.env.CONTACT_TO_EMAIL ?? user,
        replyTo: `"${parsed.data.name}" <${parsed.data.email}>`,
        subject: parsed.data.subject
          ? `Portfolio — ${parsed.data.subject}`
          : `Portfolio — message from ${parsed.data.name}`,
        text: [
          `From: ${parsed.data.name} <${parsed.data.email}>`,
          `Locale: ${locale}`,
          "",
          parsed.data.body,
        ].join("\n"),
      });
    } catch (error) {
      // The message is already saved; a mail outage shouldn't look like a failure
      // to the sender. It stays readable in the admin panel.
      console.error("Contact email delivery failed", error);
    }
  }

  return { status: "success" };
}
