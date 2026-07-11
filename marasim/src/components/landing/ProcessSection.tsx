import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function ProcessSection({ content }: Props) {
  const { process } = content;

  return (
    <section id="process" className="py-20 sm:py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-14">
          <h2
            id="process-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {process.title}
          </h2>
        </ScrollReveal>

        <StaggerChildren className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {process.steps.map((step) => (
            <StaggerItem key={step.number}>
              <article className="relative flex flex-col gap-3 border-t-2 border-[var(--accent)] pt-6">
                <span
                  className="text-5xl font-light leading-none text-[var(--accent)]/25"
                  style={{ fontFamily: "var(--font-amiri)" }}
                  aria-hidden
                >
                  {step.number}
                </span>
                <h3 className="text-lg font-medium">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
