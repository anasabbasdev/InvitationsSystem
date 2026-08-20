"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type MediaItem = { type: "image" | "video"; src: string; alt?: string };
type Content = { media?: MediaItem[]; label?: string; scriptLabel?: string; caption?: string };

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

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.gallery.plate} heightPsd={H}>
        <PsdBox x={480} y={9469} width={580} height={200} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(36), letterSpacing: "0.22em", color: PSD_INK, background: "transparent" }}>
            {c.label ?? "OUR"}
          </span>
          <span style={{ fontFamily: "var(--font-great-vibes)", fontSize: psdFont(130), color: PSD_INK, lineHeight: 1.05, background: "transparent" }}>
            {c.scriptLabel ?? "Moments"}
          </span>
        </PsdBox>

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
