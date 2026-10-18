import { getActiveLearnerSession } from "@/lib/child-session";
import { getChurchTourScenes } from "@kidzone/db";
import { ChurchTourClient } from "./church-tour-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inside the Catholic Church Tour | Kid Zone",
  description:
    "Explore the illustrated rooms of a Catholic church building, tap sacred objects, learn Catholic reverence, and listen to holy stories.",
};

export default async function ChurchTourPage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  const session = await getActiveLearnerSession();
  const childId = session && !session.isGuest ? session.id : undefined;
  const ageBand = session?.ageBand ?? "b8_10";

  const resolvedParams = await searchParams;
  const initialSlug = resolvedParams.scene || "narthex";
  const scenes = getChurchTourScenes();

  return (
    <ChurchTourClient
      initialScenes={scenes}
      initialActiveSlug={initialSlug}
      childId={childId}
      ageBand={ageBand}
    />
  );
}
