import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const defaultAppUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

const defaultApiUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:8787";

export const env = createEnv({
  server: {
    API_URL: z.string().url().default(defaultApiUrl),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default(defaultAppUrl),
  },
  runtimeEnv: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
