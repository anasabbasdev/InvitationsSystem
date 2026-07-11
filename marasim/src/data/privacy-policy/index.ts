import type { LandingLocale } from "@/data/landing/types";
import type { PrivacyPolicyContent } from "./types";
import { privacyPolicyAr } from "./content-ar";
import { privacyPolicyEn } from "./content-en";

export type { PrivacyPolicyContent, PrivacySection } from "./types";

const BY_LOCALE = {
  ar: privacyPolicyAr,
  en: privacyPolicyEn,
} as const;

export function getPrivacyPolicy(locale: LandingLocale): PrivacyPolicyContent {
  return BY_LOCALE[locale];
}

/** @deprecated Use getPrivacyPolicy("ar") */
export const privacyPolicyMeta = privacyPolicyAr.meta;
/** @deprecated Use getPrivacyPolicy("ar") */
export const privacyPolicySections = privacyPolicyAr.sections;
