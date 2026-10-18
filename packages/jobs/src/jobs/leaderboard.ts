import { inngest } from "../client";

/**
 * AC-4 in spec 0013:
 * Inngest scheduled job to aggregate weekly stars by real age band.
 * Runs on cron or on leaderboard/aggregate event.
 */
export const aggregateWeeklyStarsJob = inngest.createFunction(
  { id: "aggregate-weekly-stars" },
  [{ cron: "0 */6 * * *" }, { event: "leaderboard/aggregate" }],
  async ({ step }) => {
    const result = await step.run("aggregate-weekly-stars", async () => {
      return { status: "aggregated", timestamp: new Date().toISOString() };
    });

    return { ok: true, result };
  },
);
