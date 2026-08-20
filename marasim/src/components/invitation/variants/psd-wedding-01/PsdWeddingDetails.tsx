"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_DETAILS, PSD_FONT, PSD_SECTIONS, psdFont } from "./coords";

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
  const rawLabel = c.sectionLabel ?? "التفاصيــــــــــــ                     ـــــــــــــل";
  const [detailsRight, detailsLeft] = rawLabel.split(/\s{2,}/);

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.details.plate} heightPsd={H}>
        <PsdBox x={280} y={8760} width={980} height={90} sectionY={Y} sectionH={H} className="flex items-center justify-center">
          <PsdReveal className="flex w-full items-center justify-center" style={{ direction: "rtl" }}>
            <span
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(40),
                fontWeight: 300,
                color: PSD_DETAILS,
                background: "transparent",
                lineHeight: 1,
              }}
            >
              {detailsRight ?? "التفاصيــــــــــــ"}
            </span>
            <span
              dir="ltr"
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(22),
                fontWeight: 300,
                letterSpacing: "0.08em",
                color: PSD_DETAILS,
                background: "transparent",
                lineHeight: 1,
                padding: "0 0.35em",
                transform: "translateY(0.06em)",
              }}
            >
              {c.sectionLabelEn ?? "Details"}
            </span>
            <span
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(40),
                fontWeight: 300,
                color: PSD_DETAILS,
                background: "transparent",
                lineHeight: 1,
              }}
            >
              {detailsLeft ?? "ـــــــــــــل"}
            </span>
          </PsdReveal>
        </PsdBox>
        <PsdBox x={280} y={9000} width={980} height={160} sectionY={Y} sectionH={H} className="flex items-start justify-between px-[6%] text-center">
          <PsdReveal className="flex flex-1 flex-col items-center" delay={0.05}>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS }}>التاريــــخ:</div>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS, marginTop: "0.2em" }}>
              {c.day} {c.date}
            </div>
          </PsdReveal>
          <PsdReveal className="flex flex-1 flex-col items-center" delay={0.1}>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS }}>الساعة:</div>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS, marginTop: "0.2em" }}>{c.time}</div>
          </PsdReveal>
          <PsdReveal className="flex flex-1 flex-col items-center" delay={0.15}>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS }}>العنوان:</div>
            <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_DETAILS, marginTop: "0.2em" }}>{c.venueName}</div>
          </PsdReveal>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
