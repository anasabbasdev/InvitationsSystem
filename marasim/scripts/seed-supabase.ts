/**
 * Seed Supabase with local V2 blueprints, presets, and ws-* demo invitations.
 *
 * Prerequisites:
 *   1. Apply migrations in supabase/migrations/
 *   2. Copy .env.local.example → .env.local with Supabase keys
 *
 * Usage:
 *   cd marasim && npm run db:seed
 *
 * Idempotent: safe to run multiple times.
 */

import { appendFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadProjectEnv } from "@/lib/env/load-dotenv";
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
import { generatePreviewToken, hashPreviewToken } from "@/lib/preview-token";
import { assertSupabaseAdminEnv } from "@/lib/supabase/env";
import {
  createSnapshot,
  fetchInvitationBySlug,
  listSnapshotsForInvitation,
  setInvitationEventId,
  setInvitationPreviewTokenHash,
  setInvitationPublishedSnapshot,
  updateInvitationDataJson,
  upsertBlueprint,
  upsertEventWithSettings,
  upsertInvitation,
  upsertPreset,
} from "@/lib/repositories";
import type { DesignPreset, InvitationData, SequenceBlueprint } from "@/types/invitation";
import { seedOperationalDemoData } from "./seed-demo-operational";

loadProjectEnv();

type SeedInvitation = {
  data: InvitationData;
  blueprint: SequenceBlueprint;
  preset: DesignPreset;
  publish?: boolean;
};

const PREVIEW_TOKENS_FILE = resolve(process.cwd(), ".preview-tokens.local");

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
  { data: wsFloralDemoData, blueprint: weddingStandardBlueprint, preset: weddingCinematicFloralPreset, publish: true },
  { data: wsMinimalDemoData, blueprint: weddingStandardBlueprint, preset: weddingMinimalModernPreset },
  { data: wsShortDemoData, blueprint: weddingShortBlueprint, preset: weddingRoyalDarkPreset },
  { data: wsGalleryRepeatDemoData, blueprint: galleryRepeatAcceptanceBlueprint, preset: galleryRepeatAcceptancePreset },
];

type SeedAction = "created" | "updated" | "skipped";

function logAction(entity: string, key: string, action: SeedAction, detail?: string) {
  const suffix = detail ? ` — ${detail}` : "";
  console.log(`  ${action === "skipped" ? "○" : action === "created" ? "+" : "~"} ${entity} ${key}${suffix}`);
}

function appendPreviewToken(slug: string, token: string) {
  const line = `${slug}=${token}\n`;
  if (!existsSync(PREVIEW_TOKENS_FILE)) {
    writeFileSync(PREVIEW_TOKENS_FILE, "# gitignored — draft preview tokens\n", "utf8");
  }
  appendFileSync(PREVIEW_TOKENS_FILE, line, "utf8");
}

function eventTitleFromData(data: InvitationData): string {
  const hero = data.content.hero_names;
  if (hero?.primaryName && hero?.secondaryName) {
    return `زفاف ${hero.primaryName} و ${hero.secondaryName}`;
  }
  return data.slug;
}

async function ensureEventForInvitation(data: InvitationData): Promise<string | null> {
  if (!data.rsvp?.enabled) return null;

  const details = data.content.event_details;
  const { event } = await upsertEventWithSettings({
    slug: data.slug,
    title: eventTitleFromData(data),
    eventDate: details?.date ? `${details.date}T00:00:00+03:00` : null,
    venueName: details?.venueName ?? null,
    totalCapacity: data.slug === "ws-royal-demo" ? 20 : data.slug === "ws-floral-demo" ? 10 : null,
    rsvpEnabled: data.rsvp.enabled,
    rsvpMode: data.rsvp.mode,
    maxPublicRequest: data.rsvp.maxPublicRequest ?? 4,
    approvalRequired: data.rsvp.approvalRequired,
  });

  return event.id;
}

