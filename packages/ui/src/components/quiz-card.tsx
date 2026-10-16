"use client";

import * as React from "react";
import { ArrowRight, BookOpen, Crown, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

export interface QuizCardProps {
  slug: string;
  title: string;
  description: string;
  category: "bible" | "saints" | "catechism" | "seasons";
  minAge: number;
  maxAge: number;
  questionCount?: number;
  onSelect: () => void;
  className?: string;
}

export function QuizCard({
  slug,
  title,
  description,
  category,
  minAge,
  maxAge,
  questionCount = 4,
  onSelect,
  className,
}: QuizCardProps) {
  const getCategoryDetails = () => {
    switch (category) {
      case "bible":
        return {
          label: "Bible",
          icon: <BookOpen className="h-4 w-4" />,
          badgeStyle: "bg-blue-tint text-blue-deep",
        };
      case "saints":
        return {
          label: "Saints",
          icon: <Crown className="h-4 w-4" />,
          badgeStyle: "bg-yellow-tint text-yellow-deep",
        };
      case "catechism":
        return {
          label: "Catechism",
          icon: <Sparkles className="h-4 w-4" />,
          badgeStyle: "bg-sand text-ink",
        };
      case "seasons":
        return {
          label: "Church Seasons",
          icon: <HelpCircle className="h-4 w-4" />,
          badgeStyle: "bg-green-tint text-green-deep",
        };
    }
  };

  const { label, icon, badgeStyle } = getCategoryDetails();

  return (
    <article
      data-quiz-slug={slug}
      className={cn(
        "border-sand-border shadow-card-rest hover:shadow-card-hover group relative flex flex-col justify-between rounded-3xl border-2 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      <div>
        {/* Top Badges */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span
            className={cn(
              "font-heading inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold",
              badgeStyle,
            )}
          >
            {icon}
            <span>{label}</span>
          </span>

          <span className="bg-sand font-heading text-ink/75 border-sand-border inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold">
            <span>
              Ages {minAge} to {maxAge}
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-ink group-hover:text-blue-deep mb-2 text-xl font-black tracking-tight transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="font-body text-ink/80 mb-5 line-clamp-3 text-sm font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer and Action */}
      <div className="border-sand-border/70 flex items-center justify-between gap-3 border-t pt-2">
        <span className="font-heading text-ink/60 text-xs font-black uppercase tracking-wider">
          {questionCount} Questions
        </span>

        <button
          type="button"
          onClick={onSelect}
          className="bg-orange font-heading hover:bg-orange-deep focus-accessible shadow-sticker-orange inline-flex min-h-[44px] items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black text-white transition-all active:scale-95 sm:text-sm"
        >
          <span>Play Quiz</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
