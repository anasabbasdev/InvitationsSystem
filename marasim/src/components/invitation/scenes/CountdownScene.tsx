"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SectionLabel from "@/components/ui/SectionLabel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = { targetDate?: string; sectionLabel?: string };
type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (isNaN(diff) || diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const UNIT_LABELS: Record<string, string> = { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" };

function useCountdown(targetDate: string | undefined) {
  const [tl, setTl] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!targetDate) return;
    setTl(calcTimeLeft(targetDate));
    const id = setInterval(() => setTl(calcTimeLeft(targetDate)), 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return { tl, mounted };
}

// ─── Variant: boxed_luxury ────────────────────────────────────────────────────
// Bordered boxes for each time unit. Classic luxury look.

function BoxedLuxury({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const { tl, mounted } = useCountdown(content.targetDate);
  const label = content.sectionLabel ?? "العد التنازلي";

  const units: [string, number][] = tl
    ? [["days", tl.days], ["hours", tl.hours], ["minutes", tl.minutes], ["seconds", tl.seconds]]
    : [["days", 0], ["hours", 0], ["minutes", 0], ["seconds", 0]];

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-3"
        >
          <SectionLabel text={label} d={d} />
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
        </motion.div>

        {!mounted ? (
          /* Skeleton prevents hydration mismatch */
          <div className="grid grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 70,
                  height: 80,
                  border: `1px solid rgba(${primaryRgb},0.2)`,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-4 gap-3"
          >
            {units.map(([key, val]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  padding: "0.75rem 0.5rem",
                  border: `1px solid rgba(${primaryRgb},0.3)`,
                  backgroundColor: `rgba(${primaryRgb},0.04)`,
                  borderRadius: 2,
                  minWidth: 64,
                  boxShadow: `0 0 18px rgba(${primaryRgb},0.06)`,
                }}
              >
                <span
                  style={{
                    fontFamily: resolveFont(d, "heading"),
                    fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
                    color: theme.primaryColor,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(val).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: resolveFont(d, "body"),
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    color: theme.secondaryColor,
                    opacity: 0.6,
                  }}
                >
                  {UNIT_LABELS[key]}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_digits ──────────────────────────────────────────────────
// Large numbers with no boxes. Clean and modern.

function MinimalDigits({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const { tl, mounted } = useCountdown(content.targetDate);
  const label = content.sectionLabel ?? "العد التنازلي";

  const units: [string, number][] = tl
    ? [["days", tl.days], ["hours", tl.hours], ["minutes", tl.minutes], ["seconds", tl.seconds]]
    : [["days", 0], ["hours", 0], ["minutes", 0], ["seconds", 0]];

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-12 text-center">
        <SectionLabel text={label} d={d} />

        {!mounted ? (
          <div style={{ height: 80 }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-4 gap-6"
          >
            {units.map(([key, val]) => (
              <div key={key} className="flex flex-col items-center gap-2">
                <span
                  style={{
                    fontFamily: resolveFont(d, "heading"),
                    fontSize: "clamp(2.4rem, 10vw, 3.5rem)",
                    color: theme.primaryColor,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {String(val).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: resolveFont(d, "body"),
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    color: theme.secondaryColor,
                    opacity: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {UNIT_LABELS[key]}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: hidden ──────────────────────────────────────────────────────────
// Sequence can skip countdown entirely.

function HiddenCountdown() {
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CountdownScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "minimal_digits": return <MinimalDigits {...p} />;
    case "hidden": return <HiddenCountdown />;
    default: return <BoxedLuxury {...p} />;
  }
}
