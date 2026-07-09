import React from "react";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import { isAssetDriven } from "@/lib/scene-media";
import MediaSceneRenderer from "@/components/invitation/MediaSceneRenderer";

/**
 * If scene uses asset-driven composition, return MediaSceneRenderer.
 * Otherwise return null and the scene falls through to web_layout.
 */
export function renderMediaSceneIfNeeded(
  scene: InvitationScene,
  config: InvitationConfig,
  onReveal?: () => void
): React.ReactElement | null {
  if (!isAssetDriven(scene.media)) return null;
  return (
    <MediaSceneRenderer scene={scene} config={config} onReveal={onReveal} />
  );
}
