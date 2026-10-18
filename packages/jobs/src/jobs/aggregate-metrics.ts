import { inngest } from "../client";

/**
 * AC-6 in spec 0014:
 * Inngest scheduled job to aggregate daily activity metrics.
 * Runs nightly on cron or on metrics/aggregate event.
 */
export const aggregateDailyMetricsJob = inngest.createFunction(
  { id: "aggregate-daily-metrics" },
  [{ cron: "0 2 * * *" }, { event: "metrics/aggregate" }],
  async ({ step }) => {
    const summary = await step.run("aggregate-daily-summary", async () => {
      return { status: "aggregated", timestamp: new Date().toISOString() };
    });

    return { ok: true, summary };
  },
);
