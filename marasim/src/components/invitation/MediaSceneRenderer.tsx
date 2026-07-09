"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  InvitationConfig,
  InvitationScene,
  MediaAsset,
  SceneMediaConfig,
} from "@/types/invitation";
import SceneFrame from "./SceneFrame";
import { buildLiveTextLines } from "@/lib/scene-media";
import { getButtonStyles, resolveFont, resolveDesign } from "@/lib/scene-design";
import { resolveFontFamily } from "@/lib/theme-vars";
import { LAYER_Z_DEFAULTS } from "@/lib/composer/visual-identity";

interface MediaSceneRendererProps {
  scene: InvitationScene;
  config: InvitationConfig;
  /** Called when opening gate should unlock scroll (video end / tap). */
  onReveal?: () => void;
}

// ─── Single asset layer (image or video) ─────────────────────────────────────

function MediaAssetLayer({
  asset,
  className = "",
  style,
  videoRef,
  autoPlay = false,
  onEnded,
  onError,
}: {
  asset: MediaAsset;
  className?: string;
  style?: React.CSSProperties;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  autoPlay?: boolean;
  onEnded?: () => void;
  onError?: () => void;
}) {
  const fit = asset.fit ?? "cover";
  const common: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: fit,
    display: "block",
    ...style,
  };

  if (asset.type === "video") {
    return (
      <video
        ref={videoRef}
        src={asset.src}
        poster={asset.poster}
        className={className}
        style={common}
        muted={asset.muted ?? true}
        loop={asset.loop ?? false}
        playsInline={asset.playsInline ?? true}
        preload={asset.preload ?? "metadata"}
        autoPlay={autoPlay}
        onEnded={onEnded}
        onError={onError}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt=""
      aria-hidden={!asset.poster}
      className={className}
      style={common}
      onError={onError}
    />
  );
}

// ─── Gradient placeholder when asset file is missing ─────────────────────────

