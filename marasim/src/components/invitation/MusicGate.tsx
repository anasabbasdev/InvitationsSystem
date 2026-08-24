"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { InvitationConfig } from "@/types/invitation";

type MusicControl = {
  enabled: boolean;
  isPlaying: boolean;
  toggleMusic: () => void;
};

const MusicControlContext = createContext<MusicControl>({
  enabled: false,
  isPlaying: false,
  toggleMusic: () => {},
});

export function useMusicControl(): MusicControl {
  return useContext(MusicControlContext);
}

interface MusicGateProps {
  config: InvitationConfig;
  children: ReactNode;
  onFirstInteraction?: () => void;
}

/**
 * Starts looping invitation music as soon as the browser allows:
 * 1. Attempt autoplay when the page loads (before the opening video).
 * 2. Unlock/play on the first tap in the same user gesture (so music
 *    begins even if autoplay was blocked, and before the intro video).
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
  const enabled = Boolean(music.enabled && music.src && music.startMode !== "disabled");

  const playNow = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const attempt = audio.play();
    if (attempt) {
      attempt.then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!enabled || !music.src) return;
    const audio = new Audio(music.src);
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";
    audioRef.current = audio;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [enabled, music.src]);

  const handleFirstInteraction = useCallback(() => {
    playNow();
    if (!hasInteracted) {
      setHasInteracted(true);
      onFirstInteraction?.();
    }
  }, [hasInteracted, onFirstInteraction, playNow]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (!audio.paused && !audio.ended) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const value = useMemo<MusicControl>(
    () => ({ enabled, isPlaying, toggleMusic }),
    [enabled, isPlaying, toggleMusic]
  );

  return (
    <MusicControlContext.Provider value={value}>
      <div onPointerDownCapture={handleFirstInteraction} className="relative">
        {children}
      </div>
    </MusicControlContext.Provider>
  );
}
