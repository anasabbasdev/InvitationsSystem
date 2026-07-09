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
  /**
   * Whether this scene instance is rendered.
   * false = filtered out by InvitationRenderer before rendering.
   * Replaces the anti-pattern of variant: "hidden" as a disable mechanism.
   * Default: true (absent = visible).
   */
  enabled?: boolean;
  /** When true, this scene cannot be toggled off by operators */
  required?: boolean;
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

export type VersionedRef = {
  id: string;
  version: string;
};

/**
 * Resolved InvitationConfig — the final merged output consumed by InvitationRenderer.
 * Can be stored as a published snapshot so later blueprint/preset edits do not affect live invitations.
 */
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
  /** ISO timestamp when this config was snapshotted for publish */
  snapshotAt?: string;
  /** Source blueprint reference (draft builds may omit) */
  blueprintRef?: VersionedRef;
  /** Source design preset reference (draft builds may omit) */
  presetRef?: VersionedRef;
  /** Source invitation data reference (draft builds may omit) */
  dataRef?: { id: string };
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
  /**
   * Optional explicit scene instance ID.
   * Used as the scene ID in the built InvitationConfig.
   * If absent, auto-generated as `sceneType-index`.
   */
  id?: string;
  sceneType: SceneType;
  /** Whether this scene is included in the rendered invitation. Default: true */
  enabledByDefault?: boolean;
  /** If true, this scene cannot be disabled. Default: false */
  required?: boolean;
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
 * Per-scene-instance override keyed by scene ID.
 * Used in InvitationData.sceneOverrides for sceneId-based targeting.
 * Takes priority over sceneType-based overrides (legacy pattern).
 */
export type SceneInstanceOverride = {
  /** Override scene enabled state (supports disabling any scene by ID) */
  enabled?: boolean;
  /** Override the variant for this scene instance */
  variant?: string;
  /** Override design tokens for this scene instance */
  design?: SceneDesign;
  /** Override media composition for this scene instance */
  media?: Partial<SceneMediaConfig>;
  /** Content overrides for this scene instance */
  content?: Record<string, unknown>;
  /** Layer asset overrides for this scene instance */
  assetOverrides?: { background?: Layer; overlay?: Layer; foreground?: Layer[] };
};

/**
 * Per-invitation data supplied for a specific client event.
 * References a sequence by ID and overrides content/assets/design per scene.
 */
export type InvitationData = {
  id: string;
  slug: string;
  eventId: string;
  /** @deprecated Legacy V1 — use blueprintId for V2 invitations */
  sequenceId: string;
  /** V2 blueprint business id (e.g. wedding-standard) */
  blueprintId?: string;
  /** V2 design preset business id (e.g. wedding-royal-dark) */
  presetId?: string;
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
  /**
   * Per-scene-instance overrides keyed by scene ID (Phase 2.10+).
   * Takes priority over all sceneType-keyed overrides above.
   * Enables independent control of repeated scene types and explicit IDs.
   */
  sceneOverrides?: Record<string, SceneInstanceOverride>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2.10 — SequenceBlueprint + DesignPreset
//
// Cleaner architectural separation:
//   SequenceBlueprint = journey only (which scenes, in what order, which are optional)
//   DesignPreset      = visual identity only (theme, per-scene variants, media defaults)
//   InvitationData    = per-client content and overrides
//
//   buildInvitationConfigV2(blueprint, preset, data) → InvitationConfig
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Single scene slot in a SequenceBlueprint.
 * Defines the journey slot — ID, type, and whether it's included by default.
 * Contains NO design, NO content, NO assets.
 */
export type SceneBlueprintEntry = {
  /** Unique scene instance ID within this blueprint (e.g. "ws-opening", "gallery-childhood") */
  id: string;
  type: SceneType;
  /** Human-readable label for Composer / admin UI */
  label?: string;
  /** Whether this scene renders by default. Can be overridden per InvitationData. Default: true */
  enabledByDefault?: boolean;
  /** If true, this scene cannot be disabled by InvitationData overrides */
  required?: boolean;
};

/**
 * Sequence Blueprint — defines the JOURNEY only.
 * Create a new SequenceBlueprint only when the journey changes.
 * Different visual identities use a DesignPreset on the same blueprint.
 *
 * Examples: wedding-standard, wedding-short, birth-announcement, graduation
 */
export type SequenceBlueprint = {
  id: string;
  label: string;
  description?: string;
  /** Semantic version — bump when journey structure changes */
  version?: string;
  layout: InvitationLayout;
  scenes: SceneBlueprintEntry[];
};

/**
 * Visual defaults for one scene type within a DesignPreset.
 * Defines what the scene looks like when no client override is applied.
 */
export type DesignPresetScene = {
  variant?: string;
  design?: SceneDesign;
  media?: SceneMediaConfig;
  background?: Layer;
  overlay?: Layer;
  foreground?: Layer[];
  defaultContent?: Record<string, unknown>;
  motion?: Record<string, unknown>;
};

/**
 * Design Preset — defines the VISUAL IDENTITY only.
 * Reusable across multiple InvitationData on the same SequenceBlueprint.
 * Create a new DesignPreset when the visual direction changes.
 *
 * Examples: wedding-royal-dark, wedding-cinematic-floral, wedding-minimal-modern
 */
export type DesignPreset = {
  id: string;
  label: string;
  description?: string;
  /** Semantic version — bump when visual defaults change */
  version?: string;
  theme: InvitationTheme;
  /**
   * Per-sceneType visual defaults — lowest design layer after blueprint.
   * Merge order: typeDefaults[sceneType] → sceneOverrides[sceneId]
   */
  typeDefaults?: Partial<Record<SceneType, DesignPresetScene>>;
  /**
   * Per-sceneId visual overrides — targets a specific scene instance.
   * Enables two gallery_media scenes with different media in the same journey.
   */
  sceneOverrides?: Record<string, DesignPresetScene>;
  /**
   * @deprecated Use typeDefaults. Kept for backward compatibility with Phase 2.10 presets.
   */
  scenes?: Partial<Record<SceneType, DesignPresetScene>>;
};
