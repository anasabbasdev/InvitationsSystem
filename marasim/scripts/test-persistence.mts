import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  canAccessDraftInvitation,
  shouldFallbackToLocalRegistry,
  resolveLocalRegistryOnly,
} from "@/lib/invitation-load-policy";
import {
  generatePreviewToken,
  hashPreviewToken,
  verifyPreviewToken,
} from "@/lib/preview-token";
import {
  parseInvitationConfig,
  parseSequenceBlueprint,
  parseDesignPreset,
  parseInvitationData,
} from "@/lib/validation/persistence-schemas";
import { weddingStandardBlueprint } from "@/data/blueprints/wedding-standard.blueprint";
import { weddingRoyalDarkPreset } from "@/data/presets/wedding-royal-dark.preset";
import { wsRoyalDemoData } from "@/data/invitations/ws-royal-demo";
import { buildInvitationConfigV2, createPublishedSnapshot } from "@/lib/build-config";

describe("preview token", () => {
  it("generates and verifies token hash", () => {
    const token = generatePreviewToken();
    const hash = hashPreviewToken(token);
    assert.equal(verifyPreviewToken(token, hash), true);
    assert.equal(verifyPreviewToken("wrong", hash), false);
  });
});

describe("draft access policy", () => {
  it("requires valid preview token for draft", () => {
    const token = generatePreviewToken();
    const hash = hashPreviewToken(token);
    assert.equal(
      canAccessDraftInvitation({
        status: "draft",
        previewToken: token,
        storedPreviewHash: hash,
      }),
      true
    );
    assert.equal(
      canAccessDraftInvitation({
        status: "draft",
        previewToken: null,
        storedPreviewHash: hash,
      }),
      false
    );
  });

  it("rejects draft access for published status", () => {
    assert.equal(
      canAccessDraftInvitation({
        status: "published",
        previewToken: "x",
        storedPreviewHash: hashPreviewToken("x"),
      }),
      false
    );
  });
});

describe("loader fallback policy", () => {
  it("falls back to local registry when supabase not configured", () => {
    assert.equal(
      shouldFallbackToLocalRegistry({
        supabaseConfigured: false,
        slugInDatabase: false,
        slugInLocalRegistry: true,
        databaseError: false,
      }),
      true
    );
    assert.equal(
      resolveLocalRegistryOnly({
        supabaseConfigured: false,
        slugInLocalRegistry: true,
      }),
      "local_registry"
    );
  });

  it("does not fallback on database error", () => {
    assert.equal(
      shouldFallbackToLocalRegistry({
        supabaseConfigured: true,
        slugInDatabase: true,
        slugInLocalRegistry: true,
        databaseError: true,
      }),
      false
    );
  });

  it("falls back only for local slugs when not in database", () => {
    assert.equal(
      shouldFallbackToLocalRegistry({
        supabaseConfigured: true,
        slugInDatabase: false,
        slugInLocalRegistry: true,
        databaseError: false,
      }),
      true
    );
    assert.equal(
      shouldFallbackToLocalRegistry({
        supabaseConfigured: true,
        slugInDatabase: false,
        slugInLocalRegistry: false,
        databaseError: false,
      }),
      false
    );
  });
});

describe("Zod persistence validation", () => {
  it("accepts valid blueprint, preset, data, config", () => {
    assert.equal(parseSequenceBlueprint(weddingStandardBlueprint).success, true);
    assert.equal(parseDesignPreset(weddingRoyalDarkPreset).success, true);
    assert.equal(parseInvitationData(wsRoyalDemoData).success, true);
    const config = createPublishedSnapshot(
      buildInvitationConfigV2(
        weddingStandardBlueprint,
        weddingRoyalDarkPreset,
        wsRoyalDemoData
      )
    );
    assert.equal(parseInvitationConfig(config).success, true);
  });

  it("rejects malformed invitation config", () => {
    const result = parseInvitationConfig({ slug: "", scenes: [] });
    assert.equal(result.success, false);
  });
});

describe("snapshot immutability contract", () => {
  it("createPublishedSnapshot sets snapshotAt", () => {
    const config = buildInvitationConfigV2(
      weddingStandardBlueprint,
      weddingRoyalDarkPreset,
      wsRoyalDemoData
    );
    const snapshot = createPublishedSnapshot(config);
    assert.ok(snapshot.snapshotAt);
    assert.notEqual(snapshot.snapshotAt, config.snapshotAt);
  });
});
