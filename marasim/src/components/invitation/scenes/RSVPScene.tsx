"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import SceneFrame from "../SceneFrame";
import LayerRenderer from "../LayerRenderer";
import SceneOrnament from "@/components/ui/SceneOrnament";
import SectionLabel from "@/components/ui/SectionLabel";
import SceneIcon from "@/components/ui/SceneIcon";
import { renderMediaSceneIfNeeded } from "@/lib/render-media-scene";
import { resolveDesign, getButtonStyles, getCardStyles, hexToRgbString, resolveFont, type ResolvedDesign } from "@/lib/scene-design";

interface Props {
  scene: InvitationScene;
  config: InvitationConfig;
}

type Content = { sectionLabel?: string };
type VProps = { scene: InvitationScene; config: InvitationConfig; content: Content; d: ResolvedDesign };

type FormState = { name: string; guests: string; note: string };

function useRSVPForm() {
  const [form, setForm] = useState<FormState>({ name: "", guests: "1", note: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return { form, submitted, handleChange, handleSubmit };
}

// ─── Variant: luxury_form ─────────────────────────────────────────────────────
// Full styled form with ornament divider.

function LuxuryForm({ scene, config, content, d }: VProps) {
  const { theme, rsvp } = config;
  const primaryRgb = hexToRgbString(theme.primaryColor);
  const cardStyles = getCardStyles(d.cardStyle, primaryRgb);
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);
  const label = content.sectionLabel ?? "تأكيد الحضور";
  const { form, submitted, handleChange, handleSubmit } = useRSVPForm();

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
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
              padding: "2.5rem 2rem",
              maxWidth: 320,
              ...cardStyles,
            }}
          >
            <SceneIcon name="check" style="line" size={32} color={theme.primaryColor} />
            <p style={{ fontFamily: resolveFont(d, "heading"), fontSize: "1.2rem", color: theme.primaryColor }}>
              تم استلام طلبك
            </p>
            <p style={{ fontFamily: resolveFont(d, "body"), fontSize: "0.82rem", color: theme.secondaryColor, opacity: 0.65, lineHeight: 1.9 }}>
              في النسخة الفعلية سيتم إنشاء رابط خاص لمتابعة حالة طلبك والحصول على التذكرة بعد موافقة المضيف.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{
              display: "flex",
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
              style={inputStyle}
            />

            <select name="guests" value={form.guests} onChange={handleChange} style={inputStyle}>
              {[1, 2, 3, 4, 5].map((n) => (
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
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              style={{ ...btnStyle, marginTop: "0.5rem" }}
            >
              تأكيد الحضور
            </motion.button>
          </motion.form>
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

function MinimalForm({ scene, config, content, d }: VProps) {
  const { theme, rsvp } = config;
  const label = content.sectionLabel ?? "تأكيد الحضور";
  const btnStyle = getButtonStyles(d.buttonStyle, theme.primaryColor, theme.backgroundColor);
  const { form, submitted, handleChange, handleSubmit } = useRSVPForm();

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

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4 text-center max-w-xs"
          >
            <p style={{ fontFamily: resolveFont(d, "heading"), fontSize: "1.3rem", color: theme.primaryColor }}>
              تم استلام طلبك
            </p>
            <p style={{ fontFamily: resolveFont(d, "body"), fontSize: "0.82rem", color: theme.secondaryColor, opacity: 0.65, lineHeight: 1.9 }}>
              سيتم إنشاء رابط خاص لمتابعة حالة طلبك بعد الموافقة.
            </p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              display: "flex",
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
              style={inputStyle}
            />

            <select name="guests" value={form.guests} onChange={handleChange} style={inputStyle}>
              {[1, 2, 3, 4, 5].map((n) => (
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
              rows={2}
              style={{ ...inputStyle, resize: "none" }}
            />

            <motion.button type="submit" whileTap={{ scale: 0.97 }} style={btnStyle}>
              تأكيد الحضور
            </motion.button>
          </motion.form>
        )}
      </div>

      {scene.foreground?.map((layer, i) => (
        <LayerRenderer key={i} layer={layer} className="pointer-events-none" />
      ))}
    </SceneFrame>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function RSVPScene({ scene, config }: Props) {
  const mediaView = renderMediaSceneIfNeeded(scene, config);
  if (mediaView) return mediaView;

  const d = resolveDesign(config, scene);
  const content = (scene.content ?? {}) as Content;
  const p = { scene, config, content, d };

  switch (scene.variant) {
    case "minimal_form": return <MinimalForm {...p} />;
    case "hidden": return null;
    default: return <LuxuryForm {...p} />;
  }
}
