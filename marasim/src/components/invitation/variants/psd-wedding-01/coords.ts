import { APP_NAME } from "@/lib/app-brand";

/** Original PSD canvas — confirmed @4x mobile (1540/4 = 385). */
export const PSD_WIDTH = 1540;
export const PSD_HEIGHT = 20000;
export const PSD_SCALE = 4;
export const DESIGN_WIDTH = 385;

export const ASSET_BASE = "/assets/invitations/psd-wedding-01";
const DECOR_REV = "v14";

export type PsdSectionDef = {
  id: string;
  plate: string;
  y: number;
  height: number;
};

export const PSD_SECTIONS = {
  invitation: {
    id: "invitation",
    plate: `${ASSET_BASE}/sections/01-opening.webp`,
    plateB: `${ASSET_BASE}/sections/02-invitation.webp`,
    y: 0,
    height: 4808,
  },
  names: {
    id: "names",
    plate: `${ASSET_BASE}/sections/03-names.webp`,
    y: 4808,
    height: 1592,
  },
  countdown: {
    id: "countdown",
    plate: `${ASSET_BASE}/sections/04-countdown.webp?${DECOR_REV}`,
    y: 6400,
    height: 2100,
  },
  details: {
    id: "details",
    plate: `${ASSET_BASE}/sections/05-details.webp?${DECOR_REV}`,
    y: 8500,
    height: 969,
  },
  gallery: {
    id: "gallery",
    plate: `${ASSET_BASE}/sections/06-gallery.webp`,
    y: 9469,
    height: 1444,
  },
  program: {
    id: "program",
    plate: `${ASSET_BASE}/sections/07-program.webp`,
    y: 10913,
    height: 2337,
  },
  notes: {
    id: "notes",
    plate: `${ASSET_BASE}/sections/08-notes.webp?${DECOR_REV}`,
    y: 13250,
    height: 1351,
  },
  location: {
    id: "location",
    plate: `${ASSET_BASE}/sections/09-location.webp?${DECOR_REV}`,
    y: 14601,
    height: 1484,
  },
  rsvp: {
    id: "rsvp",
    plate: `${ASSET_BASE}/sections/10-rsvp.webp`,
    plateSuccess: `${ASSET_BASE}/sections/10-rsvp-success.webp`,
    y: 16085,
    height: 1741,
  },
  closing: {
    id: "closing",
    plate: `${ASSET_BASE}/sections/11-closing.webp?${DECOR_REV}`,
    y: 17826,
    height: 2174,
  },
} as const;

export const PSD_DECOR = {
  detailsColumnWall: `${ASSET_BASE}/decor/details-column-wall.webp?${DECOR_REV}`,
  detailsTornPaper: `${ASSET_BASE}/decor/details-torn-paper.webp?${DECOR_REV}`,
  countdownTimer: `${ASSET_BASE}/decor/countdown-timer.webp?${DECOR_REV}`,
  countdownLeaves: `${ASSET_BASE}/decor/countdown-leaves.webm?${DECOR_REV}`,
  goldenRings: `${ASSET_BASE}/decor/golden-rings.webp`,
  luxuryCurtains: `${ASSET_BASE}/decor/luxury-curtains.webp`,
  notesCurtains: `${ASSET_BASE}/decor/notes-curtains.webm?${DECOR_REV}`,
  notesCurtainsPoster: `${ASSET_BASE}/decor/notes-curtains-poster.webp?${DECOR_REV}`,
  closingBouquet: `${ASSET_BASE}/decor/closing-bouquet.webp`,
  closingThanks: `${ASSET_BASE}/decor/closing-thanks.png?${DECOR_REV}`,
  artBest: `${ASSET_BASE}/decor/art-best.webp?${DECOR_REV}`,
  artMoment: `${ASSET_BASE}/decor/art-moment.webp?${DECOR_REV}`,
  artMoments: `${ASSET_BASE}/decor/art-moments.webp?${DECOR_REV}`,
  artTogether: `${ASSET_BASE}/decor/art-together.webp?${DECOR_REV}`,
  artTimeline: `${ASSET_BASE}/decor/art-timeline.webp?${DECOR_REV}`,
  artWeddingHall: `${ASSET_BASE}/decor/art-wedding-hall.webp?${DECOR_REV}`,
  programHall: `${ASSET_BASE}/decor/program-hall.webp`,
  programHallFrame: `${ASSET_BASE}/decor/program-hall-frame.webp`,
  tape1: `${ASSET_BASE}/decor/gallery-tape-1.webp`,
  tape2a: `${ASSET_BASE}/decor/gallery-tape-2a.webp`,
  tape2b: `${ASSET_BASE}/decor/gallery-tape-2b.webp`,
  tape3: `${ASSET_BASE}/decor/gallery-tape-3.webp`,
  openingVideo: `${ASSET_BASE}/opening.mp4`,
  openingPoster: `${ASSET_BASE}/opening-poster.webp`,
};

