"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import type { InviteLinkContext } from "@/lib/rsvp-core";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SectionLabel from "@/components/ui/SectionLabel";
import PhoneInput, { defaultPhoneValue, phoneValueToRaw, type PhoneInputValue } from "@/components/ui/PhoneInput";
import RsvpSuccessPanel from "@/components/rsvp/RsvpSuccessPanel";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, getButtonStyles, getCardStyles, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
  inviteToken?: string;
  inviteLinkContext?: InviteLinkContext;
  controlledMaxSeats?: number;
  controlledLabel?: string;
}

type Content = { sectionLabel?: string };
type VProps = {
  scene: InvitationScene;
  config: InvitationConfig;
  content: Content;
  d: ResolvedDesign;
  inviteToken?: string;
  inviteLinkContext?: InviteLinkContext;
  controlledMaxSeats?: number;
  controlledLabel?: string;
};

type FormState = { name: string; guests: string; note: string; phone: PhoneInputValue };

type SubmitSuccess = {
  guestCode: string;
  status: string;
  approvedSeats?: number | null;
};

function initialSuccessFromContext(ctx?: InviteLinkContext): SubmitSuccess | null {
  if (ctx?.status === "already_confirmed" && ctx.guestView.found && ctx.guestView.guestCode) {
    return {
      guestCode: ctx.guestView.guestCode,
      status: ctx.guestView.status ?? "confirmed",
      approvedSeats: ctx.guestView.approvedSeats,
    };
  }
  return null;
}

