import { DesignPreset } from "@/types/invitation";

/**
 * Wedding Minimal Modern — Design Preset C
 *
 * Visual identity: light theme, minimal typography, NO icons, web_layout throughout.
 * Composition: web_layout for all scenes — no media files needed.
 * Typography: Tajawal (modern sans), airy spacing, center-aligned.
 * Colors: warm white backgrounds, dark brown text, earth-tone accent.
 * Icons: none — clean, text-first aesthetic.
 *
 * Use with: weddingStandardBlueprint + InvitationData
 *
 * Proof that the SAME blueprint + SAME components produce a light, contemporary
 * invitation that looks nothing like the Royal Dark or Cinematic Floral presets.
 * The visual difference comes entirely from the DesignPreset, not from new components.
 */
export const weddingMinimalModernPreset: DesignPreset = {
  id: "wedding-minimal-modern",
  label: "Wedding Minimal Modern",
  description:
    "Light theme, airy spacing, modern typography. No icons, no ornate details — pure minimalism.",

  theme: {
    family: "minimal-modern",
    primaryColor: "#2A2420",
    secondaryColor: "#8B6F4E",
    backgroundColor: "#F7F4F0",
    textColor: "#2A2420",
    mutedTextColor: "#7A7068",
    accentColor: "#8B6F4E",
    fontHeading: "Tajawal",
    fontBody: "Tajawal",
    typography: {
      headingFont: "Tajawal",
      bodyFont: "Tajawal",
      namesFont: "Tajawal",
      headingSize: "clamp(1.4rem, 6vw, 2.2rem)",
      namesSize: "clamp(2rem, 9vw, 3rem)",
      letterSpacing: "0.02em",
      lineHeight: "1.8",
    },
    design: {
      cardStyle: "minimal",
      buttonStyle: "underline",
      dividerStyle: "line",
      iconStyle: "none",
      typographyStyle: "modern",
      cornerStyle: "none",
      sectionLabelStyle: "plain",
      density: "airy",
    },
  },

  scenes: {
    opening: {
      variant: "minimal_tap",
      background: {
        type: "color",
        value: "#F7F4F0",
      },
      defaultContent: {
        label: "دعوة زفاف",
        tapText: "افتح الدعوة",
      },
    },

    hero_names: {
      variant: "split_names",
      background: {
        type: "color",
        value: "#F2EEE9",
      },
      design: {
        colors: {
          backgroundColor: "#F2EEE9",
          textColor: "#2A2420",
          accentColor: "#8B6F4E",
        },
      },
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم",
      },
    },

    invitation_message: {
      variant: "minimal_quote",
      background: {
        type: "color",
        value: "#F7F4F0",
      },
      design: {
        cardStyle: "none",
        dividerStyle: "line",
      },
      defaultContent: {
        title: "دعوة كريمة",
        body: "يسعدنا حضوركم ومشاركتنا في هذه المناسبة السعيدة.",
      },
    },

    event_details: {
      variant: "timeline",
      background: {
        type: "color",
        value: "#EFEAE4",
      },
      design: {
        iconStyle: "none",
        colors: {
          backgroundColor: "#EFEAE4",
          textColor: "#2A2420",
          accentColor: "#8B6F4E",
        },
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },

    countdown: {
      variant: "minimal_digits",
      background: {
        type: "color",
        value: "#F7F4F0",
      },
      design: {
        colors: {
          backgroundColor: "#F7F4F0",
          textColor: "#2A2420",
          accentColor: "#8B6F4E",
        },
      },
      defaultContent: { sectionLabel: "العد التنازلي" },
    },

    gallery_media: {
      variant: "polaroid_stack",
      background: {
        type: "color",
        value: "#F2EEE9",
      },
      design: {
        mediaTreatment: "polaroid",
        colors: {
          backgroundColor: "#F2EEE9",
        },
      },
      defaultContent: { label: "لحظاتنا", media: [] },
    },

    location: {
      variant: "minimal_link",
      background: {
        type: "color",
        value: "#F7F4F0",
      },
      design: {
        iconStyle: "none",
      },
      defaultContent: { sectionLabel: "الموقع" },
    },

    notes: {
      variant: "elegant_cards",
      background: {
        type: "color",
        value: "#EFEAE4",
      },
      design: {
        cardStyle: "minimal",
        dividerStyle: "line",
      },
      defaultContent: { sectionLabel: "ملاحظات", items: [] },
    },

    rsvp: {
      variant: "minimal_form",
      background: {
        type: "color",
        value: "#F7F4F0",
      },
      design: {
        buttonStyle: "ghost",
        colors: {
          backgroundColor: "#F7F4F0",
          textColor: "#2A2420",
          buttonColor: "#2A2420",
        },
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },

    ticket_confirmation: {
      variant: "minimal_thank_you",
      background: {
        type: "color",
        value: "#F2EEE9",
      },
      design: {
        colors: {
          backgroundColor: "#F2EEE9",
          textColor: "#2A2420",
          accentColor: "#8B6F4E",
        },
      },
      defaultContent: { closingTitle: "نراكم قريباً" },
    },
  },
};
