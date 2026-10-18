import { getActiveLearnerSession } from "../lib/child-session";
import { HomeView } from "./home-view";

export const metadata = {
  title: "Kid Zone · Learn and Grow in the Catholic Faith",
  description:
    "Explore sacred Scripture, wonderful saint stories, prayers, quizzes, and church tours guided by our friendly living lamb companion.",
};

export default async function HomePage() {
  const learner = await getActiveLearnerSession();

  return <HomeView learner={learner} />;
}
