export type SceneType =
  | "opening"
  | "hero_names"
  | "invitation_message"
  | "event_details"
  | "countdown"
  | "gallery_media"
  | "location"
  | "notes"
  | "rsvp"
  | "ticket_confirmation";

export type LayerType = "image" | "video" | "color" | "gradient" | "lottie";

export type Layer = {
  type: LayerType;
  src?: string;
  /** CSS color value for "color" type, or CSS gradient string for "gradient" type */
  value?: string;
  fit?: "cover" | "contain";
  /** Positional placement within the scene frame */
  position?: "top" | "center" | "bottom" | "full";
  opacity?: number;
  /**
   * Explicit height for partial-position ornaments.
   * Accepts any CSS height value: "auto", "30%", "160px".
   * Defaults to "auto" for top/bottom/center; "100%" for full.
   */
  height?: string;
};

// ─── Asset-Driven Scene Composition (Phase 2.8) ───────────────────────────────
//
// Each scene can render designer-delivered video/image assets with minimal web code.
// compositionMode "web_layout" = current variant/token system (default when media absent).
// ─────────────────────────────────────────────────────────────────────────────

export type SceneCompositionMode = "full_media" | "layered_media" | "web_layout";

export type MediaAsset = {
  type: "image" | "video";
  src: string;
  poster?: string;
  fit?: "cover" | "contain";
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "auto" | "metadata" | "none";
  /** Layer position for layered_media foreground/frame (default: full) */
  position?: "top" | "center" | "bottom" | "full";
  opacity?: number;
  /** CSS height for layered foreground (e.g. "45%", "200px") */
  height?: string;
  /** Stacking order within layered_media (higher = on top) */
  zIndex?: number;
};

export type LiveTextStyle = "classic" | "modern" | "soft" | "hidden";

/** Fine-grained live text overlay styling (Phase 2.9.2) */
export type LiveTextConfig = {
  enabled?: boolean;
  placement?: "top" | "center" | "bottom" | "overlay";
  style?: LiveTextStyle;
  color?: string;
  emphasisColor?: string;
  font?: string;
  size?: string;
  emphasisSize?: string;
  align?: "left" | "center" | "right";
  maxWidth?: string;
  textShadow?: string;
  panelEnabled?: boolean;
  panelColor?: string;
  panelOpacity?: number;
};

export type SceneMediaConfig = {
  compositionMode: SceneCompositionMode;
  background?: MediaAsset;
  mainMedia?: MediaAsset;
  overlay?: MediaAsset;
  foreground?: MediaAsset[];
  frame?: MediaAsset;
  startBehavior?: "none" | "center_button" | "tap_anywhere";
  startButtonText?: string;
  playBehavior?: "on_visible" | "on_tap" | "manual";
  revealAfter?: "media_end" | "tap" | "immediate";
  minDurationMs?: number;
  maxDurationMs?: number;
  liveTextEnabled?: boolean;
  liveTextPlacement?: "top" | "center" | "bottom" | "overlay";
  liveTextStyle?: LiveTextStyle;
  /** Extended live text controls — merged with legacy liveText* fields at render time */
  liveText?: LiveTextConfig;
};

/** Global typography tokens — serializable, extensible for custom web fonts later */
export type ThemeTypography = {
  headingFont?: string;
  bodyFont?: string;
  namesFont?: string;
  headingSize?: string;
  bodySize?: string;
  namesSize?: string;
  textAlign?: "left" | "center" | "right" | "start" | "end";
  lineHeight?: string;
  letterSpacing?: string;
};

/** Per-scene color overrides applied via CSS variables on the scene frame */
export type SceneColorOverrides = {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
};

// ─── Design System Tokens ──────────────────────────────────────────────────────
//
// DesignTokens live at sequence.theme.design (sequence-wide defaults) and can be
// overridden per scene via SceneDefinition.design / InvitationScene.design.
//
// All values are plain strings/enums so they are serializable to JSON / Supabase.
// ─────────────────────────────────────────────────────────────────────────────

/** Sequence-level visual design system defaults, applied to all scenes unless overridden. */
export type DesignTokens = {
  /** Card / container border treatment */
  cardStyle?: "framed" | "minimal" | "glass" | "full_bleed" | "none";
  /** CTA and action button shape */
  buttonStyle?: "pill" | "square" | "ghost" | "underline" | "none";
  /** Ornamental divider between content sections */
  dividerStyle?: "diamond" | "line" | "floral_asset" | "none";
  /** Icon rendering style */
  iconStyle?: "line" | "filled" | "asset" | "none";
  /** Typography personality — controls font selection and sizing */
  typographyStyle?: "classic" | "modern" | "calligraphy" | "soft";
  /** Corner ornament treatment on cards */
  cornerStyle?: "ornate" | "minimal" | "none";
  /** Section label display above scene content */
  sectionLabelStyle?: "badge" | "plain" | "hidden";
  /** Vertical spacing density */
  density?: "airy" | "balanced" | "compact";
};

