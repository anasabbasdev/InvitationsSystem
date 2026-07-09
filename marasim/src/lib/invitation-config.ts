import { InvitationConfig } from "@/types/invitation";
import { weddingRoyalConfig } from "@/data/demo-invitations/wedding-royal";
import { noorWeddingConfig } from "@/data/demo-invitations/noor-wedding";
import { noorBirthConfig } from "@/data/demo-invitations/noor-birth";
import { noorWeddingAltConfig } from "@/data/demo-invitations/noor-wedding-alt";
import { noorWeddingMediaConfig } from "@/data/demo-invitations/noor-wedding-media";
import { noorBirthMediaConfig } from "@/data/demo-invitations/noor-birth-media";
// Phase 2.10 — SequenceBlueprint + DesignPreset architecture proofs
import { wsRoyalConfig } from "@/data/demo-invitations/ws-royal";
import { wsFloralConfig } from "@/data/demo-invitations/ws-floral";
import { wsMinimalConfig } from "@/data/demo-invitations/ws-minimal";
import { wsShortConfig } from "@/data/demo-invitations/ws-short";
import { wsGalleryRepeatConfig } from "@/data/demo-invitations/ws-gallery-repeat";

// Re-export both builders so callers only need one import
export { buildInvitationConfig, buildInvitationConfigV2, createPublishedSnapshot } from "@/lib/build-config";

// ─────────────────────────────────────────────────────────────────────────────
// Registry — maps URL slugs to their built InvitationConfig.
// Phase 3+: replace lookups with Supabase queries.
// ─────────────────────────────────────────────────────────────────────────────

const INVITATION_REGISTRY: Record<string, InvitationConfig> = {
  // Phase 1 / Phase 2 demos
  "demo-wedding": weddingRoyalConfig,

  // Phase 2.5 — Noor design integration demos
  "noor-wedding-demo": noorWeddingConfig,
  "noor-birth-demo": noorBirthConfig,

  // Phase 2.7 — Reuse proof: same sequence, different InvitationData
  "noor-wedding-alt-demo": noorWeddingAltConfig,

  // Phase 2.8 — Asset-driven scene player demos
  "noor-wedding-media-demo": noorWeddingMediaConfig,
  "noor-birth-media-demo": noorBirthMediaConfig,

  // Phase 2.10 — SequenceBlueprint + DesignPreset architecture proofs
  // Three invitations from one wedding-standard blueprint:
  "ws-royal-demo": wsRoyalConfig,       // Invitation A: dark gold, web_layout
  "ws-floral-demo": wsFloralConfig,     // Invitation B: cinematic assets, full_media
  "ws-minimal-demo": wsMinimalConfig,   // Invitation C: light, no icons, modern

  // Journey variation proof:
  "ws-short-demo": wsShortConfig,       // 6-scene journey, same components

  // Repeated SceneType proof:
  "ws-gallery-repeat-demo": wsGalleryRepeatConfig, // gallery_media × 2 with different IDs
};

export function getInvitationFromRegistry(slug: string): InvitationConfig | null {
  return INVITATION_REGISTRY[slug] ?? null;
}

/** @deprecated Use loadInvitationBySlug for server routes; registry-only for Composer */
export function getInvitationBySlug(slug: string): InvitationConfig | null {
  return getInvitationFromRegistry(slug);
}

export function getLocalInvitationSlugs(): string[] {
  return Object.keys(INVITATION_REGISTRY);
}

export function isLocalRegistrySlug(slug: string): boolean {
  return slug in INVITATION_REGISTRY;
}
