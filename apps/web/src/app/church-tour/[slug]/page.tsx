import { getActiveLearnerSession } from "@/lib/child-session";
import { getChurchTourSceneBySlug, getChurchTourScenes } from "@kidzone/db";
import { ChurchTourClient } from "../church-tour-client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const scenes = getChurchTourScenes();
  return scenes.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const scene = getChurchTourSceneBySlug(slug);

  if (!scene) {
    return { title: "Church Tour Room | Kid Zone" };
  }

  return {
    title: `${scene.title} | Inside the Catholic Church Tour`,
    description: scene.description,
  };
}

export default async function ChurchTourSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scene = getChurchTourSceneBySlug(slug);

  if (!scene) {
    notFound();
  }

  const session = await getActiveLearnerSession();
  const childId = session && !session.isGuest ? session.id : undefined;
  const ageBand = session?.ageBand ?? "b8_10";
  const allScenes = getChurchTourScenes();

  return (
    <ChurchTourClient
      initialScenes={allScenes}
      initialActiveSlug={scene.slug}
      childId={childId}
      ageBand={ageBand}
    />
  );
}
