'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { forceX, forceY, forceCollide } from 'd3-force';
import { buildSystemMap, type SystemMapData, type MapNode } from '@/lib/systemMap';

export interface FlyTo { index: number; key: number }

const INK = '#2B2A29';
const BG = '#EBEAE8';

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
}: {
    flyTo: FlyTo | null;
    reduced: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    onAreaChange?: (i: number) => void;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<any>(null);
    const [size, setSize] = useState({ w: 1280, h: 800 });
    const [data, setData] = useState<SystemMapData | null>(null);
    const [FG, setFG] = useState<any>(null);

    const zoomRef = useRef(1);
    const hoverNode = useRef<MapNode | null>(null);
    const pointer = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
    const lastReheat = useRef(0);
    const placedOnce = useRef(false);
    const flyingUntil = useRef(0); // suppress area-detection during programmatic flights
    const userZoomed = useRef(false); // only follow the area on a real wheel zoom

    useEffect(() => {
        setData(buildSystemMap());
        let alive = true;
        import('react-force-graph-2d').then((mod) => {
            if (alive) setFG(() => mod.default);
        });
        return () => {
            alive = false;
        };
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
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [FG, data, repel, flyToView]);

    // Menu / rail jumps → smooth animated fly-to.
    useEffect(() => {
        if (!flyTo || reduced) return;
        flyToView(flyTo.index, 1100);
    }, [flyTo, reduced, flyToView]);

    // Resolve which cluster a graph-space point falls in (nearest centre within reach).
    const clusterAt = useCallback(
        (x: number, y: number): string | null => {
            if (!data) return null;
            let best: { href: string; d: number } | null = null;
            for (const c of data.clusters) {
                const d = Math.hypot(x - c.cx, y - c.cy);
                if (d <= c.radius * 1.25 && (!best || d < best.d)) best = { href: c.href, d };
            }
            return best?.href ?? null;
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
        // Click affordance: everything clickable (a node, or empty canvas inside
        // a cluster) shows a pointer cursor — the hint line alone isn't enough.
        el.style.cursor = hoverNode.current || clusterAt(coords.x, coords.y) ? 'pointer' : '';
        const now = performance.now();
        if (now - lastReheat.current > 90) {
            lastReheat.current = now;
            g.d3ReheatSimulation();
        }
    }, [reduced, clusterAt]);

    const onPointerLeave = useCallback(() => {
        pointer.current.active = false;
        hoverNode.current = null;
        if (wrapRef.current) wrapRef.current.style.cursor = '';
    }, []);

    // Click empty canvas inside a cluster → open that area's window.
    const onBackgroundClick = useCallback(
        (e: MouseEvent) => {
            const g = fgRef.current;
            const el = wrapRef.current;
            if (!g || !el || !data) return;
            const rect = el.getBoundingClientRect();
            const { x, y } = g.screen2GraphCoords(e.clientX - rect.left, e.clientY - rect.top);
            const href = clusterAt(x, y);
            if (href) onSelect(href, { x: e.clientX, y: e.clientY });
        },
        [data, clusterAt, onSelect]
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

    // Click any node → its project window, or (if it has none) its area window.
    // The click's screen position seeds the window's circle-reveal.
    const onNodeClick = useCallback(
        (node: any, event?: MouseEvent) => {
            const n = node as MapNode;
            const href = n.href ?? data?.clusters[n.cluster]?.href;
            if (href && href !== '#') {
                onSelect(href, event ? { x: event.clientX, y: event.clientY } : undefined);
            }
        },
        [data, onSelect]
    );

    const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, scale: number) => {
        const n = node as MapNode;
        const r = n.r;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        if (n.kind === 'satellite') {
            ctx.globalAlpha = 0.55;
            ctx.fillStyle = n.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = n.color;
            ctx.fill();
            ctx.lineWidth = 1.4 / scale;
            ctx.strokeStyle = BG;
            ctx.stroke();
        }
        if (n.label) {
            // Reveal detail as you zoom in: hubs always named, projects appear
            // mid-zoom, the small centre dots only up close — so the overview stays
            // clean and a zoomed-in region reads as a clear map.
            const isHub = n.kind === 'hub';
            const small = n.kind === 'project' && r < 7;
            const minK = isHub ? 0 : small ? 1.25 : 0.62;
            if (scale >= minK) {
                const fontPx = (isHub ? 13 : 11) / scale;
                ctx.font = `${isHub ? 700 : 600} ${fontPx}px Montserrat, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                const ly = node.y - r - 4 / scale;
                ctx.lineWidth = 3 / scale;
                ctx.strokeStyle = BG;
                ctx.lineJoin = 'round';
                ctx.strokeText(n.label, node.x, ly);
                ctx.fillStyle = INK;
                ctx.fillText(n.label, node.x, ly);
            }
        }
    }, []);

    const pointerArea = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
        const n = node as MapNode;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, n.r + 4, 0, 2 * Math.PI);
        ctx.fill();
    }, []);

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
                    linkColor={() => 'rgba(43,42,41,0.13)'}
                    linkWidth={1}
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

            <div className="grain-overlay absolute inset-0 pointer-events-none" />
        </div>
    );
}
