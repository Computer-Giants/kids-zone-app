import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  // `standalone` makes the Docker/VPS image small; Vercel ignores it.
  output: "standalone",
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  transpilePackages: [
    "@kidzone/ui",
    "@kidzone/auth",
    "@kidzone/validators",
    "@kidzone/api",
    "@kidzone/db",
    "@kidzone/jobs",
    "@kidzone/observability",
  ],
};

export default config;
