"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { demoPosterSrc, type LandingContent } from "@/data/landing";
import { ScrollReveal } from "./landing-motion";
import LandingButton from "./LandingButton";
import PhonePreview from "./PhonePreview";

type Props = { content: LandingContent };

export default function InvitationShowcase({ content }: Props) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const { showcase, demos, ui } = content;

  useEffect(() => {
    if (reduced) return;

    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(index);
        },
        { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [reduced]);

  const current = demos[active] ?? demos[0];

  return (
    <section id="showcase" className="relative py-20 sm:py-28" aria-labelledby="showcase-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-14 max-w-2xl">
          <h2
            id="showcase-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)] leading-snug"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {showcase.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">{showcase.subtitle}</p>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(260px,320px)_1fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: reduced ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <PhonePreview
                    posterSrc={demoPosterSrc(current)}
                    posterAlt={current.posterAlt}
                    accent={current.accent}
                    label={current.name}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-16 sm:gap-24">
            {demos.map((demo, index) => (
              <article
                key={demo.slug}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="grid gap-8 border-b border-[var(--border)]/70 pb-16 last:border-0 last:pb-0 sm:gap-10 lg:grid-cols-1"
              >
                <div className="lg:hidden">
                  <PhonePreview
                    posterSrc={demoPosterSrc(demo)}
                    posterAlt={demo.posterAlt}
                    accent={demo.accent}
                    label={demo.name}
                  />
                </div>

                <div className="flex flex-col justify-center gap-4">
                  <p className="text-xs tracking-[0.25em] text-[var(--accent)] uppercase">{demo.tagline}</p>
                  <h3
                    className="text-2xl sm:text-3xl"
                    style={{ fontFamily: "var(--font-amiri)", color: demo.accent }}
                  >
                    {demo.name}
                  </h3>
                  <p className="max-w-md text-base leading-relaxed text-[var(--muted)]">{demo.description}</p>
                  <div className="mt-2">
                    <LandingButton href={demo.href} variant="primary">
                      {ui.viewInviteCta}
                    </LandingButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
