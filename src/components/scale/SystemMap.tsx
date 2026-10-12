'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { forceX, forceY, forceCollide } from 'd3-force';
import { buildSystemMap, depthScale, depthAlpha, type SystemMapData, type MapNode } from '@/lib/systemMap';

export interface FlyTo { index: number; key: number }

/**
 * Signature sequence (Phase 3, docs/MOTION-PLAN-2026-10-12.md): the overview's accent
 * word ("chaos.") is rasterised into points on an overlay canvas, holds its shape for a
 * beat, then every point flies out to become a node of the system. The DOM word is
 * hidden while the canvas owns it and fades back once the last point lands.
 */
export interface SignatureProps {
    getWordRect: () => { rect: DOMRect; text: string; font: string; color: string } | null;
    onStart: () => void;
    onEnd: () => void;
}
interface SigPoint { x0: number; y0: number; node: MapNode; delay: number; surplus: boolean }
interface SigState {
    phase: 'idle' | 'pending' | 'hold' | 'fly' | 'done';
    t0: number;                  // when the hold began
    points: SigPoint[];
    reveal: Map<string, number>; // node id → time its point arrived
    linkT: number;               // 0..1 multiplier on link alpha
    now: number;                 // last frame time, read by drawNode
    fade: number;                // ms a node takes to appear once its point lands
}
const SIG_HOLD = 650;       // ms the word stays legible as points
const SIG_FLY = 1700;       // ms per point flight
const SIG_MAX_DELAY = 650;  // ms, stagger cap (hubs lead, satellites trail)
const SIG_NODE_FADE = 320;  // ms a node takes to appear once its point lands
const SIG_STEP = 3;         // px sampling grid over the word
const ACCENT = '#003ED7';
const easeOutExpo = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
const hex2rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// Depth as a degradé of each cluster's own hue: a far node is its colour washed
// toward the field, a near node is the full pigment. Mixes are cached per
// (colour, step) so the paint loop builds no strings it has built before.
const RGB_CACHE = new Map<string, number[]>();
const rgbOf = (hex: string) => {
    let v = RGB_CACHE.get(hex);
    if (!v) { v = hex2rgb(hex); RGB_CACHE.set(hex, v); }
    return v;
};
const mixRgb = (A: number[], B: number[], k: number) => [
    Math.round(A[0] + (B[0] - A[0]) * k),
    Math.round(A[1] + (B[1] - A[1]) * k),
    Math.round(A[2] + (B[2] - A[2]) * k),
];
const css = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;
const WHITE_RGB = [255, 255, 255];
const BG_RGB = hex2rgb('#EBEAE8');
const INK_RGB = hex2rgb('#2B2A29');
interface Shade { pigment: string; hi: string; rim: string }
const SHADE_CACHE = new Map<string, Shade>();
/** The three tones a node of colour `hex` at depth `z` paints with; quantised to 1/32. */
const shadeOf = (hex: string, z: number): Shade => {
    const q = Math.round(Math.min(1, Math.max(0, z)) * 32);
    const key = hex + q;
    let s = SHADE_CACHE.get(key);
    if (!s) {
        const pigment = mixRgb(rgbOf(hex), BG_RGB, (1 - q / 32) * 0.62);
        s = {
            pigment: css(pigment),
            hi: css(mixRgb(pigment, WHITE_RGB, 0.34)),
            rim: css(mixRgb(pigment, INK_RGB, 0.28)),
        };
        SHADE_CACHE.set(key, s);
    }
    return s;
};

const INK = '#2B2A29';
const BG = '#EBEAE8';

// Screen-space floors for openable nodes (anything carrying an `href`), applied as
// `value / globalScale` so they hold at any zoom. The designed graph-unit radii take
// over again once you zoom past them, so the hub > project > small-project hierarchy
// still reads up close.
const MIN_HIT_R = 12;  // ≥24px pointer target, even at the zoomed-out overview
const MIN_DRAW_R = 4;  // ≥8px drawn dot, below which the white keyline stops reading
// Parallax amplitude in screen px at the viewport edge: a near node (z = 1) leads the
// cursor by half of this, a far node (z = 0) lags by half. Divided by zoom in paint.
const PAR_AMP = 34;
// Perspective: paint positions spread away from the camera centre by depth (near
// outward, far inward), in graph units. Because it is measured from wherever the
// camera is looking, panning and zooming produce motion parallax, the strongest
// depth cue there is, without any change to the physics or the hit model.
const K_PERSP = 0.14;

/**
 * SystemMap — a LIVE, freely-explorable force-directed node graph (Obsidian-style).
 * Daniel Irala sits at the centre, the four scales orbit around it as clusters
 * (a wheel). You can ZOOM and PAN anywhere; moving the cursor pushes nearby nodes
 * away; drag a node and drop it and it stays. Clicking a node opens that project's
 * window — and clicking anywhere inside a cluster (or a plain node) opens that
 * area's window. The menu / scale-rail fly the camera between levels.
 */
