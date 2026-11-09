"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { OPEN_INVITE_ANCHOR, PSD_DECOR, PSD_FONT, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

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
  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      {/* Same crop as the opening video, so the last frame and this screen are one picture. */}
      <div className="relative h-[100dvh] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PSD_DECOR.openingSettled}
          alt=""
          className="inv-opening-settle pointer-events-none absolute inset-0"
          draggable={false}
        />
      </div>

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
