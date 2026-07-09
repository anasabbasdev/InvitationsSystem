import { DesignPreset } from "@/types/invitation";

/**
 * Wedding Royal Dark — Design Preset A
 *
 * Visual identity: dark gold luxury, ornate calligraphy, framed cards.
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
  label: "Wedding Royal Dark",
  version: "1.0.0",
  description: "Dark gold luxury — ornate cards, diamond dividers, calligraphy fonts",

  theme: {
    family: "royal-dark",
    primaryColor: "#C9A24D",
    secondaryColor: "#F7E7B4",
    backgroundColor: "#0F0B08",
    textColor: "#F5F0E8",
    mutedTextColor: "#A89F8F",
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
          "radial-gradient(ellipse 80% 60% at 50% 45%, #1C1409 0%, #0F0B08 65%, #080604 100%)",
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, rgba(15,11,8,0.3) 0%, transparent 40%, rgba(15,11,8,0.5) 100%)",
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
          "radial-gradient(ellipse 75% 55% at 50% 42%, #1A1208 0%, #0F0B08 60%, #080604 100%)",
      },
      overlay: {
        type: "gradient",
        value:
          "linear-gradient(180deg, #0F0B08 0%, transparent 12%, transparent 88%, #0F0B08 100%)",
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
        value: "linear-gradient(160deg, #0F0B08 0%, #130E0A 50%, #0F0B08 100%)",
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
        value: "linear-gradient(180deg, #0F0B08 0%, #0D0A07 100%)",
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },

    countdown: {
      variant: "boxed_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #141008 0%, #0F0B08 70%)",
      },
      defaultContent: { sectionLabel: "العد التنازلي" },
    },

    gallery_media: {
      variant: "single_card",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #0F0B08 0%, #100C08 100%)",
      },
      defaultContent: { label: "لحظات", media: [] },
    },

    location: {
      variant: "map_button_card",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0F0B08 0%, #0D0A07 100%)",
      },
      defaultContent: { sectionLabel: "موقع المناسبة" },
    },

    notes: {
      variant: "simple_list",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #0F0B08 0%, #100C08 100%)",
      },
      defaultContent: { sectionLabel: "تنبيهات", items: [] },
    },

    rsvp: {
      variant: "luxury_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0F0B08 0%, #0D0A07 100%)",
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },

    ticket_confirmation: {
      variant: "closing_luxury",
      background: {
        type: "gradient",
        value:
          "radial-gradient(ellipse 80% 60% at 50% 55%, #1A1208 0%, #0F0B08 65%, #080604 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #0F0B08 0%, transparent 15%)",
      },
      defaultContent: {},
    },
  },
};
