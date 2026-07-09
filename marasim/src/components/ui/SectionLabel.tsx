"use client";

import type { ResolvedDesign } from "@/lib/scene-design";

interface SectionLabelProps {
  text: string;
  d: Pick<ResolvedDesign, "sectionLabelStyle">;
  className?: string;
}

/**
 * SectionLabel — renders the small label above scene content.
 * Respects the sectionLabelStyle design token:
 *   "badge"  → bordered pill (uppercase)
 *   "plain"  → plain uppercase text
 *   "hidden" → renders nothing
 */
export default function SectionLabel({ text, d, className = "" }: SectionLabelProps) {
  if (d.sectionLabelStyle === "hidden") return null;

  if (d.sectionLabelStyle === "badge") {
    return (
      <div
        className={className}
        style={{
          display: "inline-block",
          border: "1px solid rgba(var(--inv-primary-rgb),0.35)",
          padding: "3px 14px",
          borderRadius: "100px",
          fontSize: "0.62rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: "var(--inv-primary)",
          fontFamily: "var(--inv-font-body)",
        }}
      >
        {text}
      </div>
    );
  }

  // plain (default)
  return (
    <p
      className={className}
      style={{
        fontSize: "0.7rem",
        letterSpacing: "0.45em",
        textTransform: "uppercase",
        color: "var(--inv-primary)",
        fontFamily: "var(--inv-font-body)",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}
