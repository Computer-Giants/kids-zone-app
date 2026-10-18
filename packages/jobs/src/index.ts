import { inngest } from "./client";
export { inngest } from "./client";
import { serve as serveHono } from "inngest/hono";

/** Mount in a Hono app: `app.on(["GET","POST","PUT"], "/", serve({ client: inngest, functions }))`. */
export const serve = serveHono;

export const sendWelcome = inngest.createFunction(
  { id: "send-welcome" },
  { event: "user/created" },
  async ({ event, step }) => {
    await step.run("log", async () => {
      console.log("welcome flow for", event.data.email);
    });
    return { ok: true };
  },
);

import { aggregateWeeklyStarsJob } from "./jobs/leaderboard";
import { aggregateDailyMetricsJob } from "./jobs/aggregate-metrics";

export { aggregateWeeklyStarsJob, aggregateDailyMetricsJob };

export const functions = [sendWelcome, aggregateWeeklyStarsJob, aggregateDailyMetricsJob];
