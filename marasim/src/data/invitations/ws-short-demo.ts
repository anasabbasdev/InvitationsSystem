import { InvitationData } from "@/types/invitation";

/**
 * Wedding Short Demo — InvitationData
 *
 * Journey:  weddingShortBlueprint   (6 scenes: opening, hero, details, gallery, location, closing)
 * Design:   weddingRoyalDarkPreset  (same preset as Invitation A — different journey, same look)
 *
 * PROOF: A different Sequence Blueprint (6 scenes vs 10) uses the same Scene Library
 * and InvitationRenderer without any component modification.
 * Absent scenes produce no gaps or errors.
 *
 * PROOF: Different journey + same design preset is valid and renders cleanly.
 */
export const wsShortDemoData: InvitationData = {
  id: "ws-short-demo-01",
  slug: "ws-short-demo",
  eventId: "event_ws_short_01",
  sequenceId: "wedding-short",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/wedding/music.mp3",
    startMode: "after_first_tap",
  },

  rsvp: {
    enabled: false,
    mode: "none",
    approvalRequired: false,
  },

  content: {
    opening: {
      tapText: "افتح الدعوة",
      label: "دعوة زفاف",
    },
    hero_names: {
      primaryName: "عمر",
      secondaryName: "ليلى",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم",
    },
    event_details: {
      sectionLabel: "تفاصيل المناسبة",
      date: "2027-01-20",
      day: "الثلاثاء",
      time: "20:00",
      venueName: "فندق الريتز — الرياض",
    },
    gallery_media: {
      label: "لحظات",
      media: [],
    },
    location: {
      sectionLabel: "الموقع",
      venueName: "فندق الريتز كارلتون",
      address: "طريق الملك عبدالعزيز — الرياض",
      mapUrl: "https://maps.google.com/?q=Riyadh+Ritz+Carlton",
    },
    ticket_confirmation: {
      closingTitle: "في انتظار حضوركم",
    },
  },
};
