"use client";

import Image from "next/image";
import { useState } from "react";
import { LANDING_ASSETS } from "@/data/landing-assets";
import type { LandingOccasion } from "@/data/landing";

type Props = {
  item: LandingOccasion;
  staggerOffset?: number;
};

export default function OccasionCard({ item, staggerOffset = 0 }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const showPhoto = imageLoaded && !imageFailed;
  const src = LANDING_ASSETS[item.imageKey];

  return (
    <div
      className="relative flex aspect-[4/5] items-end overflow-hidden rounded-xl p-4 sm:p-5"
      style={{
        background: item.gradient,
        marginTop: staggerOffset,
      }}
    >
      {!imageFailed && (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 45vw, 20vw"
          className={`object-cover transition-opacity duration-500 ${showPhoto ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
        />
      )}
      {showPhoto && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent"
          aria-hidden
        />
      )}
      <p
        className={`relative z-10 text-base sm:text-lg ${showPhoto ? "text-white drop-shadow-sm" : "text-[var(--foreground)]"}`}
        style={{ fontFamily: "var(--font-amiri)" }}
      >
        {item.title}
      </p>
    </div>
  );
}
