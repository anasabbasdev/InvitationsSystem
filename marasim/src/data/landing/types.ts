import type { LandingAssetKey } from "@/data/landing-assets";

export type LandingLocale = "ar" | "en";

export type LandingNavItem = { id: string; label: string; href: string };

export type LandingDemo = {
  slug: string;
  href: string;
  name: string;
  tagline: string;
  description: string;
  posterKey: LandingAssetKey;
  posterAlt: string;
  accent: string;
};

export type LandingService = {
  number: string;
  title: string;
  description: string;
};

export type LandingExperienceRole = {
  id: "guest" | "owner" | "gate";
  label: string;
  title: string;
  points: string[];
};

export type LandingExperiencePreviews = {
  guest: { label: string; title: string; openLabel: string; rsvpButton: string };
  owner: { label: string; rows: string[]; rowBadges: string[]; seatsLabel: string };
  gate: { label: string; validStatus: string };
};

export type LandingOccasion = {
  title: string;
  gradient: string;
  imageKey: LandingAssetKey;
};

export type LandingFaqItem = {
  question: string;
  answer: string;
};

export type LandingAdditionalService = {
  title: string;
  description: string;
  enabled: boolean;
};

export type LandingRsvpMode = {
  id: "public" | "controlled";
  badge: string;
  title: string;
  subtitle: string;
  bestFor: string;
  guestFlow: string[];
  ownerFlow: string[];
  guestResult: string;
  accent: string;
};

export type LandingUi = {
  requestInviteCta: string;
  viewInviteCta: string;
  navAriaLabel: string;
  openMenu: string;
  closeMenu: string;
  menuSr: string;
  sectionsLabel: string;
  contactLabel: string;
  ownerLogin: string;
  privacyLink: string;
  langSwitchLabel: string;
  experienceTabsAria: string;
  guestFlowHeading: string;
  ownerFlowHeading: string;
  compareTableTitle: string;
  heroDemoAria: string;
  heroDemoCaption: string;
  whatsappInline: string;
};

export type LandingContent = {
  locale: LandingLocale;
  dir: "rtl" | "ltr";
  siteDescription: string;
  ogLocale: string;
  alternateHomeHref: string;
  alternatePrivacyHref: string;
  ui: LandingUi;
  nav: LandingNavItem[];
  hero: {
    lines: string[];
    subtitle: string;
    microcopy: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    demoHref: string;
    visualMock: {
      label: string;
      name1: string;
      conj: string;
      name2: string;
      inviteLine: string;
      tapLabel: string;
    };
  };
  statement: {
    title: string;
    body: string;
    highlights: string[];
  };
  showcase: {
    title: string;
    subtitle: string;
  };
  demos: LandingDemo[];
  experience: {
    title: string;
    subtitle: string;
    roles: LandingExperienceRole[];
    previews: LandingExperiencePreviews;
  };
  rsvpModes: {
    title: string;
    subtitle: string;
    footnote: string;
    modes: LandingRsvpMode[];
    compareRows: {
      label: string;
      public: string;
      controlled: string;
    }[];
  };
  services: {
    title: string;
    subtitle: string;
    items: LandingService[];
  };
  bespoke: {
    title: string;
    titleAccent: string;
    body: string;
    comparisonNote: string;
    variants: string[];
  };
  process: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  occasions: {
    title: string;
    items: LandingOccasion[];
  };
  additional: {
    title: string;
    subtitle: string;
    items: LandingAdditionalService[];
  };
  privacy: {
    title: string;
    subtitle: string;
    points: string[];
  };
  faq: LandingFaqItem[];
  faqHeading: string;
  finalCta: {
    title: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  footer: {
    tagline: string;
    copyright: string;
    privacyHref: string;
  };
};
