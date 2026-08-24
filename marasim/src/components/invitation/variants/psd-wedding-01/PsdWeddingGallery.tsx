"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdArt, PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_DECOR, PSD_FONT, PSD_GALLERY_LOREM, PSD_SECTIONS, PSD_WHITE, psdFont } from "./coords";

type MediaItem = { type: "image" | "video"; src: string; alt?: string };
type Content = {
  media?: MediaItem[];
  label?: string;
  scriptLabel?: string;
  caption?: string;
  body?: string;
};

const Y = PSD_SECTIONS.gallery.y;
const H = PSD_SECTIONS.gallery.height;

const FRAMES = [
  { x: 256, y: 9751, w: 521, h: 503 },
  { x: 810, y: 10319, w: 518, h: 506 },
  { x: 216, y: 10329, w: 575, h: 433 },
];

export default function PsdWeddingGallery({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;
  const photos = c.media?.filter((m) => m.type === "image" && m.src) ?? [];
  const lorem = c.body ?? PSD_GALLERY_LOREM;

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.gallery.plate} heightPsd={H} style={{ overflow: "visible" }}>
        <PsdBox x={500} y={9510} width={540} height={64} sectionY={Y} sectionH={H} className="flex items-center justify-center overflow-visible">
          <PsdReveal>
            <span
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(52),
                fontWeight: 400,
                letterSpacing: "0.2em",
                color: PSD_WHITE,
                background: "transparent",
                lineHeight: 1,
              }}
            >
              {c.label ?? "OUR"}
            </span>
          </PsdReveal>
        </PsdBox>

        <PsdArt src={PSD_DECOR.artMoments} x={576} y={9503} width={437} height={163} sectionY={Y} sectionH={H} alt={c.scriptLabel ?? "Moments"} />

        <PsdBox x={873} y={9769} width={452} height={155} sectionY={Y} sectionH={H} className="flex items-start">
          <PsdReveal delay={0.08}>
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(18),
                fontWeight: 400,
                color: PSD_WHITE,
                margin: 0,
                lineHeight: 1.35,
                textAlign: "left",
                direction: "ltr",
                background: "transparent",
              }}
            >
              {lorem}
            </p>
          </PsdReveal>
        </PsdBox>

        <PsdArt src={PSD_DECOR.artBest} x={982} y={10010} width={275} height={122} sectionY={Y} sectionH={H} alt="Best" delay={0.1} />
        <PsdArt src={PSD_DECOR.artMoment} x={908} y={10045} width={327} height={166} sectionY={Y} sectionH={H} alt="Moment" delay={0.14} />

        {FRAMES.map((frame, i) => {
          const photo = photos[i];
          if (!photo) return null;
          return (
            <PsdBox key={i} x={frame.x} y={frame.y} width={frame.w} height={frame.h} sectionY={Y} sectionH={H} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt ?? ""} className="h-full w-full object-cover" />
            </PsdBox>
          );
        })}
      </PsdSection>
    </SceneFrame>
  );
}
