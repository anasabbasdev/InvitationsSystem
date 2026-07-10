import { InvitationSequence } from "@/types/invitation";

/**
 * Noor Birth Soft Sequence — Dusty Rose & Blush.
 *
 * Design direction: Soft, airy, celebratory. No rings. No heavy ornaments.
 * Single baby name centered. Glass-style cards. Polaroid gallery.
 *
 * - minimal_tap opening       → clean, no rings, airy
 * - single_name_centered hero → one large baby name
 * - minimal_quote message     → quote-style announcement
 * - stacked_cards details     → no icons (iconStyle:none)
 * - minimal_digits countdown
 * - polaroid_stack gallery    → warm frame for baby photos
 * - map_button_card location
 * - elegant_cards notes       → each note in its own card
 * - RSVP disabled by default  (use rsvp.enabled = false in InvitationData)
 * - minimal_thank_you closing
 *
 * Design tokens: glass | pill | none dividers | none icons | soft typography | airy
 */
export const noorBirthSoftSequence: InvitationSequence = {
  id: "noor-birth-soft",
  label: "Noor Birth — Dusty Rose",

  theme: {
    family: "soft",
    primaryColor: "#B86B85",
    secondaryColor: "#E8B8C8",
    backgroundColor: "#FDF5F7",
    textColor: "#4A3040",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
    design: {
      cardStyle: "glass",
      buttonStyle: "pill",
      dividerStyle: "none",
      iconStyle: "none",
      typographyStyle: "soft",
      cornerStyle: "none",
      sectionLabelStyle: "plain",
      density: "airy",
    },
  },

  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },

  scenes: [
    // ── 1. Opening — Minimal, no rings ────────────────────────────────────────
    {
      sceneType: "opening",
      variant: "minimal_tap",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 70% at 50% 40%, #FAE8EE 0%, #FDF5F7 55%, #EDE0E6 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, rgba(253,245,247,0.2) 0%, transparent 50%)",
      },
      defaultContent: {
        label: "مناسبة مباركة",
        tapText: "اكتشفي المناسبة",
        previewTitle: "",
      },
    },

    // ── 2. Hero Names — Single centered name ──────────────────────────────────
    {
      sceneType: "hero_names",
      variant: "single_name_centered",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 75% 60% at 50% 44%, #F8E4EA 0%, #FDF5F7 60%, #F9EEF2 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, transparent 14%, transparent 86%, #FDF5F7 100%)",
      },
      defaultContent: {
        primaryName: "الاسم",
        subtitle: "أهلاً بكِ في هذا العالم",
      },
    },

    // ── 3. Invitation Message — Minimal quote style ───────────────────────────
    {
      sceneType: "invitation_message",
      variant: "minimal_quote",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FDF5F7 0%, #F3DCE5 50%, #FDF5F7 100%)",
      },
      defaultContent: {
        body: "يسعدنا دعوتكم للاحتفال بهذه المناسبة المباركة.",
      },
    },

    // ── 4. Event Details — Soft timeline layout (no icon circles) ─────────────
    {
      sceneType: "event_details",
      variant: "timeline",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: {
        sectionLabel: "تفاصيل المناسبة",
        date: "",
        time: "",
        venueName: "",
      },
    },

    // ── 5. Countdown — Boxed units (distinct from noor-wedding minimal_digits) ──
    {
      sceneType: "countdown",
      variant: "boxed_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 65% 50% at 50% 50%, #F5E0E8 0%, #FDF5F7 70%)",
      },
      defaultContent: {
        sectionLabel: "يوم المناسبة",
        targetDate: "",
      },
    },

    // ── 6. Gallery — Polaroid style ───────────────────────────────────────────
    // Warm cream polaroid frames for baby photos
    {
      sceneType: "gallery_media",
      variant: "polaroid_stack",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: {
        label: "لحظات البهجة",
        media: [],
      },
    },

    // ── 7. Location ───────────────────────────────────────────────────────────
    {
      sceneType: "location",
      variant: "map_button_card",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: {
        sectionLabel: "موقع المناسبة",
        venueName: "",
        address: "",
        mapUrl: "",
      },
    },

    // ── 8. Notes — Each note in a glass card ──────────────────────────────────
    {
      sceneType: "notes",
      variant: "elegant_cards",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: {
        sectionLabel: "ملاحظات",
        items: [],
      },
    },

    // ── 9. RSVP ───────────────────────────────────────────────────────────────
    // rsvp.enabled = false in InvitationData hides this scene automatically.
    // If enabled, the minimal_form variant is used.
    {
      sceneType: "rsvp",
      variant: "luxury_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: {
        sectionLabel: "تأكيد الحضور",
      },
    },

    // ── 10. Closing — Brand signature watermark (distinct from minimal_thank_you) ─
    {
      sceneType: "ticket_confirmation",
      variant: "brand_signature",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 65% at 50% 55%, #F6E4EC 0%, #FDF5F7 65%, #E8D8DE 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, transparent 15%)",
      },
      defaultContent: {},
    },
  ],
};
