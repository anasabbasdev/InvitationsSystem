"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdArt, PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_DECOR, PSD_FONT, PSD_SECTIONS, PSD_WHITE, psdFont } from "./coords";

type ProgramItem = {
  time: string;
  title: string;
  detail?: string;
  titleEn?: string;
  detailEn?: string;
};

type Content = {
  sectionLabel?: string;
  scriptLabel?: string;
  hallEyebrow?: string;
  hallTitle?: string;
  programItems?: ProgramItem[];
};

const Y = PSD_SECTIONS.program.y;
const H = PSD_SECTIONS.program.height;

export default function PsdWeddingProgram({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;
  const items = c.programItems ?? [];

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.program.plate} heightPsd={H}>
        <PsdBox x={500} y={11220} width={540} height={48} sectionY={Y} sectionH={H} className="flex items-center justify-center">
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
              {c.sectionLabel ?? "EVENT"}
            </span>
          </PsdReveal>
        </PsdBox>

        <PsdArt src={PSD_DECOR.artTimeline} x={591} y={11286} width={357} height={159} sectionY={Y} sectionH={H} alt={c.scriptLabel ?? "Timeline"} />

        <PsdBox
          x={265}
          y={11484}
          width={298}
          height={758}
          sectionY={Y}
          sectionH={H}
          className="flex flex-col justify-between py-[2%] text-left"
          style={{ direction: "ltr", background: "transparent" }}
        >
          {items.map((item, index) => (
            <PsdReveal key={`en-${item.time}`} delay={0.06 + index * 0.07} x={-10} y={8}>
              <div style={{ color: PSD_WHITE }}>
                <div style={{ fontFamily: PSD_FONT.latin, fontSize: psdFont(28), fontWeight: 500 }}>{item.time}</div>
                <div style={{ fontFamily: PSD_FONT.latin, fontSize: psdFont(24), fontWeight: 500, letterSpacing: "0.04em" }}>{item.titleEn}</div>
                <div style={{ fontFamily: PSD_FONT.latin, fontSize: psdFont(22), fontWeight: 300 }}>{item.detailEn}</div>
              </div>
            </PsdReveal>
          ))}
        </PsdBox>

        <PsdBox x={956} y={11484} width={344} height={722} sectionY={Y} sectionH={H} className="flex flex-col justify-between py-[2%] text-right" style={{ background: "transparent" }}>
          {items.map((item, index) => (
            <PsdReveal key={`ar-${item.time}`} delay={0.06 + index * 0.07} x={10} y={8}>
              <div style={{ color: PSD_WHITE }}>
                <div style={{ fontFamily: PSD_FONT.latin, fontSize: psdFont(28), fontWeight: 500 }}>{item.time}</div>
                <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 400 }}>{item.title}</div>
                <div style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(24), fontWeight: 200 }}>{item.detail}</div>
              </div>
            </PsdReveal>
          ))}
        </PsdBox>

        <PsdBox x={400} y={12310} width={740} height={48} sectionY={Y} sectionH={H} className="flex items-center justify-center">
          <PsdReveal delay={0.08}>
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
              {c.hallEyebrow ?? "Our Luxury"}
            </span>
          </PsdReveal>
        </PsdBox>

        <PsdArt src={PSD_DECOR.artWeddingHall} x={369} y={12361} width={828} height={181} sectionY={Y} sectionH={H} alt={c.hallTitle ?? "Wedding Hall"} delay={0.1} />
      </PsdSection>
    </SceneFrame>
  );
}
