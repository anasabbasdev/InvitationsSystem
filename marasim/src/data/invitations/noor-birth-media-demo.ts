import { InvitationData } from "@/types/invitation";

/**
 * Noor Birth Media Demo — asset-driven birth announcement data.
 * Pair with noorBirthMediaSequence.
 *
 * Drop designer files into public/assets/demo/noor/media-birth/
 */
export const noorBirthMediaDemoData: InvitationData = {
  id: "noor-birth-media-demo-01",
  slug: "noor-birth-media-demo",
  eventId: "event_noor_bm01",
  sequenceId: "noor-birth-media",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/media-birth/music.mp3",
    startMode: "after_first_tap",
  },

  rsvp: {
    enabled: false,
    mode: "none",
    approvalRequired: false,
  },

  content: {
    opening: {
      tapText: "اكتشفي المناسبة",
      label: "بشرى سعيدة",
      previewTitle: "رزقنا الله مولودة",
    },

    hero_names: {
      primaryName: "نور",
      subtitle: "تُشرف أسرة العتيبي بإعلان قدوم مولودتها",
    },

    invitation_message: {
      body: "بفرح لا يوصف، نُبشّركم بقدوم أميرتنا الصغيرة نور. نسعد بحضوركم للاحتفال بهذه البشرى المباركة.",
    },

    event_details: {
      sectionLabel: "تفاصيل المناسبة",
      date: "2026-11-15",
      day: "السبت",
      time: "17:00",
      venueName: "قاعة الياسمين — الدمام",
    },

    countdown: {
      sectionLabel: "يوم المناسبة",
      targetDate: "2026-11-15T17:00:00+03:00",
    },

    gallery_media: {
      label: "أول لقطة",
    },

    location: {
      sectionLabel: "موقع المناسبة",
      venueName: "قاعة الياسمين",
      address: "حي الشاطئ — الدمام",
      mapUrl: "https://maps.google.com/?q=Dammam",
    },

    notes: {
      sectionLabel: "ملاحظات",
      items: [
        "الحضور من 5 مساءً",
        "الزي الفاتح مفضّل",
        "حضوركم هو أجمل هدية",
      ],
    },

    ticket_confirmation: {
      closingTitle: "نراكم قريباً",
    },
  },
};
