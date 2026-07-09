import { buildInvitationConfigV2 } from "@/lib/build-config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  fetchBlueprintById,
  fetchInvitationBySlug,
  fetchPresetById,
  fetchSnapshotById,
  parseBlueprintRow,
  parsePresetRow,
  parseSnapshotConfig,
} from "@/lib/repositories";
import type { InvitationConfig } from "@/types/invitation";
import { getInvitationFromRegistry } from "@/lib/invitation-config";

/**
 * Resolve an invitation config by slug.
 *
 * 1. Supabase invitation row (if configured)
 *    - published → frozen published_snapshots.resolved_config_json
 *    - draft     → buildInvitationConfigV2(latest linked blueprint + preset + data)
 * 2. Local registry fallback (demos)
 */
export async function loadInvitationBySlug(
  slug: string
): Promise<InvitationConfig | null> {
  if (isSupabaseConfigured()) {
    try {
      const fromDb = await resolveInvitationFromSupabase(slug);
      if (fromDb) return fromDb;
    } catch (error) {
      console.error(
        `[loadInvitationBySlug] Supabase lookup failed for "${slug}", using registry fallback.`,
        error
      );
    }
  }

  return getInvitationFromRegistry(slug);
}

async function resolveInvitationFromSupabase(
  slug: string
): Promise<InvitationConfig | null> {
  const row = await fetchInvitationBySlug(slug);
  if (!row) return null;

  if (row.status === "published" && row.published_snapshot_id) {
    const snapshot = await fetchSnapshotById(row.published_snapshot_id);
    if (snapshot) return parseSnapshotConfig(snapshot);
  }

  const [blueprintRow, presetRow] = await Promise.all([
    fetchBlueprintById(row.blueprint_id),
    fetchPresetById(row.preset_id),
  ]);

  if (!blueprintRow || !presetRow) {
    throw new Error(
      `Invitation "${slug}" references missing blueprint or preset rows.`
    );
  }

  if (
    blueprintRow.version !== row.blueprint_version ||
    presetRow.version !== row.preset_version
  ) {
    console.warn(
      `[resolveInvitationFromSupabase] Version mismatch for "${slug}" — using linked row versions.`
    );
  }

  const blueprint = parseBlueprintRow(blueprintRow);
  const preset = parsePresetRow(presetRow);
  const data = row.invitation_data_json;

  return buildInvitationConfigV2(blueprint, preset, data);
}
