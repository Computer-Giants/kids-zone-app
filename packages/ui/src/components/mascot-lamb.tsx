import type { SVGProps } from "react";
import { cn } from "../lib/utils";

export type LambMood = "happy" | "thinking" | "celebrating" | "encouraging";
export type LambSize = "sm" | "md" | "lg" | "xl";

export interface MascotLambProps extends SVGProps<SVGSVGElement> {
  mood?: LambMood;
  size?: LambSize;
  className?: string;
}

const sizeMap: Record<LambSize, { width: number; height: number }> = {
  sm: { width: 64, height: 64 },
  md: { width: 96, height: 96 },
  lg: { width: 128, height: 128 },
  xl: { width: 180, height: 180 },
};

export function MascotLamb({ mood = "happy", size = "md", className, ...props }: MascotLambProps) {
  const { width, height } = sizeMap[size];

  return (
    <svg
      role="img"
      aria-label={`Guide lamb ${mood}`}
      viewBox="0 0 120 120"
      width={width}
      height={height}
      className={cn("select-none transition-transform duration-200", className)}
      {...props}
    >
      {/* Background celebration sparkles if celebrating */}
      {mood === "celebrating" && (
        <g className="sparkles">
          <circle cx="20" cy="24" r="4" fill="#ffd23f" />
          <polygon points="102,20 105,28 113,31 105,34 102,42 99,34 91,31 99,28" fill="#ffd23f" />
          <circle cx="95" cy="80" r="3" fill="#ff7a1a" />
          <circle cx="16" cy="75" r="3" fill="#35c76a" />
        </g>
      )}

      {/* Gentle comforting aura if encouraging */}
      {mood === "encouraging" && <circle cx="60" cy="62" r="50" fill="#fff6cc" opacity="0.6" />}

      {/* Fluffy wool body cloud */}
      <g fill="#ffffff" stroke="#f0e2c0" strokeWidth="3" strokeLinejoin="round">
        <circle cx="42" cy="74" r="22" />
        <circle cx="78" cy="74" r="22" />
        <circle cx="60" cy="82" r="24" />
        <circle cx="36" cy="60" r="18" />
        <circle cx="84" cy="60" r="18" />
      </g>

      {/* Little hooves */}
      <rect x="44" y="98" width="8" height="12" rx="4" fill="#5c5f7a" />
      <rect x="68" y="98" width="8" height="12" rx="4" fill="#5c5f7a" />

      {/* Soft floppy ears */}
      <ellipse
        cx="26"
        cy="50"
        rx="14"
        ry="8"
        fill="#fff1d6"
        stroke="#f0e2c0"
        strokeWidth="2.5"
        transform="rotate(-20 26 50)"
      />
      <ellipse cx="26" cy="50" rx="9" ry="5" fill="#ffe1e8" transform="rotate(-20 26 50)" />

      <ellipse
        cx="94"
        cy="50"
        rx="14"
        ry="8"
        fill="#fff1d6"
        stroke="#f0e2c0"
        strokeWidth="2.5"
        transform="rotate(20 94 50)"
      />
      <ellipse cx="94" cy="50" rx="9" ry="5" fill="#ffe1e8" transform="rotate(20 94 50)" />

      {/* Lamb face */}
      <ellipse cx="60" cy="56" rx="28" ry="24" fill="#fff1d6" stroke="#f0e2c0" strokeWidth="3" />

      {/* Fluffy wool head tuft */}
      <g fill="#ffffff" stroke="#f0e2c0" strokeWidth="2.5">
        <circle cx="48" cy="36" r="11" />
        <circle cx="72" cy="36" r="11" />
        <circle cx="60" cy="32" r="13" />
      </g>

      {/* Rosy cheeks */}
      <ellipse cx="40" cy="62" rx="6" ry="4" fill="#ffe1e8" />
      <ellipse cx="80" cy="62" rx="6" ry="4" fill="#ffe1e8" />

      {/* Little soft nose */}
      <polygon points="60,58 56,54 64,54" fill="#ff7a1a" />

      {/* Eyes & Mouth by Mood */}
      {mood === "happy" && (
        <g>
          {/* Open happy eyes */}
          <circle cx="48" cy="50" r="4.5" fill="#2b2d42" />
          <circle cx="46.5" cy="48.5" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="50" r="4.5" fill="#2b2d42" />
          <circle cx="70.5" cy="48.5" r="1.5" fill="#ffffff" />
          {/* Sweet smile */}
          <path
            d="M 54 64 Q 60 71 66 64"
            fill="none"
            stroke="#2b2d42"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}

      {mood === "thinking" && (
        <g>
          {/* Eyes looking up and left */}
          <circle cx="48" cy="48" r="4" fill="#2b2d42" />
          <circle cx="47" cy="46.5" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="48" r="4" fill="#2b2d42" />
          <circle cx="71" cy="46.5" r="1.5" fill="#ffffff" />
          {/* Thoughtful curved mouth */}
          <path
            d="M 55 64 Q 60 67 66 63"
            fill="none"
            stroke="#2b2d42"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Thought bubbles */}
          <circle cx="86" cy="32" r="3" fill="#3d8bff" opacity="0.7" />
          <circle cx="94" cy="24" r="5" fill="#3d8bff" opacity="0.8" />
        </g>
      )}

      {mood === "celebrating" && (
        <g>
          {/* Happy closed arched eyes */}
          <path
            d="M 43 51 Q 48 44 53 51"
            fill="none"
            stroke="#2b2d42"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 67 51 Q 72 44 77 51"
            fill="none"
            stroke="#2b2d42"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Big open celebratory smile */}
          <path
            d="M 53 63 Q 60 74 67 63 Z"
            fill="#ec4466"
            stroke="#2b2d42"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      )}

      {mood === "encouraging" && (
        <g>
          {/* Warm supportive open eyes */}
          <circle cx="48" cy="50" r="4" fill="#2b2d42" />
          <circle cx="49" cy="49" r="1.5" fill="#ffffff" />
          <circle cx="72" cy="50" r="4" fill="#2b2d42" />
          <circle cx="73" cy="49" r="1.5" fill="#ffffff" />
          {/* Warm comforting reassuring smile */}
          <path
            d="M 53 64 Q 60 70 67 64"
            fill="none"
            stroke="#2b2d42"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
}
