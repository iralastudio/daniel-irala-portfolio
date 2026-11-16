// The views the review measures. One list, shared by the screenshot and
// Lighthouse scripts, so "every route" always means the same thing.
// Today each view is a hash on the single route; Stage D of
// docs/review/phase-3.md replaces these with real paths.
export const PORT = 3100;
export const BASE = `http://localhost:${PORT}/`;

export const VIEWS = [
    { name: 'home', path: '' },
    { name: 'about', path: '#about' },
    { name: 'compass', path: '#compass' },
    { name: 'contact', path: '#contact' },
    { name: 'remote-go', path: '#remote-go' },
    { name: 'nespresso', path: '#nespresso' },
    { name: 'digital-agent', path: '#digital-agent' },
    { name: 'synthetic-users', path: '#synthetic-users' },
    { name: 'design-maturity', path: '#design-maturity' },
    { name: 'it-product', path: '#it-product' },
    { name: 'it-key-roles', path: '#it-key-roles' },
    { name: 'seamless', path: '#seamless' },
    { name: 'talks', path: '#talks' },
    { name: 'thinking', path: '#thinking' },
    { name: 'podcast', path: '#podcast' },
];

/** `--key value` and bare `--flag` arguments as an object. */
export function parseArgs(argv = process.argv.slice(2)) {
    const out = {};
    for (let i = 0; i < argv.length; i++) {
        if (!argv[i].startsWith('--')) continue;
        const key = argv[i].slice(2);
        const next = argv[i + 1];
        out[key] = next && !next.startsWith('--') ? argv[++i] : true;
    }
    return out;
}

/** The views named in `--views a,b`, or all of them. Unknown names fail loudly. */
export function pickViews(arg) {
    if (!arg || arg === true) return VIEWS;
    const names = String(arg).split(',').map((s) => s.trim()).filter(Boolean);
    const unknown = names.filter((n) => !VIEWS.some((v) => v.name === n));
    if (unknown.length) throw new Error(`Unknown view(s): ${unknown.join(', ')}`);
    return VIEWS.filter((v) => names.includes(v.name));
}

/** Fails with a clear message when the production server is not running. */
export async function requireServer() {
    try {
        const res = await fetch(BASE);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
        throw new Error(
            `No production server at ${BASE} (${e.message}). Run "npm run build" then "npx next start -p ${PORT}" first.`
        );
    }
}
