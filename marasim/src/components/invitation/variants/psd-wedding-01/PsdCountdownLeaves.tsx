"use client";

import { useEffect, useRef } from "react";
import { PSD_DECOR } from "./coords";

/** Animated right-side foliage — same leaves as the PSD, now in motion. */
export function PsdCountdownLeaves() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const play = () => {
      video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0.12 }
    );
    io.observe(video);
    play();
    return () => io.disconnect();
  }, []);

  return (
    <div className="psd-countdown-leaves" aria-hidden>
      <video
        ref={ref}
        src={PSD_DECOR.countdownLeaves}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}
