import { InvitationSequence, SceneMediaConfig } from "@/types/invitation";

const ASSET = "/assets/demo/noor/media-wedding";

/** Opening: designer-delivered full-screen intro video + center start button */
const openingMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "video",
    src: `${ASSET}/opening.mp4`,
    poster: `${ASSET}/opening-poster.webp`,
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
    src: `${ASSET}/hero-bg.webp`,
    fit: "cover",
    position: "full",
  },
  foreground: [
    {
      type: "image",
      src: `${ASSET}/hero-foreground.webp`,
      fit: "contain",
      position: "bottom",
      opacity: 0.95,
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
    src: `${ASSET}/message-bg.webp`,
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
    src: `${ASSET}/gallery-01.webp`,
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
    src: `${ASSET}/closing.mp4`,
    poster: `${ASSET}/closing-poster.webp`,
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

/**
 * Noor Wedding Media Sequence — asset-driven player demo.
 *
 * Visual scenes: designer video/image assets via scene.media.
 * Functional scenes: web_layout (countdown, RSVP, location, details).
 */
export const noorWeddingMediaSequence: InvitationSequence = {
  id: "noor-wedding-media",
  label: "Noor Wedding — Asset-Driven",

  theme: {
    family: "media-wedding",
    primaryColor: "#B8722E",
    secondaryColor: "#E8C98A",
    backgroundColor: "#FAF6F1",
    textColor: "#2C2419",
    fontHeading: "CustomArabicFont",
    fontBody: "Tajawal",
    design: {
      cardStyle: "minimal",
      buttonStyle: "pill",
      dividerStyle: "line",
      iconStyle: "line",
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
    {
      sceneType: "opening",
      variant: "minimal_tap",
      media: openingMedia,
      defaultContent: { tapText: "افتح الدعوة", label: "دعوة زفاف" },
    },
    {
      sceneType: "hero_names",
      variant: "stacked_calligraphy",
      media: heroMedia,
      defaultContent: {
        primaryName: "الاسم الأول",
        secondaryName: "الاسم الثاني",
        connector: "و",
        subtitle: "يتشرفان بدعوتكم",
      },
    },
    {
      sceneType: "invitation_message",
      variant: "full_bleed_text",
      media: messageMedia,
      defaultContent: { title: "دعوة كريمة", body: "" },
    },
    {
      sceneType: "event_details",
      variant: "minimal_rows",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },
    {
      sceneType: "countdown",
      variant: "minimal_digits",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 70% 50% at 50% 50%, #F3E9DC 0%, #FAF6F1 70%)",
      },
      defaultContent: { sectionLabel: "يوم المناسبة", targetDate: "" },
    },
    {
      sceneType: "gallery_media",
      variant: "full_bleed_media",
      media: galleryMedia,
      defaultContent: { label: "لحظات" },
    },
    {
      sceneType: "location",
      variant: "minimal_link",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "موقع المناسبة" },
    },
    {
      sceneType: "notes",
      variant: "simple_list",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تنبيهات", items: [] },
    },
    {
      sceneType: "rsvp",
      variant: "minimal_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FAF6F1 0%, #F2EBE2 100%)",
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },
    {
      sceneType: "ticket_confirmation",
      variant: "minimal_thank_you",
      media: closingMedia,
      defaultContent: {},
    },
  ],
};