function useRSVPForm(
  slug: string,
  maxSeats: number,
  options?: {
    inviteToken?: string;
    inviteLinkContext?: InviteLinkContext;
  }
) {
  const [form, setForm] = useState<FormState>({
    name: "",
    guests: "1",
    note: "",
    phone: defaultPhoneValue(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SubmitSuccess | null>(() =>
    initialSuccessFromContext(options?.inviteLinkContext)
  );

  const seatOptions = Array.from({ length: Math.max(1, maxSeats) }, (_, i) => i + 1);
  const isControlled = Boolean(options?.inviteToken);
  const linkBlocked = options?.inviteLinkContext?.status === "invalid";
  const linkDone = options?.inviteLinkContext?.status === "already_confirmed";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (linkBlocked || linkDone) return;

    setSubmitting(true);
    setError(null);

    const seats = Number.parseInt(form.guests, 10);

    try {
      const response = await fetch(
        isControlled ? "/api/rsvp/controlled/confirm" : "/api/rsvp/public",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isControlled
              ? {
                  slug,
                  inviteToken: options!.inviteToken,
                  name: form.name.trim(),
                  seats,
                  phone: form.phone.national.trim()
                    ? phoneValueToRaw(form.phone)
                    : undefined,
                }
              : {
                  slug,
                  name: form.name.trim(),
                  phone: phoneValueToRaw(form.phone),
                  requestedSeats: seats,
                  guestNote: form.note.trim() || undefined,
                }
          ),
        }
      );

      const data = (await response.json()) as {
        guestCode?: string;
        status?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "تعذر إرسال الطلب. حاول مرة أخرى.");
        return;
      }

      if (data.guestCode) {
        setSuccess({
          guestCode: data.guestCode,
          status: data.status ?? (isControlled ? "confirmed" : "pending"),
          approvedSeats: isControlled ? seats : undefined,
        });
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    form,
    submitting,
    error,
    success,
    seatOptions,
    handleChange,
    handleSubmit,
    setPhone: (phone: PhoneInputValue) => setForm((prev) => ({ ...prev, phone })),
    isControlled,
    linkBlocked,
    linkDone,
  };
}

function ControlledLinkNotice({
  message,
  tone,
}: {
  message: string;
  tone: "error" | "info";
}) {
  return (
    <p
      className="text-sm text-center leading-relaxed px-2 py-3 rounded-md"
      style={{
        color: tone === "error" ? "#E8A0A0" : "inherit",
        backgroundColor: tone === "error" ? "rgba(196,92,92,0.12)" : "rgba(255,255,255,0.06)",
        border: tone === "error" ? "1px solid rgba(196,92,92,0.35)" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {message}
    </p>
  );
}

// ─── Variant: luxury_form ─────────────────────────────────────────────────────
// Full styled form with ornament divider.

function LuxuryForm({ scene, config, content, d, inviteToken, inviteLinkContext, controlledMaxSeats, controlledLabel }: VProps) {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("t") ?? undefined;
  const effectiveToken = inviteToken ?? tokenFromUrl;

  const { theme, rsvp, slug } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);
  const isControlledLink = Boolean(effectiveToken);
  const label = content.sectionLabel ?? (isControlledLink ? "تأكيد الدعوة الخاصة" : "تأكيد الحضور");
  const maxSeats = isControlledLink ? (controlledMaxSeats ?? 4) : (rsvp.maxPublicRequest ?? 4);
  const { form, submitting, error, success, seatOptions, handleChange, handleSubmit, setPhone, isControlled, linkBlocked, linkDone } = useRSVPForm(slug, maxSeats, {
    inviteToken: effectiveToken,
    inviteLinkContext,
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: `rgba(${primaryRgb},0.04)`,
    border: `1px solid rgba(${primaryRgb},0.22)`,
    color: theme.textColor ?? "#F5F0E8",
    fontFamily: resolveFont(d, "body"),
    fontSize: "0.9rem",
    outline: "none",
    direction: "rtl",
    borderRadius: 0,
  };

  if (!rsvp.enabled) return null;

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-6 py-16 gap-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <SectionLabel text={label} d={d} />
          <SceneOrnament dividerStyle={d.dividerStyle} ornamentAsset={d.ornamentAsset} />
          {controlledLabel && (
            <p className="text-xs opacity-60 max-w-xs">{controlledLabel}</p>
          )}
          {isControlledLink && inviteLinkContext?.status === "invalid" && (
            <ControlledLinkNotice message={inviteLinkContext.message} tone="error" />
          )}
        </motion.div>

        {!success && !linkDone && !linkBlocked && (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              display: success ? "none" : "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%",
              maxWidth: 320,
              padding: "2rem 1.75rem",
              position: "relative",
              textAlign: "right",
              ...cardStyles,
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="اسمك الكريم"
              value={form.name}
              onChange={handleChange}
              required
              disabled={submitting}
              style={inputStyle}
            />

            <PhoneInput
              value={form.phone}
              onChange={setPhone}
              disabled={submitting}
              required={!isControlled}
              inputStyle={inputStyle}
            />

            <select
              name="guests"
              value={form.guests}
              onChange={handleChange}
              disabled={submitting}
              style={inputStyle}
            >
              {seatOptions.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "شخص" : "أشخاص"}
                </option>
              ))}
            </select>

            <textarea
              name="note"
              placeholder="ملاحظة (اختياري)"
              value={form.note}
              onChange={handleChange}
              disabled={submitting || Boolean(inviteToken)}
              rows={3}
              style={{ ...inputStyle, resize: "none", display: inviteToken ? "none" : undefined }}
            />

            {error && (
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  fontSize: "0.8rem",
                  color: "#E8A0A0",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              disabled={submitting}
              style={{
                ...btnStyle,
                marginTop: "0.5rem",
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? "جاري الإرسال..." : "تأكيد الحضور"}
            </motion.button>
          </motion.form>
        )}

        {success && (
          <RsvpSuccessPanel
            guestCode={success.guestCode}
            status={success.status}
            approvedSeats={success.approvedSeats}
            primaryColor={theme.primaryColor}
            textColor={theme.textColor ?? "#F5F0E8"}
          />
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Variant: minimal_form ────────────────────────────────────────────────────
// Same fields, much less decoration. Clean and minimal.

function MinimalForm({ scene, config, content, d, inviteToken, inviteLinkContext, controlledMaxSeats, controlledLabel }: VProps) {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("t") ?? undefined;
  const effectiveToken = inviteToken ?? tokenFromUrl;

  const { theme, rsvp, slug } = config;
  const isControlledLink = Boolean(effectiveToken);
  const label = content.sectionLabel ?? (isControlledLink ? "تأكيد الدعوة الخاصة" : "تأكيد الحضور");
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);
  const maxSeats = isControlledLink ? (controlledMaxSeats ?? 4) : (rsvp.maxPublicRequest ?? 4);
  const { form, submitting, error, success, seatOptions, handleChange, handleSubmit, setPhone, isControlled, linkBlocked, linkDone } = useRSVPForm(slug, maxSeats, {
    inviteToken: effectiveToken,
    inviteLinkContext,
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 0",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: `1px solid rgba(var(--inv-primary-rgb),0.2)`,
    color: theme.textColor ?? "#F5F0E8",
    fontFamily: resolveFont(d, "body"),
    fontSize: "0.9rem",
    outline: "none",
    direction: "rtl",
  };

  if (!rsvp.enabled) return null;

  return (
    <SceneFrame config={config} scene={scene}>
      {scene.background && <LayerRenderer layer={scene.background} />}
      {scene.overlay && <LayerRenderer layer={scene.overlay} />}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-dvh px-8 py-16 gap-10">
        <SectionLabel text={label} d={d} />
        {controlledLabel && <p className="text-xs opacity-60 text-center max-w-xs">{controlledLabel}</p>}
        {isControlledLink && inviteLinkContext?.status === "invalid" && (
          <ControlledLinkNotice message={inviteLinkContext.message} tone="error" />
        )}

        {!success && !linkDone && !linkBlocked && (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              display: success ? "none" : "flex",
              flexDirection: "column",
              gap: "1.5rem",
              width: "100%",
              maxWidth: 300,
              textAlign: "right",
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="اسمك الكريم"
              value={form.name}
              onChange={handleChange}
              required
              disabled={submitting}
              style={inputStyle}
            />

            <PhoneInput
              value={form.phone}
              onChange={setPhone}
              disabled={submitting}
              required={!isControlled}
              inputStyle={inputStyle}
            />

            <select
              name="guests"
              value={form.guests}
              onChange={handleChange}
              disabled={submitting}
              style={inputStyle}
            >
              {seatOptions.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "شخص" : "أشخاص"}
                </option>
              ))}
            </select>

            <textarea
              name="note"
              placeholder="ملاحظة (اختياري)"
              value={form.note}
              onChange={handleChange}
              disabled={submitting || Boolean(inviteToken)}
              rows={2}
              style={{ ...inputStyle, resize: "none", display: inviteToken ? "none" : undefined }}
            />

            {error && (
              <p
                style={{
                  fontFamily: resolveFont(d, "body"),
                  fontSize: "0.8rem",
                  color: "#E8A0A0",
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              disabled={submitting}
              style={{
                ...btnStyle,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? "جاري الإرسال..." : "تأكيد الحضور"}
            </motion.button>
          </motion.form>
        )}

        {success && (
          <RsvpSuccessPanel
            guestCode={success.guestCode}
            status={success.status}
            approvedSeats={success.approvedSeats}
            primaryColor={theme.primaryColor}
            textColor={theme.textColor ?? "#F5F0E8"}
          />
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function RSVPScene({
  scene,
  config,
  inviteToken,
  inviteLinkContext,
  controlledMaxSeats,
  controlledLabel,
}: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d, inviteToken, inviteLinkContext, controlledMaxSeats, controlledLabel };

  switch (scene.variant) {
    case "minimal_form": return <MinimalForm {...p} />;
    case "hidden": return null;
    default: return <LuxuryForm {...p} />;
  }
}
