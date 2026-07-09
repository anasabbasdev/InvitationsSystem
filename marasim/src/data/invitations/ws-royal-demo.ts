import { InvitationData } from "@/types/invitation";

/**
 * Invitation A — Royal Dark Demo
 *
 * Journey:  weddingStandardBlueprint  (10 scenes, all enabled)
 * Design:   weddingRoyalDarkPreset    (dark gold, framed cards, calligraphy)
 * Content:  Ahmad & Sara — classic Arabic wedding
 *
 * PROOF: Same wedding-standard blueprint → radically different visual (A)
 * compared to ws-floral-demo (B) and ws-minimal-demo (C).
 * All 10 scenes enabled — visual difference comes from DesignPreset only.
 */
export const wsRoyalDemoData: InvitationData = {
  id: "ws-royal-demo-01",
  slug: "ws-royal-demo",
  eventId: "event_ws_royal_01",
  sequenceId: "wedding-standard",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/wedding/music.mp3",
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
    },
    hero_names: {
      primaryName: "أحمد",
      secondaryName: "سارة",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم لحفل زفافهما",
    },
    invitation_message: {
      header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      title: "دعوة كريمة",
      body: "يسعدنا أن ندعوكم لمشاركتنا فرحة زواج أحمد وسارة في أجواء تمتزج فيها الأصالة بالحب.",
    },
    event_details: {
      sectionLabel: "تفاصيل المناسبة",
      date: "2027-03-15",
      day: "الأحد",
      time: "21:00",
      venueName: "قصر الأميرة — الرياض",
    },
    countdown: {
      sectionLabel: "العد التنازلي",
      targetDate: "2027-03-15T21:00:00+03:00",
    },
    gallery_media: {
      label: "لحظاتنا",
      media: [],
    },
    location: {
      sectionLabel: "موقع المناسبة",
      venueName: "قصر الأميرة",
      address: "حي الملقا، الرياض، المملكة العربية السعودية",
      mapUrl: "https://maps.google.com/?q=Riyadh+Saudi+Arabia",
    },
    notes: {
      sectionLabel: "تنبيهات",
      items: [
        "الحضور قبل التاسعة مساءً",
        "الزي الرسمي",
        "الدعوة شخصية",
      ],
    },
    rsvp: {
      sectionLabel: "تأكيد الحضور",
    },
    ticket_confirmation: {
      closingTitle: "شكراً لتفاعلكم",
      body: "نتطلع لمشاركتكم فرحتنا",
    },
  },
};
