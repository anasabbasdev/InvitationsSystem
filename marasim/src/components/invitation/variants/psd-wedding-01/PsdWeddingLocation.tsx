"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_FONT, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  sectionLabel?: string;
  sectionLabelEn?: string;
  venueName?: string;
  address?: string;
  mapUrl?: string;
  locationButtonLabel?: string;
};

const Y = PSD_SECTIONS.location.y;
const H = PSD_SECTIONS.location.height;

export default function PsdWeddingLocation({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.location.plate} heightPsd={H}>
        <PsdBox
          x={260}
          y={14610}
          width={1020}
          height={200}
          sectionY={Y}
          sectionH={H}
          className="flex flex-col items-center justify-start text-center"
          style={{ background: "transparent" }}
        >
          <PsdReveal className="flex flex-col items-center">
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(34),
                fontWeight: 600,
                color: PSD_INK,
                margin: 0,
                lineHeight: 1.25,
                background: "transparent",
              }}
            >
              {c.sectionLabelEn ?? "Location on the map"}
            </p>
            <p
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(38),
                fontWeight: 400,
                color: PSD_INK,
                margin: "0.35em 0 0",
                lineHeight: 1.3,
                background: "transparent",
              }}
            >
              {c.sectionLabel ?? "موقع المناسبة"}
            </p>
            {(c.venueName || c.address) && (
              <p
                style={{
                  fontFamily: PSD_FONT.arabic,
                  fontSize: psdFont(26),
                  fontWeight: 300,
                  color: PSD_INK,
                  margin: "0.4em 0 0",
                  lineHeight: 1.35,
                  background: "transparent",
                }}
              >
                {[c.venueName, c.address].filter(Boolean).join(" — ")}
              </p>
            )}
          </PsdReveal>
        </PsdBox>
        <PsdBox x={654} y={15314} width={232} height={55} sectionY={Y} sectionH={H}>
          <a
            href={c.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-full w-full items-center justify-center"
            style={{
              fontFamily: PSD_FONT.arabic,
              fontSize: psdFont(36),
              fontWeight: 500,
              color: "#F7F1E8",
              textDecoration: "none",
              background: "transparent",
            }}
          >
            {c.locationButtonLabel ?? "فتح الخريطة"}
          </a>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
