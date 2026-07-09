import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { InvitationConfig } from "@/types/invitation";
import type { DbPublishedSnapshotRow } from "@/types/persistence";

const TABLE = "published_snapshots";

export async function fetchSnapshotById(
  id: string
): Promise<DbPublishedSnapshotRow | null> {
  const { data, error } = await getSupabaseServer()
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as DbPublishedSnapshotRow | null;
}

export function parseSnapshotConfig(
  row: DbPublishedSnapshotRow
): InvitationConfig {
  return row.resolved_config_json;
}

export type CreateSnapshotInput = {
  invitationId: string;
  config: InvitationConfig;
  blueprintId: string;
  blueprintVersion: string;
  presetId: string;
  presetVersion: string;
};

export async function createSnapshot(
  input: CreateSnapshotInput
): Promise<DbPublishedSnapshotRow> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from(TABLE)
    .insert({
      invitation_id: input.invitationId,
      resolved_config_json: input.config,
      blueprint_id: input.blueprintId,
      blueprint_version: input.blueprintVersion,
      preset_id: input.presetId,
      preset_version: input.presetVersion,
      snapshot_at: input.config.snapshotAt ?? new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as DbPublishedSnapshotRow;
}
