import type { SceneType } from "@/types/invitation";

/** Icon asset keys used in composer — map to SceneIcon names or custom assets */
export const COMPOSER_ICON_FIELDS = [
  { key: "calendar", label: "calendarIcon", scenes: ["event_details"] as SceneType[] },
  { key: "clock", label: "clockIcon", scenes: ["event_details"] as SceneType[] },
  { key: "pin", label: "locationIcon", scenes: ["event_details", "location"] as SceneType[] },
  { key: "map", label: "mapIcon", scenes: ["location"] as SceneType[] },
  { key: "envelope", label: "rsvpIcon", scenes: ["rsvp"] as SceneType[] },
  { key: "check", label: "guestIcon", scenes: ["rsvp"] as SceneType[] },
  { key: "star", label: "phoneIcon", scenes: ["rsvp", "location"] as SceneType[] },
  { key: "bullet", label: "notesBulletIcon", scenes: ["notes"] as SceneType[] },
] as const;

export const FUNCTIONAL_ICON_SCENES: SceneType[] = [
  "event_details",
  "location",
  "notes",
  "rsvp",
];

export const LIVE_TEXT_SCENES: SceneType[] = [
  "opening",
  "hero_names",
  "invitation_message",
  "event_details",
  "countdown",
  "gallery_media",
  "location",
  "notes",
  "ticket_confirmation",
];

export function iconsForScene(sceneType: SceneType) {
  return COMPOSER_ICON_FIELDS.filter((f) => f.scenes.includes(sceneType));
}

/** Default z-index stack for layered media layers */
export const LAYER_Z_DEFAULTS: Record<string, number> = {
  background: 0,
  mainMedia: 5,
  overlay: 10,
  frame: 15,
  foreground: 20,
};
