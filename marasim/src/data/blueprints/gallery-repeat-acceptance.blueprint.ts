import { SequenceBlueprint } from "@/types/invitation";

/**
 * Gallery Repeat Acceptance Blueprint — Phase 2.11 proof.
 *
 * Two gallery_media instances with different IDs in the same journey.
 * Each gets independent preset.sceneOverrides and data.sceneOverrides.
 */
export const galleryRepeatAcceptanceBlueprint: SequenceBlueprint = {
  id: "gallery-repeat-acceptance",
  label: "Gallery Repeat Acceptance — 7 Scenes",
  description: "Proves two gallery_media scenes with independent IDs and overrides.",
  version: "1.0.0",
  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },
  scenes: [
    { id: "opening-main", type: "opening", required: true, enabledByDefault: true, label: "Opening" },
    { id: "hero-main", type: "hero_names", required: true, enabledByDefault: true, label: "Hero Names" },
    { id: "gallery-childhood", type: "gallery_media", enabledByDefault: true, label: "Gallery — Childhood" },
    { id: "event-details-main", type: "event_details", required: true, enabledByDefault: true, label: "Event Details" },
    { id: "gallery-wedding-day", type: "gallery_media", enabledByDefault: true, label: "Gallery — Wedding Day" },
    { id: "location-main", type: "location", enabledByDefault: true, label: "Location" },
    { id: "closing-main", type: "ticket_confirmation", required: true, enabledByDefault: true, label: "Closing" },
  ],
};
