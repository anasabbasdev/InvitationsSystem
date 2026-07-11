"use client";

import Image from "next/image";
import { useState } from "react";
import { LANDING_ASSETS } from "@/data/landing-assets";
import type { LandingContent } from "@/data/landing";
import { LineReveal } from "./landing-motion";
import LandingButton from "./LandingButton";
import HeroVisual from "./HeroVisual";

type Props = {
  content: LandingContent;
};

export default function HeroSection({ content }: Props) {
  const [bgError, setBgError] = useState(false);
  const { hero } = content;

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden pt-24 pb-16 sm:pt-28"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_20%,rgba(201,162,77,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(245,237,227,0.9),transparent_60%)]" />
        {!bgError && (
          <Image
            src={LANDING_ASSETS.heroLayer}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-[0.07] mix-blend-multiply"
            onError={() => setBgError(true)}
          />
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:gap-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 xl:gap-14">
        <div className="order-2 flex flex-col gap-8 text-center lg:order-1 lg:py-4 lg:text-start">
          <h1
            id="hero-heading"
            className="flex flex-col gap-1 text-[clamp(2rem,7vw,3.75rem)] leading-[1.15] text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {hero.lines.map((line, i) => (
              <LineReveal key={line} delay={i * 0.12}>
                {line}
              </LineReveal>
            ))}
          </h1>

          <p className="mx-auto max-w-lg text-base leading-relaxed text-[var(--muted)] sm:text-lg lg:mx-0">
            {hero.subtitle}
          </p>

          <p className="text-xs tracking-[0.2em] text-[var(--accent)] uppercase">{hero.microcopy}</p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <LandingButton href={hero.primaryCta.href} variant="primary">
              {hero.primaryCta.label}
            </LandingButton>
            <LandingButton href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </LandingButton>
          </div>
        </div>

        <div className="order-1 flex min-h-[min(52vh,520px)] items-center justify-center lg:order-2 lg:min-h-0 lg:justify-self-stretch lg:py-6">
          <HeroVisual content={content} />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden>
        <div className="inv-bounce-down h-8 w-px bg-[var(--accent)]/40" />
      </div>
    </section>
  );
}
