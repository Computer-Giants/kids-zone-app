import { defineConfig, devices } from "@playwright/test";

const port = process.env.PORT || "3099";
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 60_000,
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm exec next dev -p 3099",
    url: `${baseURL}/`,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { SKIP_ENV_VALIDATION: "1" },
  },
});
