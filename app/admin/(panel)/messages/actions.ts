"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { bool, str } from "@/lib/form";
import { messages } from "@/lib/schema";

export async function setRead(formData: FormData) {
  await requireAdmin();
  await db
    .update(messages)
    .set({ isRead: bool(formData, "isRead") })
    .where(eq(messages.id, str(formData, "id")));
  // Messages are not public, so only the admin views need rebuilding.
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.id, str(formData, "id")));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
