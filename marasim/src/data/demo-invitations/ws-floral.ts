import { buildInvitationConfigV2 } from "@/lib/build-config";
import { weddingStandardBlueprint } from "@/data/blueprints/wedding-standard.blueprint";
import { weddingCinematicFloralPreset } from "@/data/presets/wedding-cinematic-floral.preset";
import { wsFloralDemoData } from "@/data/invitations/ws-floral-demo";

/**
 * Invitation B — Cinematic Floral
 * Blueprint: wedding-standard (10 scenes, countdown disabled via sceneOverrides)
 * Preset:    wedding-cinematic-floral
 * Data:      Faisal & Dana — asset-driven, full_media + layered_media
 */
export const wsFloralConfig = buildInvitationConfigV2(
  weddingStandardBlueprint,
  weddingCinematicFloralPreset,
  wsFloralDemoData
);
