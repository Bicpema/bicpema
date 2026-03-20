import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test',
  testMatch: ['ui/**/*.spec.js', 'e2e/**/*.spec.js'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    // Vite dev server ルートはhttp://localhost:5173、baseは/vite
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite --port 5173',
    // シミュレーションページが200を返すURLでサーバー起動確認
    url: 'http://localhost:5173/vite/simulations/vertical-throw-up/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
