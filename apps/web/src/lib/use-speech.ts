"use client";

import * as React from "react";

export interface UseSpeechOptions {
  defaultRate?: number;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

export interface UseSpeechReturn {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  toggleSpeed: () => void;
  speak: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useSpeech(options: UseSpeechOptions = {}): UseSpeechReturn {
  const { defaultRate = 1.0, onEnd, onError } = options;
  const [isSupported, setIsSupported] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(defaultRate);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  const pause = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isPaused]);

  const speak = React.useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      if (!text || text.trim().length === 0) {
        setIsPlaying(false);
        setIsPaused(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = playbackRate;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      // Select warm friendly English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Google")),
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        onEnd?.();
      };

      utterance.onerror = (e) => {
        setIsPlaying(false);
        setIsPaused(false);
        onError?.(e);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [playbackRate, onEnd, onError],
  );

  const toggleSpeed = React.useCallback(() => {
    setPlaybackRate((prev) => {
      if (prev <= 0.8) return 1.0;
      if (prev === 1.0) return 1.2;
      return 0.8;
    });
  }, []);

  return {
    isSupported,
    isPlaying,
    isPaused,
    playbackRate,
    setPlaybackRate,
    toggleSpeed,
    speak,
    pause,
    resume,
    stop,
  };
}
