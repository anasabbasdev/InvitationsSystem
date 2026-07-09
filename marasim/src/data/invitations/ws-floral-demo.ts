import { InvitationData } from "@/types/invitation";

/**
 * Invitation B — Cinematic Floral Demo
 *
 * Journey:  weddingStandardBlueprint     (10 scenes)
 * Design:   weddingCinematicFloralPreset (designer assets: full_media + layered_media)
 * Content:  Faisal & Dana — cinematic, asset-driven
 *
 * PROOF: Same wedding-standard blueprint → radically different visual (B)
 * compared to ws-royal-demo (A — dark gold web_layout) and ws-minimal-demo (C — light minimal).
 *
 * Countdown disabled via sceneOverrides to demonstrate scene-level control.
 * Notes disabled as well (announcement-only style).
 */
export const wsFloralDemoData: InvitationData = {
  id: "ws-floral-demo-01",
  slug: "ws-floral-demo",
  eventId: "event_ws_floral_01",
  sequenceId: "wedding-standard",

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
    maxPublicRequest: 3,
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
    rsvp: {
      sectionLabel: "تأكيد الحضور",
    },
    ticket_confirmation: {
      closingTitle: "شكراً لتفاعلكم",
    },
  },
};
