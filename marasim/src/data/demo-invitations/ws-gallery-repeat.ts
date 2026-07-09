import { buildInvitationConfigV2 } from "@/lib/build-config";
import { galleryRepeatAcceptanceBlueprint } from "@/data/blueprints/gallery-repeat-acceptance.blueprint";
import { galleryRepeatAcceptancePreset } from "@/data/presets/gallery-repeat-acceptance.preset";
import { wsGalleryRepeatDemoData } from "@/data/invitations/ws-gallery-repeat-demo";

/**
 * Gallery Repeat Acceptance Demo — Phase 2.11 proof.
 * Two gallery_media scenes with independent preset.sceneOverrides + data.sceneOverrides.
 */
export const wsGalleryRepeatConfig = buildInvitationConfigV2(
  galleryRepeatAcceptanceBlueprint,
  galleryRepeatAcceptancePreset,
  wsGalleryRepeatDemoData
);
