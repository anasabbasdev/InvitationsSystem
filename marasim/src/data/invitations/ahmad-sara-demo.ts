import { InvitationData } from "@/types/invitation";

/**
 * Ahmad & Sara Wedding — Demo Invitation Data
 *
 * DATA layer only — no design/gradient/animation info here.
 * Pair with weddingRoyalSequence to produce a full InvitationConfig.
 *
 * Usage:
 *   import { buildInvitationConfig } from "@/lib/build-config";
 *   import { weddingRoyalSequence } from "@/data/sequences/wedding-royal.sequence";
 *   const config = buildInvitationConfig(ahmadSaraDemoData, weddingRoyalSequence);
 */
export const ahmadSaraDemoData: InvitationData = {
  id: "demo-wedding-royal-01",
  slug: "demo-wedding",
  eventId: "event_demo_001",
  sequenceId: "wedding-royal",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/wedding/music.mp3",
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
      label: "دعوة خاصة",
      previewTitle: "أحمد & سارة",
    },

    hero_names: {
      primaryName: "أحمد",
      secondaryName: "سارة",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم لحضور حفل زفافهما",
    },

    invitation_message: {
      header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      title: "دعوة كريمة",
      body: "بفرح لا يوصف وقلوب ممتنة، يسعدنا أن نتشرف بدعوتكم لحضور حفل زفاف نجلنا أحمد ونجلتنا سارة. يسعدنا مشاركتنا هذه الفرحة التي تجمع قلبين في عهد الله ومباركة من نحب.",
    },

    event_details: {
      date: "2026-09-15",
      time: "20:00",
      venueName: "قاعة النخلة الملكية — دبي",
    },

    countdown: {
      targetDate: "2026-09-15T20:00:00+04:00",
    },

    gallery_media: {
      // Real photo assets go here when uploaded to /assets/demo/wedding/
      // Leaving empty shows an elegant CSS placeholder card.
      media: [],
    },

    location: {
      venueName: "قاعة النخلة الملكية",
      address: "نخلة جميرا — دبي، الإمارات العربية المتحدة",
      mapUrl: "https://maps.google.com/?q=Palm+Jumeirah+Dubai",
    },

    notes: {
      title: "تنبيهات",
      items: [
        "يُرجى الحضور قبل الساعة الثامنة مساءً",
        "الزي الرسمي الفاخر — اللون الأبيض أو الكريمي مفضّل",
        "الدعوة شخصية — يُرجى إبرازها عند الدخول",
        "لا تنسَ الصلاة على النبي ﷺ",
      ],
    },
  },

  // ── Asset overrides — populate when real assets are ready ─────────────────
  // assetOverrides: {
  //   opening: {
  //     background: {
  //       type: "video",
  //       src: "/assets/demo/wedding/opening-bg.mp4",
  //       fit: "cover",
  //       opacity: 0.6,
  //     },
  //   },
  //   hero_names: {
  //     background: {
  //       type: "image",
  //       src: "/assets/demo/wedding/bg-gold-texture.webp",
  //       fit: "cover",
  //       opacity: 0.55,
  //     },
  //     foreground: [
  //       {
  //         type: "image",
  //         src: "/assets/demo/wedding/ornament-bottom.webp",
  //         position: "bottom",
  //         opacity: 0.8,
  //       },
  //     ],
  //   },
  //   gallery_media: {
  //     background: {
  //       type: "image",
  //       src: "/assets/demo/wedding/gallery-bg.webp",
  //       fit: "cover",
  //       opacity: 0.3,
  //     },
  //   },
  // },
};
