"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  sectionLabel?: string;
  sectionLabelEn?: string;
  date?: string;
  day?: string;
  time?: string;
  venueName?: string;
};

const Y = PSD_SECTIONS.details.y;
const H = PSD_SECTIONS.details.height;

export default function PsdWeddingDetails({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.details.plate} heightPsd={H}>
        <PsdBox x={280} y={8760} width={980} height={90} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
          <span style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(40), color: PSD_INK, background: "transparent" }}>
            {c.sectionLabel ?? "التفاصيل"}
          </span>
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(24), color: PSD_INK, letterSpacing: "0.14em", marginTop: "0.2em", background: "transparent" }}>
            {c.sectionLabelEn ?? "Details"}
          </span>
        </PsdBox>
        <PsdBox x={280} y={9000} width={980} height={160} sectionY={Y} sectionH={H} className="flex items-start justify-between px-[6%] text-center">
          <div className="flex-1">
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK }}>التاريــــخ:</div>
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK, marginTop: "0.2em" }}>
              {c.day} {c.date}
            </div>
          </div>
          <div className="flex-1">
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK }}>الساعة:</div>
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK, marginTop: "0.2em" }}>{c.time}</div>
          </div>
          <div className="flex-1">
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK }}>العنوان:</div>
            <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(28), color: PSD_INK, marginTop: "0.2em" }}>{c.venueName}</div>
          </div>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
