import { defineConfig, devices } from '@playwright/test';

// Smoke tests run against the PRODUCTION build (`npm run build` first), never the
// dev server: dev mode has React StrictMode warnings the live site does not.
// `channel: 'chrome'` uses the installed Chrome, so no browser download is needed.
const PORT = 3100;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        channel: 'chrome',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
        { name: 'phone', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    ],
    webServer: {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
