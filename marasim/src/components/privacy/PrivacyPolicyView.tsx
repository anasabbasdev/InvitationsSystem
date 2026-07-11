import Link from "next/link";
import type { PrivacyPolicyContent, PrivacySection } from "@/data/privacy-policy";
import LocaleDocument from "@/components/locale/LocaleDocument";
import { getLandingContact } from "@/lib/landing-config";
import LandingLogo from "@/components/landing/LandingLogo";

type Props = {
  policy: PrivacyPolicyContent;
};

export default function PrivacyPolicyView({ policy }: Props) {
  const contact = getLandingContact();
  const { meta, ui, sections, homeHref, alternatePrivacyHref } = policy;

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <LocaleDocument locale={policy.locale} dir={policy.dir} />
      <header className="border-b border-[var(--border)] bg-white/90 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href={homeHref}>
            <LandingLogo size="sm" />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href={alternatePrivacyHref}
              className="text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              {ui.langSwitchLabel}
            </Link>
            <Link href={homeHref} className="text-[var(--muted)] hover:text-[var(--foreground)]">
              {ui.backToHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-amiri)" }}>
          {meta.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {ui.lastUpdatedLabel}: {meta.lastUpdated}
        </p>
        <p className="mt-6 text-base leading-relaxed text-[var(--muted)]">
          {meta.operatorName}: {meta.operatorDescription}
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((section: PrivacySection) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2
                className="text-xl font-semibold text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-amiri)" }}
              >
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-[1.9] text-[var(--muted)]">
                {section.paragraphs.map((p: string) => (
                  <p key={p}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 ps-5 marker:text-[var(--accent)]">
                    {section.bullets.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-14 rounded-xl border border-[var(--border)] bg-white p-6 text-sm">
          <h2 className="font-semibold text-[var(--foreground)]">{ui.contactHeading}</h2>
          <ul className="mt-3 space-y-2 text-[var(--muted)]">
            {contact.email && (
              <li>
                {ui.contactEmailLabel}:{" "}
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[var(--accent)] hover:underline"
                >
                  {contact.email}
                </a>
              </li>
            )}
            {contact.whatsapp && (
              <li>
                {ui.contactWhatsappLabel}:{" "}
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  {ui.openWhatsapp}
                </a>
              </li>
            )}
            {!contact.email && !contact.whatsapp && <li>{ui.contactMissing}</li>}
          </ul>
        </aside>
      </main>
    </div>
  );
}
