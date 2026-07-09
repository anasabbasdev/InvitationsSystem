import { InvitationData } from "@/types/invitation";

/**
 * Noor Wedding Media Demo — asset-driven invitation data.
 * Pair with noorWeddingMediaSequence.
 *
 * Drop designer files into public/assets/demo/noor/media-wedding/
 */
export const noorWeddingMediaDemoData: InvitationData = {
  id: "noor-wedding-media-demo-01",
  slug: "noor-wedding-media-demo",
  eventId: "event_noor_wm01",
  sequenceId: "noor-wedding-media",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/media-wedding/music.mp3",
    startMode: "after_first_tap",
  },

  rsvp: {
    enabled: true,
    mode: "public_request",
    approvalRequired: true,
    maxPublicRequest: 4,
  },

  content: {
    opening: {
      tapText: "افتح الدعوة",
      label: "دعوة زفاف",
      previewTitle: "فيصل & دانة",
    },

    hero_names: {
      primaryName: "فيصل",
      secondaryName: "دانة",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم لحفل زفافهما",
    },

    invitation_message: {
      header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      title: "دعوة كريمة",
      body: "يسعدنا أن نتشرف بدعوتكم لمشاركتنا فرحة زفاف فيصل ودانة في أجواء مليئة بالحب والبهجة.",
    },

    event_details: {
      sectionLabel: "تفاصيل المناسبة",
      date: "2026-12-20",
      day: "الأحد",
      time: "20:30",
      venueName: "قاعة اللؤلؤة — الخبر",
    },

    countdown: {
      sectionLabel: "العد التنازلي",
      targetDate: "2026-12-20T20:30:00+03:00",
    },

    gallery_media: {
      label: "لحظات الخطوبة",
    },

    location: {
      sectionLabel: "موقع المناسبة",
      venueName: "قاعة اللؤلؤة",
      address: "الكورنيش الشرقي — الخبر، المملكة العربية السعودية",
      mapUrl: "https://maps.google.com/?q=Khobar+Saudi+Arabia",
    },

    notes: {
      sectionLabel: "تنبيهات",
      items: [
        "الحضور قبل الثامنة والنصف مساءً",
        "الزي الرسمي الفاخر",
        "الدعوة شخصية",
      ],
    },

    ticket_confirmation: {
      closingTitle: "شكراً لتفاعلكم",
    },
  },
};
