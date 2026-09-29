import { defineConfig, devices } from "@playwright/test";

// Browser smoke tests. They never submit forms or write data.
//   PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test   (server already running)
//   npx playwright test                                             (starts `npm run start` on :3000)
// Locally, PW_CHANNEL=chrome uses the installed Chrome instead of the bundled Chromium.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const channel = process.env.PW_CHANNEL;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "unit", testDir: "./tests/unit" },
    {
      name: "desktop",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"], ...(channel ? { channel } : {}) }
    },
    {
      name: "mobile",
      testDir: "./tests/e2e",
      use: { ...devices["Pixel 7"], ...(channel ? { channel } : {}) }
    }
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : { command: "npm run start", url: baseURL, reuseExistingServer: true, timeout: 120_000 }
});
