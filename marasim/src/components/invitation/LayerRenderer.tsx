"use client";

import { CSSProperties } from "react";
import { Layer } from "@/types/invitation";

interface LayerRendererProps {
  layer: Layer;
  className?: string;
}

/**
 * Returns the absolute-positioning CSS for a given position value.
 * For "full" this is a complete inset fill.
 * For "top" / "bottom" / "center" the element is left at natural height
 * (or the explicitly provided height) so ornament images don't get stretched.
 */
function getPositionStyle(position?: Layer["position"]): CSSProperties {
  switch (position) {
    case "top":
      return { position: "absolute", top: 0, left: 0, right: 0 };
    case "bottom":
      return { position: "absolute", bottom: 0, left: 0, right: 0 };
    case "center":
      return {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };
    case "full":
    default:
      return { position: "absolute", inset: 0 };
  }
}

/** Whether this position targets a partial (non-full) area of the scene. */
function isPartialPosition(position?: Layer["position"]) {
  return position === "top" || position === "bottom" || position === "center";
}

/**
 * LayerRenderer — renders a single Layer (background, overlay, foreground ornament).
 *
 * Supported types:
 *  - color     → solid CSS color
 *  - gradient  → CSS gradient string
 *  - image     → <img> with cover/contain fit; auto-height for ornaments
 *  - video     → muted loop autoplay background/overlay
 *  - lottie    → stub (Phase 3+)
 *
 * position:
 *  - full   (default) → absolute inset-0, covers whole scene
 *  - top            → anchored to scene top, natural / explicit height
 *  - bottom         → anchored to scene bottom, natural / explicit height
 *  - center         → centred with transform, natural / explicit size
 *
 * opacity:  0–1, defaults to 1
 * height:   explicit CSS height for partial ornaments (default "auto")
 */
export default function LayerRenderer({ layer, className = "" }: LayerRendererProps) {
  const positionStyle = getPositionStyle(layer.position);
  const opacity = layer.opacity ?? 1;
  const partial = isPartialPosition(layer.position);

  if (layer.type === "color") {
    return (
      <div
        aria-hidden
        className={className}
        style={{ ...positionStyle, backgroundColor: layer.value, opacity }}
      />
    );
  }

  if (layer.type === "gradient") {
    return (
      <div
        aria-hidden
        className={className}
        style={{ ...positionStyle, background: layer.value, opacity }}
      />
    );
  }

  if (layer.type === "image" && layer.src) {
    if (partial) {
      // Ornament / decorative image — keep natural aspect ratio
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={layer.src}
          alt=""
          aria-hidden
          className={className}
          style={{
            ...positionStyle,
            width: "100%",
            height: layer.height ?? "auto",
            maxWidth: "100%",
            display: "block",
            opacity,
          }}
        />
      );
    }

    // Full-bleed background / cover image
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={layer.src}
        alt=""
        aria-hidden
        className={className}
        style={{
          ...positionStyle,
          width: "100%",
          height: "100%",
          objectFit: layer.fit ?? "cover",
          objectPosition:
            layer.position === "top"
              ? "top"
              : layer.position === "bottom"
                ? "bottom"
                : "center",
          opacity,
        }}
      />
    );
  }

  if (layer.type === "video" && layer.src) {
    return (
      <video
        src={layer.src}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className={className}
        style={{
          ...positionStyle,
          width: "100%",
          height: partial ? (layer.height ?? "auto") : "100%",
          objectFit: partial ? undefined : (layer.fit ?? "cover"),
          opacity,
        }}
      />
    );
  }

  // layer.type === "lottie" — Phase 3+
  return null;
}
