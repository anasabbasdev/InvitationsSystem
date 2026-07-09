import type { InvitationScene, SceneMediaConfig } from "@/types/invitation";

/** True when the scene should use MediaSceneRenderer instead of web_layout variants. */
export function isAssetDriven(media?: SceneMediaConfig): boolean {
  return (
    media?.compositionMode === "full_media" ||
    media?.compositionMode === "layered_media"
  );
}

/** Merge partial media override onto base config. */
export function mergeSceneMedia(
  base?: SceneMediaConfig,
  override?: Partial<SceneMediaConfig>
): SceneMediaConfig | undefined {
  if (override?.compositionMode === "web_layout") return undefined;
  if (!base && !override) return undefined;
  if (!base) return override as SceneMediaConfig;
  if (!override) return base;
  return {
    ...base,
    ...override,
    foreground: override.foreground ?? base.foreground,
  };
}

/** Build live text lines from scene content for overlay rendering. */
export function buildLiveTextLines(
  scene: InvitationScene
): { key: string; text: string; emphasis?: boolean }[] {
  const c = scene.content ?? {};
  const lines: { key: string; text: string; emphasis?: boolean }[] = [];

  switch (scene.type) {
    case "opening":
      if (c.label) lines.push({ key: "label", text: String(c.label) });
      if (c.previewTitle) lines.push({ key: "previewTitle", text: String(c.previewTitle), emphasis: true });
      break;
    case "hero_names":
      if (c.primaryName) lines.push({ key: "primary", text: String(c.primaryName), emphasis: true });
      if (c.connector && c.secondaryName) {
        lines.push({ key: "connector", text: String(c.connector) });
        lines.push({ key: "secondary", text: String(c.secondaryName), emphasis: true });
      } else if (c.secondaryName) {
        lines.push({ key: "secondary", text: String(c.secondaryName), emphasis: true });
      }
      if (c.subtitle) lines.push({ key: "subtitle", text: String(c.subtitle) });
      break;
    case "invitation_message":
      if (c.header) lines.push({ key: "header", text: String(c.header) });
      if (c.title) lines.push({ key: "title", text: String(c.title), emphasis: true });
      if (c.body) lines.push({ key: "body", text: String(c.body) });
      break;
    case "gallery_media":
      if (c.label) lines.push({ key: "label", text: String(c.label) });
      break;
    case "ticket_confirmation":
      if (c.closingTitle || c.title) {
        lines.push({
          key: "closing",
          text: String(c.closingTitle ?? c.title),
          emphasis: true,
        });
      }
      if (c.body) lines.push({ key: "body", text: String(c.body) });
      break;
    default:
      if (c.title) lines.push({ key: "title", text: String(c.title), emphasis: true });
      if (c.body) lines.push({ key: "body", text: String(c.body) });
  }

  return lines;
}
