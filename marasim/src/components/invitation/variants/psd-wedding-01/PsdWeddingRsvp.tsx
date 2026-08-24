"use client";

import type { CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import type { InvitationConfig, InvitationScene } from "@/types/invitation";
import type { InviteLinkContext } from "@/lib/rsvp-core";
import SceneFrame from "@/components/invitation/SceneFrame";
import PhoneInput from "@/components/ui/PhoneInput";
import RsvpSuccessPanel from "@/components/rsvp/RsvpSuccessPanel";
import { useRSVPForm } from "@/lib/use-rsvp-form";
import { PsdBox, PsdSection } from "./PsdSection";
import { PsdReveal } from "./PsdReveal";
import { PSD_FONT, PSD_INK, PSD_SECTIONS, psdFont } from "./coords";

type Content = { sectionLabel?: string; intro?: string };

const Y = PSD_SECTIONS.rsvp.y;
const H = PSD_SECTIONS.rsvp.height;

export default function PsdWeddingRsvp({
  scene,
  config,
  inviteToken,
  inviteLinkContext,
  controlledMaxSeats,
}: {
  scene: InvitationScene;
  config: InvitationConfig;
  inviteToken?: string;
  inviteLinkContext?: InviteLinkContext;
  controlledMaxSeats?: number;
}) {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("t") ?? undefined;
  const effectiveToken = inviteToken ?? tokenFromUrl;
  const { rsvp, slug, theme } = config;
  const c = (scene.content ?? {}) as Content;
  const isControlledLink = Boolean(effectiveToken);
  const maxSeats = isControlledLink ? (controlledMaxSeats ?? 4) : (rsvp.maxPublicRequest ?? 4);
  const formApi = useRSVPForm(slug, maxSeats, {
    inviteToken: effectiveToken,
    inviteLinkContext,
  });

  const fieldStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    padding: "0 12px",
    backgroundColor: "transparent",
    border: "none",
    color: PSD_INK,
    fontFamily: PSD_FONT.arabic,
    fontSize: psdFont(48),
    fontWeight: 400,
    lineHeight: 1.25,
    outline: "none",
    direction: "rtl",
  };

  if (!rsvp.enabled) return null;

  const showSuccess = Boolean(formApi.success);

  return (
    <SceneFrame config={config} scene={scene} minHeight="auto" style={{ padding: 0 }}>
      <PsdSection plateSrc={showSuccess ? PSD_SECTIONS.rsvp.plateSuccess : PSD_SECTIONS.rsvp.plate} heightPsd={H}>
        {!showSuccess && (
          <>
            <PsdBox
              x={220}
              y={16110}
              width={1100}
              height={120}
              sectionY={Y}
              sectionH={H}
              className="flex items-center justify-center"
              style={{ overflow: "visible" }}
            >
              <PsdReveal>
                <p
                  style={{
                    fontFamily: PSD_FONT.arabic,
                    fontSize: psdFont(28),
                    fontWeight: 300,
                    color: PSD_INK,
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.45,
                    whiteSpace: "normal",
                    background: "transparent",
                  }}
                >
                  {c.intro ?? "نرجو ملئ المعلومات لتأكيد الحضور"}
                </p>
              </PsdReveal>
            </PsdBox>
            <PsdBox x={500} y={16490} width={540} height={90} sectionY={Y} sectionH={H} className="flex items-center justify-center">
              <PsdReveal delay={0.06}>
                <h2
                  style={{
                    fontFamily: PSD_FONT.arabic,
                    fontSize: psdFont(40),
                    fontWeight: 700,
                    color: PSD_INK,
                    margin: 0,
                    textAlign: "center",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.sectionLabel ?? "تأكيد الحضور"}
                </h2>
              </PsdReveal>
            </PsdBox>
          </>
        )}

        {inviteLinkContext?.status === "invalid" && (
          <PsdBox x={450} y={16590} width={638} height={60} sectionY={Y} sectionH={H} className="flex items-center justify-center">
            <p style={{ color: "#9B3B3B", textAlign: "center", fontFamily: PSD_FONT.arabic, margin: 0 }}>{inviteLinkContext.message}</p>
          </PsdBox>
        )}

        {!formApi.success && !formApi.linkDone && !formApi.linkBlocked && (
          <form onSubmit={formApi.handleSubmit}>
            <PsdBox x={450} y={16667} width={638} height={92} sectionY={Y} sectionH={H}>
              <input
                name="name"
                type="text"
                placeholder="الاسم الكريم"
                value={formApi.form.name}
                onChange={formApi.handleChange}
                required
                disabled={formApi.submitting}
                className="psd-rsvp-field"
                style={fieldStyle}
              />
            </PsdBox>
            <PsdBox x={450} y={16786} width={638} height={92} sectionY={Y} sectionH={H}>
              <PhoneInput
                value={formApi.form.phone}
                onChange={formApi.setPhone}
                disabled={formApi.submitting}
                required={!formApi.isControlled}
                className="psd-rsvp-phone h-full w-full"
                compact
                inputStyle={{ ...fieldStyle, height: "100%", direction: "ltr", fontSize: psdFont(40) }}
              />
            </PsdBox>
            <PsdBox x={450} y={16906} width={638} height={92} sectionY={Y} sectionH={H}>
              <select
                name="guests"
                value={formApi.form.guests}
                onChange={formApi.handleChange}
                disabled={formApi.submitting}
                className="psd-rsvp-field psd-rsvp-guests"
                style={{
                  ...fieldStyle,
                  fontSize: psdFont(28),
                  fontWeight: 300,
                  letterSpacing: "0.01em",
                }}
              >
                {formApi.seatOptions.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "شخص" : "أشخاص"}
                  </option>
                ))}
              </select>
            </PsdBox>
            <PsdBox
              x={450}
              y={17025}
              width={638}
              height={216}
              sectionY={Y}
              sectionH={H}
              className="flex flex-col"
            >
              {formApi.error ? (
                <div
                  className="flex h-full w-full flex-col items-center justify-center px-[8%] text-center"
                  style={{ background: "transparent" }}
                  role="alert"
                >
                  <span
                    aria-hidden
                    style={{
                      display: "block",
                      width: "2.2em",
                      height: 1,
                      background: "linear-gradient(90deg, transparent, #C4A35A, transparent)",
                      marginBottom: "0.7em",
                    }}
                  />
                  <p
                    style={{
                      fontFamily: PSD_FONT.arabic,
                      fontSize: psdFont(28),
                      fontWeight: 500,
                      color: "#6E3D36",
                      margin: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {formApi.error}
                  </p>
                  <p
                    style={{
                      fontFamily: PSD_FONT.arabic,
                      fontSize: psdFont(22),
                      color: "#8A7A68",
                      margin: "0.55em 0 0",
                      lineHeight: 1.45,
                    }}
                  >
                    تابع الطلب من شريط «تحقق من حالة دعوتك» أسفل الدعوة.
                  </p>
                </div>
              ) : (
                <textarea
                  name="note"
                  placeholder="ملاحظات (اختياري)"
                  value={formApi.form.note}
                  onChange={formApi.handleChange}
                  disabled={formApi.submitting || Boolean(effectiveToken)}
                  className="psd-rsvp-field"
                  style={{
                    ...fieldStyle,
                    resize: "none",
                    paddingTop: 8,
                    paddingBottom: 8,
                    lineHeight: 1.45,
                    display: effectiveToken ? "none" : undefined,
                  }}
                />
              )}
            </PsdBox>
            <PsdBox x={560} y={17292} width={440} height={86} sectionY={Y} sectionH={H}>
              <button
                type="submit"
                disabled={formApi.submitting}
                className="psd-rsvp-submit h-full w-full"
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#F7F1E8",
                  fontFamily: PSD_FONT.arabic,
                  fontSize: psdFont(40),
                  fontWeight: 600,
                  cursor: formApi.submitting ? "wait" : "pointer",
                }}
              >
                {formApi.submitting ? "جاري الإرسال..." : "تأكيد الحضور"}
              </button>
            </PsdBox>
          </form>
        )}

        {formApi.success && (
          <PsdBox
            x={430}
            y={16420}
            width={680}
            height={1180}
            sectionY={Y}
            sectionH={H}
            className="flex items-center justify-center px-[6%]"
            style={{ background: "transparent" }}
          >
            <RsvpSuccessPanel
              guestCode={formApi.success.guestCode}
              status={formApi.success.status}
              approvedSeats={formApi.success.approvedSeats}
              primaryColor={theme.primaryColor}
              textColor={theme.textColor ?? PSD_INK}
              chrome="plain"
            />
          </PsdBox>
        )}
      </PsdSection>
    </SceneFrame>
  );
}
