"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LandingContent } from "@/data/landing";
import { getLandingContact } from "@/lib/landing-config";
import LandingButton from "./LandingButton";
import LandingLogo from "./LandingLogo";

type Props = {
  content: LandingContent;
};

export default function LandingHeader({ content }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const contact = getLandingContact();
  const { nav, ui, alternateHomeHref } = content;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const ctaHref = contact.whatsappForCta ?? "#contact";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[var(--border)]/80 bg-[var(--background)]/92 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#"
          className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <LandingLogo size="sm" />
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={ui.navAriaLabel}>
          {nav.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={alternateHomeHref}
            className="text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            hrefLang={content.locale === "ar" ? "en" : "ar"}
          >
            {ui.langSwitchLabel}
          </Link>
          <LandingButton href={ctaHref} variant="primary" className="!px-5 !py-2.5 !text-sm">
            {ui.requestInviteCta}
          </LandingButton>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white/80 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? ui.closeMenu : ui.menuSr}</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`block h-px bg-[var(--foreground)] transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span className={`block h-px bg-[var(--foreground)] ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block h-px bg-[var(--foreground)] transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--border)] bg-[var(--background)]/98 px-5 py-6 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label={ui.navAriaLabel}>
            {nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-base text-[var(--foreground)]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={alternateHomeHref}
              className="text-base text-[var(--muted)]"
              hrefLang={content.locale === "ar" ? "en" : "ar"}
              onClick={() => setMenuOpen(false)}
            >
              {ui.langSwitchLabel}
            </Link>
            <LandingButton
              href={ctaHref}
              variant="primary"
              className="mt-2 w-full"
              external={Boolean(contact.whatsappForCta?.startsWith("http"))}
            >
              {ui.requestInviteCta}
            </LandingButton>
          </nav>
        </div>
      )}
    </header>
  );
}
