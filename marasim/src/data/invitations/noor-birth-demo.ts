import { InvitationData } from "@/types/invitation";

/**
 * Noor Birth Demo — InvitationData
 *
 * DATA layer only. Pair with noorBirthSoftSequence.
 * Demonstrates:
 *  - A birth announcement / baby celebration invitation.
 *  - Single primaryName (baby), no secondaryName.
 *  - RSVP disabled (announcement-only flow).
 *  - ticket_confirmation renders as "يسعدنا حضوركم" closing scene.
 *  - Different content structure from wedding invitations.
 *
 * Proof of reuse: this data + noorWeddingLuxurySequence would produce
 * a birth-content card rendered with the Copper theme — no component change needed.
 */
export const noorBirthDemoData: InvitationData = {
  id: "noor-birth-demo-01",
  slug: "noor-birth-demo",
  eventId: "event_noor_b01",
  sequenceId: "noor-birth-soft",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/birth/music.mp3",
    startMode: "after_first_tap",
  },

  rsvp: {
    enabled: false,
    mode: "none",
    approvalRequired: false,
  },

  content: {
    opening: {
      tapText: "اكتشف المفاجأة",
      label: "بشرى سعيدة",
      previewTitle: "قدِمَت لَيان",
    },

    hero_names: {
      primaryName: "لَيان",
      // secondaryName intentionally empty — birth announcement uses single name
      subtitle: "تُشرف أسرة محمد العمري بإعلان قدوم مولودتها الجديدة",
    },

    invitation_message: {
      title: "أهلاً بالمولودة",
      body: "بفرح لا يوصف وقلب مليء بالامتنان، نُبشّركم بقدوم أميرتنا الصغيرة لَيان. نسأل الله أن تكون قُرّةَ أعيننا وصالحةً في دينها ودنياها. نسعد بحضوركم للاحتفال بهذه البشرى.",
    },

    event_details: {
      date: "2026-10-18",
      time: "17:00",
      venueName: "قاعة الياسمين — الشارقة",
    },

    countdown: {
      targetDate: "2026-10-18T17:00:00+04:00",
    },

    gallery_media: {
      label: "أول لقطة",
      // Drop baby photo here once available:
      // { type: "image", src: "/assets/demo/noor/birth/photo-baby-01.webp", alt: "لَيان" }
      media: [],
    },

    location: {
      venueName: "قاعة الياسمين",
      address: "المنطقة الصناعية — الشارقة، الإمارات العربية المتحدة",
      mapUrl: "https://maps.google.com/?q=Sharjah+UAE",
    },

    notes: {
      title: "ملاحظات",
      items: [
        "الحضور رسمي — اللون الأبيض أو الكريمي مفضّل",
        "مواعيد القدوم من 5 مساءً حتى 8 مساءً",
        "لا داعي لإحضار هدايا — حضوركم هو الهدية",
      ],
    },
  },

  // ── Asset overrides — uncomment once Noor delivers assets ─────────────────
  // assetOverrides: {
  //   opening: {
  //     background: { type: "image", src: "/assets/demo/noor/birth/opening-bg.webp", fit: "cover" },
  //     foreground: [
  //       { type: "image", src: "/assets/demo/noor/birth/ornament-top.webp", position: "top", opacity: 0.85 },
  //       { type: "image", src: "/assets/demo/noor/birth/ornament-bottom.webp", position: "bottom", opacity: 0.85 },
  //     ],
  //   },
  //   hero_names: {
  //     background: { type: "image", src: "/assets/demo/noor/birth/hero-bg.webp", fit: "cover", opacity: 0.55 },
  //     foreground: [
  //       { type: "image", src: "/assets/demo/noor/birth/ornament-bottom.webp", position: "bottom", opacity: 0.85 },
  //     ],
  //   },
  //   gallery_media: {
  //     // media items go in content.gallery_media.media above
  //   },
  // },
};