function MediaPlaceholder({ label, theme }: { label?: string; theme: InvitationConfig["theme"] }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-3"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 45%, rgba(var(--inv-primary-rgb),0.12) 0%, ${theme.backgroundColor} 70%)`,
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" style={{ opacity: 0.25, color: theme.primaryColor }}>
        <rect x="4" y="8" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 18l4 4 6-6 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {label && (
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: theme.primaryColor,
            opacity: 0.35,
            fontFamily: "var(--inv-font-body)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Live text overlay ─────────────────────────────────────────────────────────

function resolveLiveTextConfig(media: SceneMediaConfig) {
  const lt = media.liveText ?? {};
  return {
    enabled: lt.enabled ?? media.liveTextEnabled ?? false,
    placement: lt.placement ?? media.liveTextPlacement ?? "center",
    style: lt.style ?? media.liveTextStyle ?? "classic",
    color: lt.color,
    emphasisColor: lt.emphasisColor,
    font: lt.font,
    size: lt.size,
    emphasisSize: lt.emphasisSize,
    align: lt.align ?? "center",
    maxWidth: lt.maxWidth,
    textShadow: lt.textShadow,
    panelEnabled: lt.panelEnabled ?? false,
    panelColor: lt.panelColor ?? "rgba(0,0,0,0.45)",
    panelOpacity: lt.panelOpacity ?? 0.65,
  };
}

function LiveTextOverlay({
  scene,
  config,
  media,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
  media: SceneMediaConfig;
}) {
  const lt = resolveLiveTextConfig(media);
  if (!lt.enabled || lt.style === "hidden") return null;

  const lines = buildLiveTextLines(scene);
  if (lines.length === 0) return null;

  const d = resolveDesign(config, scene);
  const sceneTypo = scene.design?.typography;
  const themeTypo = config.theme.typography;

  const positionStyle: React.CSSProperties =
    lt.placement === "top"
      ? { top: "12%", left: 0, right: 0 }
      : lt.placement === "bottom"
        ? { bottom: "14%", left: 0, right: 0 }
        : lt.placement === "overlay"
          ? { inset: 0, justifyContent: "center" }
          : { top: "50%", left: 0, right: 0, transform: "translateY(-50%)" };

  const fontHeading = lt.font
    ? resolveFontFamily(lt.font)
    : resolveFont({ typographyStyle: lt.style ?? d.typographyStyle }, "heading", sceneTypo ?? themeTypo);
  const fontBody = resolveFont({ typographyStyle: lt.style ?? d.typographyStyle }, "body", sceneTypo ?? themeTypo);

  return (
    <div
      className="absolute z-20 flex flex-col items-center gap-3 px-8 pointer-events-none"
      style={{
        ...positionStyle,
        textAlign: lt.align,
        maxWidth: lt.maxWidth ?? "100%",
        margin: "0 auto",
      }}
    >
      {lt.panelEnabled && (
        <div
          className="absolute inset-0 -z-10 rounded-lg"
          style={{
            backgroundColor: lt.panelColor,
            opacity: lt.panelOpacity,
          }}
          aria-hidden
        />
      )}
      {lines.map((line) => (
        <p
          key={line.key}
          style={{
            fontFamily: line.emphasis ? fontHeading : fontBody,
            fontSize: line.emphasis
              ? lt.emphasisSize ?? "var(--inv-heading-size)"
              : lt.size ?? "var(--inv-body-size)",
            color: line.emphasis
              ? lt.emphasisColor ?? "var(--inv-primary)"
              : lt.color ?? "var(--inv-text)",
            opacity: line.emphasis ? 1 : 0.85,
            lineHeight: "var(--inv-line-height)",
            letterSpacing: "var(--inv-letter-spacing)",
            textShadow: lt.textShadow ?? (line.emphasis ? "0 2px 24px rgba(0,0,0,0.5)" : "0 1px 12px rgba(0,0,0,0.4)"),
            margin: 0,
            width: "100%",
          }}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}

// ─── Position helper for layered assets ──────────────────────────────────────

function layerPositionStyle(asset: MediaAsset): React.CSSProperties {
  const position = asset.position ?? "full";
  let style: React.CSSProperties;

  switch (position) {
    case "top":
      style = { position: "absolute", top: 0, left: 0, right: 0, height: "auto", maxHeight: "45%" };
      break;
    case "bottom":
      style = { position: "absolute", bottom: 0, left: 0, right: 0, height: "auto", maxHeight: "45%" };
      break;
    case "center":
      style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "85%",
        height: "auto",
        maxHeight: "70%",
      };
      break;
    default:
      style = { position: "absolute", inset: 0 };
  }

  if (asset.height) {
    style = { ...style, height: asset.height, maxHeight: asset.height };
  }

  return style;
}

// ─── Main renderer ─────────────────────────────────────────────────────────────

export default function MediaSceneRenderer({
  scene,
  config,
  onReveal,
}: MediaSceneRendererProps) {
  const media = scene.media!;
  const { theme } = config;
  const d = resolveDesign(config, scene);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set());
  const [showStartButton, setShowStartButton] = useState(
    media.startBehavior === "center_button"
  );
  const [hasStarted, setHasStarted] = useState(media.startBehavior === "none");
  const [hasRevealed, setHasRevealed] = useState(media.revealAfter === "immediate");

  const isOpening = scene.type === "opening";
  const primaryAsset = media.mainMedia ?? media.background;
  const startText =
    media.startButtonText ??
    (scene.content?.tapText as string | undefined) ??
    "افتح الدعوة";

  const triggerReveal = useCallback(() => {
    if (hasRevealed) return;
    setHasRevealed(true);
    onReveal?.();
  }, [hasRevealed, onReveal]);

  const handleStart = useCallback(async () => {
    setHasStarted(true);
    setShowStartButton(false);

    const video = videoRef.current;
    if (video && primaryAsset?.type === "video") {
      try {
        await video.play();
      } catch {
        // Autoplay blocked — user can tap again if revealAfter is tap
      }
    }

    if (media.revealAfter === "immediate") {
      triggerReveal();
    } else if (media.revealAfter === "tap" && primaryAsset?.type !== "video") {
      triggerReveal();
    } else if (primaryAsset?.type === "image" && media.revealAfter === "media_end") {
      setTimeout(triggerReveal, media.minDurationMs ?? 600);
    }
  }, [media.revealAfter, media.minDurationMs, primaryAsset?.type, triggerReveal]);

  const handleMediaEnd = useCallback(() => {
    if (media.revealAfter === "media_end" || (isOpening && media.revealAfter !== "tap")) {
      const minMs = media.minDurationMs ?? 0;
      setTimeout(triggerReveal, minMs);
    }
  }, [media.revealAfter, media.minDurationMs, isOpening, triggerReveal]);

  // playBehavior: on_visible
  useEffect(() => {
    if (media.playBehavior !== "on_visible" || !hasStarted) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [media.playBehavior, hasStarted]);

  // maxDurationMs safety cap for opening
  useEffect(() => {
    if (!isOpening || !media.maxDurationMs || hasRevealed) return;
    const t = setTimeout(triggerReveal, media.maxDurationMs);
    return () => clearTimeout(t);
  }, [isOpening, media.maxDurationMs, hasRevealed, triggerReveal]);

  const btnStyle = getButtonStyles(d.buttonStyle, "var(--inv-button-color)", theme.backgroundColor);
  const tapAnywhere = media.startBehavior === "tap_anywhere" && !hasStarted;

  const renderAsset = (
    asset: MediaAsset | undefined,
    opts?: {
      autoPlay?: boolean;
      position?: MediaAsset["position"];
      label?: string;
      zIndex?: number;
    }
  ) => {
    if (!asset?.src?.trim() || failedSrcs.has(asset.src)) {
      return <MediaPlaceholder label={opts?.label} theme={theme} />;
    }
    const positioned = opts?.position ? { ...asset, position: opts.position } : asset;
    const pos = positioned.position ?? "full";
    const isFull = pos === "full";

    return (
      <div
        style={{
          ...layerPositionStyle(positioned),
          opacity: asset.opacity ?? 1,
          overflow: "hidden",
          zIndex: asset.zIndex ?? opts?.zIndex ?? 1,
          ...(isFull ? { inset: 0 } : {}),
        }}
      >
        <MediaAssetLayer
          asset={asset}
          videoRef={primaryAsset === asset ? videoRef : undefined}
          autoPlay={
            opts?.autoPlay ??
            (hasStarted && media.playBehavior !== "manual" && asset.type === "video")
          }
          onEnded={handleMediaEnd}
          onError={() => {
            setFailedSrcs((prev) => new Set(prev).add(asset.src));
            if (isOpening && media.revealAfter === "media_end" && primaryAsset === asset) {
              setTimeout(triggerReveal, media.minDurationMs ?? 600);
            }
          }}
        />
      </div>
    );
  };

  // ── full_media mode ────────────────────────────────────────────────────────
  if (media.compositionMode === "full_media") {
    return (
      <SceneFrame
        config={config}
        scene={scene}
        style={{ padding: 0, minHeight: isOpening ? "100dvh" : undefined }}
        className="inv-media-scene"
      >
        <div ref={sectionRef} className="absolute inset-0">
          {renderAsset(primaryAsset, {
            autoPlay: false,
            label: primaryAsset?.src.split("/").pop(),
          })}

          {media.overlay && renderAsset(media.overlay, { position: "full" })}

          <LiveTextOverlay scene={scene} config={config} media={media} />

          {showStartButton && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              <button
                type="button"
                onClick={handleStart}
                style={btnStyle}
              >
                {startText}
              </button>
            </div>
          )}

          {tapAnywhere && (
            <button
              type="button"
              aria-label={startText}
              className="absolute inset-0 z-30 cursor-pointer"
              style={{ background: "transparent", border: "none" }}
              onClick={handleStart}
            />
          )}

          {hasStarted &&
            media.revealAfter === "tap" &&
            primaryAsset?.type === "video" &&
            !hasRevealed &&
            !showStartButton && (
              <button
                type="button"
                className="absolute inset-x-0 bottom-10 z-30 mx-auto"
                style={{
                  ...btnStyle,
                  background: "transparent",
                  border: `1px solid ${theme.primaryColor}`,
                  color: theme.primaryColor,
                }}
                onClick={triggerReveal}
              >
                متابعة
              </button>
            )}
        </div>
      </SceneFrame>
    );
  }

  // ── layered_media mode ─────────────────────────────────────────────────────
  return (
      <SceneFrame config={config} scene={scene} style={{ padding: 0 }} className="inv-media-scene">
      <div ref={sectionRef} className="absolute inset-0">
        {media.background &&
          renderAsset(media.background, {
            label: "background",
            zIndex: media.background.zIndex ?? LAYER_Z_DEFAULTS.background,
          })}
        {!media.background && !media.mainMedia && (
          <MediaPlaceholder theme={theme} />
        )}

        {media.mainMedia &&
          renderAsset(media.mainMedia, {
            position: media.mainMedia.position ?? "full",
            zIndex: media.mainMedia.zIndex ?? LAYER_Z_DEFAULTS.mainMedia,
          })}

        {media.overlay &&
          renderAsset(media.overlay, {
            position: "full",
            zIndex: media.overlay.zIndex ?? LAYER_Z_DEFAULTS.overlay,
          })}

        {media.frame &&
          renderAsset(media.frame, {
            position: "full",
            zIndex: media.frame.zIndex ?? LAYER_Z_DEFAULTS.frame,
          })}

        {media.foreground
          ?.filter((fg) => fg.src?.trim())
          .map((fg, i) => (
            <React.Fragment key={i}>
              {renderAsset(fg, {
                position: fg.position ?? "bottom",
                zIndex: fg.zIndex ?? LAYER_Z_DEFAULTS.foreground + i,
              })}
            </React.Fragment>
          ))}

        <LiveTextOverlay scene={scene} config={config} media={media} />

        {showStartButton && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <button type="button" onClick={handleStart} style={btnStyle}>
              {startText}
            </button>
          </div>
        )}
      </div>
    </SceneFrame>
  );
}