/** Per-scene design overrides — extends DesignTokens with scene-specific fields. */
export type SceneDesign = DesignTokens & {
  /** Layout sub-variant for fine-grained control within a variant */
  layout?: string;
  /** Text placement within the scene frame */
  textPlacement?: "top" | "center" | "bottom" | "overlay";
  /** How media items are rendered in gallery scenes */
  mediaTreatment?: "card" | "full_bleed" | "polaroid" | "frame";
  /**
   * Custom divider / ornament image asset.
   * Used when dividerStyle = "floral_asset".
   * Path relative to /public.
   */
  ornamentAsset?: string;
  /**
   * Custom icon assets keyed by icon purpose.
   * e.g. { calendar: "/assets/icons/calendar.webp", pin: "/assets/icons/pin.webp" }
   * Used when iconStyle = "asset".
   */
  iconAssets?: Record<string, string>;
  /** Per-scene color overrides */
  colors?: SceneColorOverrides;
  /** Per-scene typography overrides */
  typography?: ThemeTypography;
};

// ─── Core Scene ───────────────────────────────────────────────────────────────

export type InvitationScene = {
  id: string;
  type: SceneType;
  /** Controls the layout/visual variant rendered by the scene component */
  variant: string;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
  content?: Record<string, unknown>;
  motion?: Record<string, unknown>;
  /** Per-scene design overrides (merged with theme.design at render time) */
  design?: SceneDesign;
  /** Asset-driven composition config (Phase 2.8) */
  media?: SceneMediaConfig;
};

// ─── Theme & Layout ───────────────────────────────────────────────────────────

export type InvitationTheme = {
  family: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor?: string;
  mutedTextColor?: string;
  accentColor?: string;
  fontHeading: string;
  fontBody: string;
  /** Global typography overrides */
  typography?: ThemeTypography;
  /** Sequence-level design system defaults — overridable per scene via SceneDesign */
  design?: DesignTokens;
};

export type InvitationLayout = {
  mobileMaxWidth: number;
  minSupportedWidth: number;
  safePaddingX: number;
};

export type InvitationMusic = {
  enabled: boolean;
  src?: string;
  startMode: "after_first_tap" | "manual" | "disabled";
};

export type InvitationRSVP = {
  enabled: boolean;
  mode: "none" | "public_request" | "controlled_link";
  approvalRequired: boolean;
  maxPublicRequest?: number;
};

export type InvitationConfig = {
  id: string;
  eventId: string;
  slug: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  theme: InvitationTheme;
  layout: InvitationLayout;
  music: InvitationMusic;
  rsvp: InvitationRSVP;
  scenes: InvitationScene[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Sequence + InvitationData — two-layer architecture
//
//   InvitationSequence  = reusable visual design (theme, variants, animations)
//   InvitationData      = per-client content, assets, RSVP settings
//
//   buildInvitationConfig(data, sequence) → InvitationConfig → InvitationRenderer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One entry in a sequence — the design of a single scene slot.
 * Contains NO real content (names, dates, etc.). Those come from InvitationData.
 */
export type SceneDefinition = {
  sceneType: SceneType;
  variant: string;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
  /** Fallback content shown when InvitationData provides no override */
  defaultContent?: Record<string, unknown>;
  motion?: Record<string, unknown>;
  /** Per-scene design token overrides (merged with theme.design) */
  design?: SceneDesign;
  /** Asset-driven scene composition (Phase 2.8) */
  media?: SceneMediaConfig;
};

/**
 * A reusable visual design template.
 * Shared across multiple client invitations via different InvitationData.
 */
export type InvitationSequence = {
  id: string;
  /** Human-readable name shown in Admin UI */
  label: string;
  theme: InvitationTheme;
  layout: InvitationLayout;
  /** Ordered list of 10 scene slots */
  scenes: SceneDefinition[];
};

/**
 * Per-invitation data supplied for a specific client event.
 * References a sequence by ID and overrides content/assets/design per scene.
 */
export type InvitationData = {
  id: string;
  slug: string;
  eventId: string;
  sequenceId: string;
  language: "ar" | "en";
  direction: "rtl" | "ltr";
  music: InvitationMusic;
  rsvp: InvitationRSVP;
  /**
   * Content overrides keyed by SceneType.
   * Merged with the scene's defaultContent from the sequence.
   */
  content: Partial<Record<SceneType, Record<string, unknown>>>;
  /** Per-scene layer asset overrides (replace sequence backgrounds/foregrounds) */
  assetOverrides?: Partial<Record<SceneType, { background?: Layer; overlay?: Layer; foreground?: Layer[] }>>;
  /** Per-scene design token overrides (applied on top of sequence scene.design) */
  designOverrides?: Partial<Record<SceneType, SceneDesign>>;
  /** Per-scene variant overrides — change layout without duplicating the sequence */
  variantOverrides?: Partial<Record<SceneType, string>>;
  /** Per-scene media composition overrides (merged with sequence scene.media) */
  mediaOverrides?: Partial<Record<SceneType, Partial<SceneMediaConfig>>>;
  /** Global theme overrides (e.g., different primaryColor for this client) */
  themeOverrides?: Partial<InvitationTheme>;
};
