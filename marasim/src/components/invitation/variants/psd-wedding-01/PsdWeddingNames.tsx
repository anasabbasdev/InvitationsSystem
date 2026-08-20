"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_MUTED, PSD_SECTIONS, psdFont } from "./coords";

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
        <PsdBox x={390} y={5980} width={760} height={280} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: psdFont(36),
              letterSpacing: "0.16em",
              color: PSD_MUTED,
              margin: 0,
              background: "transparent",
            }}
          >
            {c.eyebrow ?? "OUR FOREVER BEGINS"}
          </p>
          <p
            aria-label={[c.primaryName, c.secondaryName].filter(Boolean).join(` ${c.connector ?? "و"} `)}
            style={{
              fontFamily: "var(--font-great-vibes)",
              fontSize: psdFont(140),
              color: PSD_INK,
              margin: "0.1em 0 0",
              lineHeight: 1.05,
              background: "transparent",
            }}
          >
            {c.subtitle ?? "Together"}
          </p>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
