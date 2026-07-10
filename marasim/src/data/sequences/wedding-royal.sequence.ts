import { InvitationSequence } from "@/types/invitation";

/**
 * Wedding Royal Sequence — Light Gold, Classic Luxury.
 *
 * Design direction: Ornate and traditional.
 * - rings_luxury opening
 * - stacked_calligraphy hero names (two names, large, stacked)
 * - classic_card invitation message (framed card with corner ornaments)
 * - stacked_cards event details (icon circles)
 * - boxed_luxury countdown (bordered boxes)
 * - single_card gallery
 * - map_button_card location
 * - simple_list notes (diamond bullets)
 * - luxury_form RSVP
 * - closing_luxury ticket (rings + ornament)
 *
 * Design tokens: framed | pill | diamond | line icons | ornate corners | balanced
 */
export const weddingRoyalSequence: InvitationSequence = {
  id: "wedding-royal",
  label: "Wedding Royal — Light Gold",

  theme: {
    family: "royal",
    primaryColor: "#A67C2E",
    secondaryColor: "#D4AF6A",
    backgroundColor: "#FBF7F2",
    textColor: "#3D3229",
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

  layout: {
    mobileMaxWidth: 430,
    minSupportedWidth: 348,
    safePaddingX: 24,
  },

  scenes: [
    // ── 1. Opening ────────────────────────────────────────────────────────────
    {
      sceneType: "opening",
      variant: "rings_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 60% at 50% 45%, #FFF6EB 0%, #FBF7F2 65%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, rgba(251,247,242,0.3) 0%, transparent 40%, rgba(251,247,242,0.5) 100%)",
      },
      defaultContent: {
        label: "دعوة زفاف",
        tapText: "افتح الدعوة",
      },
      motion: { enter: "fade", scrollHint: true },
    },

    // ── 2. Hero Names ─────────────────────────────────────────────────────────
    {
      sceneType: "hero_names",
      variant: "stacked_calligraphy",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 75% 55% at 50% 42%, #FFF4E6 0%, #FBF7F2 60%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, transparent 12%, transparent 88%, #FBF7F2 100%)",
      },
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم",
      },
      motion: { names: "fade_up" },
    },

    // ── 3. Invitation Message ──────────────────────────────────────────────────
    {
      sceneType: "invitation_message",
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

    // ── 4. Event Details ──────────────────────────────────────────────────────
    {
      sceneType: "event_details",
      variant: "stacked_cards",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: {
        sectionLabel: "تفاصيل المناسبة",
        date: "",
        time: "",
        venueName: "",
      },
    },

    // ── 5. Countdown ──────────────────────────────────────────────────────────
    {
      sceneType: "countdown",
      variant: "boxed_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #F8F0E5 0%, #FBF7F2 70%)",
      },
      defaultContent: {
        sectionLabel: "العد التنازلي",
        targetDate: "",
      },
    },

    // ── 6. Gallery / Media ────────────────────────────────────────────────────
    {
      sceneType: "gallery_media",
      variant: "single_card",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FBF7F2 0%, #F5EDE3 100%)",
      },
      defaultContent: {
        label: "لحظات",
        media: [],
      },
    },

    // ── 7. Location ───────────────────────────────────────────────────────────
    {
      sceneType: "location",
      variant: "map_button_card",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: {
        sectionLabel: "موقع المناسبة",
        venueName: "",
        address: "",
        mapUrl: "",
      },
    },

    // ── 8. Notes ──────────────────────────────────────────────────────────────
    {
      sceneType: "notes",
      variant: "simple_list",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FBF7F2 0%, #F5EDE3 100%)",
      },
      defaultContent: {
        sectionLabel: "تنبيهات",
        items: [],
      },
    },

    // ── 9. RSVP ───────────────────────────────────────────────────────────────
    {
      sceneType: "rsvp",
      variant: "luxury_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, #F2EAE0 100%)",
      },
      defaultContent: {
        sectionLabel: "تأكيد الحضور",
      },
    },

    // ── 10. Ticket / Closing ──────────────────────────────────────────────────
    {
      sceneType: "ticket_confirmation",
      variant: "closing_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 80% 60% at 50% 55%, #FFF4E6 0%, #FBF7F2 65%, #F0E6D8 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #FBF7F2 0%, transparent 15%)",
      },
      defaultContent: {},
    },
  ],
};
