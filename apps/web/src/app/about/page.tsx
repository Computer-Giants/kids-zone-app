import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Button,
  CheckCircle2,
  Compass,
  Cpu,
  Heart,
  Music,
  ShieldCheck,
  Sparkles,
  Trophy,
  WaveDivider,
} from "@kidzone/ui";
import { SupportAccountCard } from "../../components/support-account-card";
import { SharePlatformCard } from "../../components/share-platform-card";
import { getActiveLearnerSession } from "../../lib/child-session";

export const metadata: Metadata = {
  title: "About Our Chaplain & Community Mission | Kid Zone",
  description:
    "Learn about platform chaplain Rev. Fr. Michael Ifeanyi Ezeora and our mission to provide Catholic faith formation alongside free community classes in computers, music, and sports.",
};

export default async function AboutPage() {
  const learner = await getActiveLearnerSession();
  const isAuthenticatedChild = Boolean(learner && !learner.isGuest);

  return (
    <div className="bg-cream flex w-full flex-col items-center justify-start overflow-x-hidden">
      {/* Hero Header */}
      <section className="bg-cream md:pt-18 relative w-full px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 md:pb-20">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb / Return Link */}
          <Link
            href="/"
            className="text-ink-soft hover:text-orange-deep mb-6 inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="border-orange/20 bg-orange-tint text-orange-deep shadow-xs inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Our Pastoral Leadership & Story</span>
              </div>
              <h1 className="font-heading text-ink mt-3 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Faith and Skill in Joyful Harmony
              </h1>
              <p className="font-body text-ink-soft mt-3 text-base leading-relaxed sm:text-lg">
                Kid Zone was founded on the conviction that every Catholic child deserves a safe
                foundation in holy doctrine, alongside practical life skills to flourish in
                God&apos;s world.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="border-sand-border shadow-card-rest flex shrink-0 flex-col gap-3 rounded-3xl border-2 bg-white p-5 sm:p-6 md:w-72">
              <div className="flex items-center gap-3">
                <div className="bg-green-tint text-green-deep flex h-10 w-10 items-center justify-center rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-heading text-ink text-base font-black">100% Free</span>
                  <p className="font-body text-ink-soft text-xs">For all parish children</p>
                </div>
              </div>
              <div className="border-sand-border flex items-center gap-3 border-t pt-3">
                <div className="bg-orange-tint text-orange-deep flex h-10 w-10 items-center justify-center rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-heading text-ink text-base font-black">
                    Priest Reviewed
                  </span>
                  <p className="font-body text-ink-soft text-xs">Faithful Catholic doctrine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Wave Divider: Cream to Sand */}
      <WaveDivider fillColor="var(--color-sand)" position="top" />

      {/* Chaplain Portrait & Personal Story */}
      <section className="bg-sand relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            {/* Chaplain Photo Card (5 cols) */}
            <div className="border-sand-border shadow-card-hover relative flex flex-col items-center justify-center rounded-3xl border-2 bg-white p-6 sm:p-8 md:col-span-5">
              <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                <div
                  aria-hidden="true"
                  className="bg-orange-tint/60 pointer-events-none absolute inset-0 rounded-full blur-3xl"
                />
                <Image
                  src="/images/about/fr-michael-ifeanyi-ezeora.png"
                  alt="Rev. Fr. Michael Ifeanyi Ezeora in green priest liturgical vestment"
                  fill
                  sizes="(max-width: 768px) 288px, 320px"
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

              <div className="mt-4 text-center">
                <div className="bg-yellow-tint text-yellow-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Platform Chaplain</span>
                </div>
                <h2 className="font-heading text-ink mt-2 text-2xl font-black">
                  Rev. Fr. Michael Ifeanyi Ezeora
                </h2>
                <p className="font-body text-ink-soft text-sm font-semibold">
                  Catholic Priest & Youth Educator
                </p>
              </div>
            </div>

            {/* Chaplain Vision & Biography (7 cols) */}
            <div className="space-y-5 md:col-span-7">
              <div className="border-yellow-deep/20 bg-yellow-tint text-yellow-deep inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider">
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>Pastoral Vision</span>
              </div>
              <h2 className="font-heading text-ink text-3xl font-black tracking-tight sm:text-4xl">
                Building Children Up in Virtue and Practical Skill
              </h2>
              <p className="font-body text-ink text-base leading-relaxed sm:text-lg">
                Rev. Fr. Michael Ifeanyi Ezeora is a Catholic priest with a deep pastoral zeal for
                the next generation. Observing that children often face digital distractions without
                positive guidance, he initiated free weekend classes to help young parishioners
                discover both holy Christian truth and empowering modern abilities.
              </p>
              <p className="font-body text-ink-soft text-sm leading-relaxed sm:text-base">
                Under his leadership, children learn that technology, artistic expression, and
                physical discipline are gifts from God meant to be used for the good of their
                families, their communities, and the Church.
              </p>

              {/* Pastoral Pillars */}
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <div className="border-sand-border flex items-start gap-2.5 rounded-2xl border bg-white p-3.5">
                  <CheckCircle2 className="text-green-deep mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="font-heading text-ink text-sm font-bold">Safe Digital Space</h4>
                    <p className="font-body text-ink-soft text-xs leading-snug">
                      Zero ads, zero trackers, and verified Catholic content.
                    </p>
                  </div>
                </div>

                <div className="border-sand-border flex items-start gap-2.5 rounded-2xl border bg-white p-3.5">
                  <CheckCircle2 className="text-green-deep mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <h4 className="font-heading text-ink text-sm font-bold">Talent Development</h4>
                    <p className="font-body text-ink-soft text-xs leading-snug">
                      Coding, keyboard music, and athletics offered without cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Wave Divider: Sand to White */}
      <WaveDivider fillColor="var(--color-white)" position="top" flipX={true} />

      {/* Free Community Classes Curriculum */}
      <section className="relative w-full bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center sm:text-left">
            <div className="bg-blue-tint text-blue-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Cpu className="h-3.5 w-3.5" />
              <span>Free Community Curriculum</span>
            </div>
            <h2 className="font-heading text-ink mt-2 text-3xl font-black sm:text-4xl">
              Classes Hosted by Fr. Michael
            </h2>
            <p className="font-body text-ink-soft mt-1 max-w-2xl text-base sm:text-lg">
              Regular weekend training programs hosted at Wisdom Hall and parish grounds, open to
              all children without discrimination or tuition fees.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Subject 1: Computers */}
            <div className="border-sand-border bg-cream shadow-card-rest space-y-3 rounded-3xl border-2 p-6">
              <div className="bg-blue-tint text-blue-deep flex h-12 w-12 items-center justify-center rounded-2xl">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-ink text-lg font-bold">Computer Science</h3>
              <p className="font-body text-ink-soft text-xs leading-relaxed sm:text-sm">
                Foundations of digital literacy, coding logic, and creative problem solving using
                modern tools.
              </p>
            </div>

            {/* Subject 2: Music */}
            <div className="border-sand-border bg-cream shadow-card-rest space-y-3 rounded-3xl border-2 p-6">
              <div className="bg-yellow-tint text-yellow-deep flex h-12 w-12 items-center justify-center rounded-2xl">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-ink text-lg font-bold">Music & Keyboard</h3>
              <p className="font-body text-ink-soft text-xs leading-relaxed sm:text-sm">
                Piano keyboard instruction, pitch training, and sacred liturgical hymns that lift
                the heart to God.
              </p>
            </div>

            {/* Subject 3: Sports */}
            <div className="border-sand-border bg-cream shadow-card-rest space-y-3 rounded-3xl border-2 p-6">
              <div className="bg-green-tint text-green-deep flex h-12 w-12 items-center justify-center rounded-2xl">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-ink text-lg font-bold">Sports & Athletics</h3>
              <p className="font-body text-ink-soft text-xs leading-relaxed sm:text-sm">
                Football tournaments, athletic training, and lessons in perseverance, fair play, and
                teamwork.
              </p>
            </div>

            {/* Subject 4: Catechesis */}
            <div className="border-sand-border bg-cream shadow-card-rest space-y-3 rounded-3xl border-2 p-6">
              <div className="bg-orange-tint text-orange-deep flex h-12 w-12 items-center justify-center rounded-2xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-ink text-lg font-bold">Holy Catechesis</h3>
              <p className="font-body text-ink-soft text-xs leading-relaxed sm:text-sm">
                Scripture stories, lives of the saints, and learning to pray with our friendly Guide
                Lamb companion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Wave Divider: White to Cream */}
      <WaveDivider fillColor="var(--color-cream)" position="top" />

      {/* Community Gallery in Full Layout */}
      <section className="bg-cream relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center sm:text-left">
            <div className="bg-orange-tint text-orange-deep inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Community Outreach Photo Gallery</span>
            </div>
            <h2 className="font-heading text-ink mt-2 text-3xl font-black sm:text-4xl">
              Moments from Our Parish Outreaches
            </h2>
            <p className="font-body text-ink-soft mt-1 max-w-2xl text-base sm:text-lg">
              Witnessing joy, fellowship, and empowerment among children in our Catholic community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gallery Image 1 */}
            <div className="border-sand-border shadow-card-hover group overflow-hidden rounded-3xl border-2 bg-white">
              <div className="aspect-16/10 bg-sand relative w-full overflow-hidden">
                <Image
                  src="/images/about/wisdom-hall-classes.jpg"
                  alt="Parish children and community youth gathered outside Wisdom Hall for free skills classes with Fr. Michael"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="group-hover:scale-102 object-cover transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-6">
                <div className="bg-blue-tint text-blue-deep inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Wisdom Hall Training</span>
                </div>
                <h3 className="font-heading text-ink mt-2 text-xl font-bold">
                  Free Skill Classes at Wisdom Hall
                </h3>
                <p className="font-body text-ink-soft mt-1 text-sm leading-relaxed">
                  Children gathered in front of Wisdom Hall for weekly classes in computer coding,
                  keyboard music, and faith formation under Fr. Michael&apos;s guidance.
                </p>
              </div>
            </div>

            {/* Gallery Image 2 */}
            <div className="border-sand-border shadow-card-hover group overflow-hidden rounded-3xl border-2 bg-white">
              <div className="aspect-16/10 bg-sand relative w-full overflow-hidden">
                <Image
                  src="/images/about/sports-youth-outreach.jpg"
                  alt="Community youth and parish children enjoying athletics, sports, and fellowship in stadium seating"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="group-hover:scale-102 object-cover transition-transform duration-500 ease-out"
                />
              </div>
              <div className="p-6">
                <div className="bg-green-tint text-green-deep inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>Youth Athletics & Fellowship</span>
                </div>
                <h3 className="font-heading text-ink mt-2 text-xl font-bold">
                  Faith, Sportsmanship and Teamwork
                </h3>
                <p className="font-body text-ink-soft mt-1 text-sm leading-relaxed">
                  Youth and children assembled at the community stadium for athletic competitions,
                  learning discipline, Christian character, and joyful teamwork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Wave Divider: Cream to Sand */}
      <WaveDivider fillColor="var(--color-sand)" position="top" />

      {/* Support and Social Sharing Row */}
      <section className="bg-sand relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-10">
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-ink text-3xl font-black sm:text-4xl">
              Support the Mission & Invite Others
            </h2>
            <p className="font-body text-ink-soft mt-1 max-w-2xl text-base sm:text-lg">
              Every voluntary gift helps Fr. Michael acquire computers, keyboards, sports balls, and
              learning supplies for children in need.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SupportAccountCard isAuthenticatedChild={isAuthenticatedChild} />
            <SharePlatformCard isAuthenticatedChild={isAuthenticatedChild} />
          </div>

          {/* Bottom Back Button */}
          <div className="flex justify-center pt-6">
            <Link href="/">
              <Button size="lg" variant="primary">
                <Compass className="mr-1 h-5 w-5" />
                <span>Explore Children&apos;s Learning Tracks</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
