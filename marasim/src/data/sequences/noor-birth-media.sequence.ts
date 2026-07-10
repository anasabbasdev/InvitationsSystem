import { InvitationSequence, SceneMediaConfig } from "@/types/invitation";

const ASSET = "/assets/demo/noor/media-birth";

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
  startButtonText: "اكتشفي المناسبة",
  playBehavior: "on_tap",
  revealAfter: "media_end",
  maxDurationMs: 40000,
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
      src: `${ASSET}/baby-bg.webp`,
      fit: "contain",
      position: "center",
      opacity: 0.85,
    },
  ],
  liveTextEnabled: true,
  liveTextPlacement: "center",
  liveTextStyle: "soft",
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
  liveTextStyle: "soft",
};

const closingMedia: SceneMediaConfig = {
  compositionMode: "full_media",
  mainMedia: {
    type: "image",
    src: `${ASSET}/closing.webp`,
    fit: "cover",
  },
  startBehavior: "none",
  revealAfter: "immediate",
  liveTextEnabled: true,
  liveTextPlacement: "center",
  liveTextStyle: "soft",
};

/**
 * Noor Birth Media Sequence — asset-driven birth announcement demo.
 */
export const noorBirthMediaSequence: InvitationSequence = {
  id: "noor-birth-media",
  label: "Noor Birth — Asset-Driven",

  theme: {
    family: "media-birth",
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
    {
      sceneType: "opening",
      variant: "minimal_tap",
      media: openingMedia,
      defaultContent: { tapText: "اكتشفي المناسبة", label: "بشرى سعيدة" },
    },
    {
      sceneType: "hero_names",
      variant: "single_name_centered",
      media: heroMedia,
      defaultContent: { primaryName: "الاسم", subtitle: "" },
    },
    {
      sceneType: "invitation_message",
      variant: "minimal_quote",
      media: messageMedia,
      defaultContent: { body: "" },
    },
    {
      sceneType: "event_details",
      variant: "timeline",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: { sectionLabel: "تفاصيل المناسبة" },
    },
    {
      sceneType: "countdown",
      variant: "boxed_luxury",
      background: {
        type: "gradient",
        value: "radial-gradient(ellipse 65% 50% at 50% 50%, #F5E0E8 0%, #FDF5F7 70%)",
      },
      defaultContent: { sectionLabel: "يوم المناسبة", targetDate: "" },
    },
    {
      sceneType: "gallery_media",
      variant: "full_bleed_media",
      media: galleryMedia,
      defaultContent: { label: "لحظات البهجة" },
    },
    {
      sceneType: "location",
      variant: "map_button_card",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: { sectionLabel: "موقع المناسبة" },
    },
    {
      sceneType: "notes",
      variant: "elegant_cards",
      background: {
        type: "gradient",
        value: "linear-gradient(160deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: { sectionLabel: "ملاحظات", items: [] },
    },
    {
      sceneType: "rsvp",
      variant: "luxury_form",
      background: {
        type: "gradient",
        value: "linear-gradient(180deg, #FDF5F7 0%, #F0D8E2 100%)",
      },
      defaultContent: { sectionLabel: "تأكيد الحضور" },
    },
    {
      sceneType: "ticket_confirmation",
      variant: "minimal_thank_you",
      media: closingMedia,
      defaultContent: { closingTitle: "نراكم قريباً" },
    },
  ],
};
