import { buildInvitationConfigV2 } from "@/lib/build-config";
import { weddingStandardBlueprint } from "@/data/blueprints/wedding-standard.blueprint";
import { weddingMinimalModernPreset } from "@/data/presets/wedding-minimal-modern.preset";
import { wsMinimalDemoData } from "@/data/invitations/ws-minimal-demo";

/**
 * Invitation C — Minimal Modern
 * Blueprint: wedding-standard (10 scenes, notes + countdown + RSVP disabled)
 * Preset:    wedding-minimal-modern
 * Data:      Khalid & Nour — light theme, Tajawal, no icons, no RSVP
 */
export const wsMinimalConfig = buildInvitationConfigV2(
  weddingStandardBlueprint,
  weddingMinimalModernPreset,
  wsMinimalDemoData
);