/** PSD typefaces → loaded web fonts (Alexandria is Montserrat Arabic on Google Fonts). */
export const PSD_FONT = {
  latin: "var(--font-montserrat), sans-serif",
  arabic: "var(--font-montserrat-arabic), var(--font-noto-sans-arabic), sans-serif",
  script: "var(--font-great-vibes), cursive",
  signature: "var(--font-allura), var(--font-great-vibes), cursive",
  displayAr: "var(--font-tajawal), var(--font-montserrat-arabic), sans-serif",
  numeral: "var(--font-playfair), Georgia, serif",
};

export const PSD_WHITE = "#FFFFFF";
export const PSD_SCRIPT_CREAM = "#D4CEA9";
export const PSD_BRONZE = "#534408";
export const PSD_DETAILS = "#5D5D5D";
export const PSD_DIGIT_GOLD = "#6B4A14";

export const PSD_TICKER =
  `تم تصميم هذه الدعوة بشكل خاص وبواسطة موقع ${APP_NAME}  .  لمناسبتك القادمة احصل على دعوة مميزة وتواصل معنا الان.`;

export const PSD_GALLERY_LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.";

export const OPEN_INVITE_ANCHOR = "psd-open-invite";

export function pctX(x: number): string {
  return `${(x / PSD_WIDTH) * 100}%`;
}

export function pctW(width: number): string {
  return `${(width / PSD_WIDTH) * 100}%`;
}

export function pctY(y: number, sectionY: number, sectionH: number): string {
  return `${((y - sectionY) / sectionH) * 100}%`;
}

export function pctH(height: number, sectionH: number): string {
  return `${(height / sectionH) * 100}%`;
}

/** PSD type size → CSS size relative to the 385 design width. */
export function psdFont(px: number): string {
  return `calc(100cqw * ${px / PSD_WIDTH})`;
}

export const PSD_INK = "#4A4038";
export const PSD_MUTED = "#6B6258";
export const PSD_PAPER = "#F3EDE3";
export const PSD_GOLD = "#C4A35A";

/**
 * Implementation guidance only — not a runtime registry.
 *
 * Written in Love / A Promise / Together / Our Forever Begins → live (type hidden)
 * Couple calligraphy on seal / invitation card → baked template
 * Host names + invitation wording → live
 * Countdown chrome → PSD timer template; digits only are live
 * Countdown date lines → live
 * Details title is one line: التفاصيل cut by Details
 * OUR / Moments / lorem / Best Moment → live
 * Gallery photos → baked collage unless InvitationData.media set
 * EVENT / Timeline / programItems / hall titles → live
 * Notes headings + items → live
 * Location titles + venue + CTA → live
 * Closing وشكراً → exact Layer 25 PNG overlay on a plate without baked calligraphy
 * Closing ticket line + Marasim ticker → live
 */
