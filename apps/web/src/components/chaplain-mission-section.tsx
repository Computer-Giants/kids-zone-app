"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Button,
  Cpu,
  Music,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "@kidzone/ui";
import { SupportAccountCard } from "./support-account-card";
import { SharePlatformCard } from "./share-platform-card";

export interface ChaplainMissionSectionProps {
  isAuthenticatedChild?: boolean;
  className?: string;
}

export function ChaplainMissionSection({
  isAuthenticatedChild = false,
  className,
}: ChaplainMissionSectionProps) {
  return (
    <section
      className={`bg-sand relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 ${className || ""}`}
    >
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="border-orange/20 bg-orange-tint text-orange-deep shadow-xs inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Pastoral Leadership & Community Mission</span>
            </div>
            <h2 className="font-heading text-ink mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Meet Our Chaplain — Fr. Michael
            </h2>
            <p className="font-body text-ink-soft mt-2 text-base leading-relaxed sm:text-lg">
              Guiding Catholic children to grow both deeply rooted in faith and equipped with
              valuable skills through free weekly classes in computers, music, and sports.
            </p>
          </div>

          <Link href="/about" className="shrink-0">
            <Button variant="outline" size="md">
              <span>Read Full Story</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid: Chaplain Spotlight & Outreach Gallery */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Chaplain Spotlight Card (5 cols on lg) */}
          <div className="border-sand-border shadow-card-hover flex flex-col justify-between overflow-hidden rounded-3xl border-2 bg-white p-6 sm:p-8 lg:col-span-5">
            <div>
              {/* Chaplain Badge */}
              <div className="flex items-center gap-2">
                <div className="bg-yellow-tint text-yellow-deep flex h-8 w-8 items-center justify-center rounded-full">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="font-heading text-yellow-deep text-xs font-extrabold uppercase tracking-wider">
                  Platform Chaplain & Pastoral Director
                </span>
              </div>

              {/* Priest Portrait with soft radiant halo */}
              <div className="relative mx-auto my-6 flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
                <div
                  aria-hidden="true"
                  className="bg-orange-tint/70 pointer-events-none absolute inset-0 rounded-full blur-2xl"
                />
                <div className="relative h-full w-full">
                  <Image
                    src="/images/about/fr-michael-ifeanyi-ezeora.png"
                    alt="Rev. Fr. Michael Ifeanyi Ezeora in green priest liturgical vestment"
                    fill
                    sizes="(max-width: 768px) 256px, 288px"
                    className="object-contain drop-shadow-lg"
                    priority={false}
                  />
                </div>
              </div>

              {/* Chaplain Name & Title */}
              <div className="text-center sm:text-left">
                <h3 className="font-heading text-ink text-2xl font-black sm:text-3xl">
                  Rev. Fr. Michael Ifeanyi Ezeora
                </h3>
                <p className="font-body text-orange-deep mt-0.5 text-sm font-bold">
                  Parish Priest • Youth Ministry Director
                </p>
              </div>

              {/* Chaplain Quote / Pastoral Statement */}
              <div className="border-sand-border bg-cream relative mt-4 rounded-2xl border p-4">
                <p className="font-body text-ink text-sm font-medium italic leading-relaxed">
                  &ldquo;Every child is endowed by God with sacred potential. Our goal is to nurture
                  both their souls through Scripture and prayer, and their minds and hands through
                  practical classes in computer coding, music, and athletics. Faith and skill walk
                  hand in hand.&rdquo;
                </p>
              </div>
            </div>

            {/* Core Values Strip */}
            <div className="border-sand-border text-ink mt-6 grid grid-cols-2 gap-2 border-t pt-4 text-xs font-bold">
              <div className="text-ink-soft flex items-center gap-1.5">
                <Cpu className="text-blue-deep h-4 w-4 shrink-0" />
                <span>Coding & Tech</span>
              </div>
              <div className="text-ink-soft flex items-center gap-1.5">
                <Music className="text-yellow-deep h-4 w-4 shrink-0" />
                <span>Music & Keyboard</span>
              </div>
              <div className="text-ink-soft flex items-center gap-1.5">
                <Trophy className="text-green-deep h-4 w-4 shrink-0" />
                <span>Sports & Fitness</span>
              </div>
              <div className="text-ink-soft flex items-center gap-1.5">
                <BookOpen className="text-orange-deep h-4 w-4 shrink-0" />
                <span>Holy Scripture</span>
              </div>
            </div>
          </div>

          {/* Outreach Photo Gallery Cards (7 cols on lg) */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Gallery Card 1: Wisdom Hall Classes */}
            <div className="border-sand-border shadow-card-hover group overflow-hidden rounded-3xl border-2 bg-white">
              <div className="aspect-16/9 bg-sand sm:aspect-2/1 relative w-full overflow-hidden">
                <Image
                  src="/images/about/wisdom-hall-classes.jpg"
                  alt="Parish children and community youth gathered outside Wisdom Hall for free skills classes with Fr. Michael"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="group-hover:scale-103 object-cover transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white sm:bottom-4 sm:left-6 sm:right-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md">
                    <Cpu className="text-orange-tint h-3.5 w-3.5" />
                    <span>Free Community Classes</span>
                  </div>
                  <h4 className="font-heading mt-1 text-lg font-bold leading-tight sm:text-xl">
                    Digital Skills & Music at Wisdom Hall
                  </h4>
                  <p className="font-body mt-0.5 line-clamp-2 text-xs text-white/90 sm:text-sm">
                    Fr. Michael hosts free weekend computer and keyboard classes for parish children
                    to prepare them for modern careers.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Card 2: Youth Sports Outreach */}
            <div className="border-sand-border shadow-card-hover group overflow-hidden rounded-3xl border-2 bg-white">
              <div className="aspect-16/9 bg-sand sm:aspect-2/1 relative w-full overflow-hidden">
                <Image
                  src="/images/about/sports-youth-outreach.jpg"
                  alt="Community youth and parish children enjoying athletics, sports, and fellowship in stadium seating"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="group-hover:scale-103 object-cover transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white sm:bottom-4 sm:left-6 sm:right-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md">
                    <Trophy className="text-yellow-tint h-3.5 w-3.5" />
                    <span>Youth Fellowship & Athletics</span>
                  </div>
                  <h4 className="font-heading mt-1 text-lg font-bold leading-tight sm:text-xl">
                    Faith, Teamwork & Sportsmanship
                  </h4>
                  <p className="font-body mt-0.5 line-clamp-2 text-xs text-white/90 sm:text-sm">
                    Building character, physical health, and Christian brotherhood through football
                    tournaments and youth sports.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Share Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SupportAccountCard isAuthenticatedChild={isAuthenticatedChild} />
          <SharePlatformCard isAuthenticatedChild={isAuthenticatedChild} />
        </div>
      </div>
    </section>
  );
}
