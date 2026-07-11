import type { LandingLocale } from "@/data/landing/types";

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PrivacyPolicyContent = {
  locale: LandingLocale;
  dir: "rtl" | "ltr";
  meta: {
    title: string;
    lastUpdated: string;
    operatorName: string;
    operatorDescription: string;
  };
  ui: {
    backToHome: string;
    lastUpdatedLabel: string;
    contactHeading: string;
    contactEmailLabel: string;
    contactWhatsappLabel: string;
    openWhatsapp: string;
    contactMissing: string;
    langSwitchLabel: string;
  };
  homeHref: string;
  alternatePrivacyHref: string;
  sections: PrivacySection[];
};
