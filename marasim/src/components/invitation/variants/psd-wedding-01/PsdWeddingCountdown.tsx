"use client";

import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "@/components/invitation/SceneFrame";
import { useCountdown } from "@/lib/use-countdown";
import { PsdBox, PsdSection } from "./PsdSection";
import { PSD_GOLD, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = {
  targetDate?: string;
  arabicLine?: string;
  englishLine?: string;
};

const Y = PSD_SECTIONS.countdown.y;
const H = PSD_SECTIONS.countdown.height;

const UNITS = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HOURS" },
  { key: "minutes", label: "MINUTES" },
  { key: "seconds", label: "SECONDS" },
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
        <PsdBox x={480} y={7620} width={580} height={120} sectionY={Y} sectionH={H} className="flex items-center justify-center text-center">
          <p
            className="whitespace-pre-line"
            style={{ fontFamily: "var(--font-noto-sans-arabic)", fontSize: psdFont(40), color: PSD_INK, margin: 0, lineHeight: 1.4, background: "transparent" }}
          >
            {c.arabicLine}
          </p>
        </PsdBox>

        <PsdBox x={360} y={7760} width={820} height={504} sectionY={Y} sectionH={H} className="flex flex-col items-center justify-center px-[4%]">
          <div
            className="flex w-full justify-between gap-[3%]"
            style={{ direction: "ltr" }}
          >
            {UNITS.map((unit) => (
              <div key={unit.key} className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className="flex w-full items-center justify-center"
                  style={{
                    border: `1px solid ${PSD_GOLD}`,
                    boxShadow: "0 1px 0 rgba(196, 163, 90, 0.18)",
                    aspectRatio: "1 / 1",
                    maxHeight: "4.6em",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: psdFont(72),
                      fontWeight: 500,
                      color: PSD_INK,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                    }}
                  >
                    {mounted ? String(values[unit.key]).padStart(2, "0") : "00"}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: psdFont(18),
                    letterSpacing: "0.16em",
                    color: PSD_GOLD,
                    marginTop: "0.45em",
                    background: "transparent",
                  }}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </PsdBox>

        <PsdBox x={420} y={8284} width={700} height={200} sectionY={Y} sectionH={H} className="flex items-center justify-center text-center">
          <p
            className="whitespace-pre-line"
            style={{ fontFamily: "var(--font-montserrat)", fontSize: psdFont(26), color: PSD_INK, margin: 0, lineHeight: 1.55, background: "transparent" }}
          >
            {c.englishLine}
          </p>
        </PsdBox>
      </PsdSection>
    </SceneFrame>
  );
}
