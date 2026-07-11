import { LANDING_ASSETS } from "@/data/landing-assets";
import type { LandingDemo, LandingLocale } from "./types";
import { landingContentAr } from "./content-ar";
import { landingContentEn } from "./content-en";

export type { LandingContent, LandingLocale, LandingDemo, LandingOccasion } from "./types";
export { LANDING_ASSETS } from "@/data/landing-assets";

const CONTENT_BY_LOCALE = {
  ar: landingContentAr,
  en: landingContentEn,
} as const;

export function getLandingContent(locale: LandingLocale) {
  return CONTENT_BY_LOCALE[locale];
}

export function demoPosterSrc(demo: LandingDemo): string {
  return LANDING_ASSETS[demo.posterKey];
}
