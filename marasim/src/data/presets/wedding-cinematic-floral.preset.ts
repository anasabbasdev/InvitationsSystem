import { DesignPreset, SceneMediaConfig } from "@/types/invitation";

/**
 * Wedding Cinematic Floral — Design Preset B
 *
 * Visual identity: designer video/image assets drive every visual scene.
 * Composition: full_media opening + closing, layered_media hero, full_media gallery.
 * Typography: Amiri headings + Tajawal body, warm rose palette.
 * Icons: hidden (assets tell the story).
 *
 * Asset paths reference the existing noor/media-wedding demo assets —
 * replace with actual client assets in production InvitationData.
 *
 * Use with: weddingStandardBlueprint + InvitationData
 *
 * Proof that the SAME blueprint produces a cinematically different invitation
 * purely through DesignPreset — no new components, no new pages.
 */

const DEMO_ASSET = "/assets/demo/noor/media-wedding";

const openingMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "video",
    src: `${DEMO_ASSET}/opening.mp4`,
    poster: `${DEMO_ASSET}/opening-poster.webp`,
    fit: "cover",
    loop: false,
    muted: true,
    playsInline: true,
    preload: "metadata",
  },
  startBehavior: "center_button",
  startButtonText: "افتح الدعوة",
  playBehavior: "on_tap",
  revealAfter: "media_end",
  maxDurationMs: 45000,
  liveTextEnabled: false,
};

const heroMedia: SceneMediaConfig = {
  compositionMode: "layered_media",
  background: {
    type: "image",
    src: `${DEMO_ASSET}/hero-bg.webp`,
    fit: "cover",
    position: "full",
    zIndex: 0,
  },
  foreground: [
    {
      type: "image",
      src: `${DEMO_ASSET}/hero-foreground.webp`,
      fit: "contain",
      position: "bottom",
      opacity: 0.92,
      zIndex: 20,
    },
  ],
  liveTextEnabled: true,
  liveTextPlacement: "center",
  liveTextStyle: "classic",
};

const messageMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "image",
    src: `${DEMO_ASSET}/message-bg.webp`,
    fit: "cover",
  },
  liveTextEnabled: true,
  liveTextPlacement: "overlay",
  liveTextStyle: "soft",
};

const galleryMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "image",
    src: `${DEMO_ASSET}/gallery-01.webp`,
    fit: "cover",
  },
  liveTextEnabled: true,
  liveTextPlacement: "bottom",
  liveTextStyle: "modern",
};

const closingMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "video",
    src: `${DEMO_ASSET}/closing.mp4`,
    poster: `${DEMO_ASSET}/closing-poster.webp`,
    fit: "cover",
    loop: true,
    muted: true,
    playsInline: true,
    preload: "metadata",
  },
  startBehavior: "none",
  playBehavior: "on_visible",
  revealAfter: "immediate",
  liveTextEnabled: true,
  liveTextPlacement: "center",
  liveTextStyle: "classic",
};

export const weddingCinematicFloralPreset: DesignPreset = {
  id: "wedding-cinematic-floral",
  label: "Wedding Cinematic Floral",
  description:
    "Designer video/image assets drive the visual. Warm rose palette, minimal UI, hidden icons.",

  theme: {
    family: "cinematic-floral",
    primaryColor: "#B8722E",
    secondaryColor: "#E8C98A",
    backgroundColor: "#FAF6F1",
    textColor: "#2C2419",
    mutedTextColor: "#7A6E62",
    accentColor: "#E8A878",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
    design: {
      cardStyle: "minimal",
      buttonStyle: "pill",
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
      media: openingMedia,
      defaultContent: { tapText: "افتح الدعوة", label: "دعوة زفاف" },
    },

    hero_names: {
      variant: "stacked_calligraphy",
      media: heroMedia,
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم لحفل زفافهما",
      },
    },

    invitation_message: {
      variant: "full_bleed_text",
      media: messageMedia,
      defaultContent: {
        header: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        title: "دعوة كريمة",
        body: "",
      },
    },

    event_details: {
      variant: "minimal_rows",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },

    countdown: {
      variant: "minimal_digits",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #F3E9DC 0%, #FAF6F1 70%)",
      },
      defaultContent: { sectionLabel: "يوم المناسبة" },
    },

    gallery_media: {
      variant: "full_bleed_media",
      media: galleryMedia,
      defaultContent: { label: "لحظات" },
    },

    location: {
      variant: "minimal_link",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "موقع المناسبة" },
    },

    notes: {
      variant: "simple_list",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تنبيهات", items: [] },
    },

    rsvp: {
      variant: "minimal_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },

    ticket_confirmation: {
      variant: "minimal_thank_you",
      media: closingMedia,
      defaultContent: { closingTitle: "شكراً لتفاعلكم" },
    },
  },
};
