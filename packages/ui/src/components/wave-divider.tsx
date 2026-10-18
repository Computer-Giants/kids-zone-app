import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

export interface WaveDividerProps extends HTMLAttributes<HTMLDivElement> {
  fillColor?: string;
  position?: "top" | "bottom";
  flipX?: boolean;
}

export function WaveDivider({
  fillColor = "var(--color-sand)",
  position = "top",
  flipX = false,
  className,
  ...props
}: WaveDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none w-full overflow-hidden leading-none",
        position === "bottom" && "rotate-180",
        className,
      )}
      {...props}
    >
      <svg
        viewBox="0 0 1440 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn("md:h-18 lg:h-22 block h-10 w-full sm:h-14", flipX && "-scale-x-100")}
      >
        {/* Layer 1: Softer backdrop cloud puffs for gentle layered depth */}
        <path
          d="M0,58 C50,36 95,30 145,46 C195,22 255,18 315,38 C370,12 435,10 495,34 C560,6 635,6 705,30 C770,4 850,2 925,26 C985,8 1060,12 1120,34 C1180,16 1250,14 1310,36 C1365,22 1415,24 1440,38 L1440,96 L0,96 Z"
          fill={fillColor}
          opacity="0.45"
        />

        {/* Layer 2: Main billowy cloud scallops matching user storybook reference */}
        <path
          d="M0,64 C40,64 70,46 110,46 C155,46 180,60 225,60 C275,60 305,28 365,28 C425,28 455,54 510,54 C565,54 600,18 675,18 C750,18 785,50 850,50 C915,50 950,14 1030,14 C1105,14 1140,42 1195,42 C1250,42 1285,26 1350,26 C1395,26 1420,42 1440,46 L1440,96 L0,96 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
