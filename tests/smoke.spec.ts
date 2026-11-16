import { test, expect, type Page } from '@playwright/test';

/**
 * Smoke tests: the few things that must never break on a portfolio. They describe
 * the site as it is today (one route, hash-addressed windows) and are rewritten
 * for real routes in Stage D of docs/review/phase-3.md.
 */

// Every content window. Keep in step with HREF_SCENE in src/data/nodeContent.ts
// (hub hrefs such as #touchpoint open nothing and are deliberately absent).
const WINDOWS = [
    '#about', '#compass', '#contact',
    '#remote-go', '#nespresso', '#digital-agent',
    '#synthetic-users', '#design-maturity',
    '#it-product', '#it-key-roles', '#seamless',
    '#talks', '#thinking', '#podcast',
];

/** Collects console errors and uncaught exceptions for the life of the page. */
function watchErrors(page: Page) {
    const errors: string[] = [];
    page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(e.message));
    return errors;
}

test('home renders the hero with the right title and no console errors', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('/');
    await expect(page).toHaveTitle(/Daniel Irala/);
    await expect(page.getByRole('heading', { name: /Making meaning out of chaos/ }).first()).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(errors).toEqual([]);
});

test('every content window opens from its link and has a title', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'one pass over all windows is enough');
    test.slow();
    const errors = watchErrors(page);
    for (const hash of WINDOWS) {
        // Third-party embed (Spotify) logs its own errors; it is checked for opening only.
        const before = errors.length;
        await page.goto(`/${hash}`);
        const dialog = page.getByRole('dialog');
        await expect(dialog, hash).toBeVisible();
        await expect(dialog.getByRole('heading', { level: 2 }).first(), hash).toBeVisible();
        expect(await dialog.getAttribute('aria-label'), hash).toBeTruthy();
        if (hash === '#podcast') errors.length = before;
        // A full reload per window: the hash alone would be a same-document navigation.
        await page.goto('about:blank');
    }
    expect(errors).toEqual([]);
});

test('Escape closes a deep-linked window and clears the hash', async ({ page }) => {
    await page.goto('/#it-product');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
});

test('contact window carries the three working contact links', async ({ page }) => {
    await page.goto('/#contact');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: /Email me/ })).toHaveAttribute('href', /^mailto:/);
    await expect(dialog.getByRole('link', { name: /Book a call/ })).toHaveAttribute('href', /^https:\/\/calendar\.app\.google\//);
    await expect(dialog.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', /^https:\/\/www\.linkedin\.com\/in\//);
});

test('a project opens from the page and Back closes it', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop', 'uses the desktop rail');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Areas' }).getByRole('button', { name: /Organisation/ }).click();
    await page.getByRole('button', { name: /E2E IT Product Offering/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveURL(/#it-product$/);
    await page.goBack();
    await expect(page.getByRole('dialog')).toBeHidden();
});

test('phones get the stacked layout without the graph engine', async ({ page }) => {
    test.skip(test.info().project.name !== 'phone', 'phone layout only');
    await page.goto('/');
    await expect(page.locator('section[id^="scene-"]')).toHaveCount(6);
    await expect(page.locator('canvas')).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
});
