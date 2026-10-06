import { defineConfig } from '@playwright/test'

/*
 * Browser tests against the production build (run `npm run build` first).
 * Each test gets a fresh browser context: its own localStorage, Cache Storage
 * and service worker. Requests to any host other than the local test server
 * are blocked (see tests/e2e/fixtures.ts), so tests never touch production
 * services such as the visitor counter.
 *
 * Uses the installed Google Chrome by default. Set PW_BUNDLED_CHROMIUM=1 to use
 * Playwright's own Chromium instead (after `npx playwright install chromium`).
 */
const PORT = 4173

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    channel: process.env.PW_BUNDLED_CHROMIUM ? undefined : 'chrome',
    serviceWorkers: 'allow',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node tests/e2e/server.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/robots.txt`,
    reuseExistingServer: false,
  },
})
