"use client";

import { useEffect, useRef } from "react";
import { PSD_DECOR } from "./coords";

const OPEN_HOLD = 0.08;
let curtainsStayOpen = false;

/**
 * Plays the curtain-open video once, then freezes on the last (open) frame.
 * If the browser seeks back to the start, we snap to the open pose again.
 */
export function PsdNotesCurtains() {
  const ref = useRef<HTMLVideoElement>(null);
  const opened = useRef(curtainsStayOpen);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.loop = false;
    video.muted = true;

    const openTime = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return 4.9;
      return Math.max(0, video.duration - OPEN_HOLD);
    };

    const freezeOpen = () => {
      opened.current = true;
      curtainsStayOpen = true;
      video.pause();
      try {
        video.currentTime = openTime();
      } catch {
        /* some mobile browsers reject a seek until metadata is ready */
      }
    };

    const beginOpen = () => {
      if (opened.current || curtainsStayOpen) {
        freezeOpen();
        return;
      }
      if (Number.isFinite(video.duration) && video.duration > 1.3) {
        video.currentTime = 1.15;
      }
      video.playbackRate = 1.22;
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (video.currentTime >= video.duration - 0.18) {
        freezeOpen();
      }
    };

    const onPlay = () => {
      if (opened.current || curtainsStayOpen) {
        freezeOpen();
      }
    };

    const onSeeked = () => {
      if ((opened.current || curtainsStayOpen) && video.currentTime < 2) {
        freezeOpen();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) beginOpen();
      },
      { threshold: 0.04, rootMargin: "28% 0px -4% 0px" }
    );

    video.addEventListener("ended", freezeOpen);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", () => {
      if (opened.current || curtainsStayOpen) freezeOpen();
    });
    io.observe(video);

    if (curtainsStayOpen) freezeOpen();

    return () => {
      io.disconnect();
      video.removeEventListener("ended", freezeOpen);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return (
    <div className="psd-notes-curtains" aria-hidden>
      <video
        ref={ref}
        src={PSD_DECOR.notesCurtains}
        poster={PSD_DECOR.notesCurtainsPoster}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}
