"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdArt, PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { OPEN_INVITE_ANCHOR, PSD_DECOR, PSD_FONT, PSD_INK, PSD_MUTED, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  header?: string;
  hostPrimaryTitle?: string;
  hostPrimaryName?: string;
  hostSecondaryTitle?: string;
  hostSecondaryName?: string;
  body?: string;
  eyebrow?: string;
  subtitle?: string;
};

const COVER_H = 3333;
const INVITE_Y = 3333;
const INVITE_H = 1475;

export default function PsdWeddingInvitationMessage({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;
  const names = (config.scenes.find((s) => s.type === "hero_names")?.content ?? {}) as {
    eyebrow?: string;
    subtitle?: string;
  };

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.invitation.plate} heightPsd={COVER_H}>
        <PsdBox x={400} y={400} width={740} height={140} sectionY={0} sectionH={COVER_H} className="flex flex-col items-center justify-center text-center">
          <PsdReveal className="flex flex-col items-center">
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(42),
                fontWeight: 600,
                letterSpacing: "0.18em",
                color: PSD_INK,
                margin: 0,
                background: "transparent",
              }}
            >
              {c.eyebrow ?? "WRITTEN IN LOVE"}
            </p>
            <p
              style={{
                fontFamily: PSD_FONT.latin,
                fontSize: psdFont(28),
                fontWeight: 400,
                letterSpacing: "0.12em",
                color: PSD_MUTED,
                margin: "0.45em 0 0",
                background: "transparent",
              }}
            >
              {c.subtitle ?? "A PROMISE FOR A LIFETIME."}
            </p>
          </PsdReveal>
        </PsdBox>
        <PsdBox x={400} y={2680} width={740} height={120} sectionY={0} sectionH={COVER_H} className="flex flex-col items-center justify-center text-center">
          <PsdReveal className="flex flex-col items-center" delay={0.08}>
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
              {names.eyebrow ?? "OUR FOREVER BEGINS"}
            </p>
          </PsdReveal>
        </PsdBox>
        <PsdArt
          src={PSD_DECOR.artTogether}
          x={542}
          y={2814}
          width={458}
          height={207}
          sectionY={0}
          sectionH={COVER_H}
          alt={names.subtitle ?? "Together"}
        />
      </PsdSection>

      <PsdSection id={OPEN_INVITE_ANCHOR} plateSrc={PSD_SECTIONS.invitation.plateB} heightPsd={INVITE_H}>
        <PsdBox
          x={360}
          y={3920}
          width={820}
          height={280}
          sectionY={INVITE_Y}
          sectionH={INVITE_H}
          className="flex flex-col items-center justify-center text-center"
          style={{ background: "transparent" }}
        >
          <PsdReveal className="flex w-full flex-col items-center">
            <p style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(40), fontWeight: 500, color: PSD_INK, margin: 0, lineHeight: 1.35, background: "transparent" }}>
              {c.header}
            </p>
            <div className="mt-[0.55em] flex w-[88%] justify-between" style={{ direction: "ltr" }}>
              <span className="flex flex-col items-center" style={{ fontFamily: PSD_FONT.displayAr, fontSize: psdFont(40), fontWeight: 700, color: PSD_INK, lineHeight: 1.3 }}>
                <span>{c.hostPrimaryTitle}</span>
                <span>{c.hostPrimaryName}</span>
              </span>
              <span className="flex flex-col items-center" style={{ fontFamily: PSD_FONT.displayAr, fontSize: psdFont(40), fontWeight: 700, color: PSD_INK, lineHeight: 1.3 }}>
                <span>{c.hostSecondaryTitle}</span>
                <span>{c.hostSecondaryName}</span>
              </span>
            </div>
            <p style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(40), fontWeight: 500, color: PSD_INK, margin: "0.55em 0 0", lineHeight: 1.35, background: "transparent" }}>
              {c.body}
            </p>
          </PsdReveal>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
