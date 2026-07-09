"use client";

import React from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SectionLabel from "@/components/ui/SectionLabel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type MediaItem = { type: "image" | "video"; src: string; alt?: string };
type Content = { media?: MediaItem[]; label?: string };
type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

// ─── Elegant gold placeholder ─────────────────────────────────────────────────

function GoldPlaceholder({ primaryRgb }: { primaryRgb: string }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4/3",
        border: `1px solid rgba(${primaryRgb},0.2)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        backgroundColor: `rgba(${primaryRgb},0.025)`,
      }}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        style={{ color: `rgba(${primaryRgb},0.3)` }}
      >
        <rect x="2" y="5" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 20l8-8 6 6 4-4 10 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="22" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: `rgba(${primaryRgb},0.35)`, textTransform: "uppercase" }}>
        صورة المناسبة
      </span>
    </div>
  );
}

// ─── Variant: single_card ─────────────────────────────────────────────────────
// Standard card display with optional gold frame border.

function SingleCard({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const label = content.label ?? "لحظات";
  const first = content.media?.[0];

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
          className="flex flex-col items-center"
        >
          <SectionLabel text={label} d={d} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            width: "100%",
            maxWidth: 360,
            border: `1px solid rgba(${primaryRgb},0.22)`,
            overflow: "hidden",
          }}
        >
          {first ? (
            first.type === "video" ? (
              <video
                src={first.src}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={first.src}
                alt={first.alt ?? ""}
                style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />
            )
          ) : (
            <GoldPlaceholder primaryRgb={primaryRgb} />
          )}
        </motion.div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: full_bleed_media ────────────────────────────────────────────────
// Media fills the entire scene height — immersive, cinematic.

function FullBleedMedia({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const label = content.label ?? "لحظات";
  const first = content.media?.[0];

  return (
    <SceneFrame config={config} scene={scene} style={{ padding: 0 }}>
      {scene.background && <LayerRenderer layer={scene.background} />}

      {first ? (
        first.type === "video" ? (
          <video
            src={first.src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={first.src}
            alt={first.alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )
      ) : (
        /* Elegant gradient placeholder */
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(145deg, rgba(${primaryRgb},0.08) 0%, transparent 100%)` }}
        />
      )}

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "45%",
          background: `linear-gradient(to top, ${theme.backgroundColor}CC 0%, transparent 100%)`,
        }}
      />

      {/* Label at bottom */}
      {d.sectionLabelStyle !== "hidden" && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-10 z-10">
          <SectionLabel text={label} d={d} />
        </div>
      )}

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: polaroid_stack ──────────────────────────────────────────────────
// Polaroid-style white/cream frame with slight rotation. Warm and personal.

function PolaroidStack({ scene, config, content, d }: VProps) {
  const { theme } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const label = content.label ?? "لحظات";
  const mediaItems = content.media ?? [];

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel text={label} d={d} />
        </motion.div>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          {mediaItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              style={{
                backgroundColor: "#f5ede6",
                padding: "10px 10px 36px 10px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.45)",
                transform: "rotate(-0.8deg)",
              }}
            >
              <GoldPlaceholder primaryRgb={primaryRgb} />
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "#6b5a4e",
                  marginTop: "0.5rem",
                  opacity: 0.6,
                }}
              >
                صورة المناسبة
              </p>
            </motion.div>
          ) : (
            mediaItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                style={{
                  backgroundColor: "#f5ede6",
                  padding: "10px 10px 36px 10px",
                  boxShadow: "0 6px 28px rgba(0,0,0,0.45)",
                  transform: `rotate(${i % 2 === 0 ? "-0.8deg" : "0.6deg"})`,
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.src}
                    alt={item.alt ?? ""}
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
                  />
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function GalleryMediaScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "full_bleed_media": return <FullBleedMedia {...p} />;
    case "polaroid_stack": return <PolaroidStack {...p} />;
    default: return <SingleCard {...p} />;
  }
}
