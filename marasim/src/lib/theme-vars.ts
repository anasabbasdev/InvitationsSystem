import type { CSSProperties } from "react";
import type { InvitationTheme, SceneDesign } from "@/types/invitation";
import { hexToRgbString } from "@/lib/scene-design";

/** Loaded font tokens — extensible for custom web fonts in a later phase */
export const LOADED_FONT_OPTIONS = [
  { value: "var(--font-amiri)", label: "Amiri" },
  { value: "var(--font-tajawal)", label: "Tajawal" },
  { value: "CustomArabicFont", label: "CustomArabicFont → Amiri" },
  { value: "Tajawal", label: "Tajawal (theme token)" },
] as const;

export function resolveFontFamily(token?: string): string {
  if (!token) return "var(--font-tajawal)";
  if (token === "CustomArabicFont" || token === "Amiri") return "var(--font-amiri)";
  if (token === "Tajawal") return "var(--font-tajawal)";
  return token;
}

/** Build invitation-wide CSS custom properties from theme */
export function buildInvitationCssVars(theme: InvitationTheme): CSSProperties {
  const typo = theme.typography;
  const headingFont = resolveFontFamily(typo?.headingFont ?? theme.fontHeading);
  const bodyFont = resolveFontFamily(typo?.bodyFont ?? theme.fontBody);
  const namesFont = resolveFontFamily(typo?.namesFont ?? typo?.headingFont ?? theme.fontHeading);
  const accent = theme.accentColor ?? theme.secondaryColor;
  const muted = theme.mutedTextColor ?? theme.textColor ?? "#A89F8F";

  return {
    "--inv-primary": theme.primaryColor,
    "--inv-primary-rgb": hexToRgbString(theme.primaryColor),
    "--inv-secondary": theme.secondaryColor,
    "--inv-bg": theme.backgroundColor,
    "--inv-text": theme.textColor ?? "#F5F0E8",
    "--inv-muted": muted,
    "--inv-accent": accent,
    "--inv-accent-rgb": hexToRgbString(accent),
    "--inv-font-heading": headingFont,
    "--inv-font-body": bodyFont,
    "--inv-font-names": namesFont,
    "--inv-heading-size": typo?.headingSize ?? "clamp(1.6rem, 7vw, 2.6rem)",
    "--inv-body-size": typo?.bodySize ?? "1rem",
    "--inv-names-size": typo?.namesSize ?? "clamp(2rem, 9vw, 3.2rem)",
    "--inv-text-align": typo?.textAlign ?? "center",
    "--inv-line-height": typo?.lineHeight ?? "1.6",
    "--inv-letter-spacing": typo?.letterSpacing ?? "0.04em",
    "--inv-button-color": theme.primaryColor,
  } as CSSProperties;
}

/** Per-scene CSS variable overrides from scene.design */
export function buildSceneCssVarOverrides(design?: SceneDesign): CSSProperties {
  if (!design) return {};

  const vars: Record<string, string> = {};
  const c = design.colors;
  const t = design.typography;

  if (c?.backgroundColor) vars["--inv-bg"] = c.backgroundColor;
  if (c?.textColor) vars["--inv-text"] = c.textColor;
  if (c?.accentColor) {
    vars["--inv-accent"] = c.accentColor;
    vars["--inv-accent-rgb"] = hexToRgbString(c.accentColor);
  }
  if (c?.buttonColor) vars["--inv-button-color"] = c.buttonColor;

  if (t?.headingFont) vars["--inv-font-heading"] = resolveFontFamily(t.headingFont);
  if (t?.bodyFont) vars["--inv-font-body"] = resolveFontFamily(t.bodyFont);
  if (t?.namesFont) vars["--inv-font-names"] = resolveFontFamily(t.namesFont);
  if (t?.headingSize) vars["--inv-heading-size"] = t.headingSize;
  if (t?.bodySize) vars["--inv-body-size"] = t.bodySize;
  if (t?.namesSize) vars["--inv-names-size"] = t.namesSize;
  if (t?.textAlign) vars["--inv-text-align"] = t.textAlign;
  if (t?.lineHeight) vars["--inv-line-height"] = t.lineHeight;
  if (t?.letterSpacing) vars["--inv-letter-spacing"] = t.letterSpacing;

  return vars as CSSProperties;
}
