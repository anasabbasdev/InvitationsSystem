import type { DesignPreset, DesignPresetScene, SceneType } from "@/types/invitation";

/** Resolve typeDefaults with backward compat for legacy `scenes` field */
export function getPresetTypeDefaults(
  preset: DesignPreset
): Partial<Record<SceneType, DesignPresetScene>> {
  return preset.typeDefaults ?? preset.scenes ?? {};
}

/** Per-sceneId preset override, if any */
export function getPresetSceneOverride(
  preset: DesignPreset,
  sceneId: string
): DesignPresetScene | undefined {
  return preset.sceneOverrides?.[sceneId];
}
