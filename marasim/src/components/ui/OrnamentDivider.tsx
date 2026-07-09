/**
 * OrnamentDivider — reusable gold ornamental line used across scenes.
 * Reads CSS vars from the parent invitation wrapper.
 */
interface OrnamentDividerProps {
  className?: string;
  width?: number;
  opacity?: number;
}

export default function OrnamentDivider({
  className = "",
  width = 14,
  opacity = 0.45,
}: OrnamentDividerProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="h-px"
        style={{
          width,
          background: "var(--inv-primary)",
          opacity,
        }}
      />
      {/* Inline diamond SVG — no external assets, no emoji */}
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
        style={{
          width,
          background: "var(--inv-primary)",
          opacity,
        }}
      />
    </div>
  );
}
