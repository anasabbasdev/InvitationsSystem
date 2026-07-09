import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { DbInvitationRow, UpsertInvitationInput } from "@/types/persistence";

const TABLE = "invitations";

export async function fetchInvitationBySlug(
  slug: string
): Promise<DbInvitationRow | null> {
  const { data, error } = await getSupabaseServer()
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as DbInvitationRow | null;
}

export async function fetchAllInvitationSlugs(): Promise<string[]> {
  const { data, error } = await getSupabaseServer()
    .from(TABLE)
    .select("slug")
    .neq("status", "archived");

  if (error) throw error;
  return (data ?? []).map((row) => row.slug as string);
}

export async function upsertInvitation(
  input: UpsertInvitationInput
): Promise<DbInvitationRow> {
  const admin = getSupabaseAdmin();
  const payload = {
    slug: input.slug,
    event_id: input.eventId ?? null,
    blueprint_id: input.blueprintId,
    blueprint_version: input.blueprintVersion,
    preset_id: input.presetId,
    preset_version: input.presetVersion,
    invitation_data_json: input.data,
    status: input.status ?? "draft",
  };

  const { data, error } = await admin
    .from(TABLE)
    .upsert(payload, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) throw error;
  return data as DbInvitationRow;
}

export async function setInvitationPublishedSnapshot(
  invitationId: string,
  snapshotId: string
): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from(TABLE)
    .update({
      status: "published",
      published_snapshot_id: snapshotId,
    })
    .eq("id", invitationId);

  if (error) throw error;
}
