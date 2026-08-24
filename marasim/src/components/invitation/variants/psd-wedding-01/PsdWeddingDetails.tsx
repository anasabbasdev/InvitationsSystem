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

function DetailCopy({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <PsdReveal className="flex h-full w-full flex-col items-center justify-start text-center">
      <div
        style={{
          fontFamily: PSD_FONT.arabic,
          fontSize: psdFont(24),
          fontWeight: 300,
          color: PSD_DETAILS,
          lineHeight: 1.2,
          background: "transparent",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: PSD_FONT.arabic,
          fontSize: psdFont(24),
          fontWeight: 300,
          color: PSD_DETAILS,
          lineHeight: 1.25,
          marginTop: "0.15em",
          background: "transparent",
        }}
      >
        {value}
      </div>
    </PsdReveal>
  );
}

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
        <PsdBox
          x={581}
          y={8794}
          width={376}
          height={34}
          sectionY={Y}
          sectionH={H}
          className="relative z-[2] flex items-center justify-center"
        >
          <PsdReveal className="flex w-full items-center justify-center" style={{ direction: "rtl" }}>
            <span
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(34),
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
                fontSize: psdFont(20),
                fontWeight: 300,
                letterSpacing: "0.08em",
                color: PSD_DETAILS,
                background: "transparent",
                lineHeight: 1,
                padding: "0 0.3em",
                transform: "translateY(0.05em)",
              }}
            >
              {c.sectionLabelEn ?? "Details"}
            </span>
            <span
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(34),
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

        <PsdBox x={430} y={9072} width={228} height={70} sectionY={Y} sectionH={H} className="relative z-[2]">
          <DetailCopy label="التاريــــخ:" value={`${c.day ?? ""} ${c.date ?? ""}`.trim()} />
        </PsdBox>
        <PsdBox x={668} y={9072} width={180} height={70} sectionY={Y} sectionH={H} className="relative z-[2]">
          <DetailCopy label="الساعة:" value={c.time ?? ""} />
        </PsdBox>
        <PsdBox x={848} y={9072} width={228} height={70} sectionY={Y} sectionH={H} className="relative z-[2]">
          <DetailCopy label="العنوان:" value={c.venueName ?? ""} />
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
