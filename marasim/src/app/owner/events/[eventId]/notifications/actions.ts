"use server";

import { revalidatePath } from "next/cache";
import { requireEventOwnership } from "@/lib/auth";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/repositories";

export async function markNotificationReadAction(eventId: string, notificationId: string) {
  await requireEventOwnership(eventId);
  await markNotificationRead(notificationId);
  revalidatePath(`/owner/events/${eventId}/notifications`);
}

export async function markAllNotificationsReadAction(eventId: string) {
  await requireEventOwnership(eventId);
  await markAllNotificationsRead(eventId);
  revalidatePath(`/owner/events/${eventId}/notifications`);
}
