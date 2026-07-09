import { InvitationData } from "@/types/invitation";

/**
 * Noor Wedding Alt Demo — Reuse Proof Invitation
 *
 * Uses the SAME sequence as noor-wedding-demo:
 *   noorWeddingLuxurySequence
 *
 * Visual differences come ONLY from InvitationData:
 *   - variantOverrides  → different layouts per scene
 *   - themeOverrides    → emerald + champagne palette (not copper)
 *   - designOverrides   → framed cards, diamond dividers, line icons, calligraphy
 *   - assetOverrides    → different gradients / placeholder asset paths
 *   - content           → different couple, venue, copy
 *
 * Proof: two weddings can share one sequence template and look like
 * different design directions without copying the sequence file.
 */
export const noorWeddingAltDemoData: InvitationData = {
  id: "noor-wedding-alt-demo-01",
  slug: "noor-wedding-alt-demo",
  eventId: "event_noor_w02",
  sequenceId: "noor-wedding-luxury",

  language: "ar",
  direction: "rtl",

  music: {
    enabled: true,
    src: "/assets/demo/noor/wedding-alt/music.mp3",
    startMode: "after_first_tap",
  },

  rsvp: {
    enabled: true,
    mode: "public_request",
    approvalRequired: true,
    maxPublicRequest: 3,
  },

  // ── Theme: emerald + champagne (vs copper in base noor-wedding-demo) ─────────
  themeOverrides: {
    primaryColor: "#3D6B5E",
    secondaryColor: "#D4C5A0",
    backgroundColor: "#080E0C",
    textColor: "#EEF2EF",
    design: {
      cardStyle: "framed",
      buttonStyle: "pill",
      dividerStyle: "diamond",
      iconStyle: "line",
      typographyStyle: "calligraphy",
      cornerStyle: "ornate",
      sectionLabelStyle: "badge",
      density: "balanced",
    },
  },

  // ── Variant overrides: flip layouts without touching the sequence file ───────
  variantOverrides: {
    opening: "minimal_tap",              // sequence default: full_video_intro
    hero_names: "stacked_calligraphy",   // sequence default: split_names
    invitation_message: "classic_card",  // sequence default: full_bleed_text
    event_details: "timeline",           // sequence default: minimal_rows
    countdown: "boxed_luxury",           // sequence default: minimal_digits
    gallery_media: "polaroid_stack",     // sequence default: full_bleed_media
    location: "map_button_card",         // sequence default: minimal_link
    notes: "elegant_cards",              // sequence default: simple_list
    rsvp: "luxury_form",                 // sequence default: minimal_form
    ticket_confirmation: "closing_luxury", // sequence default: minimal_thank_you
  },

  // ── Per-scene design tweaks on top of themeOverrides.design ─────────────────
  designOverrides: {
    opening: {
      dividerStyle: "line",
      buttonStyle: "ghost",
    },
    gallery_media: {
      mediaTreatment: "polaroid",
      sectionLabelStyle: "badge",
    },
    notes: {
      cardStyle: "glass",
      dividerStyle: "none",
    },
    ticket_confirmation: {
      dividerStyle: "diamond",
      cornerStyle: "none",
    },
  },

  content: {
    opening: {
      label: "دعوة زفاف",
      tapText: "ادخلوا الدعوة",
      previewTitle: "عبدالله & ريما",
    },

    hero_names: {
      primaryName: "عبدالله",
      secondaryName: "ريما",
      connector: "و",
      subtitle: "يتشرفان بدعوتكم لحفل زفافهما في جدة",
    },

    invitation_message: {
      header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      title: "دعوة مباركة",
      sectionLabel: "رسالة العروسين",
      body: "في ليلة تُجمع فيها القلوب وتُزهر فيها الأماني، يسعدنا أن ندعوكم لمشاركتنا فرحة زفاف عبدالله وريما. حضوركم يُكمل جمال هذه المناسبة ويُضيء ليلتنا.",
    },

    event_details: {
      sectionLabel: "موعد الحفل",
      date: "2026-12-12",
      day: "السبت",
      time: "21:00",
      venueName: "قاعة الزمرد — فندق هيلتون — جدة",
    },

    countdown: {
      sectionLabel: "متبقي على الليلة",
      targetDate: "2026-12-12T21:00:00+03:00",
    },

    gallery_media: {
      label: "ذكريات الخطوبة",
      media: [],
    },

    location: {
      sectionLabel: "مكان الاحتفال",
      venueName: "قاعة الزمرد — فندق هيلتون جدة",
      address: "كورنيش جدة — المملكة العربية السعودية",
      mapUrl: "https://maps.google.com/?q=Hilton+Jeddah",
    },

    notes: {
      sectionLabel: "إرشادات الضيوف",
      items: [
        "الحضور قبل التاسعة مساءً",
        "الزي الرسمي — درجات الأخضر والذهبي مفضّلة",
        "الدعوة شخصية وغير قابلة للتحويل",
      ],
    },

    rsvp: {
      sectionLabel: "تأكيد الحضور",
    },
  },

  // ── Asset overrides — different visual layers from base noor-wedding-demo ────
  assetOverrides: {
    opening: {
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 85% 65% at 50% 38%, #143028 0%, #080E0C 55%, #050A08 100%)",
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, rgba(8,14,12,0.25) 0%, transparent 45%, rgba(8,14,12,0.55) 100%)",
      },
      // When Noor delivers assets, swap gradient for:
      // background: { type: "video", src: "/assets/demo/noor/wedding-alt/opening-bg.mp4", fit: "cover", position: "full" }
      foreground: [
        {
          type: "gradient",
          value:
            "linear-gradient(180deg, transparent 0%, rgba(61,107,94,0.08) 100%)",
          position: "bottom",
          height: "30%",
        },
      ],
    },

    hero_names: {
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 70% 55% at 50% 45%, #122820 0%, #080E0C 65%, #050A08 100%)",
      },
    },

    gallery_media: {
      background: {
        type: "gradient",
        value: "linear-gradient(155deg, #0E1814 0%, #080E0C 50%, #0A100E 100%)",
      },
      // When Noor delivers: { type: "image", src: "/assets/demo/noor/wedding-alt/gallery-01.webp", fit: "cover", position: "full" }
    },

    ticket_confirmation: {
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 80% 60% at 50% 55%, #143028 0%, #080E0C 65%, #050A08 100%)",
      },
    },
  },
};
