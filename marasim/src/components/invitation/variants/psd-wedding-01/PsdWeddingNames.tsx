"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdArt, PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_DECOR, PSD_FONT, PSD_MUTED, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  primaryName?: string;
  secondaryName?: string;
  connector?: string;
  eyebrow?: string;
  subtitle?: string;
};

const Y = PSD_SECTIONS.names.y;
const H = PSD_SECTIONS.names.height;

export default function PsdWeddingNames({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.names.plate} heightPsd={H}>
        <PsdBox x={390} y={5980} width={760} height={130} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
          <PsdReveal className="flex flex-col items-center">
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(36),
                letterSpacing: "0.16em",
                color: PSD_MUTED,
                margin: 0,
                background: "transparent",
              }}
            >
              {c.eyebrow ?? "OUR FOREVER BEGINS"}
            </p>
            <span className="sr-only">{c.subtitle ?? "Together"}</span>
          </PsdReveal>
        </PsdBox>
        <PsdArt
          src={PSD_DECOR.artTogether}
          x={542}
          y={6117}
          width={458}
          height={207}
          sectionY={Y}
          sectionH={H}
          alt={c.subtitle ?? "Together"}
        />
      </PsdSection>
    </SceneFrame>
  );
}
