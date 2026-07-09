import { SequenceBlueprint } from "@/types/invitation";

/**
 * Wedding Short Blueprint — 6-scene streamlined wedding journey.
 *
 * Demonstrates that a different journey (fewer scenes) does NOT require
 * new Scene Components. The same Scene Library and InvitationRenderer are used.
 *
 * Journey: opening → names → details → gallery → location → closing
 *
 * Scenes removed vs wedding-standard:
 *   - invitation_message (implicit in names/details)
 *   - countdown (short notice weddings)
 *   - notes (keep it simple)
 *   - rsvp (announcement-only)
 *
 * Create a new blueprint like this when the JOURNEY changes —
 * not when the design or assets change.
 */
export const weddingShortBlueprint: SequenceBlueprint = {
  id: "wedding-short",
  label: "Wedding Short — 6 Scenes",
  description:
    "Streamlined wedding journey without countdown, notes, or RSVP.",
  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },
  scenes: [
    {
      id: "ws-opening",
      type: "opening",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-hero",
      type: "hero_names",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-details",
      type: "event_details",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-gallery",
      type: "gallery_media",
      enabledByDefault: true,
    },
    {
      id: "ws-location",
      type: "location",
      enabledByDefault: true,
    },
    {
      id: "ws-closing",
      type: "ticket_confirmation",
      required: true,
      enabledByDefault: true,
    },
  ],
};

/**
 * Gallery Repeat Blueprint — proof that gallery_media can repeat with different IDs.
 *
 * Two gallery scenes exist in the same journey, each with:
 *   - unique id (gallery-childhood, gallery-wedding)
 *   - different content via sceneOverrides
 *   - different design via sceneOverrides
 */
export const weddingGalleryRepeatBlueprint: SequenceBlueprint = {
  id: "wedding-gallery-repeat",
  label: "Wedding Gallery Repeat — Proof of Concept",
  description:
    "Proves that gallery_media can appear twice in one journey with distinct IDs and overrides.",
  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },
  scenes: [
    {
      id: "ws-opening",
      type: "opening",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-hero",
      type: "hero_names",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-details",
      type: "event_details",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "gallery-childhood",
      type: "gallery_media",
      enabledByDefault: true,
    },
    {
      id: "gallery-wedding-day",
      type: "gallery_media",
      enabledByDefault: true,
    },
    {
      id: "ws-closing",
      type: "ticket_confirmation",
      required: true,
      enabledByDefault: true,
    },
  ],
};
