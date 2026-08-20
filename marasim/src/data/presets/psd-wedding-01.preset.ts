import { DesignPreset } from "@/types/invitation";

const PSD_PAPER = "#F3EDE3";
const PSD_GOLD = "#C4A35A";
const PSD_INK = "#4A4038";
const OPENING_VIDEO = "/assets/invitations/psd-wedding-01/opening.mp4";
const OPENING_POSTER = "/assets/invitations/psd-wedding-01/opening-poster.webp";

export const psdWedding01Preset: DesignPreset = {
  id: "psd-wedding-01",
  label: "PSD Wedding 01 — Envelope Floral",
  version: "1.0.0",
  description: "Visual identity extracted from the original 1540×20000 @4x PSD",

  theme: {
    family: "psd-wedding-01",
    primaryColor: PSD_GOLD,
    secondaryColor: "#8A7A68",
    backgroundColor: PSD_PAPER,
    textColor: PSD_INK,
    mutedTextColor: "#6B6258",
    accentColor: PSD_GOLD,
    fontHeading: "var(--font-montserrat)",
    fontBody: "var(--font-montserrat-arabic)",
    typography: {
      headingFont: "var(--font-montserrat)",
      bodyFont: "var(--font-montserrat-arabic)",
      namesFont: "var(--font-great-vibes)",
    },
    design: {
      cardStyle: "none",
      buttonStyle: "square",
      dividerStyle: "none",
      iconStyle: "none",
      typographyStyle: "classic",
      cornerStyle: "none",
      sectionLabelStyle: "hidden",
      density: "compact",
    },
  },

  typeDefaults: {
    opening: {
      variant: "psd_wedding_video",
      media: {
        compositionMode: "full_media",
        mainMedia: {
          type: "video",
          src: OPENING_VIDEO,
          poster: OPENING_POSTER,
          fit: "cover",
          loop: false,
          muted: true,
          playsInline: true,
          preload: "auto",
        },
        startBehavior: "tap_anywhere",
        startButtonText: "افتح الدعوة",
        revealAfter: "media_end",
        minDurationMs: 200,
        maxDurationMs: 10000,
      },
      defaultContent: {
        tapText: "افتح الدعوة",
        label: "دعوة زفاف",
      },
    },
    invitation_message: { variant: "psd_wedding_message" },
    hero_names: { variant: "psd_wedding_names" },
    countdown: { variant: "psd_wedding_countdown" },
    event_details: { variant: "psd_wedding_details" },
    gallery_media: { variant: "psd_wedding_gallery" },
    notes: { variant: "psd_wedding_notes" },
    location: { variant: "psd_wedding_location" },
    rsvp: { variant: "psd_wedding_rsvp" },
    ticket_confirmation: { variant: "psd_wedding_closing" },
  },

  sceneOverrides: {
    "ml-program": { variant: "psd_wedding_program" },
  },
};
