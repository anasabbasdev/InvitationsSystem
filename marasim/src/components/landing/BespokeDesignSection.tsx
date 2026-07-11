import type { LandingContent } from "@/data/landing";
import { ScrollReveal } from "./landing-motion";

type Props = { content: LandingContent };

export default function BespokeDesignSection({ content }: Props) {
  const { bespoke, demos } = content;

  return (
    <section className="border-y border-[var(--border)]/60 bg-white py-20 sm:py-28" aria-labelledby="bespoke-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <h2
              id="bespoke-heading"
              className="text-[clamp(1.75rem,5vw,2.75rem)] leading-snug"
              style={{ fontFamily: "var(--font-amiri)" }}
            >
              {bespoke.title}
              <br />
              <span className="text-[var(--accent)]">{bespoke.titleAccent}</span>
            </h2>
            <p className="mt-6 text-base leading-[1.9] text-[var(--muted)] sm:text-lg">{bespoke.body}</p>
            <p className="mt-8 text-sm tracking-wide text-[var(--accent)]">{bespoke.comparisonNote}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {demos.map((demo, i) => (
                <div
                  key={demo.slug}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border)]"
                  style={{
                    aspectRatio: "3/5",
                    marginTop: i === 1 ? "2rem" : i === 2 ? "1rem" : 0,
                  }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{
                      background: `linear-gradient(160deg, ${demo.accent}22 0%, #f5ede3 50%, #fbf7f2 100%)`,
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-3">
                    <p className="text-center text-xs text-[var(--foreground)]">{demo.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-6 text-xs text-[var(--muted)]">
              {bespoke.variants.map((v) => (
                <span key={v}>{v}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
