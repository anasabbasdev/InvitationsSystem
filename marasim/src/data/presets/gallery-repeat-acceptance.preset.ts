import { DesignPreset } from "@/types/invitation";
import { weddingRoyalDarkPreset } from "./wedding-royal-dark.preset";

const ASSET = "/assets/demo/noor/media-wedding";

/**
 * Gallery Repeat Acceptance Preset — extends Royal Dark with per-sceneId media.
 *
 * typeDefaults: inherited from weddingRoyalDarkPreset via typeDefaults/scenes
 * sceneOverrides: independent media for each gallery instance
 */
export const galleryRepeatAcceptancePreset: DesignPreset = {
  ...weddingRoyalDarkPreset,
  id: "gallery-repeat-acceptance",
  label: "Gallery Repeat Acceptance Preset",
  version: "1.0.0",
  typeDefaults: weddingRoyalDarkPreset.scenes,
  sceneOverrides: {
    "gallery-childhood": {
      variant: "full_bleed_media",
      media: {
        compositionMode: "full_media",
        mainMedia: {
          type: "image",
          src: `${ASSET}/gallery-01.webp`,
          fit: "cover",
        },
        liveTextEnabled: true,
        liveTextPlacement: "bottom",
        liveTextStyle: "soft",
      },
      design: {
        mediaTreatment: "polaroid",
        dividerStyle: "diamond",
      },
    },
    "gallery-wedding-day": {
      variant: "full_bleed_media",
      media: {
        compositionMode: "full_media",
        mainMedia: {
          type: "video",
          src: `${ASSET}/closing.mp4`,
          poster: `${ASSET}/closing-poster.webp`,
          fit: "cover",
          loop: true,
          muted: true,
          playsInline: true,
        },
        liveTextEnabled: true,
        liveTextPlacement: "center",
        liveTextStyle: "classic",
      },
      design: {
        mediaTreatment: "frame",
        dividerStyle: "line",
      },
    },
  },
};
