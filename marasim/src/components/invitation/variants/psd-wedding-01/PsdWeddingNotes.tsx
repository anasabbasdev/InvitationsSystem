"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PsdNotesCurtains } from "./PsdNotesCurtains";
import { PSD_FONT, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  sectionLabel?: string;
  sectionLabelEn?: string;
  items?: string[];
  itemsEn?: string[];
};

const Y = PSD_SECTIONS.notes.y;
const H = PSD_SECTIONS.notes.height;

export default function PsdWeddingNotes({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;
  const items = c.items ?? [];
  const itemsEn = c.itemsEn ?? [];

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.notes.plate} heightPsd={H}>
        <PsdBox
          x={531}
          y={13550}
          width={479}
          height={32}
          sectionY={Y}
          sectionH={H}
          className="relative z-[2] flex items-center justify-center text-center"
        >
          <PsdReveal>
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(28),
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: PSD_INK,
                margin: 0,
                lineHeight: 1,
                background: "transparent",
              }}
            >
              {c.sectionLabelEn ?? "IMPORTANT NOTES"}
            </p>
          </PsdReveal>
        </PsdBox>
        <PsdBox
          x={500}
          y={13605}
          width={540}
          height={40}
          sectionY={Y}
          sectionH={H}
          className="relative z-[2] flex items-center justify-center text-center"
        >
          <PsdReveal>
            <p
              style={{
                fontFamily: PSD_FONT.arabic,
                fontSize: psdFont(34),
                fontWeight: 400,
                color: PSD_INK,
                margin: 0,
                lineHeight: 1,
                background: "transparent",
              }}
            >
              {c.sectionLabel ?? "ملاحظات مهمة"}
            </p>
          </PsdReveal>
        </PsdBox>
        <PsdBox
          x={500}
          y={13790}
          width={540}
          height={200}
          sectionY={Y}
          sectionH={H}
          className="relative z-[2] flex flex-col items-center justify-start gap-[0.28em] text-center"
        >
          {items.map((item, index) => (
            <PsdReveal key={item} delay={0.04 + index * 0.04}>
              <p
                style={{
                  fontFamily: PSD_FONT.arabic,
                  fontSize: psdFont(26),
                  fontWeight: 300,
                  color: PSD_INK,
                  margin: 0,
                  lineHeight: 1.35,
                  background: "transparent",
                }}
              >
                • {item}
              </p>
            </PsdReveal>
          ))}
        </PsdBox>
        <PsdBox
          x={360}
          y={14096}
          width={820}
          height={190}
          sectionY={Y}
          sectionH={H}
          className="relative z-[2] flex flex-col items-center justify-start gap-[0.22em] text-center"
        >
          {itemsEn.map((item, index) => (
            <PsdReveal key={item} delay={0.06 + index * 0.04}>
              <p
                style={{
                  fontFamily: PSD_FONT.latin,
                  fontSize: psdFont(20),
                  fontWeight: 300,
                  color: PSD_INK,
                  margin: 0,
                  lineHeight: 1.35,
                  background: "transparent",
                }}
              >
                • {item}
              </p>
            </PsdReveal>
          ))}
        </PsdBox>
        <PsdNotesCurtains />
      </PsdSection>
    </SceneFrame>
  );
}
