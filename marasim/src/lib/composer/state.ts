import type {
  DesignPreset,
  DesignPresetScene,
  DesignTokens,
  InvitationConfig,
  InvitationData,
  InvitationScene,
  InvitationTheme,
  LiveTextConfig,
  SceneCompositionMode,
  SceneDesign,
  SceneInstanceOverride,
  SceneMediaConfig,
  SceneType,
  SequenceBlueprint,
  ThemeTypography,
} from "@/types/invitation";
import { SCENE_VARIANTS } from "./constants";
import { getAssetPublicPrefix, suggestMediaPath } from "./asset-paths";
import type { ComposerDemoSlug } from "./constants";
import {
  type ComposerJourney,
  type ComposerSceneInstance,
  createSceneInstance,
  defaultVariantForType,
  initJourneyFromConfig,
} from "./journey";

export type { ComposerJourney, ComposerSceneInstance };
export {
  createSceneInstance,
  duplicateInstance,
  duplicateSceneId,
  generateSceneId,
  moveInstance,
  removeInstance,
  updateInstanceId,
  validateSceneId,
} from "./journey";

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
  enabled: boolean;
};

/** Scene edits keyed by sceneId (Phase 2.11) */
export type ComposerSceneEdits = Record<string, ComposerSceneEdit>;

/** @deprecated Use ComposerSceneEdits */
export type ComposerEdits = ComposerSceneEdits;

export type ComposerState = {
  journey: ComposerJourney;
  sceneEdits: ComposerSceneEdits;
  themeEdit: ComposerThemeEdit;
};

export type SeparatedExports = {
  blueprint: SequenceBlueprint;
  preset: Partial<DesignPreset>;
  invitationData: Partial<InvitationData>;
  resolvedConfig: InvitationConfig;
};

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

function sceneEditFromScene(scene: InvitationScene): ComposerSceneEdit {
  return {
    compositionMode: scene.media?.compositionMode ?? "web_layout",
    variant: scene.variant,
    media: scene.media ? JSON.parse(JSON.stringify(scene.media)) : undefined,
    design: scene.design ? JSON.parse(JSON.stringify(scene.design)) : {},
    content: scene.content ? { ...scene.content } : {},
    enabled: scene.enabled !== false,
  };
}

export function initSceneEditsFromConfig(config: InvitationConfig): ComposerSceneEdits {
  const edits: ComposerSceneEdits = {};
  for (const scene of config.scenes) {
    edits[scene.id] = sceneEditFromScene(scene);
  }
  return edits;
}

/** @deprecated Use initComposerStateFromConfig */
export function initEditsFromConfig(config: InvitationConfig): ComposerSceneEdits {
  return initSceneEditsFromConfig(config);
}

export function initComposerStateFromConfig(config: InvitationConfig): ComposerState {
  return {
    journey: initJourneyFromConfig(config),
    sceneEdits: initSceneEditsFromConfig(config),
    themeEdit: initThemeFromConfig(config),
  };
}

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

function createDefaultScene(instance: ComposerSceneInstance): InvitationScene {
  return {
    id: instance.id,
    type: instance.type,
    enabled: instance.enabled,
    required: instance.required,
    variant: defaultVariantForType(instance.type),
    content: {},
  };
}

