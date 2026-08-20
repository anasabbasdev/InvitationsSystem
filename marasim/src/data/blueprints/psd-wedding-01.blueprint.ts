import { SequenceBlueprint } from "@/types/invitation";

/**
 * PSD Wedding 01 — journey matching the original 1540×20000 @4x mobile composition.
 * Opening video is the gate; remaining scenes follow the PSD scroll order.
 */
export const psdWedding01Blueprint: SequenceBlueprint = {
  id: "psd-wedding-01",
  label: "PSD Wedding 01 — Envelope Floral",
  version: "1.0.0",
  description:
    "Opening video → invitation card → names → countdown → details → gallery → program → notes → location → RSVP → closing",
  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 0,
  },
  scenes: [
    { id: "ml-opening", type: "opening", required: true, enabledByDefault: true, label: "Opening video" },
    { id: "ml-message", type: "invitation_message", enabledByDefault: true, label: "Invitation" },
    { id: "ml-names", type: "hero_names", required: true, enabledByDefault: true, label: "Names" },
    { id: "ml-countdown", type: "countdown", enabledByDefault: true, label: "Countdown" },
    { id: "ml-details", type: "event_details", required: true, enabledByDefault: true, label: "Details" },
    { id: "ml-gallery", type: "gallery_media", enabledByDefault: true, label: "Gallery" },
    { id: "ml-program", type: "event_details", enabledByDefault: true, label: "Program" },
    { id: "ml-notes", type: "notes", enabledByDefault: true, label: "Notes" },
    { id: "ml-location", type: "location", enabledByDefault: true, label: "Location" },
    { id: "ml-rsvp", type: "rsvp", enabledByDefault: true, label: "RSVP" },
    { id: "ml-closing", type: "ticket_confirmation", required: true, enabledByDefault: true, label: "Closing" },
  ],
};
