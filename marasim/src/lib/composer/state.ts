import type {
  DesignTokens,
  InvitationConfig,
  InvitationScene,
  InvitationTheme,
  LiveTextConfig,
  SceneCompositionMode,
  SceneDesign,
  SceneMediaConfig,
  SceneType,
  ThemeTypography,
} from "@/types/invitation";
import { SCENE_ORDER } from "./constants";
import { getAssetPublicPrefix, suggestMediaPath } from "./asset-paths";
import type { ComposerDemoSlug } from "./constants";

export type ComposerThemeEdit = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  typography: Partial<ThemeTypography>;
  design: Partial<DesignTokens>;
};

export type ComposerSceneEdit = {
  compositionMode: SceneCompositionMode;
  variant: string;
  media?: SceneMediaConfig;
  design: Partial<SceneDesign>;
  content: Record<string, unknown>;
};

export type ComposerEdits = Partial<Record<SceneType, ComposerSceneEdit>>;

function cloneConfig(config: InvitationConfig): InvitationConfig {
  return JSON.parse(JSON.stringify(config)) as InvitationConfig;
}

const DEFAULT_TEXT = "#F5F0E8";
const DEFAULT_MUTED = "#A89F8F";

export function initThemeFromConfig(config: InvitationConfig): ComposerThemeEdit {
  const { theme } = config;
  return {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor ?? DEFAULT_TEXT,
    mutedTextColor: theme.mutedTextColor ?? DEFAULT_MUTED,
    accentColor: theme.accentColor ?? theme.secondaryColor,
    fontHeading: theme.fontHeading,
    fontBody: theme.fontBody,
    typography: theme.typography ? { ...theme.typography } : {},
    design: theme.design ? { ...theme.design } : {},
  };
}

export function initEditsFromConfig(config: InvitationConfig): ComposerEdits {
  const edits: ComposerEdits = {};
  for (const scene of config.scenes) {
    edits[scene.type] = {
      compositionMode: scene.media?.compositionMode ?? "web_layout",
      variant: scene.variant,
      media: scene.media ? JSON.parse(JSON.stringify(scene.media)) : undefined,
      design: scene.design ? JSON.parse(JSON.stringify(scene.design)) : {},
      content: scene.content ? { ...scene.content } : {},
    };
  }
  return edits;
}

/** Sync legacy liveText* fields with liveText object for renderer compatibility */
export function syncMediaLiveText(media: SceneMediaConfig): SceneMediaConfig {
  const lt: LiveTextConfig = { ...(media.liveText ?? {}) };
  if (media.liveTextEnabled != null) lt.enabled = media.liveTextEnabled;
  if (media.liveTextPlacement) lt.placement = media.liveTextPlacement;
  if (media.liveTextStyle) lt.style = media.liveTextStyle;
  return {
    ...media,
    liveText: lt,
    liveTextEnabled: lt.enabled ?? media.liveTextEnabled,
    liveTextPlacement: lt.placement ?? media.liveTextPlacement,
    liveTextStyle: lt.style ?? media.liveTextStyle,
  };
}

export function createDefaultMedia(
  mode: "full_media" | "layered_media",
  sceneType: SceneType,
  slug: ComposerDemoSlug
): SceneMediaConfig {
  const base: SceneMediaConfig = {
    compositionMode: mode,
    liveTextEnabled: false,
    liveTextPlacement: "center",
    liveTextStyle: "classic",
    liveText: { enabled: false, placement: "center", style: "classic" },
  };

  if (mode === "full_media") {
    const isVideo = sceneType === "opening" || sceneType === "ticket_confirmation";
    return syncMediaLiveText({
      ...base,
      mainMedia: {
        type: isVideo ? "video" : "image",
        src: suggestMediaPath(slug, sceneType, "main"),
        poster: isVideo ? suggestMediaPath(slug, sceneType, "poster") : undefined,
        fit: "cover",
        loop: sceneType === "ticket_confirmation",
        muted: true,
        playsInline: true,
        preload: "metadata",
      },
      startBehavior: sceneType === "opening" ? "center_button" : "none",
      startButtonText: "افتح الدعوة",
      playBehavior: sceneType === "opening" ? "on_tap" : "on_visible",
      revealAfter: sceneType === "opening" ? "media_end" : "immediate",
      liveTextEnabled: sceneType === "invitation_message" || sceneType === "gallery_media",
      liveTextPlacement: sceneType === "invitation_message" ? "overlay" : "bottom",
      liveText: {
        enabled: sceneType === "invitation_message" || sceneType === "gallery_media",
        placement: sceneType === "invitation_message" ? "overlay" : "bottom",
        style: "classic",
      },
    });
  }

  return syncMediaLiveText({
    ...base,
    background: {
      type: "image",
      src: suggestMediaPath(slug, sceneType, "background"),
      fit: "cover",
      position: "full",
      zIndex: 0,
    },
    foreground:
      sceneType === "hero_names"
        ? [
            {
              type: "image",
              src: suggestMediaPath(slug, sceneType, "foreground"),
              fit: "contain",
              position: "bottom",
              opacity: 0.95,
              zIndex: 20,
            },
          ]
        : undefined,
    liveTextEnabled: true,
    liveTextPlacement: "center",
    liveTextStyle: slug.includes("birth") ? "soft" : "classic",
    liveText: {
      enabled: true,
      placement: "center",
      style: slug.includes("birth") ? "soft" : "classic",
    },
  });
}

