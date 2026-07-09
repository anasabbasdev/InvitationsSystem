"use client";

import { useCallback, useEffect, useRef, useState, ReactNode } from "react";
import { InvitationConfig } from "@/types/invitation";

interface MusicGateProps {
  config: InvitationConfig;
  children: ReactNode;
  onFirstInteraction?: () => void;
}

/**
 * MusicGate wraps the entire invitation and:
 * 1. Captures the first user interaction (tap/click).
 * 2. Starts background music after first tap (if startMode = "after_first_tap").
 * 3. Shows a floating toggle button to mute/unmute.
 */
export default function MusicGate({
  config,
  children,
  onFirstInteraction,
}: MusicGateProps) {
  const { music } = config;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!music.enabled || !music.src) return;
    const audio = new Audio(music.src);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [music.enabled, music.src]);

  useEffect(() => {
    if (!hasInteracted || !audioRef.current) return;
    if (music.startMode !== "after_first_tap") return;

    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [hasInteracted, music.startMode]);

  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted) return;
    setHasInteracted(true);
    onFirstInteraction?.();
  }, [hasInteracted, onFirstInteraction]);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <div onPointerDown={handleFirstInteraction} className="relative">
      {children}

      {music.enabled && hasInteracted && (
        <button
          onClick={toggleMusic}
          aria-label={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
          className="fixed bottom-6 left-4 z-[100] w-11 h-11 rounded-full flex items-center justify-center border shadow-xl transition-transform active:scale-95"
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            borderColor: "rgba(201,162,77,0.4)",
            color: "#C9A24D",
            fontSize: "18px",
          }}
        >
          {isPlaying ? "♪" : "♩"}
        </button>
      )}
    </div>
  );
}
