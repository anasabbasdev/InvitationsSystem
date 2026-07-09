import { InvitationConfig } from "@/types/invitation";

/**
 * Birth Elegant — placeholder for a baby shower / birthday invitation.
 * Will be designed in a later phase.
 */
export const birthElegantConfig: InvitationConfig = {
  id: "demo-birth-elegant-01",
  eventId: "event_demo_002",
  slug: "demo-birth",
  language: "ar",
  direction: "rtl",

  theme: {
    family: "elegant",
    primaryColor: "#D4A5C9",
    secondaryColor: "#F9EEF6",
    backgroundColor: "#0C080F",
    textColor: "#F5F0F8",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
  },

  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },

  music: {
    enabled: false,
    startMode: "disabled",
  },

  rsvp: {
    enabled: false,
    mode: "none",
    approvalRequired: false,
  },

  scenes: [
    {
      id: "opening-01",
      type: "opening",
      variant: "soft_reveal",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 60% at 50% 45%, #1A0E1C 0%, #0C080F 70%)",
      },
      content: { tapText: "افتح الدعوة" },
      motion: { enter: "fade" },
    },
    {
      id: "hero-01",
      type: "hero_names",
      variant: "simple",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 55% at 50% 42%, #180D1A 0%, #0C080F 65%)",
      },
      content: {
        primaryName: "ليلى",
        subtitle: "تُشرف أسرة عبدالله بدعوتكم لحفل مولودتها",
      },
      motion: { names: "fade_up" },
    },
    {
      id: "details-01",
      type: "event_details",
      variant: "stacked_info",
      background: { type: "color", value: "#0C080F" },
      content: {
        date: "2026-11-20",
        time: "17:00",
        venueName: "قاعة النور — الشارقة",
      },
    },
    {
      id: "countdown-01",
      type: "countdown",
      variant: "minimal",
      background: { type: "color", value: "#0C080F" },
      content: { targetDate: "2026-11-20T17:00:00+04:00" },
    },
    {
      id: "location-01",
      type: "location",
      variant: "map_button",
      background: { type: "color", value: "#0C080F" },
      content: {
        venueName: "قاعة النور — الشارقة",
        address: "Sharjah, UAE",
        mapUrl: "https://maps.google.com/",
      },
    },
    {
      id: "ticket-01",
      type: "ticket_confirmation",
      variant: "closing",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 55% at 50% 55%, #1A0E1C 0%, #0C080F 65%)",
      },
    },
  ],
};
