import type { Localized, LocalizedList } from "./schema";

export function str(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function optional(formData: FormData, name: string): string | null {
  return str(formData, name) || null;
}

export function int(formData: FormData, name: string, fallback = 0): number {
  const parsed = Number.parseInt(str(formData, name), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function bool(formData: FormData, name: string): boolean {
  return formData.get(name) === "on";
}

/** One item per line, blanks dropped. */
export function lines(formData: FormData, name: string): string[] {
  return str(formData, name)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function csv(formData: FormData, name: string): string[] {
  return str(formData, name)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function localized(formData: FormData, name: string): Localized {
  return { fr: str(formData, `${name}.fr`), en: str(formData, `${name}.en`) };
}

export function localizedList(
  formData: FormData,
  name: string,
): LocalizedList {
  return {
    fr: lines(formData, `${name}.fr`),
    en: lines(formData, `${name}.en`),
  };
}

/** Thrown when a submitted field can't be stored; carries the field name. */
export class InvalidField extends Error {
  constructor(readonly field: string) {
    super(`Invalid value for ${field}`);
  }
}

function httpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

// next/image refuses hosts missing from remotePatterns and throws mid-render,
// so an image field only accepts what the site can actually display.
function displayableImage(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return httpsUrl(value)?.hostname === "res.cloudinary.com";
}

/** Optional link. Anything but https:// is rejected, not silently dropped. */
export function link(formData: FormData, name: string): string | null {
  const value = str(formData, name);
  if (!value) return null;
  if (!httpsUrl(value)) throw new InvalidField(name);
  return value;
}

export function imageLink(formData: FormData, name: string): string | null {
  const value = str(formData, name);
  if (!value) return null;
  if (!displayableImage(value)) throw new InvalidField(name);
  return value;
}

export function imageLinks(formData: FormData, name: string): string[] {
  const values = lines(formData, name);
  if (!values.every(displayableImage)) throw new InvalidField(name);
  return values;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}
