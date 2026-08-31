import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against the production build, not the dev server: dev-only warnings and
 * unminified timing hide real problems.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [["list"]],
  timeout: 45_000,
  use: {
    baseURL: "http://localhost:3111",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    // `next start` cannot serve an `output: "export"` build, so the suite runs against
    // the exported files — which is also exactly what GitHub Pages serves.
    command: "npx --yes serve@14 out -l 3111 --no-clipboard",
    url: "http://localhost:3111",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
