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
 * MusicGate wraps the entire invitation and:
 * 1. Captures the first user interaction (tap/click).
 * 2. Starts looping background music after first tap (if startMode = "after_first_tap").
 * 3. Exposes play/pause to the invitation dock via context.
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
  const enabled = Boolean(music.enabled && music.src);

  useEffect(() => {
    if (!enabled || !music.src) return;
    const audio = new Audio(music.src);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [enabled, music.src]);

  useEffect(() => {
    if (!hasInteracted || !audioRef.current) return;
    if (music.startMode !== "after_first_tap") return;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [hasInteracted, music.startMode]);

  const handleFirstInteraction = useCallback(() => {
    if (hasInteracted) return;
    setHasInteracted(true);
    onFirstInteraction?.();
  }, [hasInteracted, onFirstInteraction]);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setHasInteracted(true);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying]);

  const value = useMemo<MusicControl>(
    () => ({ enabled, isPlaying, toggleMusic }),
    [enabled, isPlaying, toggleMusic]
  );

  return (
    <MusicControlContext.Provider value={value}>
      <div onPointerDown={handleFirstInteraction} className="relative">
        {children}
      </div>
    </MusicControlContext.Provider>
  );
}
