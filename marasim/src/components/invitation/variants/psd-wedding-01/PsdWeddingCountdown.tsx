"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { useCountdown } from "@/lib/use-countdown";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PsdCountdownLeaves } from "./PsdCountdownLeaves";
import { PSD_DECOR, PSD_FONT, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  targetDate?: string;
  arabicLine?: string;
  englishLine?: string;
};

const Y = PSD_SECTIONS.countdown.y;
const H = PSD_SECTIONS.countdown.height;

const UNITS = [
  { key: "days" },
  { key: "hours" },
  { key: "minutes" },
  { key: "seconds" },
] as const;

export default function PsdWeddingCountdown({
  scene,
  config,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
}) {
  const c = (scene.content ?? {}) as Content;
  const { tl, mounted } = useCountdown(c.targetDate);
  const values = {
    days: tl?.days ?? 0,
    hours: tl?.hours ?? 0,
    minutes: tl?.minutes ?? 0,
    seconds: tl?.seconds ?? 0,
  };

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={PSD_SECTIONS.countdown.plate} heightPsd={H}>
        <PsdCountdownLeaves />
        <PsdBox x={480} y={7620} width={580} height={120} sectionY={Y} sectionH={H} className="relative z-[2] flex items-center justify-center text-center">
          <PsdReveal>
            <p
              className="whitespace-pre-line"
              style={{ fontFamily: PSD_FONT.arabic, fontSize: psdFont(40), fontWeight: 300, color: PSD_INK, margin: 0, lineHeight: 1.4, background: "transparent" }}
            >
              {c.arabicLine}
            </p>
          </PsdReveal>
        </PsdBox>

        <PsdBox x={397} y={7829} width={759} height={367} sectionY={Y} sectionH={H} className="psd-timer-host">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PSD_DECOR.countdownTimer}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
          <div className="psd-timer-row" dir="ltr">
            {UNITS.map((unit) => (
              <div key={unit.key} className="psd-timer-cell">
                <span className="psd-timer-digit">
                  {mounted ? String(values[unit.key]).padStart(2, "0") : "00"}
                </span>
              </div>
            ))}
          </div>
        </PsdBox>

        <PsdBox x={420} y={8284} width={700} height={200} sectionY={Y} sectionH={H} className="relative z-[2] flex items-center justify-center text-center">
          <PsdReveal delay={0.06}>
            <p
              className="whitespace-pre-line"
              style={{ fontFamily: PSD_FONT.latin, fontSize: psdFont(26), fontWeight: 400, color: PSD_INK, margin: 0, lineHeight: 1.55, background: "transparent" }}
            >
              {c.englishLine}
            </p>
          </PsdReveal>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
