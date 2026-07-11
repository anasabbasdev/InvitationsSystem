import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function StatementSection({ content }: Props) {
  const { statement } = content;

  return (
    <section className="relative border-y border-[var(--border)]/60 bg-white py-20 sm:py-28" aria-labelledby="statement-heading">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20">
        <ScrollReveal>
          <h2
            id="statement-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)] leading-snug text-[var(--foreground)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {statement.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-base leading-[1.9] text-[var(--muted)] sm:text-lg">{statement.body}</p>
          <StaggerChildren className="mt-8 flex flex-wrap gap-3">
            {statement.highlights.map((word) => (
              <StaggerItem key={word}>
                <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-1.5 text-sm text-[var(--foreground)]">
                  {word}
                </span>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </ScrollReveal>
      </div>
    </section>
  );
}
