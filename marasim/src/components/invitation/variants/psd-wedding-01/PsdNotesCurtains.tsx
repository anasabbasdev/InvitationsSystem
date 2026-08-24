"use client";

import { useEffect, useRef } from "react";
import { PSD_DECOR } from "./coords";

/**
 * Plays the curtain-open video once when the notes slide enters view,
 * then freezes on the last frame. Refresh to see it again.
 */
export function PsdNotesCurtains() {
  const ref = useRef<HTMLVideoElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const holdOpen = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.pause();
      video.currentTime = Math.max(0, video.duration - 0.05);
    };

    const onEnded = () => holdOpen();

    const beginOpen = () => {
      if (started.current) return;
      started.current = true;
      // The source holds a closed pose for ~1.2s; skip it so opening starts immediately.
      if (Number.isFinite(video.duration) && video.duration > 1.3) {
        video.currentTime = 1.15;
      }
      video.playbackRate = 1.22;
      video.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) beginOpen();
      },
      { threshold: 0.04, rootMargin: "28% 0px -4% 0px" }
    );

    video.addEventListener("ended", onEnded);
    io.observe(video);
    return () => {
      io.disconnect();
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div className="psd-notes-curtains" aria-hidden>
      <video
        ref={ref}
        src={PSD_DECOR.notesCurtains}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}
