import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

export type SectionKind = "bible" | "saints" | "quizzes" | "games" | "stories" | "chat";

export interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  section: SectionKind;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  badge?: string;
}

const sectionStyles: Record<
  SectionKind,
  {
    bgTint: string;
    iconDeep: string;
    borderHover: string;
  }
> = {
  bible: {
    bgTint: "bg-blue-tint",
    iconDeep: "text-blue-deep",
    borderHover: "hover:border-blue-deep",
  },
  saints: {
    bgTint: "bg-yellow-tint",
    iconDeep: "text-yellow-deep",
    borderHover: "hover:border-yellow-deep",
  },
  quizzes: {
    bgTint: "bg-red-tint",
    iconDeep: "text-red-deep",
    borderHover: "hover:border-red-deep",
  },
  games: {
    bgTint: "bg-green-tint",
    iconDeep: "text-green-deep",
    borderHover: "hover:border-green-deep",
  },
  stories: {
    bgTint: "bg-indigo-tint",
    iconDeep: "text-indigo-deep",
    borderHover: "hover:border-indigo-deep",
  },
  chat: {
    bgTint: "bg-violet-tint",
    iconDeep: "text-violet-deep",
    borderHover: "hover:border-violet-deep",
  },
};

export function SectionCard({
  section,
  title,
  description,
  icon,
  children,
  badge,
  className,
  ...props
}: SectionCardProps) {
  const styles = sectionStyles[section];

  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        "border-sand-border shadow-card-rest focus-visible:outline-blue-deep focus-visible:outline-offset-3 hover:shadow-card-hover group relative flex min-h-[180px] cursor-pointer select-none flex-col justify-between rounded-3xl border-2 p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 focus-visible:outline-4 sm:min-h-[220px] sm:p-8",
        styles.bgTint,
        styles.borderHover,
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        {icon && (
          <div
            className={cn(
              "sm:w-18 sm:h-18 shadow-xs flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105",
              styles.iconDeep,
            )}
          >
            {icon}
          </div>
        )}
        {badge && (
          <span className="font-heading text-ink shadow-xs inline-flex items-center rounded-full bg-white px-3.5 py-1 text-xs font-bold">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5">
        <h3 className="font-heading text-ink text-xl font-bold tracking-tight sm:text-2xl">
          {title}
        </h3>
        {description && (
          <p className="text-ink-soft font-body text-base leading-relaxed">{description}</p>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