function applySceneEdit(scene: InvitationScene, edit?: ComposerSceneEdit): InvitationScene {
  if (!edit) return scene;

  const next: InvitationScene = {
    ...scene,
    variant: edit.variant,
    design: { ...scene.design, ...edit.design },
    content: { ...scene.content, ...edit.content },
  };

  if (edit.compositionMode === "web_layout") {
    const { media: _removed, ...rest } = next;
    return rest as InvitationScene;
  }

  if (edit.media) {
    next.media = syncMediaLiveText({
      ...edit.media,
      compositionMode: edit.compositionMode,
    });
  }

  return next;
}

export function applyComposerEdits(
  base: InvitationConfig,
  edits: ComposerEdits,
  themeEdit?: ComposerThemeEdit
): InvitationConfig {
  const config = cloneConfig(base);

  if (themeEdit) {
    config.theme = {
      ...config.theme,
      primaryColor: themeEdit.primaryColor,
      secondaryColor: themeEdit.secondaryColor,
      backgroundColor: themeEdit.backgroundColor,
      textColor: themeEdit.textColor,
      mutedTextColor: themeEdit.mutedTextColor,
      accentColor: themeEdit.accentColor,
      fontHeading: themeEdit.fontHeading,
      fontBody: themeEdit.fontBody,
      typography: { ...config.theme.typography, ...themeEdit.typography },
      design: { ...config.theme.design, ...themeEdit.design },
    };
  }

  config.scenes = config.scenes.map((scene) =>
    applySceneEdit(scene, edits[scene.type])
  );
  return config;
}

function shallowDiff<T extends Record<string, unknown>>(
  base: T | undefined,
  current: T | undefined
): Partial<T> | undefined {
  if (!current) return undefined;
  const diff: Partial<T> = {};
  let hasDiff = false;
  for (const key of Object.keys(current) as (keyof T)[]) {
    const b = base?.[key];
    const c = current[key];
    if (JSON.stringify(b) !== JSON.stringify(c)) {
      diff[key] = c;
      hasDiff = true;
    }
  }
  return hasDiff ? diff : undefined;
}

