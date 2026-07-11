import Link from "next/link";
import type { LandingContent } from "@/data/landing";
import { getLandingContact } from "@/lib/landing-config";
import LandingLogo from "./LandingLogo";

type Props = {
  content: LandingContent;
};

export default function LandingFooter({ content }: Props) {
  const contact = getLandingContact();
  const { nav, footer, ui, alternateHomeHref } = content;

  return (
    <footer className="border-t border-[var(--border)] bg-white py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <LandingLogo size="sm" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">{footer.tagline}</p>
          <p className="mt-4">
            <Link
              href={alternateHomeHref}
              className="text-sm text-[var(--accent)] hover:underline"
              hrefLang={content.locale === "ar" ? "en" : "ar"}
            >
              {ui.langSwitchLabel}
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="mb-3 font-medium text-[var(--foreground)]">{ui.sectionsLabel}</p>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="text-[var(--muted)] hover:text-[var(--foreground)]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-medium text-[var(--foreground)]">{ui.contactLabel}</p>
            <ul className="space-y-2 text-[var(--muted)]">
              {contact.instagram && (
                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--foreground)]"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {contact.whatsapp && (
                <li>
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--foreground)]"
                  >
                    WhatsApp
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-[var(--foreground)]">
                    {contact.email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/owner/login" className="hover:text-[var(--foreground)]">
                  {ui.ownerLogin}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[var(--border)] px-5 pt-8 text-xs text-[var(--muted)] sm:flex-row sm:px-8">
        <p>{footer.copyright}</p>
        <Link href={footer.privacyHref} className="hover:text-[var(--foreground)]">
          {ui.privacyLink}
        </Link>
      </div>
    </footer>
  );
}
