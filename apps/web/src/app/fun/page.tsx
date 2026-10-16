import type { Metadata } from "next";
import { SEED_PUZZLES } from "@kidzone/db";
import { getActiveLearnerSession } from "@/lib/child-session";
import { FunIndexView } from "./fun-index-view";

export const metadata: Metadata = {
  title: "Catholic Church Puzzles & Games for Kids | Kid Zone",
  description:
    "Fun and faithful church puzzles, matching games, word search challenges, and unscramble games for children aged 3 to 15.",
};

export default async function FunPage() {
  const session = await getActiveLearnerSession();

  return <FunIndexView puzzles={SEED_PUZZLES} session={session} />;
}
