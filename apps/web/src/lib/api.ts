import type { AppType } from "@kidzone/api/app";
import { hc } from "hono/client";
import { env } from "@/env";

/** Fully typed API client (Hono RPC). */
export const api = hc<AppType>(env.API_URL);
