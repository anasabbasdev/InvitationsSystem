"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { LandingContent } from "@/data/landing";
import { ScrollReveal } from "./landing-motion";

type Props = { content: LandingContent };

function GuestPreview({ content }: Props) {
  const p = content.experience.previews.guest;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm">
      <div className="mb-3 text-center text-[10px] text-[var(--muted)]">{p.label}</div>
      <div
        className="mx-auto max-w-[200px] rounded-xl p-4 text-center"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, #FFF9F0, #FBF7F2)",
        }}
      >
        <p className="text-lg" style={{ fontFamily: "var(--font-amiri)", color: "#A67C2E" }}>
          {p.title}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">{p.openLabel}</p>
        <div className="mt-4 rounded-full bg-[var(--accent)] px-4 py-2 text-[10px] text-[#FFFBF5]">
          {p.rsvpButton}
        </div>
      </div>
    </div>
  );
}

function OwnerPreview({ content }: Props) {
  const p = content.experience.previews.owner;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="mb-3 text-[10px] text-[var(--muted)]">{p.label}</div>
      <div className="space-y-2">
        {p.rows.map((row, i) => (
          <div
            key={row}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-[11px]"
          >
            <span>{row}</span>
            <span className={i === 0 ? "text-amber-700" : "text-[var(--muted)]"}>{p.rowBadges[i]}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-[var(--muted)]">{p.seatsLabel}</p>
    </div>
  );
}

function GatePreview({ content }: Props) {
  const p = content.experience.previews.gate;
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm">
      <div className="mb-3 text-[10px] text-[var(--muted)]">{p.label}</div>
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-[var(--accent)]/40 bg-[var(--surface-muted)]">
        <span className="text-2xl opacity-60">▢</span>
      </div>
      <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-[11px] text-emerald-800">
        {p.validStatus}
      </div>
    </div>
  );
}

export default function ExperienceSection({ content }: Props) {
  const [roleId, setRoleId] = useState<"guest" | "owner" | "gate">("guest");
  const reduced = useReducedMotion();
  const { experience, ui } = content;
  const role = experience.roles.find((r) => r.id === roleId)!;

  const previews = {
    guest: () => <GuestPreview content={content} />,
    owner: () => <OwnerPreview content={content} />,
    gate: () => <GatePreview content={content} />,
  };
  const Preview = previews[roleId];

  return (
    <section
      id="experience"
      className="bg-[var(--surface-muted)] py-20 sm:py-28"
      aria-labelledby="experience-roles-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-12 max-w-2xl">
          <h2
            id="experience-roles-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {experience.title}
          </h2>
          <p className="mt-4 text-[var(--muted)]">{experience.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label={ui.experienceTabsAria}>
              {experience.roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={roleId === r.id}
                  onClick={() => setRoleId(r.id)}
                  className={`rounded-full px-4 py-2 text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    roleId === r.id
                      ? "bg-[var(--accent)] text-[#FFFBF5]"
                      : "border border-[var(--border)] bg-white text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={roleId}
                role="tabpanel"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.4 }}
              >
                <h3 className="mt-4 text-xl font-medium">{role.title}</h3>
                <ul className="mt-6 space-y-3">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-3 text-[var(--muted)]">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={roleId}
                className="w-full max-w-xs"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.15 : 0.45 }}
              >
                <Preview />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