function buildThemeOverrides(
  base: InvitationConfig,
  themeEdit: ComposerThemeEdit
): Partial<InvitationTheme> | undefined {
  const overrides: Partial<InvitationTheme> = {};
  const bt = base.theme;

  if (themeEdit.primaryColor !== bt.primaryColor) overrides.primaryColor = themeEdit.primaryColor;
  if (themeEdit.secondaryColor !== bt.secondaryColor) overrides.secondaryColor = themeEdit.secondaryColor;
  if (themeEdit.backgroundColor !== bt.backgroundColor) overrides.backgroundColor = themeEdit.backgroundColor;
  if (themeEdit.textColor !== (bt.textColor ?? DEFAULT_TEXT)) overrides.textColor = themeEdit.textColor;
  if (themeEdit.mutedTextColor !== (bt.mutedTextColor ?? DEFAULT_MUTED)) {
    overrides.mutedTextColor = themeEdit.mutedTextColor;
  }
  if (themeEdit.accentColor !== (bt.accentColor ?? bt.secondaryColor)) {
    overrides.accentColor = themeEdit.accentColor;
  }
  if (themeEdit.fontHeading !== bt.fontHeading) overrides.fontHeading = themeEdit.fontHeading;
  if (themeEdit.fontBody !== bt.fontBody) overrides.fontBody = themeEdit.fontBody;

  const typoDiff = shallowDiff(
    bt.typography as Record<string, unknown> | undefined,
    Object.keys(themeEdit.typography).length
      ? (themeEdit.typography as Record<string, unknown>)
      : undefined
  );
  if (typoDiff && Object.keys(typoDiff).length > 0) {
    overrides.typography = typoDiff as Partial<ThemeTypography>;
  }

  const designDiff = shallowDiff(
    bt.design as Record<string, unknown> | undefined,
    Object.keys(themeEdit.design).length
      ? (themeEdit.design as Record<string, unknown>)
      : undefined
  );
  if (designDiff && Object.keys(designDiff).length > 0) {
    overrides.design = designDiff as Partial<DesignTokens>;
  }

  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

export type ComposerExport = {
  mediaOverrides?: Partial<Record<SceneType, Partial<SceneMediaConfig>>>;
  variantOverrides?: Partial<Record<SceneType, string>>;
  designOverrides?: Partial<Record<SceneType, Partial<SceneDesign>>>;
  themeOverrides?: Partial<InvitationTheme>;
  content?: Partial<Record<SceneType, Record<string, unknown>>>;
};

export function buildExportPayload(
  base: InvitationConfig,
  edits: ComposerEdits,
  themeEdit: ComposerThemeEdit
): ComposerExport {
  const payload: ComposerExport = {};

  const themeOverrides = buildThemeOverrides(base, themeEdit);
  if (themeOverrides) payload.themeOverrides = themeOverrides;

  for (const type of SCENE_ORDER) {
    const baseScene = base.scenes.find((s) => s.type === type);
    const edit = edits[type];
    if (!baseScene || !edit) continue;

    if (edit.variant !== baseScene.variant) {
      payload.variantOverrides ??= {};
      payload.variantOverrides[type] = edit.variant;
    }

    const designDiff = shallowDiff(
      baseScene.design as Record<string, unknown> | undefined,
      Object.keys(edit.design).length ? (edit.design as Record<string, unknown>) : undefined
    );
    if (designDiff && Object.keys(designDiff).length > 0) {
      payload.designOverrides ??= {};
      payload.designOverrides[type] = designDiff as Partial<SceneDesign>;
    }

    const contentDiff = shallowDiff(
      baseScene.content as Record<string, unknown> | undefined,
      Object.keys(edit.content).length ? edit.content : undefined
    );
    if (contentDiff && Object.keys(contentDiff).length > 0) {
      payload.content ??= {};
      payload.content[type] = contentDiff;
    }

    const baseMode = baseScene.media?.compositionMode ?? "web_layout";
    const editMedia = edit.media ? syncMediaLiveText(edit.media) : undefined;
    const baseMedia = baseScene.media ? syncMediaLiveText(baseScene.media) : undefined;

    if (edit.compositionMode !== baseMode) {
      payload.mediaOverrides ??= {};
      if (edit.compositionMode === "web_layout") {
        payload.mediaOverrides[type] = { compositionMode: "web_layout" };
      } else if (editMedia) {
        payload.mediaOverrides[type] = editMedia;
      }
    } else if (
      edit.compositionMode !== "web_layout" &&
      editMedia &&
      JSON.stringify(editMedia) !== JSON.stringify(baseMedia)
    ) {
      payload.mediaOverrides ??= {};
      payload.mediaOverrides[type] = editMedia;
    }
  }

  return payload;
}

export function exportJsonString(payload: ComposerExport): string {
  const cleaned = JSON.parse(JSON.stringify(payload)) as ComposerExport;
  return JSON.stringify(cleaned, null, 2);
}

export function exportInvitationDataSnippet(
  slug: ComposerDemoSlug,
  payload: ComposerExport
): string {
  const obj: Record<string, unknown> = {};
  if (payload.themeOverrides && Object.keys(payload.themeOverrides).length > 0) {
    obj.themeOverrides = payload.themeOverrides;
  }
  if (payload.content && Object.keys(payload.content).length > 0) {
    obj.content = payload.content;
  }
  if (payload.mediaOverrides && Object.keys(payload.mediaOverrides).length > 0) {
    obj.mediaOverrides = payload.mediaOverrides;
  }
  if (payload.variantOverrides && Object.keys(payload.variantOverrides).length > 0) {
    obj.variantOverrides = payload.variantOverrides;
  }
  if (payload.designOverrides && Object.keys(payload.designOverrides).length > 0) {
    obj.designOverrides = payload.designOverrides;
  }

  return [
    "// Paste into InvitationData in data/invitations/*.ts",
    `// Demo slug: ${slug}`,
    "// Includes: themeOverrides, designOverrides (colors/icons/typography), mediaOverrides, content",
    "",
    `export const composerOverrides = ${JSON.stringify(obj, null, 2)};`,
    "",
    `// Asset folder: ${getAssetPublicPrefix(slug)}`,
  ].join("\n");
}
