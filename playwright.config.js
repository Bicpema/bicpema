import { defineConfig, devices } from "@playwright/test";

/**
 * E2Eテストの実行対象URLとブラウザーの起動サーバー。
 * `astro build` の成果物（dist/）を `astro preview` で配信し、
 * `/vite/simulations/<name>/` に直接アクセスする。
 */
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: `npx astro preview --port ${PORT}`,
    url: `${BASE_URL}/vite/simulations/free-fall/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
