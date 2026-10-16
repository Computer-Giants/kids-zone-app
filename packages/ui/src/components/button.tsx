import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 rounded-full font-heading font-bold tracking-wide select-none transition-[transform,box-shadow] duration-150 ease-out focus-visible:outline-4 focus-visible:outline-blue-deep focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-1 active:translate-y-1 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-orange text-ink shadow-sticker-orange hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-orange-deep)]",
        bible:
          "bg-blue-deep text-white shadow-sticker-blue hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-blue-deep)]",
        saints:
          "bg-yellow text-ink shadow-sticker-yellow hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-yellow-deep)]",
        quizzes:
          "bg-red-deep text-white shadow-sticker-red hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-red-deep)]",
        games:
          "bg-green text-ink shadow-sticker-green hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-green-deep)]",
        stories:
          "bg-indigo-deep text-white shadow-sticker-indigo hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-indigo-deep)]",
        chat: "bg-violet-deep text-white shadow-sticker-violet hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-violet-deep)]",
        parent:
          "bg-slate text-white shadow-sticker-slate hover:-translate-y-0.5 active:shadow-[0_2px_0_rgba(43,45,66,0.35)]",
        outline:
          "bg-white text-ink border-2 border-sand-border shadow-card-rest hover:-translate-y-0.5 active:shadow-[0_2px_0_var(--color-sand-border)]",
      },
      size: {
        md: "min-h-[56px] h-14 px-8 text-lg",
        lg: "min-h-[64px] h-16 px-10 text-xl",
        icon: "min-h-[56px] min-w-[56px] w-14 h-14 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
