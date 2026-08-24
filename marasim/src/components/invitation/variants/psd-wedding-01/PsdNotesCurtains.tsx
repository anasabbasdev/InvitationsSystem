"use client";

import { useEffect, useRef } from "react";
import { PSD_DECOR } from "./coords";

const OPEN_HOLD = 0.08;
const OPEN_MIN = 3.45;
const SKIP_HOLD = 1.15;
const STORAGE_KEY = "psd-notes-curtains-open";

let curtainsStayOpen = readStayOpen();
let lastOpenTime = 4.92;

function readStayOpen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markStayOpen() {
  curtainsStayOpen = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

/**
 * Plays the curtain-open video once, then freezes on an open frame.
 * First load often has Infinity duration / unseekable WebM — seeking to the
 * last frame then fails and the element snaps back to 0 (closed). We pause
 * on the open pose before `ended`, and retry the seek until it sticks.
 */
export function PsdNotesCurtains() {
  const ref = useRef<HTMLVideoElement>(null);
  const opened = useRef(curtainsStayOpen);
  const farthest = useRef(0);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    const canSeekTo = (time: number) => {
      if (video.seekable.length === 0) return false;
      return video.seekable.end(video.seekable.length - 1) >= time - 0.05;
    };

    const openTime = () => {
      if (Number.isFinite(video.duration) && video.duration > 1) {
        return Math.max(OPEN_MIN, video.duration - OPEN_HOLD);
      }
      if (farthest.current > OPEN_MIN) return farthest.current;
      return lastOpenTime;
    };

    const applyOpenFrame = () => {
      video.pause();
      if (video.currentTime >= OPEN_MIN) {
        lastOpenTime = Math.max(lastOpenTime, video.currentTime);
        return true;
      }
      const t = openTime();
      if (!canSeekTo(t)) return false;
      try {
        video.currentTime = t;
      } catch {
        return false;
      }
      video.pause();
      return video.currentTime >= OPEN_MIN;
    };

    const freezeOpen = () => {
      opened.current = true;
      markStayOpen();
      if (applyOpenFrame()) return;
      const retry = (delay: number) => {
        window.setTimeout(() => {
          if (!opened.current) return;
          if (!applyOpenFrame()) retry(Math.min(delay + 120, 400));
        }, delay);
      };
      retry(60);
    };

    const beginOpen = () => {
      if (opened.current || curtainsStayOpen) {
        freezeOpen();
        return;
      }
      if (Number.isFinite(video.duration) && video.duration > 1.3 && canSeekTo(SKIP_HOLD)) {
        try {
          video.currentTime = SKIP_HOLD;
        } catch {
          /* keep playing from 0 */
        }
      }
      video.playbackRate = 1.22;
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (video.currentTime > farthest.current) farthest.current = video.currentTime;
      if (video.currentTime >= OPEN_MIN) {
        lastOpenTime = Math.max(lastOpenTime, video.currentTime);
        freezeOpen();
        return;
      }
      if ((opened.current || curtainsStayOpen) && video.currentTime < 1.6) {
        freezeOpen();
      }
    };

    const onPlay = () => {
      if (opened.current || curtainsStayOpen) freezeOpen();
    };

    const onSeeked = () => {
      if ((opened.current || curtainsStayOpen) && video.currentTime < OPEN_MIN) {
        freezeOpen();
      }
    };

    const onEnded = () => {
      freezeOpen();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) beginOpen();
      },
      { threshold: 0.04, rootMargin: "28% 0px -4% 0px" }
    );

    const onReady = () => {
      if (opened.current || curtainsStayOpen) freezeOpen();
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    io.observe(video);

    if (curtainsStayOpen) freezeOpen();

    return () => {
      io.disconnect();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, []);

  return (
    <div className="psd-notes-curtains" aria-hidden>
      <video
        ref={ref}
        src={PSD_DECOR.notesCurtains}
        poster={curtainsStayOpen ? undefined : PSD_DECOR.notesCurtainsPoster}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}
