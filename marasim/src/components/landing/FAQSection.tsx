"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LandingContent } from "@/data/landing";
import { ScrollReveal } from "./landing-motion";

type Props = { content: LandingContent };

export default function FAQSection({ content }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const reduced = useReducedMotion();
  const { faq, faqHeading } = content;

  return (
    <section id="faq" className="py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <ScrollReveal className="mb-10 text-center">
          <h2
            id="faq-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {faqHeading}
          </h2>
        </ScrollReveal>

        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-btn-${index}`;

            return (
              <div key={item.question}>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-start text-base font-medium transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  <span>{item.question}</span>
                  <span
                    className={`shrink-0 text-[var(--accent)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: reduced ? 0.15 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm leading-relaxed text-[var(--muted)]">{item.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
