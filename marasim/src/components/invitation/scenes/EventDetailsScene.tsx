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
import { resolveDesign, getCardStyles, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = {
  date?: string;
  day?: string;
  time?: string;
  venueName?: string;
  address?: string;
  sectionLabel?: string;
};

type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

type InfoItem = { icon: "calendar" | "clock" | "pin"; label: string; value: string };

function buildItems(content: Content): InfoItem[] {
  const items: InfoItem[] = [];
  if (content.date) {
    items.push({ icon: "calendar", label: "التاريخ", value: content.day ? `${content.day} ${content.date}` : content.date });
  }
  if (content.time) {
    items.push({ icon: "clock", label: "الوقت", value: content.time });
  }
  if (content.venueName) {
    items.push({ icon: "pin", label: "المكان", value: content.venueName });
  }
  return items;
}

// ─── Variant: stacked_cards ───────────────────────────────────────────────────
// Each detail in a row: icon circle (optional) + label + value.

function StackedCards({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const items = buildItems(content);
  const label = content.sectionLabel ?? "تفاصيل المناسبة";
  const showIcon = d.iconStyle !== "none";
  const iconAsset = (name: string) => d.iconAssets?.[name];

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <SectionLabel text={label} d={d} />
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
        </motion.div>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="flex flex-col items-center gap-3"
            >
              {showIcon && (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: `1px solid rgba(${primaryRgb},0.35)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `rgba(${primaryRgb},0.04)`,
                    flexShrink: 0,
                  }}
                >
                  <SceneIcon
                    name={item.icon}
                    style={d.iconStyle}
                    asset={iconAsset(item.icon)}
                    size={18}
                    color={theme.primaryColor}
                  />
                </div>
              )}
              <div>
                <p
                  style={{
                    fontFamily: resolveFont(d, "body"),
                    fontSize: "0.68rem",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: theme.primaryColor,
                    opacity: 0.55,
                    marginBottom: "0.3rem",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: resolveFont(d, "heading"),
                    fontSize: "clamp(1rem, 4.5vw, 1.25rem)",
                    color: theme.secondaryColor,
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </p>
              </div>
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

// ─── Variant: timeline ────────────────────────────────────────────────────────
// Vertical timeline: dot + line connecting items.

function Timeline({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const items = buildItems(content);
  const label = content.sectionLabel ?? "تفاصيل المناسبة";

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-10">
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

        {/* Timeline */}
        <div className="flex flex-col w-full max-w-xs">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex gap-5"
              /* ltr for timeline column, content is rtl via parent */
              style={{ direction: "ltr" }}
            >
              {/* Timeline column */}
              <div className="flex flex-col items-center" style={{ minWidth: 20 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: theme.primaryColor,
                    marginTop: 4,
                    flexShrink: 0,
                    boxShadow: `0 0 8px rgba(var(--inv-primary-rgb),0.5)`,
                  }}
                />
                {i < items.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      flex: 1,
                      minHeight: 40,
                      backgroundColor: `rgba(var(--inv-primary-rgb),0.2)`,
                      margin: "4px 0",
                    }}
                  />
                )}
              </div>
              {/* Content — reversed to RTL */}
              <div className="pb-8 flex-1" style={{ direction: "rtl", textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: resolveFont(d, "body"),
                    fontSize: "0.68rem",
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: theme.primaryColor,
                    opacity: 0.5,
                    marginBottom: "0.3rem",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: resolveFont(d, "heading"),
                    fontSize: "clamp(1rem, 4.5vw, 1.2rem)",
                    color: theme.secondaryColor,
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </p>
              </div>
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

// ─── Variant: minimal_rows ────────────────────────────────────────────────────
// Clean rows: label colon value. No icons, no circles.

function MinimalRows({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const items = buildItems(content);
  const label = content.sectionLabel ?? "تفاصيل المناسبة";
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-10">
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

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            maxWidth: "320px",
            padding: "2rem 1.5rem",
            borderRadius: "2px",
            ...cardStyles,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "0.85rem 0",
                borderBottom: i < items.length - 1 ? `1px solid rgba(${primaryRgb},0.1)` : "none",
              }}
            >
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  fontSize: "0.75rem",
                  color: theme.primaryColor,
                  opacity: 0.55,
                  letterSpacing: "0.1em",
                  flexShrink: 0,
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: resolveFont(d, "heading"),
                  fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
                  color: theme.secondaryColor,
                  textAlign: "left",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function EventDetailsScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "timeline": return <Timeline {...p} />;
    case "minimal_rows": return <MinimalRows {...p} />;
    default: return <StackedCards {...p} />;
  }
}
