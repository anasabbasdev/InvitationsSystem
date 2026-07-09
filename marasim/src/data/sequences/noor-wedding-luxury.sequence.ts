import { InvitationSequence } from "@/types/invitation";

/**
 * Noor Wedding Luxury Sequence — Cinematic Copper & Amber.
 *
 * Design direction: Modern cinematic luxury. No rings. No icon circles.
 * Everything is clean, spacious, and asymmetric.
 *
 * - full_video_intro opening  → cinematic, background fills screen
 * - split_names hero          → asymmetric: right/left aligned names
 * - full_bleed_text message   → text on dark bg, no card borders
 * - minimal_rows details      → clean table rows, no icons
 * - minimal_digits countdown  → large numbers with no boxes
 * - full_bleed_media gallery  → immersive full-scene media
 * - minimal_link location     → venue + underline text link
 * - simple_list notes
 * - minimal_form RSVP
 * - minimal_thank_you closing → just centered text
 *
 * Design tokens: minimal | square | line | none icons | modern typography | airy
 */
export const noorWeddingLuxurySequence: InvitationSequence = {
  id: "noor-wedding-luxury",
  label: "Noor Wedding — Cinematic Copper",

  theme: {
    family: "cinematic",
    primaryColor: "#C8843A",
    secondaryColor: "#F0C98A",
    backgroundColor: "#0C0905",
    textColor: "#F2E8DC",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
    design: {
      cardStyle: "minimal",
      buttonStyle: "square",
      dividerStyle: "line",
      iconStyle: "none",
      typographyStyle: "modern",
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
    // ── 1. Opening — Cinematic full-screen ────────────────────────────────────
    // When a video background is supplied via assetOverrides, this becomes a true
    // cinematic video intro. As a placeholder it renders the gradient + minimal CTA.
    {
      sceneType: "opening",
      variant: "full_video_intro",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #1A0E06 0%, #0C0905 50%, #0A0704 100%)",
        // Replace with: { type: "video", src: "/assets/demo/noor/wedding/opening-bg.mp4", fit: "cover", position: "full" }
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, rgba(12,9,5,0.4) 0%, transparent 35%, rgba(12,9,5,0.65) 80%, rgba(12,9,5,0.9) 100%)",
      },
      defaultContent: {
        label: "دعوة زفاف",
        tapText: "اكتشف الدعوة",
        previewTitle: "",
      },
    },

    // ── 2. Hero Names — Asymmetric split ──────────────────────────────────────
    {
      sceneType: "hero_names",
      variant: "split_names",
      background: {
        type: "gradient",
        value: "linear-gradient(145deg, #110A04 0%, #0C0905 60%, #0A0703 100%)",
      },
      overlay: {
        type: "gradient",
        value: "linear-gradient(180deg, #0C0905 0%, transparent 10%, transparent 90%, #0C0905 100%)",
      },
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        subtitle: "يتشرفان بدعوتكم",
      },
    },

    // ── 3. Invitation Message — Full bleed text, no card ──────────────────────
    {
      sceneType: "invitation_message",
      variant: "full_bleed_text",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0C0905 0%, #100C07 50%, #0C0905 100%)",
      },
      defaultContent: {
        title: "دعوة كريمة",
        body: "يسعدنا حضوركم ومشاركتنا في هذه المناسبة السعيدة.",
      },
    },

    // ── 4. Event Details — Minimal rows, no icons ─────────────────────────────
    {
      sceneType: "event_details",
      variant: "minimal_rows",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0C0905 0%, #0A0703 100%)",
      },
      defaultContent: {
        sectionLabel: "تفاصيل المناسبة",
        date: "",
        time: "",
        venueName: "",
      },
    },

    // ── 5. Countdown — Large digits, no boxes ─────────────────────────────────
    {
      sceneType: "countdown",
      variant: "minimal_digits",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #130C06 0%, #0C0905 70%)",
      },
      defaultContent: {
        sectionLabel: "يوم المناسبة",
        targetDate: "",
      },
    },

    // ── 6. Gallery — Full bleed immersive ─────────────────────────────────────
    {
      sceneType: "gallery_media",
      variant: "full_bleed_media",
      background: {
        type: "gradient",
        value: "linear-gradient(145deg, #110A04 0%, #0C0905 100%)",
        // Replace with: { type: "image", src: "/assets/demo/noor/wedding/gallery-01.webp", fit: "cover", position: "full" }
      },
      defaultContent: {
        label: "لحظات",
        media: [],
      },
    },

    // ── 7. Location — Minimal text link ───────────────────────────────────────
    {
      sceneType: "location",
      variant: "minimal_link",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0C0905 0%, #0A0703 100%)",
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
        value: "linear-gradient(160deg, #0C0905 0%, #0A0703 100%)",
      },
      defaultContent: {
        sectionLabel: "تنبيهات",
        items: [],
      },
    },

    // ── 9. RSVP — Minimal form ────────────────────────────────────────────────
    {
      sceneType: "rsvp",
      variant: "minimal_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #0C0905 0%, #0A0703 100%)",
      },
      defaultContent: {
        sectionLabel: "تأكيد الحضور",
      },
    },

    // ── 10. Closing — Minimal thank you ───────────────────────────────────────
    {
      sceneType: "ticket_confirmation",
      variant: "minimal_thank_you",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #120C06 0%, #0C0905 60%, #09070400 100%)",
      },
      defaultContent: {},
    },
  ],
};
