"use server";

import { revalidatePath } from "next/cache";
import { requireEventOwnership } from "@/lib/auth";
import { createInviteLink, disableInviteLink } from "@/lib/repositories";

export async function createInviteLinkAction(eventId: string, formData: FormData) {
  await requireEventOwnership(eventId);

  const label = String(formData.get("label") ?? "").trim() || null;
  const guestName = String(formData.get("guestName") ?? "").trim() || null;
  const side = String(formData.get("side") ?? "").trim() || null;
  const maxSeats = Number.parseInt(String(formData.get("maxSeats") ?? "1"), 10);
  const expiresAtRaw = String(formData.get("expiresAt") ?? "").trim();

  if (!Number.isInteger(maxSeats) || maxSeats <= 0) {
    throw new Error("عدد المقاعد غير صالح");
  }

  await createInviteLink({
    eventId,
    label,
    guestName,
    side: side as "groom" | "bride" | "general" | "vip" | null,
    maxSeats,
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null,
  });

  revalidatePath(`/owner/events/${eventId}`);
}

export async function disableInviteLinkAction(eventId: string, linkId: string) {
  await requireEventOwnership(eventId);
  await disableInviteLink(linkId);
  revalidatePath(`/owner/events/${eventId}`);
}
