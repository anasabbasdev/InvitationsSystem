import { DesignPreset } from "@/types/invitation";

/**
 * Wedding Royal Light — Design Preset A
 *
 * Visual identity: light gold luxury, ornate calligraphy, framed cards.
 * Composition: web_layout with gradient backgrounds + layered ornaments.
 * Typography: Amiri (Calligraphic Arabic) headings + Tajawal body.
 * Icons: line style, visible.
 *
 * Use with: weddingStandardBlueprint + InvitationData
 *
 * Proof that the same weddingStandardBlueprint can produce a radically
 * different visual result without any component modification.
 */
export const weddingRoyalDarkPreset: DesignPreset = {
  id: "wedding-royal-dark",
  label: "Wedding Royal Light",
  version: "1.0.0",
  description: "Light gold luxury — ornate cards, diamond dividers, calligraphy fonts",

  theme: {
    family: "royal-light",
    primaryColor: "#A67C2E",
    secondaryColor: "#D4AF6A",
    backgroundColor: "#FBF7F2",
    textColor: "#3D3229",
    mutedTextColor: "#7A6E62",
    accentColor: "#C9A24D",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
    design: {
      cardStyle: "framed",
      buttonStyle: "pill",
      dividerStyle: "diamond",
      iconStyle: "line",
      typographyStyle: "classic",
      cornerStyle: "ornate",
      sectionLabelStyle: "plain",
      density: "balanced",
    },
  },

  scenes: {
    opening: {
      variant: "rings_luxury",
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 80% 60% at 50% 45%, #FFF6EB 0%, #FBF7F2 65%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, rgba(251,247,242,0.3) 0%, transparent 40%, rgba(251,247,242,0.5) 100%)",
      },
      defaultContent: {
        label: "دعوة زفاف",
        tapText: "افتح الدعوة",
      },
      motion: { enter: "fade", scrollHint: true },
    },

    hero_names: {
      variant: "stacked_calligraphy",
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 75% 55% at 50% 42%, #FFF4E6 0%, #FBF7F2 60%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, #FBF7F2 0%, transparent 12%, transparent 88%, #FBF7F2 100%)",
      },
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم",
      },
      motion: { names: "fade_up" },
    },

    invitation_message: {
      variant: "classic_card",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FBF7F2 0%, #F7F0E6 50%, #FBF7F2 100%)",
      },
      defaultContent: {
        title: "دعوة كريمة",
        body: "يسعدنا حضوركم ومشاركتنا في هذه المناسبة السعيدة.",
      },
    },

    event_details: {
      variant: "stacked_cards",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },

    countdown: {
      variant: "boxed_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #F8F0E5 0%, #FBF7F2 70%)",
      },
      defaultContent: { sectionLabel: "العد التنازلي" },
    },

    gallery_media: {
      variant: "single_card",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FBF7F2 0%, #F5EDE3 100%)",
      },
      defaultContent: { label: "لحظات", media: [] },
    },

    location: {
      variant: "map_button_card",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: { sectionLabel: "موقع المناسبة" },
    },

    notes: {
      variant: "simple_list",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FBF7F2 0%, #F5EDE3 100%)",
      },
      defaultContent: { sectionLabel: "تنبيهات", items: [] },
    },

    rsvp: {
      variant: "luxury_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },

    ticket_confirmation: {
      variant: "closing_luxury",
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 80% 60% at 50% 55%, #FFF4E6 0%, #FBF7F2 65%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, transparent 15%)",
      },
      defaultContent: {},
    },
  },
};
