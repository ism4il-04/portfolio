import type { Localized, LocalizedList } from "./schema";

export function pick(
  value: Localized | null | undefined,
  locale: string,
): string {
  if (!value) return "";
  const preferred = locale === "en" ? value.en : value.fr;
  return preferred || value.fr || value.en || "";
}

export function pickList(
  value: LocalizedList | null | undefined,
  locale: string,
): string[] {
  if (!value) return [];
  const preferred = locale === "en" ? value.en : value.fr;
  return preferred?.length ? preferred : (value.fr ?? value.en ?? []);
}
