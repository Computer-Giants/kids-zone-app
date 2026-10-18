import { captureException } from "@kidzone/observability";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bible } from "./routes/bible";
import { health } from "./routes/health";
import { jobs } from "./routes/jobs";
import { quizzes } from "./routes/quizzes";
import { puzzles } from "./routes/puzzles";
import { rewards } from "./routes/rewards";
import { saints } from "./routes/saints";
import { leaderboard } from "./routes/leaderboard";
import { review } from "./routes/review";
import { telemetry } from "./routes/telemetry";

const app = new Hono().basePath("/api");

app.use("*", cors({ origin: (origin) => origin ?? "*", credentials: true }));

app.onError((err, c) => {
  captureException(err, { path: c.req.path });
  return c.json({ error: "Internal Server Error" }, 500);
});

// Chain routes so the Hono RPC client (apps/web/src/lib/api.ts) gets end-to-end types.
const routes = app
  .route("/health", health)
  .route("/jobs", jobs)
  .route("/bible", bible)
  .route("/saints", saints)
  .route("/quizzes", quizzes)
  .route("/puzzles", puzzles)
  .route("/rewards", rewards)
  .route("/leaderboard", leaderboard)
  .route("/review", review)
  .route("/telemetry", telemetry)
  .get("/", (c) => c.json({ name: "api" }));

export type AppType = typeof routes;
export { app, routes };
export default app;