export function SystemMap({
    flyTo,
    reduced,
    onSelect,
    onAreaChange,
    releasePinned = 0,
    signature,
}: {
    flyTo: FlyTo | null;
    reduced: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    onAreaChange?: (i: number) => void;
    /** Bump to let every dragged-and-dropped node rejoin the simulation. */
    releasePinned?: number;
    /** Wire-up for the first-visit signature sequence; omit to disable it. */
    signature?: SignatureProps;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<any>(null);
    const [size, setSize] = useState({ w: 1280, h: 800 });
    const [data, setData] = useState<SystemMapData | null>(null);
    const [FG, setFG] = useState<any>(null);
    // Which cluster is currently held in focus. Focusing frames the cluster, fades the
    // other four back, and reveals every project label inside it at once — so a click
    // on a hub, a satellite or the space around them answers "what is actually in
    // here?" instead of reopening prose the panel is already showing.
    const [focused, setFocused] = useState<number | null>(null);

    const zoomRef = useRef(1);
    const hoverNode = useRef<MapNode | null>(null);
    const pointer = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
    // Depth parallax (Phase 1b). The pointer, normalised to −1..1 across the viewport,
    // is eased toward its target once per frame (see onRenderFramePre); every paint
    // (nodes, hit areas, links, the signature's landing spots) offsets by depth
    // through `offsetOf`, so what you see and what you click never separate.
    const par = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
    const camCentre = useRef({ x: 0, y: 0 }); // graph coords under the viewport centre
    const offsetOf = useCallback((node: { x?: number; y?: number; z?: number }, scale: number) => {
        const d = (node.z ?? 0.5) - 0.5;
        const k = (d * PAR_AMP) / scale;
        const c = camCentre.current;
        return {
            ox: par.current.x * k + ((node.x ?? 0) - c.x) * d * K_PERSP,
            oy: par.current.y * k + ((node.y ?? 0) - c.y) * d * K_PERSP,
        };
    }, []);
    const lastReheat = useRef(0);
    const placedOnce = useRef(false);
    const flyingUntil = useRef(0); // suppress area-detection during programmatic flights
    const userZoomed = useRef(false); // only follow the area on a real wheel zoom

    // Signature sequence state lives in a ref (read every frame by drawNode / the
    // overlay loop); `sigActive` is the one piece React needs, to keep the graph
    // repainting while the overlay runs even if the simulation has already cooled.
    const sigRef = useRef<SigState>({ phase: 'idle', t0: 0, points: [], reveal: new Map(), linkT: 1, now: 0, fade: SIG_NODE_FADE });
    const sigCanvasRef = useRef<HTMLCanvasElement>(null);
    const sigCleanup = useRef<() => void>(() => {});
    const [sigActive, setSigActive] = useState(false);

    useEffect(() => {
        // Decide up front whether the signature will run, so the graph is hidden from
        // its very first frame rather than appearing, vanishing and rebuilding.
        // It plays on every full page load (a reload is a fresh arrival); what it must
        // never do is replay on in-page returns to the overview, which it cannot, since
        // this effect runs once per mount. The old once-per-session gate made reviewers
        // think it was broken after one reload (Dani, 2026-10-12).
        const willRun =
            !!signature &&
            !reduced &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (willRun) {
            sigRef.current.phase = 'pending';
            sigRef.current.linkT = 0;
        }
        setData(buildSystemMap());
        let alive = true;
        import('react-force-graph-2d').then((mod) => {
            if (alive) setFG(() => mod.default);
        });
        return () => {
            alive = false;
        };
        // Mount-only by design: the signature decision is made once, before any frame.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const update = () => setSize({ w: el.clientWidth || 1280, h: el.clientHeight || 800 });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        update();
        return () => ro.disconnect();
    }, []);

    // One camera control. zoomToFit frames either the whole system (index 0 =
    // pixel / overview = the tagline) or a single cluster's nodes. It auto-centres
    // and auto-zooms, which holds reliably where centerAt + zoom together do not.
    const flyToView = useCallback(
        (index: number, ms: number) => {
            const g = fgRef.current;
            if (!g || !data) return;
            // A fly-to owns the camera for its duration (+ grace) so area-detection
            // doesn't fight it. The instant initial placement gets a grace window too.
            flyingUntil.current = performance.now() + Math.max(ms, 0) + 450;
            userZoomed.current = false; // a programmatic fly owns the area, not detection
            if (index < 0) {
                g.zoomToFit(ms, 110); // the whole system (overview)
            } else {
                g.zoomToFit(ms, 110, (n: any) => n.cluster === index);
            }
        },
        [data]
    );

    // forceCollide keeps expanding the node disc for up to `cooldownTime` after the
    // initial zoomToFit calls above run, so the padding they asked for gets silently
    // eaten by physics still in motion (bbox grows after the camera already fit to
    // the smaller, pre-expansion bbox). Re-running the same fit once the engine
    // actually reports settled corrects the final framing without a guessed delay.
    // Guarded to fire once, and only while still on the overview — a user who has
    // already focused a cluster by the time this fires should not get yanked back.
    const settledOnce = useRef(false);
    const onEngineStop = useCallback(() => {
        if (settledOnce.current || focused !== null) return;
        settledOnce.current = true;
        flyToView(-1, 400);
    }, [flyToView, focused]);

    // Cursor-repel force — nudges nearby nodes away from the pointer. Gentle, so the
    // graph breathes rather than darting; constant screen radius regardless of zoom.
    const repel = useMemo(() => {
        let nodes: any[] = [];
        const f = (alpha: number) => {
            if (!pointer.current.active) return;
            const R = 90 / Math.max(zoomRef.current, 0.0001); // ~90px in graph units
            const R2 = R * R;
            for (const n of nodes) {
                const dx = n.x - pointer.current.x;
                const dy = n.y - pointer.current.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < R2 && d2 > 0.01) {
                    const d = Math.sqrt(d2);
                    const force = (1 - d / R) * 2.4 * (0.3 + alpha * 0.7);
                    n.vx += (dx / d) * force;
                    n.vy += (dy / d) * force;
                }
            }
        };
        (f as any).initialize = (n: any[]) => {
            nodes = n;
        };
        return f;
    }, []);

    // The signature sequence. Skips itself when it has no word to sample (deep links,
    // non-overview scenes), under reduced motion, or when it has already played this
    // session (`?sig` in the URL forces a replay for review).
    const startSignature = useCallback(() => {
        const g = fgRef.current;
        const el = sigCanvasRef.current;
        // Any bail-out must release the graph the mount effect hid in advance. The
        // reason is logged at debug level so "it didn't play" can be diagnosed from
        // the console without instrumenting anything.
        const abort = (reason: string) => {
            sigRef.current.phase = 'done';
            sigRef.current.linkT = 1;
            console.debug('[signature] skipped:', reason);
        };
        if (!g || !el || !data || !signature || reduced) return abort('not ready or reduced motion');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return abort('OS prefers reduced motion');
        const word = signature.getWordRect();
        if (!word || !word.text.trim() || word.rect.width < 20) return abort('no accent word on screen');

        // `?slow` stretches every duration 4× so the stages can be reviewed.
        const K = window.location.search.includes('slow') ? 4 : 1;
        const hold = SIG_HOLD * K;
        const fly = SIG_FLY * K;
        const maxDelay = SIG_MAX_DELAY * K;
        const fade = SIG_NODE_FADE * K;
        // A small word (narrow viewports) needs a finer grid, or there are fewer
        // points than nodes and the word reads as a sprinkle rather than a word.
        const step = word.rect.width > 180 ? SIG_STEP : 2;

        // 1. Rasterise the word exactly as the DOM draws it, then sample it to points.
        const pad = 6;
        const W = Math.ceil(word.rect.width) + pad * 2;
        const H = Math.ceil(word.rect.height) + pad * 2;
        const off = document.createElement('canvas');
        off.width = W;
        off.height = H;
        const oc = off.getContext('2d');
        if (!oc) return abort('no 2d context');
        oc.font = word.font;
        oc.fillStyle = '#000';
        const metrics = oc.measureText(word.text);
        const ascent = metrics.fontBoundingBoxAscent;
        if (ascent) {
            oc.textBaseline = 'alphabetic';
            oc.fillText(word.text, pad, pad + ascent);
        } else {
            oc.textBaseline = 'top';
            oc.fillText(word.text, pad, pad);
        }
        const px = oc.getImageData(0, 0, W, H).data;
        const starts: { x: number; y: number }[] = [];
        for (let y = 0; y < H; y += step) {
            for (let x = 0; x < W; x += step) {
                if (px[(y * W + x) * 4 + 3] > 110) {
                    starts.push({ x: word.rect.left - pad + x, y: word.rect.top - pad + y });
                }
            }
        }
        if (starts.length < 40) return abort(`word sampled to only ${starts.length} points (font "${word.font}")`);

        // 2. Give every node a point: hubs and projects claim first, by angle from the
        //    word's centre, so the flight fans out instead of crossing over itself.
        const cx = word.rect.left + word.rect.width / 2;
        const cy = word.rect.top + word.rect.height / 2;
        const order: MapNode[] = [...(data.nodes as MapNode[])].sort((a, b) => {
            const rank = (n: MapNode) => (n.kind === 'hub' ? 0 : n.kind === 'project' ? 1 : 2);
            return rank(a) - rank(b);
        });
        const free = starts.map((s, i) => ({ i, a: Math.atan2(s.y - cy, s.x - cx) }));
        const points: SigPoint[] = [];
        const claimed = new Set<number>();
        for (const n of order) {
            if (free.length === 0) break;
            const sp = g.graph2ScreenCoords(n.x ?? n.tx, n.y ?? n.ty);
            const na = Math.atan2(sp.y - cy, sp.x - cx);
            let best = 0;
            let bestD = Infinity;
            for (let k = 0; k < free.length; k++) {
                let d = Math.abs(free[k].a - na);
                if (d > Math.PI) d = Math.PI * 2 - d;
                if (d < bestD) { bestD = d; best = k; }
            }
            const s = starts[free[best].i];
            claimed.add(free[best].i);
            free.splice(best, 1);
            const dist = Math.hypot(sp.x - s.x, sp.y - s.y);
            // Landmarks land first: hubs lead, projects follow, satellites gather last,
            // with distance adding a little spread inside each group.
            const lead = n.kind === 'hub' ? 0 : n.kind === 'project' ? 70 : 140;
            points.push({ x0: s.x, y0: s.y, node: n, delay: Math.min(maxDelay, (lead + dist * 0.25) * K), surplus: false });
        }
        // Surplus points ride along with a random node and fade out on the way.
        starts.forEach((s, i) => {
            if (claimed.has(i)) return;
            const n = order[Math.floor(Math.random() * order.length)];
            const sp = g.graph2ScreenCoords(n.x ?? n.tx, n.y ?? n.ty);
            const dist = Math.hypot(sp.x - s.x, sp.y - s.y);
            points.push({ x0: s.x, y0: s.y, node: n, delay: Math.min(maxDelay, dist * 0.5 * K), surplus: true });
        });

        const accentRgb = rgbOf(ACCENT);

        const sig = sigRef.current;
        sig.phase = 'hold';
        sig.t0 = performance.now();
        sig.points = points;
        sig.reveal = new Map();
        sig.linkT = 0;
        sig.now = sig.t0;
        sig.fade = fade;
        setSigActive(true);
        signature.onStart();

        const dpr = window.devicePixelRatio || 1;
        const ctx = el.getContext('2d');
        if (!ctx) {
            abort('overlay has no 2d context');
            setSigActive(false);
            signature.onEnd();
            return;
        }
        let raf = 0;

        const finish = () => {
            const now = performance.now();
            for (const n of data.nodes as MapNode[]) if (!sig.reveal.has(n.id)) sig.reveal.set(n.id, now);
            sig.linkT = 1;
            sig.phase = 'done';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, el.width, el.height);
            setSigActive(false);
            signature.onEnd();
        };

        const frame = () => {
            const now = performance.now();
            sig.now = now;
            const flyStart = sig.t0 + hold;
            if (now >= flyStart) sig.phase = 'fly';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, el.width, el.height);

            let pending = 0;
            for (const p of sig.points) {
                let u = sig.phase === 'fly' ? (now - flyStart - p.delay) / fly : 0;
                if (u < 0) u = 0;
                if (u >= 1) {
                    if (p.surplus) continue;
                    if (!sig.reveal.has(p.node.id)) sig.reveal.set(p.node.id, now);
                    // Keep drawing the landed point until the node has faded in beneath it.
                    if (now - (sig.reveal.get(p.node.id) ?? now) > fade) continue;
                    u = 1;
                } else {
                    pending++;
                }
                const e = easeOutExpo(u);
                // Land on the node where it is actually painted (depth offsets included).
                const off = offsetOf(p.node, zoomRef.current);
                const tp = g.graph2ScreenCoords((p.node.x ?? p.node.tx) + off.ox, (p.node.y ?? p.node.ty) + off.oy);
                const x = p.x0 + (tp.x - p.x0) * e;
                const y = p.y0 + (tp.y - p.y0) * e;
                const to = rgbOf(p.node.color);
                const r = Math.round(accentRgb[0] + (to[0] - accentRgb[0]) * e);
                const gg = Math.round(accentRgb[1] + (to[1] - accentRgb[1]) * e);
                const b = Math.round(accentRgb[2] + (to[2] - accentRgb[2]) * e);
                const alpha = p.surplus ? Math.max(0, 1 - u / 0.6) : 1;
                if (alpha <= 0) continue;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = `rgb(${r},${gg},${b})`;
                ctx.beginPath();
                ctx.arc(x, y, 2.1 + 0.5 * e, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            sig.linkT = sig.phase === 'fly' ? Math.min(1, Math.max(0, (now - flyStart - 350 * K) / fly)) : 0;

            if (sig.phase === 'fly' && pending === 0 && now > flyStart + fly + maxDelay + fade) {
                finish();
                return;
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        sigCleanup.current = () => {
            cancelAnimationFrame(raf);
            if (sig.phase === 'hold' || sig.phase === 'fly') finish();
        };
    }, [data, signature, reduced, offsetOf]);
    const startSigRef = useRef(startSignature);
    startSigRef.current = startSignature;
    useEffect(() => () => sigCleanup.current(), []);

    // Configure forces once the instance + data exist, then place the camera at the
    // full-system overview so the whole map is visible and ready to explore.
    useEffect(() => {
        const g = fgRef.current;
        if (!g || !data) return;
        g.d3Force('center', null);
        g.d3Force('charge')?.strength(-22).distanceMax(360);
        g.d3Force('link')?.distance(30).strength(0.02);
        // Hold each node firmly toward its target spot in the disc → a stable circle.
        g.d3Force('x', forceX((n: any) => n.tx).strength(0.18));
        g.d3Force('y', forceY((n: any) => n.ty).strength(0.18));
        // Main dots (hubs / labelled projects) get a wide personal space so they
        // never overlap and stay easy to click; satellites pack in tight.
        g.d3Force('collide', forceCollide((n: any) => n.r + (n.kind === 'satellite' ? 2 : 13)).strength(0.9));
        g.d3Force('repel', repel);
        g.d3ReheatSimulation();
        if (!placedOnce.current) {
            placedOnce.current = true;
            // Let the layout settle a beat, then frame the whole system (overview).
            const t1 = setTimeout(() => flyToView(-1, 0), 80);
            const t2 = setTimeout(() => flyToView(-1, 0), 500);
            // The signature starts once the camera is placed and the panel's own
            // entrance (≈0.7 s) has landed the word where it will be sampled.
            const t3 = setTimeout(() => startSigRef.current(), 750);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        }
    }, [FG, data, repel, flyToView]);

    // Menu / rail jumps → smooth animated fly-to. The rail holds the same focus a map
    // click does, so both nav surfaces produce one state rather than two; going back to
    // the whole system (index -1) releases it.
    useEffect(() => {
        if (!flyTo || reduced) return;
        setFocused(flyTo.index < 0 ? null : flyTo.index);
        flyToView(flyTo.index, 1100);
    }, [flyTo, reduced, flyToView]);

    // Focus is a paint-only change, so it needs an explicit repaint whenever it shifts
    // without a camera move (releasing focus by clicking outside every cluster). The
    // simulation is at rest by then, so no frame would otherwise be drawn.
    useEffect(() => {
        fgRef.current?.refresh?.();
    }, [focused]);

    // Dropping a node pins it where you left it, which is the point — but that
    // must be undoable. Going back to the whole system unpins everything, so a
    // rearranged map is never a dead end.
    useEffect(() => {
        if (!releasePinned || !data) return;
        for (const n of data.nodes as any[]) {
            n.fx = undefined;
            n.fy = undefined;
        }
        fgRef.current?.d3ReheatSimulation();
    }, [releasePinned, data]);

    // Resolve which cluster a graph-space point falls in (nearest centre within reach).
    // Returns the cluster index: clicking inside a cluster now focuses it rather than
    // opening a window, so the index is what the caller needs.
    const clusterAt = useCallback(
        (x: number, y: number): number | null => {
            if (!data) return null;
            let best: { i: number; d: number } | null = null;
            data.clusters.forEach((c, i) => {
                const d = Math.hypot(x - c.cx, y - c.cy);
                if (d <= c.radius * 1.25 && (!best || d < best.d)) best = { i, d };
            });
            return best ? (best as { i: number; d: number }).i : null;
        },
        [data]
    );

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        const g = fgRef.current;
        const el = wrapRef.current;
        if (!g || !el || reduced) return;
        const rect = el.getBoundingClientRect();
        const coords = g.screen2GraphCoords(e.clientX - rect.left, e.clientY - rect.top);
        pointer.current = { x: coords.x, y: coords.y, active: true };
        par.current.tx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        par.current.ty = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
        // Click affordance: everything clickable (a node, or empty canvas inside
        // a cluster) shows a pointer cursor — the hint line alone isn't enough.
        el.style.cursor = hoverNode.current || clusterAt(coords.x, coords.y) !== null ? 'pointer' : '';
        const now = performance.now();
        if (now - lastReheat.current > 90) {
            lastReheat.current = now;
            g.d3ReheatSimulation();
        }
    }, [reduced, clusterAt]);

    const onPointerLeave = useCallback(() => {
        pointer.current.active = false;
        par.current.tx = 0;
        par.current.ty = 0;
        hoverNode.current = null;
        if (wrapRef.current) wrapRef.current.style.cursor = '';
    }, []);

    // Frame a cluster and hold it in focus. Always flies, so the click is never silent
    // even when the camera is already roughly on the cluster. Also reports the change
    // up to `onAreaChange` — without this the map's own fade state disagreed with what
    // the rail highlighted and the left panel described, which is a status-visibility
    // bug worse than the duplicate windows this whole rework replaced.
    const focusCluster = useCallback(
        (i: number) => {
            setFocused(i);
            flyToView(i, 900);
            onAreaChange?.(i);
        },
        [flyToView, onAreaChange]
    );

    // Click empty canvas inside a cluster → focus that cluster. Outside every cluster
    // → release focus and show the whole system again, in step with the rail/panel.
    const onBackgroundClick = useCallback(
        (e: MouseEvent) => {
            const g = fgRef.current;
            const el = wrapRef.current;
            if (!g || !el || !data) return;
            const rect = el.getBoundingClientRect();
            const { x, y } = g.screen2GraphCoords(e.clientX - rect.left, e.clientY - rect.top);
            const i = clusterAt(x, y);
            if (i !== null) focusCluster(i);
            else {
                setFocused(null);
                onAreaChange?.(-1);
            }
        },
        [data, clusterAt, focusCluster, onAreaChange]
    );

    // The radius of a circle (centred on the map origin) that contains every
    // cluster — used to tell "zoomed into one area" apart from "whole system visible".
    const overallRadius = useMemo(() => {
        if (!data) return 0;
        return Math.max(...data.clusters.map((c) => Math.hypot(c.cx, c.cy) + c.radius));
    }, [data]);

    // After a manual zoom/pan settles, report which area now fills the viewport so
    // the left copy and the scale-rail follow where you are looking.
    const onZoomEnd = useCallback(() => {
        const g = fgRef.current;
        if (!g || !data || !onAreaChange || reduced) return;
        if (performance.now() < flyingUntil.current) return; // a fly-to owns the camera
        if (!userZoomed.current) return; // only follow the area after a real wheel zoom

        // If you've zoomed out far enough that the whole system fits the viewport,
        // that's the overview — regardless of which cluster the exact centre point
        // happens to be nearest to.
        const k = Math.max(zoomRef.current, 0.0001);
        const visibleHalfExtent = Math.min(size.w / 2 / k, size.h / 2 / k);
        if (visibleHalfExtent >= overallRadius * 0.85) {
            onAreaChange(-1);
            return;
        }

        // Otherwise follow the cluster nearest the viewport centre.
        const c = g.screen2GraphCoords(size.w / 2, size.h / 2);
        let bi = -1;
        let bd = Infinity;
        data.clusters.forEach((cl, i) => {
            const d = Math.hypot(c.x - cl.cx, c.y - cl.cy);
            if (d < bd && d <= cl.radius * 1.25) {
                bd = d;
                bi = i;
            }
        });
        onAreaChange(bi);
    }, [data, size, onAreaChange, reduced, overallRadius]);

    // Two behaviours, and the difference is learnable in one sentence: a dot that owns
    // an href opens it, everything else focuses its cluster. Previously every satellite
    // and the empty space around them fell back to the cluster's window, so ~95% of a
    // cluster's clickable surface opened the same duplicate prose.
    // The click's screen position seeds the window's circle-reveal.
    const onNodeClick = useCallback(
        (node: any, event?: MouseEvent) => {
            const n = node as MapNode;
            if (n.href && n.href !== '#') {
                setFocused(null);
                onSelect(n.href, event ? { x: event.clientX, y: event.clientY } : undefined);
                return;
            }
            focusCluster(n.cluster);
        },
        [onSelect, focusCluster]
    );

    const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, scale: number) => {
        const n = node as MapNode;
        // Focus fades the other clusters back rather than hiding them: the surrounding
        // system stays legible as context, which is the whole point of a map.
        const faded = focused !== null && n.cluster !== focused;
        const inFocus = focused !== null && n.cluster === focused;
        // A dot you can act on that renders at 4px is indistinguishable from a
        // decorative satellite. Floor the drawn radius in screen space so actionable
        // always looks actionable, however far out you are. Keyed to kind, not href:
        // hubs act (they focus their cluster) even though they no longer open a window.
        const actionable = n.kind !== 'satellite';
        const isHub = n.kind === 'hub';
        // Depth: near nodes larger, far nodes smaller; the whole disc shifts with the
        // pointer by depth, so the field reads as a volume rather than a diagram.
        const z = n.z ?? 0.5;
        const { ox, oy } = offsetOf(n, scale);
        const x = node.x + ox;
        const y = node.y + oy;
        const rz = n.r * depthScale(z);
        const r = actionable ? Math.max(rz, MIN_DRAW_R / scale) : rz;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        // Hubs stay a landmark even when faded — dimmed, not hidden — because they are
        // the other four doors out of the cluster you're in. Fading them to
        // near-invisible (as satellites correctly do, to declutter) made the rest of
        // the map read as disabled: nothing legible was left to click.
        const fadedAlpha = isHub ? 0.55 : n.kind === 'satellite' ? 0.08 : 0.16;
        // While the signature runs, a node exists only once its point has landed.
        const sig = sigRef.current;
        let sigA = 1;
        if (sig.phase === 'pending' || sig.phase === 'hold' || sig.phase === 'fly') {
            const at = sig.reveal.get(n.id);
            sigA = at === undefined ? 0 : Math.min(1, (sig.now - at) / sig.fade);
            if (sigA <= 0) return;
        }
        ctx.globalAlpha = (faded ? fadedAlpha : depthAlpha(z, actionable)) * sigA;
        // Depth as colour: the far layer is the cluster hue washed toward the field.
        const shade = shadeOf(n.color, z);
        const px = r * scale; // drawn radius in screen px
        if (px >= 3.5) {
            // Bead shading: a broad, soft highlight up-left, the pigment through the
            // body, and a gentle fall-off to an inked rim. One light, no keyline:
            // the white ring read as a sticker edge and made the sphere feel fake.
            const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.05, x - r * 0.1, y - r * 0.1, r * 1.05);
            grad.addColorStop(0, shade.hi);
            grad.addColorStop(0.45, shade.pigment);
            grad.addColorStop(0.85, shade.rim);
            grad.addColorStop(1, shade.rim);
            ctx.fillStyle = grad;
        } else {
            ctx.fillStyle = shade.pigment; // too small for shading to register
        }
        ctx.fill();
        ctx.globalAlpha = 1;
        // Hub names render regardless of fade, so the four unfocused areas stay
        // identifiable and clickable-looking. Project/satellite labels stay
        // cluster-local — showing them everywhere at once would defeat the point of
        // focusing one area to read it.
        if (n.label && (!faded || isHub)) {
            // Reveal detail as you zoom in: hubs always named, projects appear
            // mid-zoom, the small centre dots only up close — so the overview stays
            // clean and a zoomed-in region reads as a clear map.
            // Keyed to the *designed* radius, not the screen-floored one, so the
            // MIN_DRAW_R floor cannot drag small-project labels into the overview.
            const small = n.kind === 'project' && n.r < 7;
            // Focusing a cluster names everything inside it at once, at any zoom.
            // That is the payoff for the click: it answers "what is in here?".
            const minK = inFocus ? 0 : isHub ? 0 : small ? 1.25 : 0.62;
            if (scale >= minK) {
                ctx.globalAlpha = (faded && isHub ? 0.6 : 1) * sigA;
                const fontPx = (isHub ? 13 : 11) / scale;
                ctx.font = `${isHub ? 700 : 600} ${fontPx}px Montserrat, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                const ly = y - r - 4 / scale;
                ctx.lineWidth = 3 / scale;
                ctx.strokeStyle = BG;
                ctx.lineJoin = 'round';
                ctx.strokeText(n.label, x, ly);
                ctx.fillStyle = INK;
                ctx.fillText(n.label, x, ly);
                ctx.globalAlpha = 1;
            }
        }
    }, [focused, offsetOf]);

    // Links carry the depth too (Phase 1c). Drawn between the parallaxed endpoints so
    // they stay attached; alpha and width come from the mean depth of the two ends, and
    // a link spanning near→far fades along its length, which is what makes the web
    // recede instead of lying flat. Links touching the hovered node turn accent.
    const drawLink = useCallback(
        (link: any, ctx: CanvasRenderingContext2D, scale: number) => {
            const a = link.source;
            const b = link.target;
            if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return;
            const za: number = a.z ?? 0.5;
            const zb: number = b.z ?? 0.5;
            const oa = offsetOf(a, scale);
            const ob = offsetOf(b, scale);
            const ax = a.x + oa.ox;
            const ay = a.y + oa.oy;
            const bx = b.x + ob.ox;
            const by = b.y + ob.oy;
            const dim = focused !== null && a.cluster !== focused && b.cluster !== focused ? 0.25 : 1;
            const t = sigRef.current.linkT; // ramps in behind the signature's points
            const hov = hoverNode.current !== null && (a === hoverNode.current || b === hoverNode.current);
            const alphaAt = (z: number) => (0.05 + 0.14 * z) * dim * t;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            if (hov) {
                // Soft: the hovered node's own hue, barely stronger than the web, so
                // the neighbourhood lifts rather than lights up.
                const h = hoverNode.current as MapNode;
                const c = rgbOf(h.color);
                ctx.lineWidth = 1 / scale;
                ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.3 * t).toFixed(3)})`;
            } else {
                ctx.lineWidth = (0.6 + 0.4 * ((za + zb) / 2)) / scale;
                if (Math.abs(za - zb) > 0.3) {
                    const gr = ctx.createLinearGradient(ax, ay, bx, by);
                    gr.addColorStop(0, `rgba(43,42,41,${alphaAt(za).toFixed(3)})`);
                    gr.addColorStop(1, `rgba(43,42,41,${alphaAt(zb).toFixed(3)})`);
                    ctx.strokeStyle = gr;
                } else {
                    ctx.strokeStyle = `rgba(43,42,41,${alphaAt((za + zb) / 2).toFixed(3)})`;
                }
            }
            ctx.stroke();
        },
        [focused, offsetOf]
    );

    // Hit area, not paint. `n.r + 4` is in graph units, so it shrank on screen exactly
    // when nodes were already smallest: at the overview zoom an openable project dot was
    // ~15px across and a small one ~8px, well under a comfortable target. Openable nodes
    // therefore keep a floor of MIN_HIT_R screen pixels however far out you zoom, while
    // the drawn dot keeps its designed size. Satellites are deliberately left at the old
    // radius — they only fall back to the area window, so growing them would let them
    // steal clicks from the project nodes sitting next to them.
    const pointerArea = useCallback(
        (node: any, color: string, ctx: CanvasRenderingContext2D, scale = 1) => {
            const n = node as MapNode;
            const z = n.z ?? 0.5;
            const { ox, oy } = offsetOf(n, scale);
            const rz = n.r * depthScale(z);
            const r = n.kind !== 'satellite' ? Math.max(rz + 4, MIN_HIT_R / scale) : rz + 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x + ox, node.y + oy, r, 0, 2 * Math.PI);
            ctx.fill();
        },
        [offsetOf]
    );

    return (
        <div
            ref={wrapRef}
            className="absolute inset-0 overflow-hidden"
            aria-hidden="true"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onWheelCapture={() => { userZoomed.current = true; }}
        >
            {FG && data && (
                <FG
                    ref={fgRef}
                    graphData={data}
                    width={size.w}
                    height={size.h}
                    backgroundColor="rgba(0,0,0,0)"
                    nodeRelSize={1}
                    nodeCanvasObject={drawNode}
                    nodePointerAreaPaint={pointerArea}
                    linkCanvasObject={drawLink}
                    linkCanvasObjectMode={() => 'replace'}
                    autoPauseRedraw={!sigActive}
                    onRenderFramePre={() => {
                        // Ease the parallax toward the pointer once per frame (~120 ms
                        // settle at 60 fps), so the field glides rather than jitters, and
                        // refresh where the camera is looking for the perspective offset.
                        const p = par.current;
                        p.x += (p.tx - p.x) * 0.055; // ~400 ms settle: slow and soft
                        p.y += (p.ty - p.y) * 0.055;
                        const g = fgRef.current;
                        if (g) camCentre.current = g.screen2GraphCoords(size.w / 2, size.h / 2);
                    }}
                    enableNodeDrag={!reduced}
                    enableZoomInteraction={!reduced}
                    enablePanInteraction={!reduced}
                    minZoom={0.03}
                    maxZoom={16}
                    cooldownTime={reduced ? 1500 : 8000}
                    d3VelocityDecay={0.5}
                    onZoom={(t: any) => {
                        if (typeof t?.k === 'number') zoomRef.current = t.k;
                    }}
                    onZoomEnd={onZoomEnd}
                    onEngineStop={onEngineStop}
                    onNodeDragEnd={(node: any) => {
                        node.fx = node.x;
                        node.fy = node.y; // drop stays where placed
                    }}
                    onNodeHover={(n: any) => {
                        hoverNode.current = (n as MapNode) ?? null;
                        const el = wrapRef.current;
                        if (el) el.style.cursor = n ? 'pointer' : el.style.cursor;
                    }}
                    onNodeClick={onNodeClick}
                    onBackgroundClick={onBackgroundClick}
                />
            )}

            {/* Signature overlay: the points that spell the word and fly out to the
                nodes. Fixed and above the frosted panel (z-20), because the word sits
                inside the panel and points drawn beneath the glass read as a smudge.
                Pointer-events none, so the live graph stays clickable from frame zero.
                Cleared and idle outside the sequence. */}
            <canvas
                ref={sigCanvasRef}
                className="fixed inset-0 z-20 pointer-events-none"
                width={Math.round(size.w * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1))}
                height={Math.round(size.h * (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1))}
                style={{ width: size.w, height: size.h }}
                aria-hidden="true"
            />

            <div className="grain-overlay absolute inset-0 pointer-events-none" />
        </div>
    );
}
