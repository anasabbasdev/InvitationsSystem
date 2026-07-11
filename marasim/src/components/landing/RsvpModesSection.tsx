import type { LandingContent } from "@/data/landing";
import { ScrollReveal, StaggerChildren, StaggerItem } from "./landing-motion";

type Props = { content: LandingContent };

export default function RsvpModesSection({ content }: Props) {
  const { rsvpModes, ui } = content;
  const { title, subtitle, footnote, modes, compareRows } = rsvpModes;

  return (
    <section
      id="rsvp"
      className="border-y border-[var(--border)]/70 bg-[var(--surface-muted)] py-20 sm:py-28"
      aria-labelledby="rsvp-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <ScrollReveal className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-xs tracking-[0.25em] text-[var(--accent)] uppercase">RSVP</p>
          <h2
            id="rsvp-heading"
            className="mt-3 text-[clamp(1.85rem,5vw,3rem)] leading-snug"
            style={{ fontFamily: "var(--font-amiri)" }}
          >
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] sm:text-lg">{subtitle}</p>
        </ScrollReveal>

        <StaggerChildren className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {modes.map((mode) => (
            <StaggerItem key={mode.id}>
              <article
                className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8"
                style={{ borderTopWidth: 3, borderTopColor: mode.accent }}
              >
                <p className="text-xs font-medium tracking-wide text-[var(--accent)]">{mode.badge}</p>
                <h3
                  className="mt-2 text-2xl sm:text-[1.65rem]"
                  style={{ fontFamily: "var(--font-amiri)", color: mode.accent }}
                >
                  {mode.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-[var(--foreground)]">{mode.subtitle}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{mode.bestFor}</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                      {ui.guestFlowHeading}
                    </h4>
                    <ol className="space-y-2.5">
                      {mode.guestFlow.map((step, i) => (
                        <li key={step} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                          <span
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-[#FFFBF5]"
                            style={{ backgroundColor: mode.accent }}
                            aria-hidden
                          >
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                      {ui.ownerFlowHeading}
                    </h4>
                    <ul className="space-y-2">
                      {mode.ownerFlow.map((step) => (
                        <li key={step} className="flex gap-2 text-sm leading-relaxed text-[var(--muted)]">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p
                  className="mt-8 rounded-lg px-4 py-3 text-center text-sm font-medium"
                  style={{ backgroundColor: `${mode.accent}14`, color: mode.accent }}
                >
                  {mode.guestResult}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <ScrollReveal className="mt-12 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          <div className="border-b border-[var(--border)] px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">{ui.compareTableTitle}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)]/80 text-start">
                  <th className="px-5 py-3 font-medium text-[var(--muted)] sm:px-6"> </th>
                  <th className="px-5 py-3 font-medium sm:px-6" style={{ color: modes[0].accent }}>
                    {modes[0].title}
                  </th>
                  <th className="px-5 py-3 font-medium sm:px-6" style={{ color: modes[1].accent }}>
                    {modes[1].title}
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--border)]/80 last:border-0">
                    <th className="px-5 py-3.5 text-start font-medium text-[var(--foreground)] sm:px-6">
                      {row.label}
                    </th>
                    <td className="px-5 py-3.5 text-[var(--muted)] sm:px-6">{row.public}</td>
                    <td className="px-5 py-3.5 text-[var(--muted)] sm:px-6">{row.controlled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-8 text-center">
          <p className="text-sm leading-relaxed text-[var(--muted)]">{footnote}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
