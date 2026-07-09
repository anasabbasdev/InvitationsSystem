"use client";

import React from "react";

/**
 * SceneIcon — configurable icon renderer.
 *
 * iconStyle:
 *   "line"   → SVG outline icon (default)
 *   "filled" → SVG filled icon
 *   "asset"  → <img> from iconAssets[name]
 *   "none"   → renders nothing
 */

interface SceneIconProps {
  name: "calendar" | "clock" | "pin" | "envelope" | "star" | "arrow" | "check" | "gallery";
  style: "line" | "filled" | "asset" | "none";
  asset?: string;
  size?: number;
  className?: string;
  color?: string;
}

// ─── SVG icon definitions ──────────────────────────────────────────────────

function CalendarIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke={color} strokeWidth={filled ? 0 : 1.4} fill={filled ? color : "none"} fillOpacity={0.15} />
      <path d="M6 2v4M14 2v4M2 9h16" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth={filled ? 0 : 1.4} fill={filled ? color : "none"} fillOpacity={0.15} />
      <path d="M10 6v4.5l3 2" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2a6 6 0 0 1 6 6c0 4.5-6 10-6 10S4 12.5 4 8a6 6 0 0 1 6-6Z"
        stroke={color} strokeWidth={filled ? 0 : 1.4}
        fill={filled ? color : "none"} fillOpacity={0.15}
      />
      <circle cx="10" cy="8" r="2" stroke={color} strokeWidth={1.2} fill={filled ? "white" : "none"} fillOpacity={0.4} />
    </svg>
  );
}

function EnvelopeIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="12" rx="2" stroke={color} strokeWidth={filled ? 0 : 1.4} fill={filled ? color : "none"} fillOpacity={0.15} />
      <path d="M2 7l8 5 8-5" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2l2.39 4.84L18 7.64l-4 3.9.94 5.5L10 14.27 5.06 17.04l.94-5.5-4-3.9 5.61-.8L10 2z"
        stroke={color} strokeWidth={1.2}
        fill={filled ? color : "none"} fillOpacity={0.2}
      />
    </svg>
  );
}

function ArrowIcon({ size, color }: { size: number; color: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h12M10 4l6 6-6 6" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ size, color }: { size: number; color: string; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke={color} strokeWidth={1.4} fill="none" />
      <path d="M6 10l3 3 5-5" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GalleryIcon({ size, color, filled }: { size: number; color: string; filled: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="13" rx="2" stroke={color} strokeWidth={filled ? 0 : 1.4} fill={filled ? color : "none"} fillOpacity={0.12} />
      <path d="M2 13l5-5 4 4 2-2 5 4" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SceneIcon({
  name,
  style,
  asset,
  size = 18,
  className,
  color = "var(--inv-primary)",
}: SceneIconProps) {
  if (style === "none") return null;

  if (style === "asset") {
    if (!asset) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={asset} alt="" aria-hidden="true" className={className} style={{ width: size, height: size }} />
    );
  }

  const filled = style === "filled";
  const props = { size, color, filled };

  const iconMap: Record<string, React.ReactElement> = {
    calendar: <CalendarIcon {...props} />,
    clock: <ClockIcon {...props} />,
    pin: <PinIcon {...props} />,
    envelope: <EnvelopeIcon {...props} />,
    star: <StarIcon {...props} />,
    arrow: <ArrowIcon {...props} />,
    check: <CheckIcon {...props} />,
    gallery: <GalleryIcon {...props} />,
  };

  const icon = iconMap[name];
  if (!icon) return null;

  return (
    <span className={className} aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
      {icon}
    </span>
  );
}
