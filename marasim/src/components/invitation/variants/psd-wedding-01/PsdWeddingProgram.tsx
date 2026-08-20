"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

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
  const reduce = useReducedMotion();

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.program.plate} heightPsd={H}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <PsdBox x={500} y={11220} width={540} height={220} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
            <span style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(40), letterSpacing: "0.2em", color: PSD_INK, background: "transparent" }}>
              {c.sectionLabel ?? "EVENT"}
            </span>
            <span style={{ fontFamily: "var(--font-great-vibes)", fontSize: psdFont(130), color: PSD_INK, lineHeight: 1.05, background: "transparent" }}>
              {c.scriptLabel ?? "Timeline"}
            </span>
          </PsdBox>
        </motion.div>

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
            <motion.div
              key={`en-${item.time}`}
              style={{ color: PSD_INK }}
              initial={reduce ? false : { opacity: 0, y: 10, x: -8 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: reduce ? 0 : 0.12 + index * 0.09 }}
            >
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(32), fontWeight: 500 }}>{item.time}</div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(28), fontWeight: 500, letterSpacing: "0.04em" }}>{item.titleEn}</div>
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(24), fontWeight: 300 }}>{item.detailEn}</div>
            </motion.div>
          ))}
        </PsdBox>

        <PsdBox x={956} y={11484} width={344} height={722} sectionY={Y} sectionH={H} className="flex flex-col justify-between py-[2%] text-right" style={{ background: "transparent" }}>
          {items.map((item, index) => (
            <motion.div
              key={`ar-${item.time}`}
              style={{ color: PSD_INK }}
              initial={reduce ? false : { opacity: 0, y: 10, x: 8 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: reduce ? 0 : 0.12 + index * 0.09 }}
            >
              <div style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(32), fontWeight: 500 }}>{item.time}</div>
              <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(32), fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(26), fontWeight: 300 }}>{item.detail}</div>
            </motion.div>
          ))}
        </PsdBox>

        <PsdBox x={400} y={12310} width={740} height={220} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center text-center">
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(40), color: PSD_INK, background: "transparent" }}>{c.hallEyebrow}</span>
          <span style={{ fontFamily: "var(--font-great-vibes)", fontSize: psdFont(120), color: PSD_INK, lineHeight: 1.05, background: "transparent" }}>{c.hallTitle}</span>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
