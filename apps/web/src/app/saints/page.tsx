import type { Metadata } from "next";
import { getSaintOfTheDay, SEED_PATRONAGES, SEED_SAINTS } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { SaintsIndexView } from "./saints-index-view";

export const metadata: Metadata = {
  title: "Catholic Saints for Children | Saint of the Day & Life Stories",
  description:
    "Discover today's Catholic saint of the day, explore inspiring holy heroes across history, and read illustrated life stories and virtues for children.",
};

export default async function SaintsPage() {
  const session = await getActiveLearnerSession();
  const initialSaintOfTheDay = getSaintOfTheDay();

  return (
    <SaintsIndexView
      initialSaintOfTheDay={initialSaintOfTheDay}
      allSaints={SEED_SAINTS}
      patronages={SEED_PATRONAGES}
      session={session}
    />
  );
}
