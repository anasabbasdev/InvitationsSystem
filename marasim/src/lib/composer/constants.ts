import type { SceneType } from "@/types/invitation";

/** Demo slugs available in the internal scene composer. */
export const COMPOSER_DEMO_SLUGS = [
  // Phase 2.10 — SequenceBlueprint + DesignPreset architecture proofs
  "ws-royal-demo",
  "ws-floral-demo",
  "ws-minimal-demo",
  "ws-short-demo",
  "ws-gallery-repeat-demo",
  // Legacy demos (Phase 2.x)
  "demo-wedding",
  "noor-wedding-demo",
  "noor-birth-demo",
  "noor-wedding-media-demo",
  "noor-birth-media-demo",
] as const;

export type ComposerDemoSlug = (typeof COMPOSER_DEMO_SLUGS)[number];

export const SCENE_ORDER: SceneType[] = [
  "opening",
  "hero_names",
  "invitation_message",
  "event_details",
  "countdown",
  "gallery_media",
  "location",
  "notes",
  "rsvp",
  "ticket_confirmation",
];

export const SCENE_VARIANTS: Record<SceneType, string[]> = {
  opening: ["rings_luxury", "full_video_intro", "minimal_tap"],
  hero_names: ["stacked_calligraphy", "split_names", "single_name_centered"],
  invitation_message: ["classic_card", "full_bleed_text", "minimal_quote"],
  event_details: ["stacked_cards", "timeline", "minimal_rows"],
  countdown: ["boxed_luxury", "minimal_digits", "hidden"],
  gallery_media: ["single_card", "full_bleed_media", "polaroid_stack"],
  location: ["map_button_card", "minimal_link", "full_bleed_location"],
  notes: ["simple_list", "elegant_cards", "hidden"],
  rsvp: ["luxury_form", "minimal_form", "hidden"],
  ticket_confirmation: ["closing_luxury", "minimal_thank_you", "brand_signature"],
};

export const SCENE_LABELS: Record<SceneType, string> = {
  opening: "Opening",
  hero_names: "Hero Names",
  invitation_message: "Invitation Message",
  event_details: "Event Details",
  countdown: "Countdown",
  gallery_media: "Gallery",
  location: "Location",
  notes: "Notes",
  rsvp: "RSVP",
  ticket_confirmation: "Closing",
};
