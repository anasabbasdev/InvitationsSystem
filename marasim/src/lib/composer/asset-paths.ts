import type { ComposerDemoSlug } from "./constants";

export type AssetPathSet = {
  base: string;
  files: string[];
};

export function getAssetPathSet(slug: ComposerDemoSlug): AssetPathSet {
  if (slug === "mhmd_lara") {
    return {
      base: "public/assets/invitations/psd-wedding-01/",
      files: ["opening.mp4", "opening-poster.webp", "music.mp3"],
    };
  }
  if (slug.includes("birth")) {
    return {
      base: "public/assets/demo/noor/media-birth/",
      files: [
        "opening.mp4",
        "opening-poster.webp",
        "hero-bg.webp",
        "baby-bg.webp",
        "message-bg.webp",
        "gallery-01.webp",
        "closing.webp",
      ],
    };
  }
  if (slug.includes("media-wedding") || slug.includes("wedding")) {
    return {
      base: "public/assets/demo/noor/media-wedding/",
      files: [
        "opening.mp4",
        "opening-poster.webp",
        "hero-bg.webp",
        "hero-foreground.webp",
        "message-bg.webp",
        "gallery-01.webp",
        "closing.mp4",
        "closing-poster.webp",
      ],
    };
  }
  return {
    base: "public/assets/demo/wedding/",
    files: ["opening-bg.webp", "hero-bg.webp", "gallery-01.webp"],
  };
}

export function suggestMusicPath(slug: ComposerDemoSlug): string {
  if (slug === "mhmd_lara") {
    return "/assets/invitations/psd-wedding-01/music.mp3";
  }
  return `${getAssetPublicPrefix(slug)}music.mp3`;
}

/** Suggested public path prefix for media src fields (starts with /). */
export function getAssetPublicPrefix(slug: ComposerDemoSlug): string {
  const set = getAssetPathSet(slug);
  return "/" + set.base.replace(/^public\//, "");
}

export function suggestMediaPath(
  slug: ComposerDemoSlug,
  sceneType: string,
  role: "main" | "background" | "foreground" | "poster" | "closing"
): string {
  const prefix = getAssetPublicPrefix(slug);
  const map: Record<string, Record<string, string>> = {
    opening: { main: `${prefix}opening.mp4`, poster: `${prefix}opening-poster.webp` },
    hero_names: { background: `${prefix}hero-bg.webp`, foreground: `${prefix}hero-foreground.webp` },
    invitation_message: { main: `${prefix}message-bg.webp` },
    gallery_media: { main: `${prefix}gallery-01.webp` },
    ticket_confirmation: { main: `${prefix}closing.mp4`, poster: `${prefix}closing-poster.webp` },
  };
  const sceneMap = map[sceneType];
  if (!sceneMap) return `${prefix}${role}.webp`;
  return sceneMap[role] ?? `${prefix}${sceneType}.webp`;
}

/** Copy-ready checklist of suggested assets for the current demo type. */
export function formatAssetChecklist(slug: ComposerDemoSlug): string {
  const set = getAssetPathSet(slug);
  const prefix = getAssetPublicPrefix(slug);
  const lines = [
    `Asset Checklist — ${slug}`,
    `Folder: ${set.base}`,
    "",
    "Files to prepare:",
    ...set.files.map((f) => `  • ${f}`),
    ...(set.files.includes("music.mp3") ? [] : ["  • music.mp3"]),
    "",
    "Public paths (composer src fields):",
    ...set.files.map((f) => `  ${prefix}${f}`),
  ];
  return lines.join("\n");
}
