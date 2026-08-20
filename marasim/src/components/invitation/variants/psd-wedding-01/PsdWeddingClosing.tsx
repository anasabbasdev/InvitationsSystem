"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = { closingTitle?: string; body?: string };

const Y = PSD_SECTIONS.closing.y;
const H = PSD_SECTIONS.closing.height;

export default function PsdWeddingClosing({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.closing.plate} heightPsd={H}>
        {c.closingTitle && (
          <PsdBox x={280} y={18640} width={980} height={120} sectionY={Y} sectionH={H} className="flex items-center justify-center text-center">
            <p style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK, margin: 0, lineHeight: 1.55, background: "transparent" }}>
              {c.closingTitle}
            </p>
          </PsdBox>
        )}
        {c.body && (
          <PsdBox x={160} y={19870} width={1220} height={110} sectionY={Y} sectionH={H} className="flex items-center justify-center text-center">
            <p style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(22), color: PSD_INK, margin: 0, lineHeight: 1.5, background: "transparent" }}>
              {c.body}
            </p>
          </PsdBox>
        )}
      </PsdSection>
    </SceneFrame>
  );
}
