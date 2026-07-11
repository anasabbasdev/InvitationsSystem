import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";
import OccasionCard from "./OccasionCard";

type Props = { content: LandingContent };

export default function OccasionsSection({ content }: Props) {
  const { occasions } = content;

  return (
    <section id="occasions" className="bg-[var(--surface-muted)] py-20 sm:py-28" aria-labelledby="occasions-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mb-12">
          <h2
            id="occasions-heading"
            className="text-[clamp(1.75rem,5vw,2.75rem)]"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {occasions.title}
          </h2>
        </ScrollReveal>

        <StaggerChildren className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {occasions.items.map((item, i) => (
            <StaggerItem key={item.imageKey}>
              <OccasionCard item={item} staggerOffset={i % 3 === 1 ? 24 : 0} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
