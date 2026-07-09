import { SequenceBlueprint } from "@/types/invitation";

/**
 * Wedding Standard Blueprint — 10-scene standard wedding journey.
 *
 * Defines ONLY the journey: which scenes exist, their IDs, order, and optional flags.
 * Contains NO design, NO content, NO assets.
 *
 * Use with a DesignPreset to produce visually distinct invitations:
 *   wedding-royal-dark    → dark gold, layered backgrounds, framed cards
 *   wedding-cinematic-floral → designer video/image assets, full_media scenes
 *   wedding-minimal-modern   → light theme, minimal typography, no icons
 *
 * Create a new blueprint ONLY when the journey changes (different scene order,
 * removed scenes, or added scenes). Visual changes belong in the DesignPreset.
 */
export const weddingStandardBlueprint: SequenceBlueprint = {
  id: "wedding-standard",
  label: "Wedding Standard — 10 Scenes",
  version: "1.0.0",
  description:
    "Standard wedding invitation journey: opening → names → message → details → countdown → gallery → location → notes → rsvp → closing",
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
      id: "ws-message",
      type: "invitation_message",
      enabledByDefault: true,
    },
    {
      id: "ws-details",
      type: "event_details",
      required: true,
      enabledByDefault: true,
    },
    {
      id: "ws-countdown",
      type: "countdown",
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
      id: "ws-notes",
      type: "notes",
      enabledByDefault: true,
    },
    {
      id: "ws-rsvp",
      type: "rsvp",
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
