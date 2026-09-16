"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { z } from "zod";
import { db } from "./db";
import { messages } from "./schema";
import { hit } from "./throttle";

const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email().max(160),
  subject: z.string().max(200),
  body: z.string().min(10).max(5000),
});

// A real person sends one or two messages; anything past this is a flood.
const MESSAGES_PER_IP_PER_HOUR = 3;

// Notifications go out through a personal Gmail account, and Gmail suspends
// sending for accounts that blow past its daily quota. Past this cap messages
// are still saved and readable in the admin panel — only the email is skipped.
const NOTIFICATION_EMAILS_PER_DAY = 40;

export type ContactField = keyof z.infer<typeof ContactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  invalidFields?: ContactField[];
  captchaFailed?: boolean;
  rateLimited?: boolean;
};

/**
 * Cloudflare Turnstile. Tokens are single-use and tied to the issuing site key,
 * so a replayed or forged one fails here.
 */
async function captchaPassed(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Without a secret there is nothing to verify against. Locally that's a
  // convenience; on Vercel it means a missing env var, and silently waving
  // every submission through would switch bot protection off unnoticed.
  if (!secret) return process.env.VERCEL !== "1";
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

  // Counted only once a submission has passed the CAPTCHA and validation, so
  // a visitor fixing a typo doesn't burn their allowance.
  const sent = await hit(`contact:${ip ?? "unknown"}`, 60 * 60);
  if (sent > MESSAGES_PER_IP_PER_HOUR) {
    return { status: "error", rateLimited: true };
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
    const emailsToday = await hit("contact-email:day", 24 * 60 * 60);

    if (emailsToday > NOTIFICATION_EMAILS_PER_DAY) {
      console.warn("Daily notification email cap reached; message saved only");
    } else {
      try {
        const transport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { user, pass },
        });

        await transport.sendMail({
          // Gmail rewrites any other sender to the authenticated account, so
          // the visitor's address goes in replyTo instead.
          from: `"Portfolio" <${user}>`,
          to: process.env.CONTACT_TO_EMAIL ?? user,
          // Object form, so nodemailer escapes a visitor-supplied name itself.
          replyTo: { name: parsed.data.name, address: parsed.data.email },
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
        // The message is already saved; a mail outage shouldn't look like a
        // failure to the sender. It stays readable in the admin panel.
        console.error("Contact email delivery failed", error);
      }
    }
  }

  return { status: "success" };
}
