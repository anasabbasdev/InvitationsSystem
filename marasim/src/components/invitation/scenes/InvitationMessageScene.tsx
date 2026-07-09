"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SectionLabel from "@/components/ui/SectionLabel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, getCardStyles, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = {
  title?: string;
  body?: string;
  header?: string;
  sectionLabel?: string;
};

type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

// ─── Corner ornaments helper ──────────────────────────────────────────────────

function CornerOrnaments({ cornerStyle }: { cornerStyle: ResolvedDesign["cornerStyle"] }) {
  if (cornerStyle === "none") return null;
  const border = "1px solid rgba(var(--inv-primary-rgb),0.45)";
  const sz = cornerStyle === "ornate" ? "18px" : "10px";

  return (
    <>
      <div style={{ position: "absolute", top: 10, right: 10, width: sz, height: sz, borderTop: border, borderRight: border }} />
      <div style={{ position: "absolute", top: 10, left: 10, width: sz, height: sz, borderTop: border, borderLeft: border }} />
      <div style={{ position: "absolute", bottom: 10, right: 10, width: sz, height: sz, borderBottom: border, borderRight: border }} />
      <div style={{ position: "absolute", bottom: 10, left: 10, width: sz, height: sz, borderBottom: border, borderLeft: border }} />
    </>
  );
}

// ─── Variant: classic_card ────────────────────────────────────────────────────
// Message in a framed card with corner ornaments.

function ClassicCard({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);
  const label = content.sectionLabel ?? "دعوة كريمة";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-8 text-center">
        <SectionLabel text={label} d={d} />
        <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            position: "relative",
            padding: "2.5rem 2rem",
            borderRadius: "2px",
            width: "100%",
            maxWidth: "340px",
            ...cardStyles,
          }}
        >
          <CornerOrnaments cornerStyle={d.cornerStyle} />

          {content.header && (
            <p
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
                color: theme.primaryColor,
                opacity: 0.8,
                marginBottom: "1.25rem",
                letterSpacing: "0.06em",
              }}
            >
              {content.header}
            </p>
          )}

          {content.title && (
            <h2
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(1.4rem, 6vw, 2rem)",
                color: theme.primaryColor,
                marginBottom: "1.25rem",
              }}
            >
              {content.title}
            </h2>
          )}

          {content.body && (
            <p
              style={{
                fontFamily: resolveFont(d, "body"),
                fontSize: "clamp(0.88rem, 3.5vw, 1rem)",
                color: theme.textColor ?? "#F5F0E8",
                lineHeight: 2.1,
                opacity: 0.85,
              }}
            >
              {content.body}
            </p>
          )}
        </motion.div>

        <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: full_bleed_text ─────────────────────────────────────────────────
// No card, no border. Text sits directly on the background with generous spacing.

function FullBleedText({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const label = content.sectionLabel ?? "دعوة كريمة";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-8 w-full max-w-sm"
        >
          <SectionLabel text={label} d={d} />

          {content.header && (
            <p
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(1rem, 4vw, 1.3rem)",
                color: theme.primaryColor,
                letterSpacing: "0.08em",
                opacity: 0.9,
              }}
            >
              {content.header}
            </p>
          )}

          {content.title && (
            <h2
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
                color: theme.primaryColor,
                letterSpacing: "0.04em",
                lineHeight: 1.4,
              }}
            >
              {content.title}
            </h2>
          )}

          {content.body && (
            <p
              style={{
                fontFamily: resolveFont(d, "body"),
                fontSize: "clamp(0.9rem, 3.5vw, 1.05rem)",
                color: theme.textColor ?? "#F5F0E8",
                lineHeight: 2.3,
                opacity: 0.8,
                letterSpacing: "0.03em",
              }}
            >
              {content.body}
            </p>
          )}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_quote ───────────────────────────────────────────────────
// Quote-style: text is presented as a centered quote with opening mark.

function MinimalQuote({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const label = content.sectionLabel ?? "";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-10 gap-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          className="flex flex-col items-center gap-6 max-w-sm"
        >
          {/* Large decorative open-quote mark */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "5rem",
              color: theme.primaryColor,
              opacity: 0.12,
              lineHeight: 0.6,
              userSelect: "none",
            }}
          >
            "
          </span>

          {content.header && (
            <p
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
                color: theme.primaryColor,
                opacity: 0.8,
                letterSpacing: "0.08em",
              }}
            >
              {content.header}
            </p>
          )}

          {content.body && (
            <p
              style={{
                fontFamily: resolveFont(d, "body"),
                fontSize: "clamp(0.95rem, 3.8vw, 1.1rem)",
                color: theme.textColor ?? "#F5F0E8",
                lineHeight: 2.4,
                opacity: 0.85,
                letterSpacing: "0.04em",
              }}
            >
              {content.body}
            </p>
          )}

          {label && <SectionLabel text={label} d={d} />}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function InvitationMessageScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "full_bleed_text": return <FullBleedText {...p} />;
    case "minimal_quote": return <MinimalQuote {...p} />;
    default: return <ClassicCard {...p} />;
  }
}
