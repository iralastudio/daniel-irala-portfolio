'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { depthScale, type MapNode, type SystemMapData } from '@/lib/systemMap';
import type { OffsetOf } from '@/lib/mapPaint';
import { WINDOW_MS } from '@/lib/motion';

/**
 * The window model, map side (Phase 4, docs/MOTION-PLAN-2026-10-12.md).
 * Opening is ONE gesture, a dive into the dot: the window's circle starts at the
 * dot's own edge, and the page zooms the map into that same point while it softens
 * (ScaleExperience). The camera therefore does not move on open; an earlier dolly
 * slid the dot away from the circle growing out of it, which read as two animations.
 * Here the map only holds the cluster in focus and keeps the node lifted. On close
 * the camera stays put, unless the reader browsed to a window in another cluster.
 */

/** The dive's duration (= --dur-window): circle reveal and map zoom share it. */
export const DIVE_MS = WINDOW_MS;
const FLY_BACK_MS = 1400;

/** Where a dot sits on screen and how big it is drawn: the dive starts there. */
export function nodeOrigin(g: any, wrap: HTMLElement | null, node: MapNode, zoom: number, offsetOf: OffsetOf) {
    if (!g || !wrap) return undefined;
    const off = offsetOf(node, zoom);
    const p = g.graph2ScreenCoords((node.x ?? node.tx) + off.ox, (node.y ?? node.ty) + off.oy);
    const rect = wrap.getBoundingClientRect();
    // ×1.12: the dot is hovered at the moment of the click, and drawn that much larger.
    const r = Math.max(6, node.r * depthScale(node.z ?? 0.5) * zoom * 1.12);
    return { x: rect.left + p.x, y: rect.top + p.y, r };
}

export interface Dolly { href: string; key: number }
export type Fit = (ms: number, padding: number, filter?: (n: any) => boolean) => void;

/** The node a window belongs to: the largest actionable node carrying its href. */
const nodeFor = (data: SystemMapData, href: string): MapNode | undefined =>
    data.nodes.filter((n) => n.href === href && n.kind !== 'satellite').sort((a, b) => b.r - a.r)[0];

export function useWindowCamera(o: {
    data: SystemMapData | null;
    windowHref: string | null;
    dolly: Dolly | null;
    reduced: boolean;
    fitTo: Fit;
    setFocused: (cluster: number | null) => void;
    setAnchor: (id: string | null) => void;
}) {
    const { data, windowHref, dolly, reduced, fitTo, setFocused, setAnchor } = o;
    const current = useRef<MapNode | null>(null);
    const openedIn = useRef<number | null>(null); // the cluster the reader dived from

    // Open (or move laterally): focus the cluster and lift the node. No camera move.
    useEffect(() => {
        if (!dolly || !data || reduced) return;
        const node = nodeFor(data, dolly.href);
        if (!node) return;
        if (current.current === null) openedIn.current = node.cluster;
        current.current = node;
        // Deferred: never set parent state synchronously inside an effect.
        queueMicrotask(() => {
            setFocused(node.cluster);
            setAnchor(node.id);
        });
    }, [dolly, data, reduced, setFocused, setAnchor]);

    // Close: release the lift and settle the camera on the cluster (still focused). A
    // window replaced without a dolly (back/forward) just releases the lift.
    useEffect(() => {
        const node = current.current;
        if (!node) return;
        if (windowHref === null) {
            current.current = null;
            setAnchor(null);
            // Browsed into another cluster: settle the camera there, after the map has
            // come back out of the dive. Same cluster: the reader is already home.
            if (!reduced && node.cluster !== openedIn.current) {
                window.setTimeout(() => fitTo(FLY_BACK_MS, 110, (n) => n.cluster === node.cluster), DIVE_MS * 0.6);
            }
            openedIn.current = null;
        } else if (windowHref !== node.href && dolly?.href !== windowHref) {
            current.current = null;
            setAnchor(null);
        }
    }, [windowHref, dolly, reduced, fitTo, setAnchor]);
}
