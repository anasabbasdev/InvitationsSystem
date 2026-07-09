/**
 * Integration verification against a real Supabase project.
 * Requires .env.local with admin keys and applied migrations.
 *
 * Usage: npm run verify:persistence
 */

import assert from "node:assert/strict";
import { loadProjectEnv } from "../src/lib/env/load-dotenv";
import { assertSupabaseAdminEnv } from "../src/lib/supabase/env";
import { createSupabaseAdminClient } from "../src/lib/supabase/create-admin-client";
import { fetchInvitationBySlug, listSnapshotsForInvitation } from "../src/lib/repositories/index";
import { loadInvitation } from "../src/lib/invitation-loader-core";
import { updatePresetJson, fetchPresetById } from "../src/lib/repositories/presets";
import { republishInvitation } from "../src/lib/repositories/republish";
import { submitPublicRSVP, getRSVPStatusView } from "../src/lib/rsvp-core";
import { listNotificationsForEvent } from "../src/lib/repositories/notifications";
import { weddingRoyalDarkPreset } from "../src/data/presets/wedding-royal-dark.preset";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

loadProjectEnv();

const REQUIRED_TABLES = [
  "sequence_blueprints",
  "design_presets",
  "invitations",
  "published_snapshots",
  "events",
  "event_settings",
  "rsvps",
  "event_notifications",
];

function readPreviewToken(slug: string): string | null {
  const file = resolve(process.cwd(), ".preview-tokens.local");
  if (!existsSync(file)) return null;
  const line = readFileSync(file, "utf8")
    .split("\n")
    .find((l) => l.startsWith(`${slug}=`));
  return line ? line.split("=")[1]?.trim() ?? null : null;
}

async function main() {
  assertSupabaseAdminEnv();
  const admin = createSupabaseAdminClient();

  console.log("\n── 1. Connection & tables ──");
  for (const table of REQUIRED_TABLES) {
    const { error } = await admin.from(table).select("*", { count: "exact", head: true });
    if (error) throw new Error(`Table check failed: ${table} — ${error.message}`);
    console.log(`  ✓ ${table}`);
  }

  console.log("\n── 2. Published snapshot (ws-royal-demo) ──");
  const royalRow = await fetchInvitationBySlug("ws-royal-demo");
  assert.ok(royalRow, "ws-royal-demo must exist — run npm run db:seed");
  assert.equal(royalRow.status, "published");
  assert.ok(royalRow.published_snapshot_id);

  const publishedLoad = await loadInvitation("ws-royal-demo");
  assert.equal(publishedLoad.status, "loaded");
  if (publishedLoad.status !== "loaded") throw new Error("expected loaded");
  assert.equal(publishedLoad.source, "supabase_snapshot");

  const heroBefore =
    publishedLoad.config.scenes.find((s) => s.id === "ws-hero")?.content?.primaryName;
  console.log(`  hero primaryName (snapshot): ${String(heroBefore)}`);
  console.log(`  snapshot_id: ${royalRow.published_snapshot_id}`);

  const presetRow = await fetchPresetById(royalRow.preset_id);
  assert.ok(presetRow);
  const mutatedPreset = structuredClone(presetRow.preset_json);
  mutatedPreset.theme = {
    ...mutatedPreset.theme,
    primaryColor: "#FF0000",
  };
  await updatePresetJson(presetRow.id, mutatedPreset);

  const afterPresetMutation = await loadInvitation("ws-royal-demo");
  assert.equal(afterPresetMutation.status, "loaded");
  if (afterPresetMutation.status !== "loaded") throw new Error("expected loaded");
  const heroAfterMutation =
    afterPresetMutation.config.scenes.find((s) => s.id === "ws-hero")?.content?.primaryName;
  assert.equal(heroAfterMutation, heroBefore, "published must not change when preset mutates");
  console.log("  ✓ published unchanged after preset mutation");

  const republish = await republishInvitation("ws-royal-demo");
  const snapshots = await listSnapshotsForInvitation(royalRow.id);
  assert.ok(snapshots.length >= 2, "old snapshot must be retained");
  console.log(`  ✓ republish created snapshot ${republish.snapshotId}`);
  console.log(`  ✓ total snapshots: ${snapshots.length}`);

  await updatePresetJson(presetRow.id, presetRow.preset_json);

  console.log("\n── 3. Draft live merge (ws-floral-demo) ──");
  const floralPreview = readPreviewToken("ws-floral-demo");
  assert.ok(floralPreview, "preview token missing — re-run db:seed");

  const draftLoad = await loadInvitation("ws-floral-demo", {
    previewToken: floralPreview,
  });
  assert.equal(draftLoad.status, "loaded");
  if (draftLoad.status !== "loaded") throw new Error("expected loaded");
  assert.equal(draftLoad.source, "supabase_draft");
  console.log(`  ✓ draft loaded with preview token`);

  const draftBlocked = await loadInvitation("ws-floral-demo");
  assert.equal(draftBlocked.status, "database_error");
  if (draftBlocked.status === "database_error") {
    assert.equal(draftBlocked.errorCode, "DRAFT_PREVIEW_REQUIRED");
  }
  console.log("  ✓ draft blocked without preview token");

  console.log("\n── 4. Local fallback slugs ──");
  const localLoad = await loadInvitation("demo-wedding");
  assert.equal(localLoad.status, "loaded");
  if (localLoad.status === "loaded") {
    assert.equal(localLoad.source, "local_registry");
  }
  console.log("  ✓ demo-wedding from local registry");

  console.log("\n── 5. Public RSVP (ws-royal-demo) ──");
  assert.ok(royalRow.event_id, "ws-royal-demo must be linked to event — re-run db:seed after migration 3B");

  const uniqueName = `Verify Guest ${Date.now()}`;
  const rsvpResult = await submitPublicRSVP({
    slug: "ws-royal-demo",
    name: uniqueName,
    requestedSeats: 2,
    guestNote: "integration test",
  });
  assert.ok(rsvpResult.rsvpViewToken);
  assert.equal(rsvpResult.status, "pending");

  const statusView = await getRSVPStatusView(rsvpResult.rsvpViewToken);
  assert.ok(statusView);
  assert.equal(statusView?.name, uniqueName);
  assert.equal(statusView?.status, "pending");
  assert.equal(statusView?.requestedSeats, 2);
  console.log(`  ✓ RSVP submitted → /s/${rsvpResult.rsvpViewToken.slice(0, 8)}...`);

  const notifications = await listNotificationsForEvent(royalRow.event_id!);
  const pendingNotif = notifications.find(
    (n) => n.type === "rsvp_pending" && n.payload?.name === uniqueName
  );
  assert.ok(pendingNotif, "owner notification must be created on RSVP submit");
  console.log("  ✓ owner notification created");

  console.log("\n── All integration checks passed ──\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
