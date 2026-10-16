import type { Metadata } from "next";
import { AnimatedLambGuide, Button, Sparkles } from "@kidzone/ui";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Parish and Youth Chat",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-4 py-12 text-center sm:py-16">
      <div className="bg-violet-tint font-heading text-violet-deep inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide">
        <Sparkles className="h-4 w-4" />
        <span>Youth Community</span>
      </div>

      <div className="border-sand-border bg-sand shadow-card-rest rounded-3xl border-2 p-6">
        <AnimatedLambGuide
          size="lg"
          mood="encouraging"
          speechText="Welcome! Youth chat will provide safe, moderated discussions for young Catholics aged 11 to 15."
          speechSpeaker="Guide Lamb"
        />
      </div>

      <div className="max-w-xl space-y-3">
        <h1 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
          Parish and Youth Chat
        </h1>
        <p className="font-body text-ink-soft text-base leading-relaxed sm:text-lg">
          A calm, supervised discussion area for older youth aged eleven to fifteen. All messages
          pass strict safety filters and human moderation.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link href="/">
          <Button variant="primary" size="lg">
            <span>Explore Home</span>
          </Button>
        </Link>
        <Link href="/parent">
          <Button variant="outline" size="lg">
            <span>Parent Portal</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
