import { InvitationData } from "@/types/invitation";

/**
 * Noor Wedding Demo — InvitationData
 *
 * DATA layer only. Pair with noorWeddingLuxurySequence.
 * Demonstrates the Copper & Amber theme with realistic wedding content.
 *
 * To use a different sequence with the same data:
 *   buildInvitationConfig(noorWeddingDemoData, anotherSequence)
 *
 * To create a different wedding invitation using the same sequence:
 *   buildInvitationConfig(realClientData, noorWeddingLuxurySequence)
 */
export const noorWeddingDemoData: InvitationData = {
  id: "noor-wedding-demo-01",
  slug: "noor-wedding-demo",
  eventId: "event_noor_w01",
  sequenceId: "noor-wedding-luxury",

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
      previewTitle: "خالد & نورة",
    },

    hero_names: {
      primaryName: "خالد",
      secondaryName: "نورة",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم لحضور حفل زفافهما",
    },

    invitation_message: {
      header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      title: "دعوة كريمة",
      body: "بقلوب تفيض بالفرح والامتنان يسعدنا أن نتشرف بدعوتكم الكريمة لحضور حفل زفاف خالد ونورة. نسعد بحضوركم وبركاتكم في هذه الليلة المباركة التي تجمع قلبين في سكن ومودة ورحمة.",
    },

    event_details: {
      date: "2026-11-07",
      time: "20:00",
      venueName: "قاعة الأندلس — فندق ريتز كارلتون — الرياض",
    },

    countdown: {
      targetDate: "2026-11-07T20:00:00+03:00",
    },

    gallery_media: {
      // Drop real engagement photos here when ready
      // { type: "image", src: "/assets/demo/noor/wedding/photo-01.webp", alt: "" }
      media: [],
    },

    location: {
      venueName: "قاعة الأندلس — فندق ريتز كارلتون",
      address: "طريق الملك فهد — الرياض، المملكة العربية السعودية",
      mapUrl: "https://maps.google.com/?q=Ritz+Carlton+Riyadh",
    },

    notes: {
      title: "تنبيهات",
      items: [
        "الحضور قبل الساعة الثامنة مساءً",
        "الزي الرسمي الفاخر — اللون الأبيض أو الكريمي مفضّل",
        "الدعوة شخصية — يُرجى إبرازها عند الدخول",
        "لمزيد من المعلومات تواصلوا مع العائلة",
      ],
    },
  },

  // ── Asset overrides — uncomment once Noor delivers assets ─────────────────
  // assetOverrides: {
  //   opening: {
  //     background: { type: "image", src: "/assets/demo/noor/wedding/opening-bg.webp", fit: "cover" },
  //     foreground: [
  //       { type: "image", src: "/assets/demo/noor/wedding/ornament-top.webp", position: "top", opacity: 0.88 },
  //       { type: "image", src: "/assets/demo/noor/wedding/ornament-bottom.webp", position: "bottom", opacity: 0.88 },
  //     ],
  //   },
  //   hero_names: {
  //     background: { type: "image", src: "/assets/demo/noor/wedding/hero-bg.webp", fit: "cover", opacity: 0.6 },
  //     foreground: [
  //       { type: "image", src: "/assets/demo/noor/wedding/ornament-bottom.webp", position: "bottom", opacity: 0.85 },
  //     ],
  //   },
  //   gallery_media: {
  //     // background stays gradient; media items go in content.gallery_media.media
  //   },
  //   ticket_confirmation: {
  //     background: { type: "image", src: "/assets/demo/noor/wedding/opening-bg.webp", fit: "cover", opacity: 0.35 },
  //   },
  // },
};
