"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = {
  primaryName?: string;
  secondaryName?: string;
  connector?: string;
  subtitle?: string;
};

type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

// ─── Variant: stacked_calligraphy ─────────────────────────────────────────────
// Two names stacked vertically, large calligraphy feel.
// Top / bottom ornament dividers. Connector "و" centered.

function StackedCalligraphy({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primary = content.primaryName ?? "الاسم الأول";
  const secondary = content.secondaryName ?? "الاسم الثاني";
  const connector = content.connector ?? "و";
  const subtitle = content.subtitle ?? "يتشرفان بدعوتكم";
  const headingFont = resolveFont(d, "heading");

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center gap-5"
        >
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          <h1
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(3rem, 13vw, 4.5rem)",
              color: theme.primaryColor,
              textShadow: `0 0 60px rgba(var(--inv-primary-rgb),0.25)`,
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}
          >
            {primary}
          </h1>

          {/* Connector with extending lines */}
          <div className="flex items-center gap-3 w-full max-w-[200px]">
            <div className="h-px flex-1" style={{ background: `rgba(var(--inv-primary-rgb),0.3)` }} />
            <span
              style={{
                fontFamily: headingFont,
                fontSize: "1.4rem",
                color: theme.primaryColor,
                opacity: 0.7,
              }}
            >
              {connector}
            </span>
            <div className="h-px flex-1" style={{ background: `rgba(var(--inv-primary-rgb),0.3)` }} />
          </div>

          <h1
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(3rem, 13vw, 4.5rem)",
              color: theme.primaryColor,
              textShadow: `0 0 60px rgba(var(--inv-primary-rgb),0.25)`,
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}
          >
            {secondary}
          </h1>

          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "clamp(0.85rem, 3.5vw, 1rem)",
              color: theme.secondaryColor,
              letterSpacing: "0.1em",
              opacity: 0.75,
            }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: split_names ─────────────────────────────────────────────────────
// Asymmetric layout: primary name right-aligned, secondary left-aligned.
// A gradient line spans the full width between them.

function SplitNames({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primary = content.primaryName ?? "الاسم الأول";
  const secondary = content.secondaryName ?? "الاسم الثاني";
  const subtitle = content.subtitle ?? "يتشرفان بدعوتكم";
  const headingFont = resolveFont(d, "heading");
  const nameSize = "clamp(2.4rem, 10vw, 3.6rem)";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col justify-center min-h-dvh px-8 gap-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p
            style={{
              fontFamily: headingFont,
              fontSize: nameSize,
              color: theme.primaryColor,
              textAlign: "right",
              lineHeight: 1.25,
              letterSpacing: "0.02em",
            }}
          >
            {primary}
          </p>
        </motion.div>

        {/* Full-width gradient separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: "1px",
            background: `linear-gradient(90deg, ${theme.primaryColor}00 0%, ${theme.primaryColor}60 30%, ${theme.primaryColor}60 70%, ${theme.primaryColor}00 100%)`,
            margin: "1rem 0",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <p
            style={{
              fontFamily: headingFont,
              fontSize: nameSize,
              color: theme.secondaryColor,
              textAlign: "left",
              lineHeight: 1.25,
              letterSpacing: "0.02em",
              opacity: 0.9,
            }}
          >
            {secondary}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{
            fontFamily: resolveFont(d, "body"),
            fontSize: "0.85rem",
            color: theme.secondaryColor,
            letterSpacing: "0.12em",
            opacity: 0.6,
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          {subtitle}
        </motion.p>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: single_name_centered ────────────────────────────────────────────
// One very large centered name. Perfect for birth announcements.

function SingleNameCentered({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const name = content.primaryName ?? "الاسم";
  const subtitle = content.subtitle ?? "";
  const headingFont = resolveFont(d, "heading");

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1
            style={{
              fontFamily: headingFont,
              fontSize: "clamp(4rem, 18vw, 6rem)",
              color: theme.primaryColor,
              textShadow: `0 0 80px rgba(var(--inv-primary-rgb),0.3)`,
              lineHeight: 1.1,
              letterSpacing: "0.04em",
            }}
          >
            {name}
          </h1>
        </motion.div>

        {d.dividerStyle !== "none" && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} lineWidth="48px" opacity={0.4} />
          </motion.div>
        )}

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "clamp(0.9rem, 4vw, 1.15rem)",
              color: theme.secondaryColor,
              letterSpacing: "0.12em",
              opacity: 0.7,
              lineHeight: 2,
              maxWidth: "18rem",
            }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function HeroNamesScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "split_names": return <SplitNames {...p} />;
    case "single_name_centered": return <SingleNameCentered {...p} />;
    default: return <StackedCalligraphy {...p} />;
  }
}
