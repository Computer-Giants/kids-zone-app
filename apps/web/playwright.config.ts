import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT || "3099";
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 90_000,
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm exec next dev -p 3099 -H 127.0.0.1",
    url: `${baseURL}/api/health`,
    reuseExistingServer: true,
    timeout: 240_000,
    env: { SKIP_ENV_VALIDATION: "1" },
  },
});
