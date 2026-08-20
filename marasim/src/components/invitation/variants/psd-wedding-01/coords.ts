/** Original PSD canvas — confirmed @4x mobile (1540/4 = 385). */
export const PSD_WIDTH = 1540;
export const PSD_HEIGHT = 20000;
export const PSD_SCALE = 4;
export const DESIGN_WIDTH = 385;

export const ASSET_BASE = "/assets/invitations/psd-wedding-01";

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
    plate: `${ASSET_BASE}/sections/04-countdown.webp`,
    y: 6400,
    height: 2100,
  },
  details: {
    id: "details",
    plate: `${ASSET_BASE}/sections/05-details.webp`,
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
    plate: `${ASSET_BASE}/sections/08-notes.webp`,
    y: 13250,
    height: 1351,
  },
  location: {
    id: "location",
    plate: `${ASSET_BASE}/sections/09-location.webp`,
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
    plate: `${ASSET_BASE}/sections/11-closing.webp`,
    y: 17826,
    height: 2174,
  },
} as const;

export const PSD_DECOR = {
  countdownTimer: `${ASSET_BASE}/decor/countdown-timer.webp`,
  goldenRings: `${ASSET_BASE}/decor/golden-rings.webp`,
  luxuryCurtains: `${ASSET_BASE}/decor/luxury-curtains.webp`,
  closingBouquet: `${ASSET_BASE}/decor/closing-bouquet.webp`,
  programHall: `${ASSET_BASE}/decor/program-hall.webp`,
  programHallFrame: `${ASSET_BASE}/decor/program-hall-frame.webp`,
  tape1: `${ASSET_BASE}/decor/gallery-tape-1.webp`,
  tape2a: `${ASSET_BASE}/decor/gallery-tape-2a.webp`,
  tape2b: `${ASSET_BASE}/decor/gallery-tape-2b.webp`,
  tape3: `${ASSET_BASE}/decor/gallery-tape-3.webp`,
  openingVideo: `${ASSET_BASE}/opening.mp4`,
  openingPoster: `${ASSET_BASE}/opening-poster.webp`,
};

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
 * Countdown digits → live custom chrome (PSD timer digits flattened)
 * Countdown date lines → live
 * Details date/time/venue → live
 * OUR / Moments → live
 * Gallery photos → baked collage unless InvitationData.media set
 * EVENT / Timeline / programItems / hall titles → live
 * Notes headings + items → live
 * Location titles + venue + CTA → live
 * Closing calligraphy / bouquet → baked
 * Closing ticket line + Marasim footer → live
 */
