'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { depthScale, type MapNode, type SystemMapData } from '@/lib/systemMap';
import { easeOutExpo, rgbOf, type OffsetOf } from '@/lib/mapPaint';

/**
 * Map feel (Phase 2, docs/MOTION-PLAN-2026-10-12.md): the hover lift, the focus fade
 * and the click ripple, on the plan's slow and soft tempo. Values are eased scalars
 * read by the paint functions each frame; nothing here touches the physics or the
 * hit model, so a node never slides out from under the cursor while it lifts.
 */

// The tempo table: nothing on the map answers the pointer faster than ~400 ms.
const HOVER_IN = 600;   // a node and its neighbourhood lift
const HOVER_OUT = 900;  // and settle back, slower than they rose
const FOCUS = 1000;     // other clusters recede while the camera flies
const RIPPLE = 1100;    // one soft wave, only for clicks that open no window
const RIPPLE_GROW = 36; // px the wave travels, screen space
/** Camera flight between areas; the focus fade rides inside it. */
export const FLY_MS = 1400;

interface Tw { from: number; to: number; t0: number; dur: number }
// `held`: lifted because a window is open from it (no growth), not by hover.
interface Live { id: string; color: string; s: number; held: boolean }

/** Eased scalars keyed by name; 0 when never set. */
class Tweens {
    private m = new Map<string, Tw>();
    now = 0;
    /** Advance the clock once per frame; every read in that frame sees the same time. */
    tick() {
        this.now = performance.now();
    }
    private at(key: string, time: number) {
        const t = this.m.get(key);
        if (!t) return 0;
        const u = t.dur <= 0 ? 1 : (time - t.t0) / t.dur;
        return u >= 1 ? t.to : t.from + (t.to - t.from) * easeOutExpo(Math.max(0, u));
    }
    value(key: string) {
        return this.at(key, this.now);
    }
    to(key: string, target: number, dur: number) {
        const now = performance.now();
        const cur = this.at(key, now);
        if (cur === target && !this.m.has(key)) return;
        this.m.set(key, { from: cur, to: target, t0: now, dur });
    }
    busy() {
        for (const t of this.m.values()) if (this.now - t.t0 < t.dur) return true;
        return false;
    }
    keys(prefix: string) {
        return [...this.m.keys()].filter((k) => k.startsWith(prefix));
    }
}

