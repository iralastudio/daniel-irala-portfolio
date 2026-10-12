/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MapNode, SystemMapData } from '@/lib/systemMap';
import { easeOutExpo, rgbOf, type OffsetOf } from '@/lib/mapPaint';

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
export interface SigState {
    phase: 'idle' | 'pending' | 'hold' | 'fly' | 'done';
    t0: number;                  // when the hold began
    points: SigPoint[];
    reveal: Map<string, number>; // node id → time its point arrived
    linkT: number;               // 0..1 multiplier on link alpha
    now: number;                 // last frame time, read by paintNode
    fade: number;                // ms a node takes to appear once its point lands
}

const SIG_HOLD = 650;       // ms the word stays legible as points
const SIG_FLY = 1700;       // ms per point flight
const SIG_MAX_DELAY = 650;  // ms, stagger cap (hubs lead, satellites trail)
const SIG_NODE_FADE = 320;  // ms a node takes to appear once its point lands
const SIG_STEP = 3;         // px sampling grid over the word
const ACCENT = '#003ED7';

export const createSigState = (): SigState => ({
    phase: 'idle', t0: 0, points: [], reveal: new Map(), linkT: 1, now: 0, fade: SIG_NODE_FADE,
});

/**
 * Run the sequence once. Returns a cleanup that cancels it (finishing cleanly), or
 * null if it skipped itself, in which case the graph has been released. Every skip
 * logs `[signature] skipped: <reason>` at debug level.
 */
export function runSignature(opts: {
    g: any;                      // the force-graph instance
    el: HTMLCanvasElement;       // the overlay canvas
    data: SystemMapData;
    signature: SignatureProps;
    sig: SigState;
    offsetOf: OffsetOf;
    getZoom: () => number;
    setActive: (on: boolean) => void;
}): (() => void) | null {
    const { g, el, data, signature, sig, offsetOf, getZoom, setActive } = opts;
    const abort = (reason: string) => {
        sig.phase = 'done';
        sig.linkT = 1;
        console.debug('[signature] skipped:', reason);
        return null;
    };
    const word = signature.getWordRect();
    if (!word || !word.text.trim() || word.rect.width < 20) return abort('no accent word on screen');

    // `?slow` stretches every duration 4× so the stages can be reviewed.
    const K = window.location.search.includes('slow') ? 4 : 1;
    const hold = SIG_HOLD * K;
    const fly = SIG_FLY * K;
    const maxDelay = SIG_MAX_DELAY * K;
    const fade = SIG_NODE_FADE * K;
    // A small word (narrow viewports) needs a finer grid, or there are fewer points
    // than nodes and the word reads as a sprinkle rather than a word.
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
    const ascent = oc.measureText(word.text).fontBoundingBoxAscent;
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
            if (px[(y * W + x) * 4 + 3] > 110) starts.push({ x: word.rect.left - pad + x, y: word.rect.top - pad + y });
        }
    }
    if (starts.length < 40) return abort(`word sampled to only ${starts.length} points (font "${word.font}")`);

    // 2. Give every node a point: hubs and projects claim first, by angle from the
    //    word's centre, so the flight fans out instead of crossing over itself.
    const cx = word.rect.left + word.rect.width / 2;
    const cy = word.rect.top + word.rect.height / 2;
    const rank = (n: MapNode) => (n.kind === 'hub' ? 0 : n.kind === 'project' ? 1 : 2);
    const order: MapNode[] = [...data.nodes].sort((a, b) => rank(a) - rank(b));
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
        // Landmarks land first: hubs lead, projects follow, satellites gather last.
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

    const ctx = el.getContext('2d');
    if (!ctx) return abort('overlay has no 2d context');
    const accentRgb = rgbOf(ACCENT);
    sig.phase = 'hold';
    sig.t0 = performance.now();
    sig.points = points;
    sig.reveal = new Map();
    sig.linkT = 0;
    sig.now = sig.t0;
    sig.fade = fade;
    setActive(true);
    signature.onStart();

    const dpr = window.devicePixelRatio || 1;
    let raf = 0;
    const finish = () => {
        const now = performance.now();
        for (const n of data.nodes) if (!sig.reveal.has(n.id)) sig.reveal.set(n.id, now);
        sig.linkT = 1;
        sig.phase = 'done';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, el.width, el.height);
        setActive(false);
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
            const o = offsetOf(p.node, getZoom());
            const tp = g.graph2ScreenCoords((p.node.x ?? p.node.tx) + o.ox, (p.node.y ?? p.node.ty) + o.oy);
            const x = p.x0 + (tp.x - p.x0) * e;
            const y = p.y0 + (tp.y - p.y0) * e;
            const to = rgbOf(p.node.color);
            const alpha = p.surplus ? Math.max(0, 1 - u / 0.6) : 1;
            if (alpha <= 0) continue;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${Math.round(accentRgb[0] + (to[0] - accentRgb[0]) * e)},${Math.round(accentRgb[1] + (to[1] - accentRgb[1]) * e)},${Math.round(accentRgb[2] + (to[2] - accentRgb[2]) * e)})`;
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
    return () => {
        cancelAnimationFrame(raf);
        if (sig.phase === 'hold' || sig.phase === 'fly') finish();
    };
}
