"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SceneIcon from "@/components/ui/SceneIcon";
import SectionLabel from "@/components/ui/SectionLabel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, getButtonStyles, getCardStyles, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = { venueName?: string; address?: string; mapUrl?: string; sectionLabel?: string };
type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

function openMap(url?: string) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

// ─── Variant: map_button_card ─────────────────────────────────────────────────
// Pin icon + venue name + address + styled button. Classic layout.

function MapButtonCard({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);
  const label = content.sectionLabel ?? "موقع المناسبة";
  const showIcon = d.iconStyle !== "none";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <SectionLabel text={label} d={d} />
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            padding: "2.5rem 2rem",
            width: "100%",
            maxWidth: 320,
            position: "relative",
            ...cardStyles,
          }}
        >
          {showIcon && (
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                border: `1px solid rgba(${primaryRgb},0.35)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: `rgba(${primaryRgb},0.04)`,
              }}
            >
              <SceneIcon
                name="pin"
                style={d.iconStyle}
                asset={d.iconAssets?.["pin"]}
                size={22}
                color={theme.primaryColor}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <p
              style={{
                fontFamily: resolveFont(d, "heading"),
                fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
                color: theme.primaryColor,
                lineHeight: 1.4,
              }}
            >
              {content.venueName ?? "قاعة المناسبة"}
            </p>
            {content.address && (
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  fontSize: "0.82rem",
                  color: theme.secondaryColor,
                  opacity: 0.65,
                  lineHeight: 1.8,
                }}
              >
                {content.address}
              </p>
            )}
          </div>

          {content.mapUrl && (
            <button onClick={() => openMap(content.mapUrl)} style={btnStyle}>
              فتح الخريطة
            </button>
          )}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_link ────────────────────────────────────────────────────
// Clean text approach: venue name + address + underline link.

function MinimalLink({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const label = content.sectionLabel ?? "موقع المناسبة";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-10 gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center gap-8 max-w-sm"
        >
          <SectionLabel text={label} d={d} />

          <h2
            style={{
              fontFamily: resolveFont(d, "heading"),
              fontSize: "clamp(1.6rem, 7vw, 2.2rem)",
              color: theme.primaryColor,
              lineHeight: 1.4,
              letterSpacing: "0.02em",
            }}
          >
            {content.venueName ?? "قاعة المناسبة"}
          </h2>

          {content.address && (
            <p
              style={{
                fontFamily: resolveFont(d, "body"),
                fontSize: "0.85rem",
                color: theme.secondaryColor,
                opacity: 0.65,
                lineHeight: 2,
                letterSpacing: "0.04em",
              }}
            >
              {content.address}
            </p>
          )}

          {content.mapUrl && (
            <button
              onClick={() => openMap(content.mapUrl)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `1px solid ${theme.primaryColor}`,
                color: theme.primaryColor,
                fontFamily: resolveFont(d, "body"),
                fontSize: "0.85rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                padding: "4px 0",
                opacity: 0.8,
              }}
            >
              فتح الخريطة ←
            </button>
          )}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: full_bleed_location ─────────────────────────────────────────────
// Dramatic: very large venue name + minimal detail + map link at bottom.

function FullBleedLocation({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const label = content.sectionLabel ?? "موقع المناسبة";

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col justify-end min-h-dvh px-8 pb-16 gap-4">
        {d.sectionLabelStyle !== "hidden" && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionLabel text={label} d={d} />
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: resolveFont(d, "heading"),
            fontSize: "clamp(2.4rem, 11vw, 3.6rem)",
            color: theme.primaryColor,
            lineHeight: 1.2,
            letterSpacing: "0.02em",
          }}
        >
          {content.venueName ?? "قاعة المناسبة"}
        </motion.h2>

        {content.address && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontFamily: resolveFont(d, "body"),
              fontSize: "0.85rem",
              color: theme.secondaryColor,
              opacity: 0.6,
              lineHeight: 1.8,
            }}
          >
            {content.address}
          </motion.p>
        )}

        {content.mapUrl && (
          <motion.button
            onClick={() => openMap(content.mapUrl)}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              background: "transparent",
              border: `1px solid rgba(var(--inv-primary-rgb),0.4)`,
              color: theme.primaryColor,
              fontFamily: resolveFont(d, "body"),
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              padding: "10px 24px",
              alignSelf: "flex-start",
              marginTop: "0.5rem",
            }}
          >
            الاتجاهات
          </motion.button>
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function LocationScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "minimal_link": return <MinimalLink {...p} />;
    case "full_bleed_location": return <FullBleedLocation {...p} />;
    default: return <MapButtonCard {...p} />;
  }
}
