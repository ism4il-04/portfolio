import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { auth } from "./auth";
import { InvalidField } from "./form";

/**
 * Server actions are publicly reachable endpoints — anyone who learns an action
 * id can invoke it. Middleware guards page navigations, not these, so every
 * mutating action has to check the session itself.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

/**
 * Builds a record from form data, sending the admin back to `page` with the
 * offending field named if any value is rejected. redirect() throws, so it is
 * deliberately called outside anything that would catch it.
 */
export function parseOrBounce<T>(page: string, build: () => T): T {
  try {
    return build();
  } catch (error) {
    if (error instanceof InvalidField) {
      redirect(`${page}?invalid=${encodeURIComponent(error.field)}`);
    }
    throw error;
  }
}

/** Rebuilds a public route for every locale. Pass "" for the home page. */
export function revalidateAllLocales(path = "") {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path}`);
  }
}
