"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SectionLabel from "@/components/ui/SectionLabel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, getButtonStyles, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
  onOpen?: () => void;
}

type Content = {
  tapText?: string;
  label?: string;
  previewTitle?: string;
};

type VProps = {
  scene: InvitationScene;
  config: InvitationConfig;
  content: Content;
  d: ResolvedDesign;
  onOpen?: () => void;
};

// ─── Variant: rings_luxury ────────────────────────────────────────────────────
// Classic luxury opening: 3 animated rings + star center + tap CTA.

function RingsLuxury({ scene, config, content, d, onOpen }: VProps) {
  const { theme } = config;
  const label = content.label ?? "دعوة خاصة";
  const tapText = content.tapText ?? "افتح الدعوة";
  const previewTitle = content.previewTitle ?? "";
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1.0, 0.7, 0.5].map((opacity, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${260 + i * 70}px`,
              height: `${260 + i * 70}px`,
              border: `1px solid rgba(var(--inv-primary-rgb),${opacity * 0.28})`,
            }}
            animate={{ scale: [1, 1.015, 1], opacity: [opacity * 0.6, opacity, opacity * 0.6] }}
            transition={{ duration: 3.5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
        {/* Dashed outer ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "310px",
            height: "310px",
            border: "1px dashed rgba(var(--inv-primary-rgb),0.14)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {/* Star center */}
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          aria-hidden="true"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: theme.primaryColor }}
        >
          <path d="M18 2l2.8 9H29l-7.4 5.4 2.8 9L18 20.3l-6.4 5.1 2.8-9L7 11h8.2z" fill="currentColor" opacity="0.7" />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh gap-6 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <SectionLabel text={label} d={d} />
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
        </motion.div>

        {previewTitle && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.6 }}
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
              color: theme.secondaryColor,
              letterSpacing: "0.06em",
            }}
          >
            {previewTitle}
          </motion.h2>
        )}

        <motion.button
          onClick={onOpen}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileTap={{ scale: 0.97 }}
          style={btnStyle}
        >
          {tapText}
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ opacity: 0.35 }}
        >
          <div className="w-px h-10" style={{ background: `linear-gradient(to bottom, transparent, ${theme.primaryColor})` }} />
          <svg width="6" height="6" viewBox="0 0 6 6" aria-hidden="true" style={{ color: theme.primaryColor }}>
            <polygon points="3,6 0,0 6,0" fill="currentColor" />
          </svg>
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: full_video_intro ────────────────────────────────────────────────
// Cinematic: media fills full screen, minimal overlay UI at center-bottom.
// Perfect for sequences with a background video.

function FullVideoIntro({ scene, config, content, d, onOpen }: VProps) {
  const { theme } = config;
  const label = content.label ?? "دعوة خاصة";
  const tapText = content.tapText ?? "اكتشف الدعوة";
  const previewTitle = content.previewTitle ?? "";
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      {/* Cinematic bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "70%",
          background: `linear-gradient(to top, ${theme.backgroundColor}E8 0%, ${theme.backgroundColor}60 40%, transparent 100%)`,
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "25%",
          background: `linear-gradient(to bottom, ${theme.backgroundColor}80 0%, transparent 100%)`,
        }}
      />

      {/* Content: positioned at bottom */}
      <div className="relative z-10 absolute inset-x-0 bottom-0 flex flex-col items-center pb-16 gap-5 px-8 text-center">
        {previewTitle && (
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
              color: theme.secondaryColor,
              letterSpacing: "0.04em",
              lineHeight: 1.3,
            }}
          >
            {previewTitle}
          </motion.h2>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionLabel text={label} d={d} />
        </motion.div>

        <motion.button
          onClick={onOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          style={btnStyle}
        >
          {tapText}
        </motion.button>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_tap ─────────────────────────────────────────────────────
// Clean, airy opening: no rings. Just section label + divider + title + button.

function MinimalTap({ scene, config, content, d, onOpen }: VProps) {
  const { theme } = config;
  const label = content.label ?? "دعوة";
  const tapText = content.tapText ?? "اكتشف الدعوة";
  const previewTitle = content.previewTitle ?? "";
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh gap-8 px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          <SectionLabel text={label} d={d} />

          {d.dividerStyle !== "none" && (
            <SceneOrnament
              dividerStyle={d.dividerStyle}
              ornamentAsset={d.ornamentAsset}
              lineWidth="48px"
              opacity={0.35}
            />
          )}

          {previewTitle && (
            <h2
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(1.8rem, 8vw, 2.8rem)",
                color: theme.primaryColor,
                letterSpacing: "0.04em",
                opacity: 0.9,
                lineHeight: 1.4,
              }}
            >
              {previewTitle}
            </h2>
          )}
        </motion.div>

        <motion.button
          onClick={onOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          style={btnStyle}
        >
          {tapText}
        </motion.button>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OpeningScene({ scene, config, onOpen }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config, onOpen);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d, onOpen };

  switch (scene.variant) {
    case "full_video_intro": return <FullVideoIntro {...p} />;
    case "minimal_tap": return <MinimalTap {...p} />;
    default: return <RingsLuxury {...p} />;
  }
}
