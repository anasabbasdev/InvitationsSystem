import {
  DesignPreset,
  DesignPresetScene,
  InvitationConfig,
  InvitationData,
  InvitationScene,
  InvitationSequence,
  SequenceBlueprint,
} from "@/types/invitation";
import { mergeSceneMedia } from "@/lib/scene-media";
import { getPresetSceneOverride, getPresetTypeDefaults } from "@/lib/preset-utils";

function mergeDesign(
  ...layers: (DesignPresetScene | undefined)[]
): DesignPresetScene | undefined {
  const merged: DesignPresetScene = {};
  for (const layer of layers) {
    if (!layer) continue;
    if (layer.variant) merged.variant = layer.variant;
    if (layer.design) merged.design = { ...merged.design, ...layer.design };
    if (layer.media) merged.media = mergeSceneMedia(merged.media, layer.media) as DesignPresetScene["media"];
    if (layer.background) merged.background = layer.background;
    if (layer.overlay) merged.overlay = layer.overlay;
    if (layer.foreground) merged.foreground = layer.foreground;
    if (layer.defaultContent) merged.defaultContent = { ...merged.defaultContent, ...layer.defaultContent };
    if (layer.motion) merged.motion = layer.motion;
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * buildInvitationConfig (V1) — merges a sequence (design+journey combined) with
 * invitation data (content) into a final InvitationConfig.
 *
 * @deprecated For new invitations, prefer buildInvitationConfigV2.
 */
export function buildInvitationConfig(
  data: InvitationData,
  sequence: InvitationSequence
): InvitationConfig {
  return {
    id: data.id,
    eventId: data.eventId,
    slug: data.slug,
    language: data.language,
    direction: data.direction,
    theme: { ...sequence.theme, ...data.themeOverrides },
    layout: sequence.layout,
    music: data.music,
    rsvp: data.rsvp,
    scenes: sequence.scenes.map((sceneDef, index): InvitationScene => {
      const sceneId =
        sceneDef.id ?? `${sceneDef.sceneType}-${String(index + 1).padStart(2, "0")}`;

      const idOverride = data.sceneOverrides?.[sceneId];

      const assetOverride =
        idOverride?.assetOverrides ?? data.assetOverrides?.[sceneDef.sceneType];
      const designOverride =
        idOverride?.design ?? data.designOverrides?.[sceneDef.sceneType];
      const variantOverride =
        idOverride?.variant ?? data.variantOverrides?.[sceneDef.sceneType];
      const mediaOverride =
        idOverride?.media ?? data.mediaOverrides?.[sceneDef.sceneType];
      const contentOverride =
        idOverride?.content ?? data.content[sceneDef.sceneType];

      const rsvpDisabled =
        sceneDef.sceneType === "rsvp" && !data.rsvp.enabled;
      const enabled =
        idOverride?.enabled ??
        (rsvpDisabled ? false : (sceneDef.enabledByDefault ?? true));

      return {
        id: sceneId,
        type: sceneDef.sceneType,
        enabled,
        required: sceneDef.required ?? false,
        variant: variantOverride ?? sceneDef.variant,
        background: assetOverride?.background ?? sceneDef.background,
        overlay: assetOverride?.overlay ?? sceneDef.overlay,
        foreground: assetOverride?.foreground ?? sceneDef.foreground,
        content: {
          ...sceneDef.defaultContent,
          ...contentOverride,
        },
        motion: sceneDef.motion,
        design: designOverride
          ? { ...sceneDef.design, ...designOverride }
          : sceneDef.design,
        media: mergeSceneMedia(sceneDef.media, mediaOverride),
      };
    }),
  };
}

/**
 * buildInvitationConfigV2 — three-layer merge:
 *
 *   SequenceBlueprint  → journey (ids, order, enabledByDefault, required)
 *   DesignPreset       → typeDefaults[sceneType] + sceneOverrides[sceneId]
 *   InvitationData     → sceneOverrides[sceneId] + legacy type-keyed overrides
 *
 * Merge priority (highest → lowest):
 *   1. Blueprint entry (id, type, enabledByDefault, required)
 *   2. DesignPreset.typeDefaults[sceneType]
 *   3. DesignPreset.sceneOverrides[sceneId]
 *   4. InvitationData.sceneOverrides[sceneId]
 *   5. InvitationData legacy *Overrides[sceneType]
 *   6. data.themeOverrides → preset.theme
 */
export function buildInvitationConfigV2(
  blueprint: SequenceBlueprint,
  preset: DesignPreset,
  data: InvitationData
): InvitationConfig {
  const theme = { ...preset.theme, ...data.themeOverrides };
  const typeDefaults = getPresetTypeDefaults(preset);

  const scenes: InvitationScene[] = blueprint.scenes.map(
    (entry): InvitationScene => {
      const presetTypeDefault = typeDefaults[entry.type];
      const presetIdOverride = getPresetSceneOverride(preset, entry.id);
      const presetMerged = mergeDesign(presetTypeDefault, presetIdOverride);

      const dataIdOverride = data.sceneOverrides?.[entry.id];

      const legacyAsset = data.assetOverrides?.[entry.type];
      const legacyDesign = data.designOverrides?.[entry.type];
      const legacyVariant = data.variantOverrides?.[entry.type];
      const legacyMedia = data.mediaOverrides?.[entry.type];
      const legacyContent = data.content?.[entry.type];

      const assetSource =
        dataIdOverride?.assetOverrides ?? legacyAsset;

      const mergedDesign = {
        ...(presetMerged?.design ?? {}),
        ...(legacyDesign ?? {}),
        ...(dataIdOverride?.design ?? {}),
      };

      const mergedContent = {
        ...(presetMerged?.defaultContent ?? {}),
        ...(legacyContent ?? {}),
        ...(dataIdOverride?.content ?? {}),
      };

      const mergedMedia = mergeSceneMedia(
        mergeSceneMedia(presetMerged?.media, legacyMedia),
        dataIdOverride?.media
      );

      const variant =
        dataIdOverride?.variant ??
        legacyVariant ??
        presetMerged?.variant ??
        "minimal_tap";

      const rsvpDisabled = entry.type === "rsvp" && !data.rsvp.enabled;
      const enabled =
        dataIdOverride?.enabled ??
        (rsvpDisabled ? false : (entry.enabledByDefault ?? true));

      return {
        id: entry.id,
        type: entry.type,
        enabled,
        required: entry.required ?? false,
        variant,
        background: assetSource?.background ?? presetMerged?.background,
        overlay: assetSource?.overlay ?? presetMerged?.overlay,
        foreground: assetSource?.foreground ?? presetMerged?.foreground,
        content: mergedContent,
        motion: presetMerged?.motion,
        design: Object.keys(mergedDesign).length > 0 ? mergedDesign : undefined,
        media: mergedMedia,
      };
    }
  );

  return {
    id: data.id,
    eventId: data.eventId,
    slug: data.slug,
    language: data.language,
    direction: data.direction,
    theme,
    layout: blueprint.layout,
    music: data.music,
    rsvp: data.rsvp,
    scenes,
    blueprintRef: blueprint.version
      ? { id: blueprint.id, version: blueprint.version }
      : undefined,
    presetRef: preset.version
      ? { id: preset.id, version: preset.version }
      : undefined,
    dataRef: { id: data.id },
  };
}

/** Create an immutable published snapshot from a resolved config */
export function createPublishedSnapshot(config: InvitationConfig): InvitationConfig {
  const snapshot = JSON.parse(JSON.stringify(config)) as InvitationConfig;
  snapshot.snapshotAt = new Date().toISOString();
  return snapshot;
}
