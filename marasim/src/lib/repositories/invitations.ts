import { createSupabaseAdminClient } from "@/lib/supabase/create-admin-client";
import type { DbInvitationRow, UpsertInvitationInput } from "@/types/persistence";

const TABLE = "invitations";

export async function fetchInvitationBySlug(
  slug: string
): Promise<DbInvitationRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as DbInvitationRow | null;
}

export async function fetchInvitationById(
  id: string
): Promise<DbInvitationRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DbInvitationRow | null;
}

export async function fetchAllInvitationSlugs(): Promise<string[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("slug")
    .neq("status", "archived");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug as string);
}

export async function fetchInvitationByEventId(
  eventId: string
): Promise<DbInvitationRow | null> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .eq("event_id", eventId)
    .neq("status", "archived")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as DbInvitationRow | null;
}

export async function listAllInvitations(): Promise<DbInvitationRow[]> {
  const { data, error } = await createSupabaseAdminClient()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as DbInvitationRow[];
}

export type UpsertInvitationResult = {
  row: DbInvitationRow;
  action: "created" | "updated";
};

export async function upsertInvitation(
  input: UpsertInvitationInput
): Promise<UpsertInvitationResult> {
  const admin = createSupabaseAdminClient();
  const existing = await fetchInvitationBySlug(input.slug);

  const payload: Record<string, unknown> = {
    slug: input.slug,
    event_id: input.eventId ?? null,
    blueprint_id: input.blueprintId,
    blueprint_version: input.blueprintVersion,
    preset_id: input.presetId,
    preset_version: input.presetVersion,
    invitation_data_json: input.data,
    status: input.status ?? "draft",
  };

  if (input.previewTokenHash !== undefined) {
    payload.preview_token_hash = input.previewTokenHash;
  }

  const { data, error } = await admin
    .from(TABLE)
    .upsert(payload, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) throw error;
  return {
    row: data as DbInvitationRow,
    action: existing ? "updated" : "created",
  };
}

export async function setInvitationEventId(
  invitationId: string,
  eventId: string
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ event_id: eventId })
    .eq("id", invitationId);

  if (error) throw error;
}

export async function setInvitationPreviewTokenHash(
  invitationId: string,
  previewTokenHash: string
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ preview_token_hash: previewTokenHash })
    .eq("id", invitationId);

  if (error) throw error;
}

export async function setInvitationPublishedSnapshot(
  invitationId: string,
  snapshotId: string
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({
      status: "published",
      published_snapshot_id: snapshotId,
    })
    .eq("id", invitationId);

  if (error) throw error;
}

export async function updateInvitationDataJson(
  invitationId: string,
  data: UpsertInvitationInput["data"]
): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .from(TABLE)
    .update({ invitation_data_json: data })
    .eq("id", invitationId);

  if (error) throw error;
}
