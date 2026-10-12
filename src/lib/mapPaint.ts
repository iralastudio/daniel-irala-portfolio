/* eslint-disable @typescript-eslint/no-explicit-any */
import { depthScale, depthAlpha, type MapNode } from '@/lib/systemMap';
import type { SigState } from '@/lib/mapSignature';

/**
 * Canvas paint for the system map (docs/MOTION-PLAN-2026-10-12.md, Phase 1): the
 * depth field's colour, bead shading, link depth and hit areas. Pure functions;
 * SystemMap.tsx owns the state and passes it in. Concrete hex values throughout,
 * because canvas cannot resolve CSS variables.
 */

export const INK = '#2B2A29';
export const BG = '#EBEAE8';

// Screen-space floors for openable nodes, applied as `value / globalScale` so they
// hold at any zoom. The designed graph-unit radii take over again once you zoom past
// them, so the hub > project > small-project hierarchy still reads up close.
const MIN_HIT_R = 12;  // ≥24px pointer target, even at the zoomed-out overview
const MIN_DRAW_R = 4;  // ≥8px drawn dot, below which a node stops reading as one

// Parallax amplitude in screen px at the viewport edge: a near node (z = 1) leads the
// cursor by half of this, a far node (z = 0) lags by half. Divided by zoom in paint.
export const PAR_AMP = 34;
// Perspective: paint positions spread away from the camera centre by depth (near
// outward, far inward), in graph units. Measured from wherever the camera is looking,
// so panning and zooming produce motion parallax without touching physics or hits.
export const K_PERSP = 0.14;

export type OffsetOf = (node: { x?: number; y?: number; z?: number }, scale: number) => { ox: number; oy: number };

export const easeOutExpo = (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u));
const hex2rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// Depth as a degradé of each cluster's own hue: a far node is its colour washed toward
// the field, a near node is the full pigment. Cached per (colour, step) so the paint
// loop builds no string it has built before.
const RGB_CACHE = new Map<string, number[]>();
export const rgbOf = (hex: string) => {
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
const BG_RGB = hex2rgb(BG);
const INK_RGB = hex2rgb(INK);
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

/** One node: a depth-shaded bead plus, when earned, its label. */
export function paintNode(
    node: any,
    ctx: CanvasRenderingContext2D,
    scale: number,
    env: { focused: number | null; offsetOf: OffsetOf; sig: SigState }
) {
    const n = node as MapNode;
    const { focused, offsetOf, sig } = env;
    // Focus fades the other clusters back rather than hiding them: the surrounding
    // system stays legible as context, which is the whole point of a map.
    const faded = focused !== null && n.cluster !== focused;
    const inFocus = focused !== null && n.cluster === focused;
    // A dot you can act on must look actionable at any zoom, so its drawn radius has
    // a screen-space floor. Keyed to kind, not href: hubs act (they focus a cluster).
    const actionable = n.kind !== 'satellite';
    const isHub = n.kind === 'hub';
    // Depth: near nodes larger, far nodes smaller; the disc shifts with the pointer
    // and the camera by depth, so the field reads as a volume, not a diagram.
    const z = n.z ?? 0.5;
    const { ox, oy } = offsetOf(n, scale);
    const x = node.x + ox;
    const y = node.y + oy;
    const rz = n.r * depthScale(z);
    const r = actionable ? Math.max(rz, MIN_DRAW_R / scale) : rz;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    // Hubs stay a landmark even when faded — dimmed, not hidden — because they are the
    // other four doors out of the cluster you're in.
    const fadedAlpha = isHub ? 0.55 : n.kind === 'satellite' ? 0.08 : 0.16;
    // While the signature runs, a node exists only once its point has landed.
    let sigA = 1;
    if (sig.phase === 'pending' || sig.phase === 'hold' || sig.phase === 'fly') {
        const at = sig.reveal.get(n.id);
        sigA = at === undefined ? 0 : Math.min(1, (sig.now - at) / sig.fade);
        if (sigA <= 0) return;
    }
    ctx.globalAlpha = (faded ? fadedAlpha : depthAlpha(z, actionable)) * sigA;
    // Depth as colour: the far layer is the cluster hue washed toward the field.
    const shade = shadeOf(n.color, z);
    if (r * scale >= 3.5) {
        // Bead: a broad, soft highlight up-left, the pigment through the body, a gentle
        // fall-off to an inked rim. One light, no keyline: the white ring read as a
        // sticker edge and made the sphere feel fake (Dani, 2026-10-12).
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
    // Hub names render regardless of fade, so the unfocused areas stay identifiable.
    // Project labels stay cluster-local, revealed by zoom or by focus.
    if (n.label && (!faded || isHub)) {
        // Keyed to the designed radius, not the floored one, so the floor cannot drag
        // small-project labels into the overview.
        const small = n.kind === 'project' && n.r < 7;
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
}

/**
 * One link, carrying depth (Phase 1c). Drawn between the offset endpoints so it stays
 * attached; alpha and width follow the mean depth of its ends, and a near→far link
 * fades along its length, which is what makes the web recede. Links touching the
 * hovered node lift softly in that node's own hue.
 */
export function paintLink(
    link: any,
    ctx: CanvasRenderingContext2D,
    scale: number,
    env: { focused: number | null; offsetOf: OffsetOf; linkT: number; hover: MapNode | null }
) {
    const a = link.source;
    const b = link.target;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return;
    const { focused, offsetOf, linkT: t, hover } = env;
    const za: number = a.z ?? 0.5;
    const zb: number = b.z ?? 0.5;
    const oa = offsetOf(a, scale);
    const ob = offsetOf(b, scale);
    const ax = a.x + oa.ox;
    const ay = a.y + oa.oy;
    const bx = b.x + ob.ox;
    const by = b.y + ob.oy;
    const dim = focused !== null && a.cluster !== focused && b.cluster !== focused ? 0.25 : 1;
    const alphaAt = (z: number) => (0.05 + 0.14 * z) * dim * t;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    if (hover !== null && (a === hover || b === hover)) {
        const c = rgbOf(hover.color);
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
}

/**
 * Hit area, not paint, at the same offset as the paint so cursor and bead agree.
 * Openable nodes keep a MIN_HIT_R screen floor however far out you zoom; satellites
 * stay small so they never steal clicks from the project nodes beside them.
 */
export function paintHitArea(node: any, color: string, ctx: CanvasRenderingContext2D, scale: number, offsetOf: OffsetOf) {
    const n = node as MapNode;
    const { ox, oy } = offsetOf(n, scale);
    const rz = n.r * depthScale(n.z ?? 0.5);
    const r = n.kind !== 'satellite' ? Math.max(rz + 4, MIN_HIT_R / scale) : rz + 4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x + ox, node.y + oy, r, 0, 2 * Math.PI);
    ctx.fill();
}
