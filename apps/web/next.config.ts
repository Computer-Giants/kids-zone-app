import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // Vercel manages serverless output automatically; `standalone` is used for Docker/VPS deployments.
  output: process.env.VERCEL
    ? undefined
    : process.env.NEXT_STANDALONE
      ? "standalone"
      : process.platform === "win32"
        ? undefined
        : "standalone",
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@kidzone/ui",
    "@kidzone/auth",
    "@kidzone/validators",
    "@kidzone/utils",
    "@kidzone/api",
    "@kidzone/db",
    "@kidzone/jobs",
    "@kidzone/observability",
  ],
};

export default config;
