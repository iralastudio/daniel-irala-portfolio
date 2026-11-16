// Lighthouse on every view, mobile and desktop, with a comparison against an
// earlier run.
//
//   node scripts/lighthouse.mjs --label stage-b [--views home,it-product]
//        [--only mobile|desktop] [--runs 3] [--compare baseline]
//
// Writes docs/review/lighthouse/<label>/<view>-<form>.json plus summary.json
// (docs/review is local-only and never committed). Needs the production server
// on port 3100. Lighthouse is run through npx at a pinned version instead of
// being a dependency: it is a measuring tool, and pinning keeps runs comparable
// with the Phase 1 baseline, which used this version.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { BASE, parseArgs, pickViews, requireServer } from './views.mjs';

const LIGHTHOUSE = 'lighthouse@12.8.2';
const FORMS = ['mobile', 'desktop'];

const args = parseArgs();
if (!args.label || args.label === true) throw new Error('Pass --label <name>, e.g. --label stage-b');
const views = pickViews(args.views);
const forms = args.only && args.only !== true ? FORMS.filter((f) => f === args.only) : FORMS;
if (!forms.length) throw new Error('--only must be "mobile" or "desktop"');
const runs = Math.max(1, Number.parseInt(args.runs ?? '1', 10) || 1);
const root = path.join('docs', 'review', 'lighthouse');
const outDir = path.join(root, String(args.label));

await requireServer();
fs.mkdirSync(outDir, { recursive: true });

function runOnce(url, form, file) {
    const cli = [
        '--yes', LIGHTHOUSE, `"${url}"`,
        '--output=json', `--output-path="${file}"`,
        '--chrome-flags="--headless=new"', '--quiet',
        ...(form === 'desktop' ? ['--preset=desktop'] : []),
    ];
    // Run through the shell so Windows resolves npx.cmd. One command string, not an
    // args array (Node warns on args + shell); every value above is quoted, and the
    // only variable parts are view names validated against the fixed list.
    const res = spawnSync(['npx', ...cli].join(' '), { shell: true, stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' });
    if (!fs.existsSync(file)) throw new Error(`Lighthouse produced no report for ${url} (${form}): ${res.stderr?.slice(-400)}`);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const score = (c) => (c?.score == null ? null : Math.round(c.score * 100));
const ms = (a) => (a?.numericValue == null ? null : Math.round(a.numericValue));

function summarise(view, form, lhr) {
    const a = lhr.audits;
    const c = lhr.categories;
    const scripts = a['resource-summary']?.details?.items?.find((i) => i.resourceType === 'script');
    return {
        view: view.name,
        form,
        perf: score(c.performance),
        a11y: score(c.accessibility),
        bp: score(c['best-practices']),
        seo: score(c.seo),
        fcp: ms(a['first-contentful-paint']),
        // null when Chrome records no LCP candidate (Lighthouse NO_LCP).
        lcp: ms(a['largest-contentful-paint']),
        tbt: ms(a['total-blocking-time']),
        cls: a['cumulative-layout-shift']?.numericValue == null ? null : +a['cumulative-layout-shift'].numericValue.toFixed(3),
        jsKB: scripts ? Math.round(scripts.transferSize / 1024) : null,
        totalKB: ms(a['total-byte-weight']) == null ? null : Math.round(a['total-byte-weight'].numericValue / 1024),
    };
}

/** The run with the median performance score; ties and nulls fall to the first. */
function median(rows) {
    const sorted = [...rows].sort((x, y) => (x.perf ?? -1) - (y.perf ?? -1));
    return sorted[Math.floor((sorted.length - 1) / 2)];
}

const rows = [];
for (const form of forms) {
    for (const view of views) {
        const attempts = [];
        for (let i = 1; i <= runs; i++) {
            const suffix = runs > 1 ? `-run${i}` : '';
            const file = path.join(outDir, `${view.name}-${form}${suffix}.json`);
            attempts.push(summarise(view, form, runOnce(BASE + view.path, form, file)));
        }
        const row = { ...median(attempts), runs };
        rows.push(row);
        console.log(
            `${view.name.padEnd(16)} ${form.padEnd(7)} perf ${String(row.perf).padStart(4)}  a11y ${row.a11y}  bp ${row.bp}  seo ${row.seo}  ` +
            `LCP ${row.lcp ?? 'none'}  TBT ${row.tbt ?? 'none'}  CLS ${row.cls}  JS ${row.jsKB} KB`
        );
    }
}
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(rows, null, 2));

if (args.compare && args.compare !== true) {
    const file = path.join(root, String(args.compare), 'summary.json');
    if (!fs.existsSync(file)) throw new Error(`Nothing to compare with: ${file} does not exist`);
    // Older summaries used '/' and '#name' for the view; normalise to the name.
    const key = (r) => `${String(r.view).replace(/^#/, '').replace(/^\/$/, 'home')}|${r.form}`;
    const before = new Map(JSON.parse(fs.readFileSync(file, 'utf8')).map((r) => [key(r), r]));
    const delta = (now, was) => (now == null || was == null ? '   n/a' : `${now - was >= 0 ? '+' : ''}${Math.round((now - was) * 1000) / 1000}`.padStart(6));
    console.log(`\nChange against "${args.compare}" (this run minus that one):`);
    for (const r of rows) {
        const b = before.get(key(r));
        if (!b) {
            console.log(`${r.view.padEnd(16)} ${r.form.padEnd(7)} not in "${args.compare}"`);
            continue;
        }
        // The Phase 1 summary wrote an unscoreable run as perf 0; treat it as missing.
        const wasPerf = b.perf === 0 && b.lcp == null ? null : b.perf;
        console.log(
            `${r.view.padEnd(16)} ${r.form.padEnd(7)} perf ${delta(r.perf, wasPerf)}  LCP ${delta(r.lcp, b.lcp)} ms  ` +
            `TBT ${delta(r.tbt, b.tbt)} ms  CLS ${delta(r.cls, b.cls)}  JS ${delta(r.jsKB, b.jsKB)} KB`
        );
    }
}
