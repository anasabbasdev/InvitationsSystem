"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

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
          x={300}
          y={13620}
          width={940}
          height={940}
          sectionY={Y}
          sectionH={H}
          className="flex flex-col items-center px-[6%] pt-[4%] text-center"
          style={{ background: "transparent" }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: psdFont(36),
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: PSD_INK,
              margin: 0,
              lineHeight: 1.2,
              background: "transparent",
            }}
          >
            IMPORTANT
            <br />
            NOTES
          </p>
          <p
            style={{
              fontFamily: "var(--font-noto-sans-arabic)",
              fontSize: psdFont(40),
              color: PSD_INK,
              margin: "0.7em 0 0",
              lineHeight: 1.25,
              background: "transparent",
            }}
          >
            ملاحظات
            <br />
            مهمة
          </p>
          <div className="mt-[1.1em] flex w-full flex-col items-center gap-[0.4em]">
            {items.map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(30), color: PSD_INK, margin: 0, lineHeight: 1.4, background: "transparent" }}>
                • {item}
              </p>
            ))}
          </div>
          <div className="mt-[1em] flex w-full flex-col items-center gap-[0.35em]">
            {itemsEn.map((item) => (
              <p key={item} style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(22), fontWeight: 300, color: PSD_INK, margin: 0, lineHeight: 1.4, background: "transparent" }}>
                • {item}
              </p>
            ))}
          </div>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
