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

type Content = { title?: string; items?: string[]; sectionLabel?: string };
type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

// ─── Variant: simple_list ─────────────────────────────────────────────────────
// Diamond bullets inside a framed card.

function SimpleList({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);
  const label = content.sectionLabel ?? content.title ?? "ملاحظات";
  const items = content.items ?? [];

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

        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "2rem 1.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              ...cardStyles,
            }}
          >
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-right">
                {/* Diamond bullet */}
                {d.dividerStyle !== "none" && (
                  <svg
                    width="6"
                    height="6"
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    style={{ color: theme.primaryColor, opacity: 0.55, flexShrink: 0, marginTop: "0.5rem" }}
                  >
                    <rect x="0.3" y="0.3" width="5.4" height="5.4" transform="rotate(45 3 3)" fill="currentColor" />
                  </svg>
                )}
                <p
                  style={{
                    fontFamily: resolveFont(d, "body"),
                    fontSize: "clamp(0.85rem, 3.5vw, 0.95rem)",
                    color: theme.textColor ?? "#F5F0E8",
                    opacity: 0.8,
                    lineHeight: 1.9,
                  }}
                >
                  {item}
                </p>
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

// ─── Variant: elegant_cards ───────────────────────────────────────────────────
// Each note in its own small card — airy, glass-style.

function ElegantCards({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const label = content.sectionLabel ?? content.title ?? "ملاحظات";
  const items = content.items ?? [];

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <SectionLabel text={label} d={d} />
        </motion.div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: "1rem 1.25rem",
                backgroundColor: `rgba(${primaryRgb},0.025)`,
                border: `1px solid rgba(${primaryRgb},0.1)`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                textAlign: "right",
              }}
            >
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  fontSize: "clamp(0.85rem, 3.5vw, 0.95rem)",
                  color: theme.textColor ?? "#F5F0E8",
                  opacity: 0.8,
                  lineHeight: 1.9,
                }}
              >
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: hidden ──────────────────────────────────────────────────────────
// Sequence can skip notes entirely.

function HiddenNotes() {
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function NotesScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "elegant_cards": return <ElegantCards {...p} />;
    case "hidden": return <HiddenNotes />;
    default: return <SimpleList {...p} />;
  }
}
