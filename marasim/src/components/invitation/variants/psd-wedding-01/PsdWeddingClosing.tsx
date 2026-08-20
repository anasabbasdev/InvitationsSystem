"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { PsdArt, PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { APP_NAME } from "@/lib/app-brand";
import { PSD_DECOR, PSD_FONT, PSD_INK, PSD_SECTIONS, PSD_TICKER, psdFont } from "./coords";

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
  const ticker = (c.body?.trim() || PSD_TICKER).replaceAll("مراسيم", APP_NAME);

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0, overflow: "visible" }}>
      <PsdSection plateSrc={PSD_SECTIONS.closing.plate} heightPsd={H} style={{ overflow: "visible" }}>
        <PsdArt
          src={PSD_DECOR.closingThanks}
          x={524}
          y={17826}
          width={492}
          height={528}
          sectionY={Y}
          sectionH={H}
          alt="وشكراً"
        />
        {c.closingTitle && (
          <PsdBox x={280} y={18640} width={980} height={120} sectionY={Y} sectionH={H} className="flex items-center justify-center text-center">
            <PsdReveal>
              <p style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(28), fontWeight: 300, color: PSD_INK, margin: 0, lineHeight: 1.55, background: "transparent" }}>
                {c.closingTitle}
              </p>
            </PsdReveal>
          </PsdBox>
        )}

        <PsdBox x={0} y={19899} width={1540} height={101} sectionY={Y} sectionH={H} className="overflow-hidden">
          <div className="psd-ticker" dir="ltr" aria-label={ticker}>
            <div className="psd-ticker-track">
              {Array.from({ length: 4 }, (_, index) => (
                <span key={index} className="psd-ticker-copy" aria-hidden={index > 0}>
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
