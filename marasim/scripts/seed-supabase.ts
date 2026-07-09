/**
 * Seed Supabase with local V2 blueprints, presets, and ws-* demo invitations.
 *
 * Prerequisites:
 *   1. Run migration: supabase/migrations/20260709120000_phase_3a_persistence.sql
 *   2. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: npm run db:seed
 */

import { weddingStandardBlueprint } from "@/data/blueprints/wedding-standard.blueprint";
import { weddingShortBlueprint } from "@/data/blueprints/wedding-short.blueprint";
import { galleryRepeatAcceptanceBlueprint } from "@/data/blueprints/gallery-repeat-acceptance.blueprint";
import { weddingRoyalDarkPreset } from "@/data/presets/wedding-royal-dark.preset";
import { weddingCinematicFloralPreset } from "@/data/presets/wedding-cinematic-floral.preset";
import { weddingMinimalModernPreset } from "@/data/presets/wedding-minimal-modern.preset";
import { galleryRepeatAcceptancePreset } from "@/data/presets/gallery-repeat-acceptance.preset";
import { wsRoyalDemoData } from "@/data/invitations/ws-royal-demo";
import { wsFloralDemoData } from "@/data/invitations/ws-floral-demo";
import { wsMinimalDemoData } from "@/data/invitations/ws-minimal-demo";
import { wsShortDemoData } from "@/data/invitations/ws-short-demo";
import { wsGalleryRepeatDemoData } from "@/data/invitations/ws-gallery-repeat-demo";
import { buildInvitationConfigV2, createPublishedSnapshot } from "@/lib/build-config";
import { isSupabaseAdminConfigured } from "@/lib/supabase/env";
import {
  createSnapshot,
  setInvitationPublishedSnapshot,
  upsertBlueprint,
  upsertInvitation,
  upsertPreset,
} from "@/lib/repositories";
import type { DesignPreset, InvitationData, SequenceBlueprint } from "@/types/invitation";

type SeedInvitation = {
  data: InvitationData;
  blueprint: SequenceBlueprint;
  preset: DesignPreset;
  publish?: boolean;
};

const BLUEPRINTS: SequenceBlueprint[] = [
  weddingStandardBlueprint,
  weddingShortBlueprint,
  galleryRepeatAcceptanceBlueprint,
];

const PRESETS: Array<{
  preset: DesignPreset;
  compatibleBlueprintId?: string;
}> = [
  { preset: weddingRoyalDarkPreset, compatibleBlueprintId: "wedding-standard" },
  { preset: weddingCinematicFloralPreset, compatibleBlueprintId: "wedding-standard" },
  { preset: weddingMinimalModernPreset, compatibleBlueprintId: "wedding-standard" },
  { preset: galleryRepeatAcceptancePreset, compatibleBlueprintId: "gallery-repeat-acceptance" },
];

const INVITATIONS: SeedInvitation[] = [
  { data: wsRoyalDemoData, blueprint: weddingStandardBlueprint, preset: weddingRoyalDarkPreset, publish: true },
  { data: wsFloralDemoData, blueprint: weddingStandardBlueprint, preset: weddingCinematicFloralPreset },
  { data: wsMinimalDemoData, blueprint: weddingStandardBlueprint, preset: weddingMinimalModernPreset },
  { data: wsShortDemoData, blueprint: weddingShortBlueprint, preset: weddingRoyalDarkPreset },
  { data: wsGalleryRepeatDemoData, blueprint: galleryRepeatAcceptanceBlueprint, preset: galleryRepeatAcceptancePreset },
];

async function main() {
  if (!isSupabaseAdminConfigured()) {
    console.error(
      "Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (and anon key for reads)."
    );
    process.exit(1);
  }

  const blueprintIds = new Map<string, string>();

  console.log("Seeding blueprints...");
  for (const blueprint of BLUEPRINTS) {
    const version = blueprint.version ?? "1.0.0";
    const row = await upsertBlueprint({
      name: blueprint.id,
      version,
      blueprint,
    });
    blueprintIds.set(`${blueprint.id}@${version}`, row.id);
    console.log(`  ✓ ${blueprint.id}@${version} → ${row.id}`);
  }

  const presetIds = new Map<string, string>();

  console.log("Seeding presets...");
  for (const entry of PRESETS) {
    const preset = entry.preset;
    const version = preset.version ?? "1.0.0";
    const compatibleKey = entry.compatibleBlueprintId
      ? `${entry.compatibleBlueprintId}@1.0.0`
      : undefined;
    const compatibleUuid = compatibleKey
      ? blueprintIds.get(compatibleKey) ?? null
      : null;

    const row = await upsertPreset({
      name: preset.id,
      version,
      preset,
      compatibleBlueprintId: compatibleUuid,
    });
    presetIds.set(`${preset.id}@${version}`, row.id);
    console.log(`  ✓ ${preset.id}@${version} → ${row.id}`);
  }

  console.log("Seeding invitations...");
  for (const entry of INVITATIONS) {
    const bpVersion = entry.blueprint.version ?? "1.0.0";
    const prVersion = entry.preset.version ?? "1.0.0";
    const blueprintUuid = blueprintIds.get(`${entry.blueprint.id}@${bpVersion}`);
    const presetUuid = presetIds.get(`${entry.preset.id}@${prVersion}`);

    if (!blueprintUuid || !presetUuid) {
      throw new Error(
        `Missing blueprint/preset UUID for invitation ${entry.data.slug}`
      );
    }

    const row = await upsertInvitation({
      slug: entry.data.slug,
      blueprintId: blueprintUuid,
      blueprintVersion: bpVersion,
      presetId: presetUuid,
      presetVersion: prVersion,
      data: entry.data,
      status: entry.publish ? "draft" : "draft",
    });

    if (entry.publish) {
      const config = createPublishedSnapshot(
        buildInvitationConfigV2(entry.blueprint, entry.preset, entry.data)
      );
      const snapshot = await createSnapshot({
        invitationId: row.id,
        config,
        blueprintId: blueprintUuid,
        blueprintVersion: bpVersion,
        presetId: presetUuid,
        presetVersion: prVersion,
      });
      await setInvitationPublishedSnapshot(row.id, snapshot.id);
      console.log(`  ✓ ${entry.data.slug} (published snapshot ${snapshot.id})`);
    } else {
      console.log(`  ✓ ${entry.data.slug} (draft)`);
    }
  }

  console.log("\nDone. Test:");
  console.log("  /i/ws-royal-demo  → published snapshot from Supabase");
  console.log("  /i/ws-floral-demo → draft live merge from Supabase");
  console.log("  /i/demo-wedding   → local registry fallback");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
