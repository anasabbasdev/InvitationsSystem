"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LANDING_ASSETS } from "@/data/landing-assets";
import type { LandingContent } from "@/data/landing";

type Props = {
  content: LandingContent;
};

function InvitationMockScreen({ content }: Props) {
  const { visualMock } = content.hero;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-5 text-center"
      style={{
        background:
          "radial-gradient(ellipse 85% 65% at 50% 35%, #FFF9F0 0%, #FBF7F2 50%, #F0E6D8 100%)",
      }}
    >
      <p className="text-[11px] tracking-[0.2em] text-[var(--muted)] sm:text-xs">{visualMock.label}</p>
      <div className="my-2 h-px w-14 bg-[var(--accent)]/40 sm:my-3 sm:w-16" aria-hidden />
      <p
        className="text-[clamp(1.35rem,4.5vw,1.85rem)] leading-tight text-[var(--accent)]"
        style={{ fontFamily: "var(--font-amiri)" }}
      >
        {visualMock.name1}
      </p>
      <p className="text-xs text-[var(--muted)] sm:text-sm">{visualMock.conj}</p>
      <p
        className="text-[clamp(1.35rem,4.5vw,1.85rem)] leading-tight text-[var(--accent)]"
        style={{ fontFamily: "var(--font-amiri)" }}
      >
        {visualMock.name2}
      </p>
      <p className="mt-2 text-[11px] text-[var(--muted)] sm:text-xs">{visualMock.inviteLine}</p>
      <span className="mt-5 rounded-full bg-[var(--accent)] px-6 py-2.5 text-[11px] text-[#FFFBF5] shadow-sm sm:mt-6 sm:px-7 sm:text-xs">
        {visualMock.tapLabel}
      </span>
    </div>
  );
}

export default function HeroVisual({ content }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const reduced = useReducedMotion();
  const showPoster = imageLoaded && !imageError;
  const { hero, ui } = content;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[min(100%,360px)] sm:max-w-[400px] lg:max-w-[min(100%,440px)] xl:max-w-[460px]"
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute -start-4 top-10 w-[78%] opacity-45 sm:-start-8 sm:top-12 lg:-start-10"
        aria-hidden
      >
        <div
          className="rounded-[2.1rem] border border-[var(--border)] bg-[var(--surface-muted)] p-2 shadow-lg lg:rounded-[2.35rem]"
          style={{ aspectRatio: "9/19.5", transform: "rotate(-7deg)" }}
        >
          <div
            className="h-full w-full rounded-[1.6rem]"
            style={{
              background: "linear-gradient(160deg, #F5EEE4, #E8D5A8)",
            }}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute -end-2 top-2 h-40 w-40 rounded-full opacity-35 blur-3xl lg:-end-6 lg:h-48 lg:w-48"
        style={{ background: "radial-gradient(circle, #C9A24D55, transparent 70%)" }}
        aria-hidden
      />

      <Link
        href={hero.demoHref}
        className="relative block transition-transform duration-500 hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
        aria-label={ui.heroDemoAria}
      >
        <div
          className="relative overflow-hidden rounded-[2.35rem] border border-[var(--border)] bg-white p-2.5 shadow-[0_32px_100px_-28px_rgba(61,50,41,0.28)] lg:rounded-[2.5rem] lg:p-3"
          style={{ aspectRatio: "9/19.5" }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-[var(--background)] lg:rounded-[2rem]">
            <InvitationMockScreen content={content} />

            {!imageError && (
              <Image
                src={LANDING_ASSETS.heroPoster}
                alt=""
                fill
                sizes="(max-width: 640px) 360px, (max-width: 1024px) 400px, 460px"
                className={`object-cover transition-opacity duration-700 ${showPoster ? "opacity-100" : "opacity-0"}`}
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-black/12 to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </Link>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">{ui.heroDemoCaption}</p>
    </motion.div>
  );
}
