import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { CreateInviteLinkInput, DbInviteLinkRow } from "@/types/persistence";
import { generateSecureToken } from "@/lib/secure-token";
import { callRpc } from "@/lib/repositories/rpc";

const TABLE = "invite_links";

export async function fetchInviteLinkByToken(
  token: string
): Promise<DbInviteLinkRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) throw error;
  return data as DbInviteLinkRow | null;
}

export async function listInviteLinksForEvent(
  eventId: string
): Promise<DbInviteLinkRow[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as DbInviteLinkRow[];
}

export async function createInviteLink(
  input: CreateInviteLinkInput
): Promise<DbInviteLinkRow> {
  const token = generateSecureToken();
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .insert({
      event_id: input.eventId,
      invitation_id: input.invitationId ?? null,
      token,
      label: input.label ?? null,
      guest_name: input.guestName ?? null,
      side: input.side ?? null,
      max_seats: input.maxSeats,
      expires_at: input.expiresAt ?? null,
      status: "active",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as DbInviteLinkRow;
}

export async function disableInviteLink(id: string): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ status: "disabled" })
    .eq("id", id)
    .neq("status", "confirmed");

  if (error) throw error;
}

export type ConfirmInviteLinkResult = {
  rsvpId: string;
  rsvpViewToken: string;
  ticketToken: string;
};

/** Atomic confirmation via Postgres function — see migration 005. */
export async function confirmInviteLinkRpc(
  token: string,
  name: string,
  phone: string | null,
  seats: number
) {
  return callRpc<ConfirmInviteLinkResult>("confirm_invite_link", {
    p_token: token,
    p_name: name,
    p_phone: phone,
    p_seats: seats,
  });
}
