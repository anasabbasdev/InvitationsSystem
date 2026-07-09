"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = { sectionLabel?: string };
type VProps = {
  scene: InvitationScene;
  config: InvitationConfig;
  content: Content;
  d: ResolvedDesign;
  isRSVPEnabled: boolean;
};

// ─── Variant: closing_luxury ──────────────────────────────────────────────────
// Ornamental rings + text + ornament. Mirrors the opening_luxury feel.

function ClosingLuxury({ scene, config, d, isRSVPEnabled }: VProps) {
  const { theme } = config;

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1.0, 0.65, 0.4].map((opacity, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${220 + i * 60}px`,
              height: `${220 + i * 60}px`,
              border: `1px solid rgba(var(--inv-primary-rgb),${opacity * 0.25})`,
            }}
            animate={{ scale: [1, 1.012, 1], opacity: [opacity * 0.5, opacity * 0.85, opacity * 0.5] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center gap-6"
        >
          <h2
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "clamp(1.8rem, 8vw, 2.8rem)",
              color: theme.primaryColor,
              letterSpacing: "0.04em",
              lineHeight: 1.4,
            }}
          >
            {isRSVPEnabled ? "شكراً لتفاعلكم" : "نراكم قريباً"}
          </h2>

          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          <p
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "clamp(0.82rem, 3.3vw, 0.95rem)",
              color: theme.secondaryColor,
              opacity: 0.65,
              lineHeight: 2.1,
              maxWidth: "22rem",
            }}
          >
            {isRSVPEnabled
              ? "تفاصيل التذكرة تظهر في صفحة الحالة الخاصة بعد موافقة المضيف."
              : "يسعدنا حضوركم وتشريفكم في هذه المناسبة الكريمة."}
          </p>

          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          {/* Brand signature */}
          <p
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "0.65rem",
              letterSpacing: "0.45em",
              color: theme.primaryColor,
              opacity: 0.35,
              textTransform: "uppercase",
            }}
          >
            مراسِم
          </p>
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_thank_you ───────────────────────────────────────────────
// Just large centered text — soft and airy.

function MinimalThankYou({ scene, config, d, isRSVPEnabled }: VProps) {
  const { theme } = config;

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-10 gap-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: resolveFont(d, "heading"),
            fontSize: "clamp(2.4rem, 10vw, 3.6rem)",
            color: theme.primaryColor,
            letterSpacing: "0.04em",
            lineHeight: 1.3,
          }}
        >
          {isRSVPEnabled ? "شكراً لتفاعلكم" : "نراكم قريباً"}
        </motion.h2>

        {d.dividerStyle !== "none" && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} lineWidth="40px" opacity={0.3} />
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: resolveFont(d, "body"),
            fontSize: "clamp(0.85rem, 3.5vw, 1rem)",
            color: theme.secondaryColor,
            opacity: 0.6,
            lineHeight: 2.2,
            maxWidth: "20rem",
          }}
        >
          {isRSVPEnabled
            ? "سيتم التواصل معك بعد مراجعة طلبك."
            : "يسعدنا حضوركم وتشريفكم في هذه المناسبة."}
        </motion.p>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: brand_signature ─────────────────────────────────────────────────
// "مراسِم" brand name as watermark background + closing text.

function BrandSignature({ scene, config, d, isRSVPEnabled }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      {/* Watermark brand */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <p
          style={{
            fontFamily: resolveFont(d, "heading"),
            fontSize: "clamp(4.5rem, 20vw, 8rem)",
            color: `rgba(${primaryRgb},0.06)`,
            letterSpacing: "0.08em",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          مراسِم
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-7 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          <h2
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "clamp(1.6rem, 7vw, 2.4rem)",
              color: theme.primaryColor,
              letterSpacing: "0.04em",
              lineHeight: 1.4,
            }}
          >
            {isRSVPEnabled ? "شكراً لتفاعلكم" : "نراكم قريباً"}
          </h2>

          <p
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "clamp(0.82rem, 3.3vw, 0.95rem)",
              color: theme.secondaryColor,
              opacity: 0.6,
              lineHeight: 2.1,
              maxWidth: "20rem",
            }}
          >
            {isRSVPEnabled
              ? "تفاصيل التذكرة في صفحة الحالة الخاصة بعد الموافقة."
              : "يسعدنا حضوركم في هذه المناسبة الكريمة."}
          </p>

          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />

          <p
            style={{
              fontFamily: "var(--inv-font-body)",
              fontSize: "0.6rem",
              letterSpacing: "0.5em",
              color: theme.primaryColor,
              opacity: 0.4,
              textTransform: "uppercase",
            }}
          >
            مراسِم للمناسبات
          </p>
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TicketConfirmationScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const isRSVPEnabled = config.rsvp.enabled;
  const p = { scene, config, content, d, isRSVPEnabled };

  switch (scene.variant) {
    case "minimal_thank_you": return <MinimalThankYou {...p} />;
    case "brand_signature": return <BrandSignature {...p} />;
    default: return <ClosingLuxury {...p} />;
  }
}