function applySceneEdit(scene: InvitationScene, edit?: ComposerSceneEdit): InvitationScene {
  if (!edit) return scene;

  const next: InvitationScene = {
    ...scene,
    enabled: edit.enabled,
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

export function applyComposerState(
  base: InvitationConfig,
  state: ComposerState
): InvitationConfig {
  const config = cloneConfig(base);
  const baseById = new Map(base.scenes.map((s) => [s.id, s]));
  const baseByType = new Map<SceneType, InvitationScene>();
  for (const s of base.scenes) {
    if (!baseByType.has(s.type)) baseByType.set(s.type, s);
  }

  config.theme = {
    ...config.theme,
    primaryColor: state.themeEdit.primaryColor,
    secondaryColor: state.themeEdit.secondaryColor,
    backgroundColor: state.themeEdit.backgroundColor,
    textColor: state.themeEdit.textColor,
    mutedTextColor: state.themeEdit.mutedTextColor,
    accentColor: state.themeEdit.accentColor,
    fontHeading: state.themeEdit.fontHeading,
    fontBody: state.themeEdit.fontBody,
    typography: { ...config.theme.typography, ...state.themeEdit.typography },
    design: { ...config.theme.design, ...state.themeEdit.design },
  };

  config.scenes = state.journey.instances.map((inst) => {
    let scene =
      baseById.get(inst.id) ??
      (() => {
        const template = baseByType.get(inst.type);
        if (template) {
          const cloned = JSON.parse(JSON.stringify(template)) as InvitationScene;
          cloned.id = inst.id;
          return cloned;
        }
        return createDefaultScene(inst);
      })();

    scene = {
      ...scene,
      id: inst.id,
      type: inst.type,
      enabled: inst.enabled,
      required: inst.required,
    };

    return applySceneEdit(scene, state.sceneEdits[inst.id]);
  });

  return config;
}

/** @deprecated Use applyComposerState */
export function applyComposerEdits(
  base: InvitationConfig,
  edits: ComposerSceneEdits,
  themeEdit?: ComposerThemeEdit,
  journey?: ComposerJourney
): InvitationConfig {
  return applyComposerState(base, {
    journey: journey ?? initJourneyFromConfig(base),
    sceneEdits: edits,
    themeEdit: themeEdit ?? initThemeFromConfig(base),
  });
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

function visualPresetFromScene(scene: InvitationScene): DesignPresetScene {
  return {
    variant: scene.variant,
    design: scene.design,
    media: scene.media,
    background: scene.background,
    overlay: scene.overlay,
    foreground: scene.foreground,
    motion: scene.motion,
  };
}

function diffVisualPreset(
  base: InvitationScene | undefined,
  current: InvitationScene
): DesignPresetScene | undefined {
  if (!base) return visualPresetFromScene(current);
  const diff: DesignPresetScene = {};
  if (base.variant !== current.variant) diff.variant = current.variant;
  const designDiff = shallowDiff(
    base.design as Record<string, unknown> | undefined,
    current.design as Record<string, unknown> | undefined
  );
  if (designDiff) diff.design = designDiff as SceneDesign;
  const baseMedia = base.media ? syncMediaLiveText(base.media) : undefined;
  const curMedia = current.media ? syncMediaLiveText(current.media) : undefined;
  if (JSON.stringify(baseMedia) !== JSON.stringify(curMedia) && curMedia) {
    diff.media = curMedia;
  }
  if (JSON.stringify(base.background) !== JSON.stringify(current.background)) {
    diff.background = current.background;
  }
  if (JSON.stringify(base.overlay) !== JSON.stringify(current.overlay)) {
    diff.overlay = current.overlay;
  }
  if (JSON.stringify(base.foreground) !== JSON.stringify(current.foreground)) {
    diff.foreground = current.foreground;
  }
  return Object.keys(diff).length > 0 ? diff : undefined;
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

export function buildSeparatedExports(
  base: InvitationConfig,
  state: ComposerState
): SeparatedExports {
  const resolved = applyComposerState(base, state);
  const baseById = new Map(base.scenes.map((s) => [s.id, s]));
  const journeyIds = new Set(state.journey.instances.map((i) => i.id));

  const blueprint: SequenceBlueprint = {
    id: `${base.slug}-blueprint`,
    label: `Blueprint — ${base.slug}`,
    version: "1.0.0",
    layout: base.layout,
    scenes: state.journey.instances.map((inst) => ({
      id: inst.id,
      type: inst.type,
      label: inst.label,
      enabledByDefault: inst.enabled,
      required: inst.required,
    })),
  };

  const typeDefaults: Partial<Record<SceneType, DesignPresetScene>> = {};
  const presetSceneOverrides: Record<string, DesignPresetScene> = {};
  const typesWithDefault = new Set<SceneType>();

  for (const inst of state.journey.instances) {
    const resolvedScene = resolved.scenes.find((s) => s.id === inst.id);
    if (!resolvedScene) continue;
    const visual = visualPresetFromScene(resolvedScene);

    if (!typesWithDefault.has(inst.type)) {
      typeDefaults[inst.type] = visual;
      typesWithDefault.add(inst.type);
    } else if (JSON.stringify(typeDefaults[inst.type]) !== JSON.stringify(visual)) {
      presetSceneOverrides[inst.id] = visual;
    }
  }

  for (const inst of state.journey.instances) {
    const resolvedScene = resolved.scenes.find((s) => s.id === inst.id);
    const baseScene = baseById.get(inst.id);
    if (!resolvedScene) continue;
    const diff = diffVisualPreset(baseScene, resolvedScene);
    if (diff) {
      presetSceneOverrides[inst.id] = {
        ...presetSceneOverrides[inst.id],
        ...diff,
      };
    }
  }

  const preset: Partial<DesignPreset> = {
    id: `${base.slug}-preset`,
    label: `Preset — ${base.slug}`,
    version: "1.0.0",
    theme: resolved.theme,
    typeDefaults: Object.keys(typeDefaults).length > 0 ? typeDefaults : undefined,
    sceneOverrides:
      Object.keys(presetSceneOverrides).length > 0 ? presetSceneOverrides : undefined,
  };

  const dataSceneOverrides: Record<string, SceneInstanceOverride> = {};
  for (const inst of state.journey.instances) {
    const resolvedScene = resolved.scenes.find((s) => s.id === inst.id);
    const baseScene = baseById.get(inst.id);
    if (!resolvedScene) continue;

    const override: SceneInstanceOverride = {};
    let has = false;

    const baseEnabled = baseScene?.enabled !== false;
    if (inst.enabled !== baseEnabled) {
      override.enabled = inst.enabled;
      has = true;
    }

    const contentDiff = shallowDiff(
      baseScene?.content as Record<string, unknown> | undefined,
      Object.keys(resolvedScene.content ?? {}).length
        ? (resolvedScene.content as Record<string, unknown>)
        : undefined
    );
    if (contentDiff && Object.keys(contentDiff).length > 0) {
      override.content = contentDiff;
      has = true;
    }

    if (has) dataSceneOverrides[inst.id] = override;
  }

  for (const baseScene of base.scenes) {
    if (!journeyIds.has(baseScene.id)) {
      dataSceneOverrides[baseScene.id] = { enabled: false };
    }
  }

  const invitationData: Partial<InvitationData> = {
    id: base.id,
    slug: base.slug,
    eventId: base.eventId,
    sequenceId: `${base.slug}-blueprint`,
    language: base.language,
    direction: base.direction,
    music: base.music,
    rsvp: base.rsvp,
    sceneOverrides:
      Object.keys(dataSceneOverrides).length > 0 ? dataSceneOverrides : undefined,
    themeOverrides: buildThemeOverrides(base, state.themeEdit),
  };

  return { blueprint, preset, invitationData, resolvedConfig: resolved };
}

/** @deprecated Use buildSeparatedExports */
export type ComposerExport = {
  themeOverrides?: Partial<InvitationTheme>;
  sceneOverrides?: Record<string, SceneInstanceOverride>;
};

export function buildExportPayload(
  base: InvitationConfig,
  edits: ComposerSceneEdits,
  themeEdit: ComposerThemeEdit,
  journey?: ComposerJourney
): ComposerExport {
  const separated = buildSeparatedExports(base, {
    journey: journey ?? initJourneyFromConfig(base),
    sceneEdits: edits,
    themeEdit,
  });
  const payload: ComposerExport = {};
  if (separated.invitationData.themeOverrides) {
    payload.themeOverrides = separated.invitationData.themeOverrides;
  }
  if (separated.invitationData.sceneOverrides) {
    payload.sceneOverrides = separated.invitationData.sceneOverrides;
  }
  return payload;
}

export function exportJsonString(value: unknown): string {
  return JSON.stringify(JSON.parse(JSON.stringify(value)), null, 2);
}

export function exportBlueprintSnippet(blueprint: SequenceBlueprint): string {
  return [
    "// SequenceBlueprint — paste into data/blueprints/*.blueprint.ts",
    `export const blueprint = ${exportJsonString(blueprint)};`,
  ].join("\n");
}

export function exportPresetSnippet(preset: Partial<DesignPreset>): string {
  return [
    "// DesignPreset — paste into data/presets/*.preset.ts",
    `export const preset = ${exportJsonString(preset)};`,
  ].join("\n");
}

export function exportInvitationDataSnippet(
  slug: ComposerDemoSlug,
  data: Partial<InvitationData>
): string {
  return [
    "// InvitationData — paste into data/invitations/*.ts",
    `// Demo slug: ${slug}`,
    `export const invitationData = ${exportJsonString(data)};`,
    "",
    `// Asset folder: ${getAssetPublicPrefix(slug)}`,
  ].join("\n");
}

export function exportResolvedConfigSnippet(config: InvitationConfig): string {
  return [
    "// Resolved InvitationConfig snapshot — safe for published invitations",
    `export const configSnapshot = ${exportJsonString(config)};`,
  ].join("\n");
}

export function duplicateSceneEdits(
  edits: ComposerSceneEdits,
  sourceId: string,
  newId: string
): ComposerSceneEdits {
  const source = edits[sourceId];
  if (!source) return edits;
  return {
    ...edits,
    [newId]: JSON.parse(JSON.stringify(source)) as ComposerSceneEdit,
  };
}

export function renameSceneEditKey(
  edits: ComposerSceneEdits,
  oldId: string,
  newId: string
): ComposerSceneEdits {
  if (oldId === newId || !edits[oldId]) return edits;
  const next = { ...edits };
  next[newId] = next[oldId];
  delete next[oldId];
  return next;
}

export function createDefaultSceneEdit(type: SceneType): ComposerSceneEdit {
  return {
    compositionMode: "web_layout",
    variant: SCENE_VARIANTS[type][0] ?? "minimal_tap",
    design: {},
    content: {},
    enabled: true,
  };
}
