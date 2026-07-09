import { buildInvitationConfigV2 } from "@/lib/build-config";
import { weddingStandardBlueprint } from "@/data/blueprints/wedding-standard.blueprint";
import { weddingRoyalDarkPreset } from "@/data/presets/wedding-royal-dark.preset";
import { wsRoyalDemoData } from "@/data/invitations/ws-royal-demo";

/**
 * Invitation A — Royal Dark
 * Blueprint: wedding-standard (10 scenes)
 * Preset:    wedding-royal-dark
 * Data:      Ahmad & Sara — dark gold, ornate, framed cards
 */
export const wsRoyalConfig = buildInvitationConfigV2(
  weddingStandardBlueprint,
  weddingRoyalDarkPreset,
  wsRoyalDemoData
);
