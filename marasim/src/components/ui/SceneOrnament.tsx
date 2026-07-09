"use client";

/**
 * SceneOrnament — configurable ornamental divider.
 *
 * Replaces the hardcoded OrnamentDivider in scene components.
 * Reads dividerStyle from the resolved design token and renders accordingly.
 *
 * dividerStyle:
 *   "diamond"      → gold line ◆ gold line (original OrnamentDivider look)
 *   "line"         → single gold line, full width or fixed width
 *   "floral_asset" → <img> from ornamentAsset path
 *   "none"         → renders nothing
 */

interface SceneOrnamentProps {
  dividerStyle: "diamond" | "line" | "floral_asset" | "none";
  ornamentAsset?: string;
  width?: number;
  opacity?: number;
  className?: string;
  lineWidth?: string;
}

export default function SceneOrnament({
  dividerStyle,
  ornamentAsset,
  width = 14,
  opacity = 0.45,
  className = "",
  lineWidth = "60px",
}: SceneOrnamentProps) {
  if (dividerStyle === "none") return null;

  if (dividerStyle === "floral_asset") {
    if (!ornamentAsset) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ornamentAsset}
        alt=""
        aria-hidden="true"
        className={className}
        style={{ opacity, maxWidth: "100%", height: "auto", display: "block" }}
      />
    );
  }

  if (dividerStyle === "line") {
    return (
      <div className={`flex items-center ${className}`} style={{ width: lineWidth }}>
        <div
          className="h-px w-full"
          style={{ background: "var(--inv-primary)", opacity }}
        />
      </div>
    );
  }

  // diamond (default)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="h-px"
        style={{ width, background: "var(--inv-primary)", opacity }}
      />
      <svg
        width="7"
        height="7"
        viewBox="0 0 7 7"
        aria-hidden="true"
        style={{ color: "var(--inv-primary)", opacity: opacity + 0.1, flexShrink: 0 }}
      >
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="currentColor"
        />
      </svg>
      <div
        className="h-px"
        style={{ width, background: "var(--inv-primary)", opacity }}
      />
    </div>
  );
}
