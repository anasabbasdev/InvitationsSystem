import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbRsvpRow } from "@/types/persistence";
import type { RSVP, RSVPSubmission } from "@/types/rsvp";
import { generateSecureToken } from "@/lib/secure-token";

const TABLE = "rsvps";

function mapRow(row: DbRsvpRow): RSVP {
  return {
    id: row.id,
    eventId: row.event_id,
    invitationId: row.invitation_id,
    inviteLinkId: row.invite_link_id,
    name: row.name,
    phone: row.phone ?? undefined,
    guestNote: row.guest_note,
    side: row.side ?? undefined,
    requestedSeats: row.requested_seats,
    approvedSeats: row.approved_seats,
    status: row.status,
    rsvpViewToken: row.rsvp_view_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchRsvpByViewToken(
  token: string
): Promise<RSVP | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("rsvp_view_token", token)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRow(data as DbRsvpRow);
}

export async function createPublicRsvp(
  submission: RSVPSubmission
): Promise<RSVP> {
  const token = generateSecureToken();
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from(TABLE)
    .insert({
      event_id: submission.eventId,
      invitation_id: submission.invitationId ?? null,
      invite_link_id: submission.inviteLinkId ?? null,
      name: submission.name.trim(),
      phone: submission.phone?.trim() || null,
      guest_note: submission.guestNote?.trim() || null,
      requested_seats: submission.requestedSeats,
      status: "pending",
      rsvp_view_token: token,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data as DbRsvpRow);
}

export async function countPendingRsvpsForEvent(eventId: string): Promise<number> {
  const { count, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "pending");

  if (error) throw error;
  return count ?? 0;
}
