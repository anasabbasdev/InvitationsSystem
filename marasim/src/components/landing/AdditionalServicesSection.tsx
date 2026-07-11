import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function AdditionalServicesSection({ content }: Props) {
  const { additional } = content;
  const items = additional.items.filter((i) => i.enabled);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="additional-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-12 max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-[var(--accent)] uppercase">{additional.title}</p>
          <h2
            id="additional-heading"
            className="mt-3 text-[clamp(1.5rem,4vw,2.25rem)] text-[var(--muted)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {additional.subtitle}
          </h2>
        </ScrollReveal>

        <StaggerChildren className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <article className="grid gap-2 py-8 sm:grid-cols-[1fr_2fr] sm:gap-12 sm:py-10">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
