import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type {
  DbEventRow,
  DbEventSettingsRow,
  UpsertEventInput,
} from "@/types/persistence";
import type { AppEvent, EventSettings } from "@/types/events";

export function mapEventRow(row: DbEventRow): AppEvent {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    eventDate: row.event_date,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    mapUrl: row.map_url,
    totalCapacity: row.total_capacity,
    confirmedSeats: row.confirmed_seats,
    status: row.status as AppEvent["status"],
    createdAt: row.created_at,
  };
}

export function mapEventSettingsRow(row: DbEventSettingsRow): EventSettings {
  return {
    id: row.id,
    eventId: row.event_id,
    rsvpEnabled: row.rsvp_enabled,
    rsvpMode: row.rsvp_mode as EventSettings["rsvpMode"],
    maxPublicRequest: row.max_public_request,
    approvalRequired: row.approval_required,
    cancellationDeadlineHours: row.cancellation_deadline_hours,
  };
}

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

export async function listAllEvents(): Promise<DbEventRow[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as DbEventRow[];
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

export type CreateEventInput = {
  title: string;
  slug: string;
  eventDate?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  mapUrl?: string | null;
  totalCapacity?: number | null;
  ownerUserId: string;
  rsvpEnabled: boolean;
  rsvpMode: "none" | "public_request" | "controlled_link";
  maxPublicRequest?: number;
  approvalRequired?: boolean;
};

/** Admin: creates an event + settings + owner link in one call. */
export async function createEventWithOwner(input: CreateEventInput): Promise<DbEventRow> {
  const admin = createSupabaseAdminClient();

  const { data: event, error: eventError } = await admin
    .from("events")
    .insert({
      title: input.title,
      slug: input.slug,
      event_date: input.eventDate ?? null,
      venue_name: input.venueName ?? null,
      venue_address: input.venueAddress ?? null,
      map_url: input.mapUrl ?? null,
      total_capacity: input.totalCapacity ?? null,
      status: "published",
    })
    .select("*")
    .single();

  if (eventError) throw eventError;

  const { error: settingsError } = await admin.from("event_settings").insert({
    event_id: event.id,
    rsvp_enabled: input.rsvpEnabled,
    rsvp_mode: input.rsvpMode,
    max_public_request: input.maxPublicRequest ?? 4,
    approval_required: input.approvalRequired ?? true,
  });
  if (settingsError) throw settingsError;

  const { error: ownerError } = await admin
    .from("event_owners")
    .insert({ event_id: event.id, user_id: input.ownerUserId, role: "owner" });
  if (ownerError) throw ownerError;

  return event as DbEventRow;
}

export type EventCounts = {
  pending: number;
  approved: number;
  rejected: number;
  confirmed: number;
};

export async function countRsvpsByStatusForEvent(eventId: string): Promise<EventCounts> {
  const admin = createSupabaseAdminClient();
  const statuses: Array<keyof EventCounts> = ["pending", "approved", "rejected", "confirmed"];
  const counts: EventCounts = { pending: 0, approved: 0, rejected: 0, confirmed: 0 };

  await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await admin
        .from("rsvps")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", status);
      if (error) throw error;
      counts[status] = count ?? 0;
    })
  );

  return counts;
}
