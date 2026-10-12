'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import type { MapNode, SystemMapData } from '@/lib/systemMap';

/**
 * The window model, map side (Phase 4, models A + B, docs/MOTION-PLAN-2026-10-12.md).
 * Opening a window from a pointer, or moving to another window from inside one,
 * dollies the camera toward the node's neighbourhood while the reveal grows, holds
 * that cluster in focus and keeps the node lifted behind the glass. Closing leaves
 * the camera on the cluster, still focused. Keyboard activation and deep links do
 * not dolly: there was no point to grow from.
 */

/** Matches the window's circle reveal (--dur-window), so camera and window land together. */
export const DOLLY_MS = 1100;
const FLY_BACK_MS = 1200;

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
    neighboursOf: (id: string) => Set<string>;
}) {
    const { data, windowHref, dolly, reduced, fitTo, setFocused, setAnchor, neighboursOf } = o;
    const current = useRef<MapNode | null>(null);

    // Open (or move laterally): dolly in, focus the cluster, lift the node.
    useEffect(() => {
        if (!dolly || !data || reduced) return;
        const node = nodeFor(data, dolly.href);
        if (!node) return;
        current.current = node;
        const near = neighboursOf(node.id);
        // Deferred: never set parent state synchronously inside an effect.
        queueMicrotask(() => {
            setFocused(node.cluster);
            setAnchor(node.id);
        });
        // Same-cluster neighbourhood only: cross-cluster strands would widen the frame
        // until the dolly read as a zoom-out.
        fitTo(DOLLY_MS, 240, (n) => n.id === node.id || (n.cluster === node.cluster && near.has(n.id)));
    }, [dolly, data, reduced, neighboursOf, fitTo, setFocused, setAnchor]);

    // Close: release the lift and settle the camera on the cluster (still focused). A
    // window replaced without a dolly (back/forward) just releases the lift.
    useEffect(() => {
        const node = current.current;
        if (!node) return;
        if (windowHref === null) {
            current.current = null;
            setAnchor(null);
            if (!reduced) fitTo(FLY_BACK_MS, 110, (n) => n.cluster === node.cluster);
        } else if (windowHref !== node.href && dolly?.href !== windowHref) {
            current.current = null;
            setAnchor(null);
        }
    }, [windowHref, dolly, reduced, fitTo, setAnchor]);
}
