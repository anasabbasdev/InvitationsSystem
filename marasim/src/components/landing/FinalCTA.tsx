"use client";

import Image from "next/image";
import { useState } from "react";
import { LANDING_ASSETS } from "@/data/landing-assets";
import type { LandingContent } from "@/data/landing";
import { getLandingContact } from "@/lib/landing-config";
import LandingButton from "./LandingButton";

function FinalCtaBackground() {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,162,77,0.15), var(--surface-muted))",
        }}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={LANDING_ASSETS.finalCtaPoster}
      alt=""
      fill
      sizes="100vw"
      className="object-cover opacity-[0.12]"
      onError={() => setErr(true)}
    />
  );
}

type Props = { content: LandingContent };

export default function FinalCTA({ content }: Props) {
  const contact = getLandingContact();
  const { finalCta, ui } = content;

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32" aria-labelledby="final-cta-heading">
      <div className="pointer-events-none absolute inset-0">
        <FinalCtaBackground />
        <div className="absolute inset-0 bg-[var(--background)]/85" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-8">
        <h2
          id="final-cta-heading"
          className="text-[clamp(2rem,6vw,3rem)] leading-snug"
          style={{ fontFamily: "var(--font-amiri)" }}
        >
          {finalCta.title}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:text-lg">{finalCta.body}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {contact.whatsappForCta && (
            <LandingButton href={contact.whatsappForCta} variant="primary" external>
              {finalCta.primary.label}
            </LandingButton>
          )}
          <LandingButton href={finalCta.secondary.href} variant="secondary">
            {finalCta.secondary.label}
          </LandingButton>
        </div>

        {contact.whatsapp && (
          <p className="mt-6">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
            >
              {ui.whatsappInline}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
