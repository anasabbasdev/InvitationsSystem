import { revalidatePath } from "next/cache";
import { buildInvitationConfigV2, createPublishedSnapshot } from "@/lib/build-config";
import {
  createSnapshot,
  fetchBlueprintById,
  fetchInvitationBySlug,
  fetchPresetById,
  parseBlueprintRow,
  parsePresetRow,
  setInvitationPublishedSnapshot,
} from "@/lib/repositories";
import {
  parseDesignPreset,
  parseInvitationData,
  parseSequenceBlueprint,
} from "@/lib/validation/persistence-schemas";

/**
 * Create a new immutable snapshot and point the invitation at it (re-publish).
 * Previous snapshots remain in published_snapshots for audit.
 */
export async function republishInvitation(slug: string): Promise<{
  invitationId: string;
  snapshotId: string;
  snapshotAt: string;
}> {
  const row = await fetchInvitationBySlug(slug);
  if (!row) {
    throw new Error(`Invitation not found: ${slug}`);
  }

  const [blueprintRow, presetRow] = await Promise.all([
    fetchBlueprintById(row.blueprint_id),
    fetchPresetById(row.preset_id),
  ]);

  if (!blueprintRow || !presetRow) {
    throw new Error(`Missing blueprint or preset for invitation: ${slug}`);
  }

  const blueprintParsed = parseSequenceBlueprint(blueprintRow.blueprint_json);
  const presetParsed = parseDesignPreset(presetRow.preset_json);
  const dataParsed = parseInvitationData(row.invitation_data_json);

  if (!blueprintParsed.success || !presetParsed.success || !dataParsed.success) {
    throw new Error(`Invalid JSON for re-publish: ${slug}`);
  }

  const config = createPublishedSnapshot(
    buildInvitationConfigV2(
      blueprintParsed.data as import("@/types/invitation").SequenceBlueprint,
      presetParsed.data as import("@/types/invitation").DesignPreset,
      dataParsed.data as import("@/types/invitation").InvitationData
    )
  );

  const snapshot = await createSnapshot({
    invitationId: row.id,
    config,
    blueprintId: row.blueprint_id,
    blueprintVersion: row.blueprint_version,
    presetId: row.preset_id,
    presetVersion: row.preset_version,
  });

  await setInvitationPublishedSnapshot(row.id, snapshot.id);

  try {
    revalidatePath(`/i/${slug}`);
  } catch {
    // revalidatePath only works inside Next.js request/build context
  }

  return {
    invitationId: row.id,
    snapshotId: snapshot.id,
    snapshotAt: snapshot.snapshot_at,
  };
}
