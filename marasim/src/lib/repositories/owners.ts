import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbEventOwnerRow, DbUserRoleRow } from "@/types/persistence";
import type { AppEvent } from "@/types/events";
import { mapEventRow } from "@/lib/repositories/events";

export async function isEventOwner(userId: string, eventId: string): Promise<boolean> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_owners")
    .select("id")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function addEventOwner(eventId: string, userId: string): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from("event_owners")
    .upsert({ event_id: eventId, user_id: userId, role: "owner" }, { onConflict: "event_id,user_id" });

  if (error) throw error;
}

export async function listEventsForOwner(userId: string): Promise<AppEvent[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_owners")
    .select("event_id, events(*)")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? [])
    .map((row) => (row as unknown as { events: Record<string, unknown> | null }).events)
    .filter((e): e is Record<string, unknown> => Boolean(e))
    .map((row) => mapEventRow(row as never));
}

export async function getUserRole(userId: string): Promise<"admin" | "owner" | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data as DbUserRoleRow | null)?.role ?? null;
}

export async function setUserRole(userId: string, role: "admin" | "owner"): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from("user_roles")
    .upsert({ user_id: userId, role }, { onConflict: "user_id" });

  if (error) throw error;
}

export async function fetchEventOwnersForEvent(eventId: string): Promise<DbEventOwnerRow[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_owners")
    .select("*")
    .eq("event_id", eventId);

  if (error) throw error;
  return (data ?? []) as DbEventOwnerRow[];
}
