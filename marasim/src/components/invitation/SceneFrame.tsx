import { ReactNode, CSSProperties } from "react";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import { buildSceneCssVarOverrides } from "@/lib/theme-vars";

interface SceneFrameProps {
  config: InvitationConfig;
  /** When provided, per-scene color/typography CSS vars and overlay are applied */
  scene?: InvitationScene;
  children: ReactNode;
  className?: string;
  minHeight?: string;
  style?: CSSProperties;
}

/**
 * SceneFrame wraps every scene with consistent mobile layout:
 * - Full viewport height minimum
 * - Safe horizontal padding from config
 * - RTL/LTR direction from config
 * - Relative positioning for layer stacking
 * - Optional per-scene CSS variable overrides (Phase 2.9.2)
 */
export default function SceneFrame({
  config,
  scene,
  children,
  className = "",
  minHeight = "100dvh",
  style,
}: SceneFrameProps) {
  const { safePaddingX } = config.layout;
  const sceneColors = scene?.design?.colors;
  const sceneVars = buildSceneCssVarOverrides(scene?.design);

  return (
    <section
      className={`relative w-full flex flex-col overflow-hidden ${className}`}
      style={{
        minHeight,
        paddingLeft: safePaddingX,
        paddingRight: safePaddingX,
        direction: config.direction,
        backgroundColor: sceneColors?.backgroundColor,
        ...sceneVars,
        ...style,
      }}
    >
      {sceneColors?.overlayColor && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 4,
            backgroundColor: sceneColors.overlayColor,
            opacity: sceneColors.overlayOpacity ?? 0.45,
          }}
          aria-hidden
        />
      )}
      {children}
    </section>
  );
}
