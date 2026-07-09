import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbEventRow, DbEventSettingsRow, UpsertEventInput } from "@/types/persistence";

export async function fetchEventBySlug(slug: string): Promise<DbEventRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as DbEventRow | null;
}

export async function fetchEventById(id: string): Promise<DbEventRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DbEventRow | null;
}

export async function fetchEventSettings(
  eventId: string
): Promise<DbEventSettingsRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from("event_settings")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) throw error;
  return data as DbEventSettingsRow | null;
}

export type UpsertEventResult = {
  event: DbEventRow;
  action: "created" | "updated";
};

export async function upsertEventWithSettings(
  input: UpsertEventInput
): Promise<UpsertEventResult> {
  const admin = createSupabaseAdminClient();
  const existing = await fetchEventBySlug(input.slug);

  const eventPayload = {
    slug: input.slug,
    title: input.title,
    event_date: input.eventDate ?? null,
    venue_name: input.venueName ?? null,
    total_capacity: input.totalCapacity ?? null,
    status: "published",
  };

  const { data: event, error: eventError } = await admin
    .from("events")
    .upsert(eventPayload, { onConflict: "slug" })
    .select("*")
    .single();

  if (eventError) throw eventError;

  const settingsPayload = {
    event_id: event.id,
    rsvp_enabled: input.rsvpEnabled,
    rsvp_mode: input.rsvpMode,
    max_public_request: input.maxPublicRequest,
    approval_required: input.approvalRequired,
  };

  const { error: settingsError } = await admin
    .from("event_settings")
    .upsert(settingsPayload, { onConflict: "event_id" });

  if (settingsError) throw settingsError;

  return {
    event: event as DbEventRow,
    action: existing ? "updated" : "created",
  };
}
