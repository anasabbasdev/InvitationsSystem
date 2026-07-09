import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbEventNotificationRow } from "@/types/persistence";
import type { AppNotification } from "@/lib/notifications";

export type CreateNotificationInput = {
  eventId: string;
  type: string;
  title: string;
  message?: string;
  payload?: Record<string, unknown>;
};

function mapRow(row: DbEventNotificationRow): AppNotification {
  return {
    id: row.id,
    eventId: row.event_id,
    type: row.type,
    title: row.title,
    message: row.message ?? undefined,
    payload: row.payload ?? undefined,
    readAt: row.read_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function createEventNotification(
  input: CreateNotificationInput
): Promise<AppNotification> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_notifications")
    .insert({
      event_id: input.eventId,
      type: input.type,
      title: input.title,
      message: input.message ?? null,
      payload: input.payload ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data as DbEventNotificationRow);
}

export async function listNotificationsForEvent(
  eventId: string
): Promise<AppNotification[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_notifications")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as DbEventNotificationRow));
}
