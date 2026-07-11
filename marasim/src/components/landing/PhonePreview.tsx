"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  posterSrc: string;
  posterAlt: string;
  accent?: string;
  className?: string;
  priority?: boolean;
  label?: string;
};

/** Editorial phone frame — not a stock mockup asset */
export default function PhonePreview({
  posterSrc,
  posterAlt,
  accent = "var(--accent)",
  className = "",
  priority = false,
  label,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`relative mx-auto w-[min(100%,280px)] ${className}`}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[3rem] opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }}
        aria-hidden
      />

      <div
        className="relative overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[var(--surface-muted)] p-2 shadow-[0_24px_80px_-20px_rgba(61,50,41,0.18)]"
        style={{ aspectRatio: "9/19.5" }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-[var(--background)]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% 30%, #FFF9F0 0%, #FBF7F2 45%, #F0E6D8 100%)",
            }}
            aria-hidden
          />
          {!imgError ? (
            <Image
              src={posterSrc}
              alt={posterAlt}
              fill
              sizes="(max-width: 768px) 260px, 300px"
              className="object-cover"
              priority={priority}
              onError={() => setImgError(true)}
            />
          ) : null}

          {/* Top bar hint */}
          <div className="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-black/10 to-transparent" aria-hidden />

          {label && (
            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/35 to-transparent px-4 pb-4 pt-12">
              <p className="text-center text-xs tracking-wide text-white/90">{label}</p>
            </div>
          )}
        </div>
      </div>

      {/* Side accent line */}
      <div
        className="absolute -right-1 top-1/4 h-24 w-px opacity-50"
        style={{ background: `linear-gradient(180deg, transparent, ${accent}, transparent)` }}
        aria-hidden
      />
    </motion.div>
  );
}