export function useMapMotion(data: SystemMapData | null, focused: number | null, reduced: boolean) {
    // One store per mount, created lazily; its internals mutate per frame by design.
    const [tw] = useState(() => new Tweens());
    const live = useRef<Live[]>([]);
    const ripples = useRef<{ node: MapNode; t0: number }[]>([]);
    const hovered = useRef<string | null>(null);
    // While true the graph repaints every frame; it clears itself once all is at rest.
    const [busy, setBusy] = useState(false);
    const dur = useCallback((ms: number) => (reduced ? 0 : ms), [reduced]);

    // One-hop neighbours and colours by id. Links may hold ids or, once the graph has
    // initialised them, node objects; both are handled.
    const { adj, colorOf } = useMemo(() => {
        const adj = new Map<string, Set<string>>();
        const colorOf = new Map<string, string>();
        if (!data) return { adj, colorOf };
        for (const n of data.nodes) colorOf.set(n.id, n.color);
        const idOf = (v: unknown) => (typeof v === 'object' && v !== null ? (v as MapNode).id : String(v));
        for (const l of data.links) {
            const a = idOf(l.source);
            const b = idOf(l.target);
            if (!adj.has(a)) adj.set(a, new Set());
            if (!adj.has(b)) adj.set(b, new Set());
            adj.get(a)!.add(b);
            adj.get(b)!.add(a);
        }
        return { adj, colorOf };
    }, [data]);

    // Focus: unfocused clusters dim and recede; the focused one fades its labels in.
    useEffect(() => {
        if (!data) return;
        data.clusters.forEach((c) => {
            tw.to(`d:${c.i}`, focused !== null && c.i !== focused ? 1 : 0, dur(FOCUS));
            tw.to(`i:${c.i}`, c.i === focused ? 1 : 0, dur(FOCUS));
        });
        // Deferred, as elsewhere in the map: never setState synchronously in an effect.
        queueMicrotask(() => setBusy(true));
    }, [focused, data, tw, dur]);

    /** Feed onNodeHover. Only actionable nodes lift; satellites are texture. */
    const onHover = useCallback(
        (n: MapNode | null) => {
            const id = n && n.kind !== 'satellite' ? n.id : null;
            if (id === hovered.current) return;
            if (hovered.current) tw.to(`h:${hovered.current}`, 0, dur(HOVER_OUT));
            if (id) tw.to(`h:${id}`, 1, dur(HOVER_IN));
            hovered.current = id;
            setBusy(true);
        },
        [tw, dur]
    );

    const addRipple = useCallback(
        (node: MapNode) => {
            if (reduced) return;
            ripples.current.push({ node, t0: performance.now() });
            setBusy(true);
        },
        [reduced]
    );

    // The node a window was opened from stays lifted while the window is open (Phase
    // 4), on its own key so hovering elsewhere cannot drop it.
    const anchored = useRef<string | null>(null);
    const setAnchor = useCallback(
        (id: string | null) => {
            if (id === anchored.current) return;
            if (anchored.current) tw.to(`a:${anchored.current}`, 0, dur(HOVER_OUT));
            if (id) tw.to(`a:${id}`, 1, dur(FOCUS));
            anchored.current = id;
            setBusy(true);
        },
        [tw, dur]
    );
    const neighboursOf = useCallback((id: string) => adj.get(id) ?? new Set<string>(), [adj]);

    /** onRenderFramePre: advance the clock and collect the nodes currently lifted. */
    const framePre = useCallback(() => {
        tw.tick();
        const next: Live[] = [];
        for (const k of [...tw.keys('h:'), ...tw.keys('a:')]) {
            const s = tw.value(k);
            const id = k.slice(2);
            if (s > 0.001) next.push({ id, color: colorOf.get(id) ?? '#2B2A29', s, held: k.startsWith('a:') });
        }
        live.current = next;
    }, [tw, colorOf]);

    /** onRenderFramePost: draw ripples (graph space), then rest when nothing moves. */
    const framePost = useCallback(
        (ctx: CanvasRenderingContext2D, scale: number, offsetOf: OffsetOf) => {
            const now = tw.now;
            ripples.current = ripples.current.filter((r) => now - r.t0 < RIPPLE);
            for (const r of ripples.current) {
                const u = (now - r.t0) / RIPPLE;
                const e = easeOutExpo(u);
                const n = r.node;
                const { ox, oy } = offsetOf(n, scale);
                const base = n.r * depthScale(n.z ?? 0.5);
                const c = rgbOf(n.color);
                ctx.beginPath();
                ctx.arc((n.x ?? 0) + ox, (n.y ?? 0) + oy, base + (RIPPLE_GROW * e) / scale, 0, Math.PI * 2);
                // A thin wave that fades as it travels, slowest at the end, so it is
                // seen leaving rather than flashing.
                ctx.lineWidth = 1.1 / scale;
                ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.4 * Math.pow(1 - u, 1.4)).toFixed(3)})`;
                ctx.stroke();
            }
            if (!tw.busy() && ripples.current.length === 0) setBusy(false);
        },
        [tw]
    );

    const dimOf = useCallback((cluster: number) => tw.value(`d:${cluster}`), [tw]);
    const inOf = useCallback((cluster: number) => tw.value(`i:${cluster}`), [tw]);
    /** How lifted a node is: itself hovered (`self`), or next to one that is (`near`). */
    const liftOf = useCallback(
        (id: string) => {
            let self = 0;
            let near = 0;
            for (const h of live.current) {
                // Hover grows the bead itself; a held node only comes forward in depth.
                if (h.id === id) {
                    if (h.held) near = Math.max(near, h.s);
                    else self = Math.max(self, h.s);
                } else if (adj.get(h.id)?.has(id)) near = Math.max(near, h.s);
            }
            return { self, near };
        },
        [adj]
    );
    /** The strongest lifted end of a link, with its colour, or null. */
    const linkLift = useCallback((aId: string, bId: string): Live | null => {
        let best: Live | null = null;
        for (const h of live.current) if ((h.id === aId || h.id === bId) && (!best || h.s > best.s)) best = h;
        return best;
    }, []);

    return { busy, onHover, addRipple, setAnchor, neighboursOf, framePre, framePost, dimOf, inOf, liftOf, linkLift };
}
