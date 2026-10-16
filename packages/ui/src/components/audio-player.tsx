"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Gauge } from "lucide-react";
import { cn } from "../lib/utils";

export interface AudioPlayerProps {
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart?: () => void;
  playbackRate?: number;
  onToggleSpeed?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  statusLabel?: string;
  className?: string;
}

export function AudioPlayer({
  title,
  isPlaying,
  onTogglePlay,
  onRestart,
  playbackRate = 1.0,
  onToggleSpeed,
  isMuted = false,
  onToggleMute,
  statusLabel = "Read Aloud",
  className,
}: AudioPlayerProps) {
  return (
    <div
      role="region"
      aria-label="Scripture Read Aloud Audio Player"
      className={cn(
        "border-sand-border shadow-card-hover flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 bg-white px-4 py-3 sm:px-6",
        className,
      )}
    >
      {/* Title & Status */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "bg-blue-tint text-blue-deep flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isPlaying && "animate-pulse",
          )}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <span className="font-heading text-orange-deep block text-xs font-extrabold uppercase tracking-wider">
            {statusLabel}
          </span>
          <p className="font-heading text-ink truncate text-sm font-black sm:text-base">{title}</p>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-2">
        {/* Restart Button */}
        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            aria-label="Restart reading from start"
            className="bg-sand text-ink hover:bg-sand-border focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl transition-all active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {/* Play/Pause Button (Primary 48px Action) */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause reading" : "Play reading aloud"}
          className={cn(
            "shadow-sticker-orange focus-accessible flex h-12 min-h-[48px] w-12 min-w-[48px] items-center justify-center rounded-2xl font-bold text-white transition-all active:scale-95",
            isPlaying ? "bg-orange-deep" : "bg-orange hover:bg-orange-deep",
          )}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 fill-white" />
          ) : (
            <Play className="ml-0.5 h-6 w-6 fill-white" />
          )}
        </button>

        {/* Speed Toggle Button */}
        {onToggleSpeed && (
          <button
            type="button"
            onClick={onToggleSpeed}
            aria-label={`Change speech speed, currently ${playbackRate}x`}
            className="bg-sand font-heading text-ink hover:bg-sand-border focus-accessible flex h-11 min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-xs font-black transition-all active:scale-95"
          >
            <Gauge className="text-ink-soft h-3.5 w-3.5" />
            <span>{playbackRate}x</span>
          </button>
        )}

        {/* Mute Toggle */}
        {onToggleMute && (
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="bg-sand text-ink hover:bg-sand-border focus-accessible flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-xl transition-all active:scale-95"
          >
            {isMuted ? <VolumeX className="text-red h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
