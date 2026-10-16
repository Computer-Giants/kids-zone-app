import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSaintBySlug, SEED_SAINTS } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { SaintDetailView } from "./saint-detail-view";

interface SaintPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SEED_SAINTS.map((saint) => ({
    slug: saint.slug,
  }));
}

export async function generateMetadata({ params }: SaintPageProps): Promise<Metadata> {
  const { slug } = await params;
  const saint = getSaintBySlug(slug);

  if (!saint) {
    return {
      title: "Saint Not Found | Kid Zone",
    };
  }

  return {
    title: `${saint.title} ${saint.name} | Catholic Saints for Children`,
    description: saint.tagline,
  };
}

export default async function SaintDetailPage({ params }: SaintPageProps) {
  const { slug } = await params;
  const saint = getSaintBySlug(slug);

  if (!saint) {
    notFound();
  }

  const session = await getActiveLearnerSession();

  return <SaintDetailView saint={saint} session={session} />;
}
