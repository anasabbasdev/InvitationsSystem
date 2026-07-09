import type { InvitationConfig, SceneType } from "@/types/invitation";
import { SCENE_LABELS, SCENE_VARIANTS } from "./constants";

export type ComposerSceneInstance = {
  id: string;
  type: SceneType;
  label: string;
  enabled: boolean;
  required: boolean;
};

export type ComposerJourney = {
  instances: ComposerSceneInstance[];
};

export function initJourneyFromConfig(config: InvitationConfig): ComposerJourney {
  return {
    instances: config.scenes.map((scene) => ({
      id: scene.id,
      type: scene.type,
      label: defaultLabelForType(scene.type),
      enabled: scene.enabled !== false,
      required: scene.required ?? false,
    })),
  };
}

export function generateSceneId(type: SceneType, existingIds: string[]): string {
  const base = type.replace(/_/g, "-");
  let n = 1;
  let id = `${base}-${n}`;
  while (existingIds.includes(id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  return id;
}

export function duplicateSceneId(sourceId: string, existingIds: string[]): string {
  let candidate = `${sourceId}-copy`;
  let n = 2;
  while (existingIds.includes(candidate)) {
    candidate = `${sourceId}-copy-${n}`;
    n += 1;
  }
  return candidate;
}

export function validateSceneId(
  id: string,
  existingIds: string[],
  excludeId?: string
): string | null {
  const trimmed = id.trim();
  if (!trimmed) return "Scene ID cannot be empty";
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(trimmed)) {
    return "Use letters, numbers, and hyphens only";
  }
  const others = excludeId
    ? existingIds.filter((x) => x !== excludeId)
    : existingIds;
  if (others.includes(trimmed)) return `ID "${trimmed}" is already in use`;
  return null;
}

export function defaultLabelForType(type: SceneType): string {
  return SCENE_LABELS[type] ?? type;
}

export function defaultVariantForType(type: SceneType): string {
  return SCENE_VARIANTS[type][0] ?? "minimal_tap";
}

export function createSceneInstance(
  type: SceneType,
  existingIds: string[],
  partial?: Partial<ComposerSceneInstance>
): ComposerSceneInstance {
  return {
    id: partial?.id ?? generateSceneId(type, existingIds),
    type,
    label: partial?.label ?? defaultLabelForType(type),
    enabled: partial?.enabled ?? true,
    required: partial?.required ?? false,
  };
}

export function moveInstance(
  instances: ComposerSceneInstance[],
  index: number,
  direction: "up" | "down"
): ComposerSceneInstance[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= instances.length) return instances;
  const next = [...instances];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removeInstance(
  instances: ComposerSceneInstance[],
  index: number
): ComposerSceneInstance[] {
  return instances.filter((_, i) => i !== index);
}

export function duplicateInstance(
  instances: ComposerSceneInstance[],
  index: number
): { instances: ComposerSceneInstance[]; newId: string } {
  const source = instances[index];
  const existingIds = instances.map((i) => i.id);
  const newId = duplicateSceneId(source.id, existingIds);
  const copy = createSceneInstance(source.type, [...existingIds, newId], {
    id: newId,
    label: `${source.label} (copy)`,
    enabled: source.enabled,
    required: false,
  });
  const next = [...instances];
  next.splice(index + 1, 0, copy);
  return { instances: next, newId };
}

export function updateInstanceId(
  instances: ComposerSceneInstance[],
  oldId: string,
  newId: string
): ComposerSceneInstance[] | { error: string } {
  const err = validateSceneId(
    newId,
    instances.map((i) => i.id),
    oldId
  );
  if (err) return { error: err };
  return instances.map((inst) =>
    inst.id === oldId ? { ...inst, id: newId.trim() } : inst
  );
}
