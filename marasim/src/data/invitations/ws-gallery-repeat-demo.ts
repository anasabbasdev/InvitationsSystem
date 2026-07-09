import { InvitationData } from "@/types/invitation";

/**
 * Gallery Repeat Acceptance — InvitationData
 *
 * Blueprint: galleryRepeatAcceptanceBlueprint (7 scenes, 2× gallery_media)
 * Preset:    galleryRepeatAcceptancePreset (sceneId media overrides)
 *
 * Each gallery instance has independent content via sceneOverrides[sceneId].
 */
export const wsGalleryRepeatDemoData: InvitationData = {
  id: "ws-gallery-repeat-demo-01",
  slug: "ws-gallery-repeat-demo",
  eventId: "event_ws_gr_01",
  sequenceId: "gallery-repeat-acceptance",

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

  content: {},

  sceneOverrides: {
    "opening-main": {
      content: {
        tapText: "افتح الدعوة",
        label: "دعوة زفاف",
      },
    },
    "hero-main": {
      content: {
        primaryName: "ناصر",
        secondaryName: "رنا",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم",
      },
    },
    "gallery-childhood": {
      content: {
        label: "ذكريات الطفولة",
        media: [],
      },
    },
    "event-details-main": {
      content: {
        sectionLabel: "تفاصيل المناسبة",
        date: "2027-04-10",
        day: "الجمعة",
        time: "20:30",
        venueName: "قاعة الكريستال — الدمام",
      },
    },
    "gallery-wedding-day": {
      content: {
        label: "يوم الفرح",
        media: [],
      },
    },
    "location-main": {
      content: {
        sectionLabel: "الموقع",
        venueName: "قاعة الكريستال",
        address: "الكورنيش — الدمام",
        mapUrl: "https://maps.google.com/?q=Dammam+Saudi+Arabia",
      },
    },
    "closing-main": {
      content: {
        closingTitle: "شكراً لتفاعلكم",
      },
    },
  },
};