async function main() {
  try {
    assertSupabaseAdminEnv();
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Supabase admin env not configured."
    );
    console.error("Copy .env.local.example → .env.local and set Supabase keys.");
    process.exit(1);
  }

  const blueprintIds = new Map<string, string>();
  const presetIds = new Map<string, string>();

  console.log("\n── Blueprints ──");
  for (const blueprint of BLUEPRINTS) {
    const version = blueprint.version ?? "1.0.0";
    const key = `${blueprint.id}@${version}`;
    const { row, action } = await upsertBlueprint({
      name: blueprint.id,
      version,
      blueprint,
    });
    blueprintIds.set(key, row.id);
    logAction("blueprint", key, action, row.id);
  }

  console.log("\n── Presets ──");
  for (const entry of PRESETS) {
    const preset = entry.preset;
    const version = preset.version ?? "1.0.0";
    const key = `${preset.id}@${version}`;
    const compatibleKey = entry.compatibleBlueprintId
      ? `${entry.compatibleBlueprintId}@1.0.0`
      : undefined;
    const { row, action } = await upsertPreset({
      name: preset.id,
      version,
      preset,
      compatibleBlueprintId: compatibleKey ? blueprintIds.get(compatibleKey) ?? null : null,
    });
    presetIds.set(key, row.id);
    logAction("preset", key, action, row.id);
  }

  console.log("\n── Invitations ──");
  for (const entry of INVITATIONS) {
    const slug = entry.data.slug;
    const bpVersion = entry.blueprint.version ?? "1.0.0";
    const prVersion = entry.preset.version ?? "1.0.0";
    const blueprintUuid = blueprintIds.get(`${entry.blueprint.id}@${bpVersion}`);
    const presetUuid = presetIds.get(`${entry.preset.id}@${prVersion}`);

    if (!blueprintUuid || !presetUuid) {
      throw new Error(`Missing blueprint/preset UUID for ${slug}`);
    }

    const eventId = await ensureEventForInvitation(entry.data);
    if (eventId) {
      logAction("event", slug, "updated", eventId);
    }

    const existing = await fetchInvitationBySlug(slug);

    if (existing?.status === "published" && existing.published_snapshot_id) {
      await updateInvitationDataJson(existing.id, entry.data);
      if (eventId && !existing.event_id) {
        await setInvitationEventId(existing.id, eventId);
        logAction("event_link", slug, "updated", eventId);
      }
      logAction("invitation", slug, "updated", "published — data only, snapshot preserved");
      continue;
    }

    let previewTokenHash = existing?.preview_token_hash ?? null;
    let previewTokenPlain: string | null = null;

    if (!entry.publish && !previewTokenHash) {
      previewTokenPlain = generatePreviewToken();
      previewTokenHash = hashPreviewToken(previewTokenPlain);
    }

    const { row, action } = await upsertInvitation({
      slug,
      eventId: eventId ?? undefined,
      blueprintId: blueprintUuid,
      blueprintVersion: bpVersion,
      presetId: presetUuid,
      presetVersion: prVersion,
      data: entry.data,
      status: "draft",
      previewTokenHash,
    });

    if (previewTokenPlain) {
      appendPreviewToken(slug, previewTokenPlain);
      logAction("preview", slug, "created", `/i/${slug}?preview=***`);
    } else if (!entry.publish && existing?.preview_token_hash) {
      logAction("preview", slug, "skipped", "existing token hash preserved");
    }

    if (entry.publish) {
      if (existing?.published_snapshot_id) {
        const snapshots = await listSnapshotsForInvitation(existing.id);
        logAction("invitation", slug, "skipped", `already published (${snapshots.length} snapshot(s))`);
        continue;
      }

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
      logAction("invitation", slug, action, `published snapshot ${snapshot.id}`);
    } else {
      if (!previewTokenPlain && row.preview_token_hash) {
        await setInvitationPreviewTokenHash(row.id, row.preview_token_hash);
      }
      logAction("invitation", slug, action, "draft");
    }
  }

  console.log("\n── Operational demo data ──");
  try {
    const op = await seedOperationalDemoData();
    console.log(`  ✓ owner: ${op.ownerEmail}`);
    console.log(`  ✓ demo URLs: .seed-data.local`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("user_roles") || msg.includes("tickets") || msg.includes("invite_links")) {
      console.error(
        "\nMissing Phase 4+ tables — apply migrations:\n" +
          "  20260710010000_phase4_owner_auth.sql\n" +
          "  20260710020000_phase4_tickets_and_approval.sql\n" +
          "  20260710030000_phase6_invite_links.sql\n"
      );
    }
    throw error;
  }

  console.log("\n── Done ──");
  console.log("Published: /i/ws-royal-demo, /i/ws-floral-demo");
  console.log("Owner login: /owner/login (see .seed-data.local)");
  console.log("Test Hub: /lab/test-hub (dev only)");
  console.log("RSVP status after submit: /s/[rsvp_view_token]");
  console.log("Ticket page: /t/[ticketToken]");
  console.log("Draft preview URLs: see .preview-tokens.local (gitignored)");
  console.log("Local fallback: /i/demo-wedding");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("preview_token_hash")) {
    console.error(
      "\nMissing column preview_token_hash — apply migration:\n" +
        "  supabase/migrations/20260709130000_phase_3a_1_hardening.sql\n"
    );
  }
  if (message.includes("rsvps") || message.includes("event_notifications")) {
    console.error(
      "\nMissing RSVP tables — apply migration:\n" +
        "  supabase/migrations/20260709140000_phase_3b_rsvp.sql\n"
    );
  }
  console.error(message);
  process.exit(1);
});
