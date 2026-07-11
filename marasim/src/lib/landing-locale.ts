import type { LandingLocale } from "@/data/landing/types";

export type { LandingLocale };

export function homePath(locale: LandingLocale): string {
  return locale === "en" ? "/en" : "/";
}

export function privacyPath(locale: LandingLocale): string {
  return locale === "en" ? "/en/privacy" : "/privacy";
}

export function alternateLocale(locale: LandingLocale): LandingLocale {
  return locale === "ar" ? "en" : "ar";
}
