import { buildInvitationConfigV2 } from "@/lib/build-config";
import { weddingShortBlueprint } from "@/data/blueprints/wedding-short.blueprint";
import { weddingRoyalDarkPreset } from "@/data/presets/wedding-royal-dark.preset";
import { wsShortDemoData } from "@/data/invitations/ws-short-demo";

/**
 * Wedding Short Demo
 * Blueprint: wedding-short (6 scenes — proof of journey variation)
 * Preset:    wedding-royal-dark (same design, different journey)
 * Data:      Omar & Layla
 *
 * Proof: different blueprint (6 scenes) + same preset → clean render,
 * no gaps, no errors for absent scenes.
 */
export const wsShortConfig = buildInvitationConfigV2(
  weddingShortBlueprint,
  weddingRoyalDarkPreset,
  wsShortDemoData
);
