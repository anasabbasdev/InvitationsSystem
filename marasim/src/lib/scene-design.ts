import type { CSSProperties } from "react";
import type { DesignTokens, InvitationConfig, InvitationScene, SceneDesign } from "@/types/invitation";

// ─── Defaults ─────────────────────────────────────────────────────────────────

/** Hard fallback defaults when no theme or scene design is specified. */
export const DESIGN_DEFAULTS: Required<DesignTokens> = {
  cardStyle: "framed",
  buttonStyle: "pill",
  dividerStyle: "diamond",
  iconStyle: "line",
  typographyStyle: "classic",
  cornerStyle: "ornate",
  sectionLabelStyle: "plain",
  density: "balanced",
};

// ─── Resolved Design type ─────────────────────────────────────────────────────

export type ResolvedDesign = Required<DesignTokens> &
  Pick<SceneDesign, "layout" | "textPlacement" | "mediaTreatment" | "ornamentAsset" | "iconAssets">;

// ─── Core resolve function ────────────────────────────────────────────────────

/**
 * Merges (lowest → highest priority):
 *   DESIGN_DEFAULTS  →  config.theme.design  →  scene.design
 */
export function resolveDesign(config: InvitationConfig, scene: InvitationScene): ResolvedDesign {
  return {
    ...DESIGN_DEFAULTS,
    ...config.theme.design,
    ...scene.design,
  } as ResolvedDesign;
}

// ─── Density helpers ──────────────────────────────────────────────────────────

export function densityPy(density: Required<DesignTokens>["density"]): string {
  return { airy: "8rem", balanced: "6rem", compact: "4rem" }[density] ?? "6rem";
}

export function densityGap(density: Required<DesignTokens>["density"]): string {
  return { airy: "3.5rem", balanced: "2.5rem", compact: "1.5rem" }[density] ?? "2.5rem";
}

// ─── RGB helper ───────────────────────────────────────────────────────────────

/**
 * Convert #RRGGBB to "r,g,b" for use in rgba(var(...),alpha).
 * Only handles 6-digit hex. Returns "201,162,77" fallback on parse error.
 */
export function hexToRgbString(hex: string): string {
  const h = hex.replace(/^#/, "");
  if (h.length !== 6) return "201,162,77";
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

// ─── Card style helper ────────────────────────────────────────────────────────

export function getCardStyles(
  cardStyle: Required<DesignTokens>["cardStyle"],
  primaryRgb: string
): CSSProperties {
  switch (cardStyle) {
    case "minimal":
      return {};
    case "glass":
      return {
        backgroundColor: `rgba(${primaryRgb},0.025)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid rgba(${primaryRgb},0.12)`,
      };
    case "full_bleed":
      return { backgroundColor: "transparent", border: "none", padding: 0 };
    case "none":
      return { display: "none" };
    default: // framed
      return {
        backgroundColor: `rgba(${primaryRgb},0.04)`,
        border: `1px solid rgba(${primaryRgb},0.22)`,
      };
  }
}

// ─── Button style helper ──────────────────────────────────────────────────────

export function getButtonStyles(
  buttonStyle: Required<DesignTokens>["buttonStyle"],
  primary: string,
  bg: string
): CSSProperties {
  const base: CSSProperties = {
    fontFamily: "var(--inv-font-body)",
    fontSize: "0.88rem",
    letterSpacing: "0.08em",
    cursor: "pointer",
    border: "none",
    padding: "13px 36px",
    position: "relative",
    overflow: "hidden",
  };

  switch (buttonStyle) {
    case "square":
      return { ...base, borderRadius: "2px", backgroundColor: primary, color: bg };
    case "ghost":
      return {
        ...base,
        borderRadius: "100px",
        backgroundColor: "transparent",
        border: `1px solid ${primary}`,
        color: primary,
      };
    case "underline":
      return {
        fontFamily: "var(--inv-font-body)",
        fontSize: "0.88rem",
        letterSpacing: "0.06em",
        cursor: "pointer",
        border: "none",
        background: "transparent",
        borderBottom: `1px solid ${primary}`,
        color: primary,
        padding: "4px 0",
        borderRadius: "0",
      };
    case "none":
      return { display: "none" };
    default: // pill
      return {
        ...base,
        borderRadius: "100px",
        backgroundColor: primary,
        color: bg,
      };
  }
}

// ─── Typography helper ────────────────────────────────────────────────────────

/**
 * Returns the CSS font-family value for a given role,
 * adjusted by the sequence's typographyStyle token and optional overrides.
 */
export function resolveFont(
  d: Pick<ResolvedDesign, "typographyStyle">,
  role: "heading" | "body" | "names",
  typography?: import("@/types/invitation").ThemeTypography
): string {
  if (typography?.headingFont && role === "heading") {
    return typography.headingFont.startsWith("var(")
      ? typography.headingFont
      : typography.headingFont === "CustomArabicFont" || typography.headingFont === "Amiri"
        ? "var(--font-amiri)"
        : typography.headingFont === "Tajawal"
          ? "var(--font-tajawal)"
          : typography.headingFont;
  }
  if (typography?.bodyFont && role === "body") {
    return typography.bodyFont.startsWith("var(")
      ? typography.bodyFont
      : typography.bodyFont === "Tajawal"
        ? "var(--font-tajawal)"
        : typography.bodyFont;
  }
  if (typography?.namesFont && role === "names") {
    return typography.namesFont.startsWith("var(") ? typography.namesFont : "var(--inv-font-names)";
  }
  if (role === "names") return "var(--inv-font-names)";

  switch (d.typographyStyle) {
    case "modern":
    case "soft":
      return "var(--inv-font-body)";
    case "calligraphy":
      return "var(--inv-font-heading)";
    default:
      return role === "heading" ? "var(--inv-font-heading)" : "var(--inv-font-body)";
  }
}
