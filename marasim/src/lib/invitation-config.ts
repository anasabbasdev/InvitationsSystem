import { InvitationConfig } from "@/types/invitation";
import { weddingRoyalConfig } from "@/data/demo-invitations/wedding-royal";
import { noorWeddingConfig } from "@/data/demo-invitations/noor-wedding";
import { noorBirthConfig } from "@/data/demo-invitations/noor-birth";
import { noorWeddingAltConfig } from "@/data/demo-invitations/noor-wedding-alt";
import { noorWeddingMediaConfig } from "@/data/demo-invitations/noor-wedding-media";
import { noorBirthMediaConfig } from "@/data/demo-invitations/noor-birth-media";

// Re-export the builder so callers only need one import
export { buildInvitationConfig } from "@/lib/build-config";

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
};

export function getInvitationBySlug(slug: string): InvitationConfig | null {
  return INVITATION_REGISTRY[slug] ?? null;
}

export function getAllInvitationSlugs(): string[] {
  return Object.keys(INVITATION_REGISTRY);
}
