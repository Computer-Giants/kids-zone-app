import { captureException } from "@kidzone/observability";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { bible } from "./routes/bible";
import { health } from "./routes/health";
import { jobs } from "./routes/jobs";
import { quizzes } from "./routes/quizzes";
import { saints } from "./routes/saints";

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
  .get("/", (c) => c.json({ name: "api" }));

export type AppType = typeof routes;
export { app, routes };
export default app;
