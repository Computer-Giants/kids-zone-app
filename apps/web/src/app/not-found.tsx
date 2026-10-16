import { Button, MascotLamb, Sparkles } from "@kidzone/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div className="bg-sand border-sand-border shadow-card-rest rounded-full border-2 p-6">
        <MascotLamb size="xl" mood="thinking" />
      </div>

      <div className="space-y-3">
        <h1 className="font-heading text-ink text-3xl font-bold tracking-tight sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-ink-soft font-body text-base leading-relaxed sm:text-lg">
          Our little guide lamb looked all around, but could not find this page. Let us head back
          home together.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/">
          <Button variant="primary" size="lg">
            <Sparkles className="h-6 w-6 shrink-0" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
