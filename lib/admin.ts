import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import { auth } from "./auth";

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

/** Rebuilds a public route for every locale. Pass "" for the home page. */
export function revalidateAllLocales(path = "") {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path}`);
  }
}
