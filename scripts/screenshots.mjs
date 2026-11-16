// Screenshots of every view at the four review widths.
//
//   node scripts/screenshots.mjs --label stage-b [--views home,it-product]
//
// Writes docs/review/screenshots/<label>/<view>-<width>.png (docs/review is
// local-only and never committed). Needs the production server on port 3100.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { BASE, parseArgs, pickViews, requireServer } from './views.mjs';

const WIDTHS = [
    { width: 375, height: 812, touch: true },
    { width: 768, height: 1024, touch: false },
    { width: 1280, height: 800, touch: false },
    { width: 1920, height: 1080, touch: false },
];
// Long enough for the map to settle and a deep-linked window to finish opening.
const SETTLE_MS = 5000;

const args = parseArgs();
if (!args.label || args.label === true) throw new Error('Pass --label <name>, e.g. --label stage-b');
const views = pickViews(args.views);
const outDir = path.join('docs', 'review', 'screenshots', String(args.label));

await requireServer();
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const problems = [];
try {
    for (const { width, height, touch } of WIDTHS) {
        const context = await browser.newContext({
            viewport: { width, height },
            isMobile: touch,
            hasTouch: touch,
            deviceScaleFactor: 1,
        });
        for (const view of views) {
            const page = await context.newPage();
            const errors = [];
            page.on('console', (m) => {
                if (m.type() === 'error') errors.push(m.text());
            });
            page.on('pageerror', (e) => errors.push(e.message));
            await page.goto(BASE + view.path, { waitUntil: 'networkidle' });
            await page.waitForTimeout(SETTLE_MS);
            await page.screenshot({ path: path.join(outDir, `${view.name}-${width}.png`) });
            const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
            // The Spotify embed logs its own errors; they are not ours to fix.
            const ours = view.name === 'podcast' ? [] : errors;
            if (ours.length || overflowX > 0) problems.push({ view: view.name, width, overflowX, errors: ours });
            await page.close();
            console.log(`${view.name}-${width}.png`);
        }
        await context.close();
    }
} finally {
    await browser.close();
}

if (problems.length) {
    console.error('\nConsole errors or horizontal overflow found:');
    console.error(JSON.stringify(problems, null, 2));
    process.exitCode = 1;
} else {
    console.log(`\n${views.length * WIDTHS.length} screenshots in ${outDir}, no console errors, no overflow.`);
}
