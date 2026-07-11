import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function PrivacySection({ content }: Props) {
  const { privacy } = content;

  return (
    <section className="border-t border-[var(--border)]/60 bg-white py-20 sm:py-24" aria-labelledby="privacy-heading">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <ScrollReveal>
          <h2
            id="privacy-heading"
            className="text-2xl sm:text-3xl"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {privacy.title}
          </h2>
          <p className="mt-3 text-[var(--muted)]">{privacy.subtitle}</p>
        </ScrollReveal>

        <StaggerChildren className="mt-10 space-y-4 text-start" stagger={0.06}>
          {privacy.points.map((point) => (
            <StaggerItem key={point}>
              <p className="text-sm leading-relaxed text-[var(--foreground)] sm:text-base">{point}</p>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
