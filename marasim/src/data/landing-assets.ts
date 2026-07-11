/**
 * Single source for landing page image URLs.
 * Update paths here only — both AR and EN pages read from this file.
 */
export const LANDING_ASSETS = {
  heroPoster: "/assets/demo/noor/media-wedding/opening-poster.webp",
  heroLayer: "/assets/demo/noor/media-wedding/hero-bg.webp",
  floralPoster: "/assets/demo/noor/media-wedding/gallery-01.webp",
  minimalPoster: "/assets/demo/noor/media-wedding/message-bg.webp",
  royalPoster: "/assets/demo/noor/media-wedding/hero-bg.webp",
  finalCtaPoster: "/assets/demo/noor/media-wedding/closing-poster.webp",
  ogImage: "/assets/demo/noor/media-wedding/opening-poster.webp",
  /** Occasions section — upload to public/assets/landing/occasions/ */
  occasionWeddings: "/assets/landing/occasions/weddings.webp",
  occasionEngagement: "/assets/landing/occasions/engagement.webp",
  occasionNewborns: "/assets/landing/occasions/newborns.webp",
  occasionGraduation: "/assets/landing/occasions/graduation.webp",
  occasionPrivate: "/assets/landing/occasions/private.webp",
  occasionCorporate: "/assets/landing/occasions/corporate.webp",
} as const;

export type LandingAssetKey = keyof typeof LANDING_ASSETS;
