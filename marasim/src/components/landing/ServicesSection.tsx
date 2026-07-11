import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function ServicesSection({ content }: Props) {
  const { services } = content;

  return (
    <section id="services" className="py-20 sm:py-28" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-16 max-w-2xl">
          <h2
            id="services-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {services.title}
          </h2>
          <p className="mt-4 text-lg text-[var(--muted)]">{services.subtitle}</p>
        </ScrollReveal>

        <StaggerChildren className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
          {services.items.map((item, i) => (
            <StaggerItem key={item.number}>
              <article
                className={`flex h-full flex-col gap-3 bg-white p-8 sm:p-10 ${
                  i === services.items.length - 1 && services.items.length % 2 === 1
                    ? "sm:col-span-2 sm:max-w-xl"
                    : ""
                }`}
              >
                <span
                  className="text-4xl font-light text-[var(--accent)]/30 sm:text-5xl"
                  style={{ fontFamily: "var(--font-amiri)" }}
                  aria-hidden
                >
                  {item.number}
                </span>
                <h3 className="text-lg font-medium text-[var(--foreground)]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
