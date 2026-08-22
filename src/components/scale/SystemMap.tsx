'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { forceX, forceY, forceCollide } from 'd3-force';
import { buildSystemMap, type SystemMapData, type MapNode } from '@/lib/systemMap';

export interface FlyTo { index: number; key: number }

const INK = '#2B2A29';
const BG = '#EBEAE8';

// Screen-space floors for openable nodes (anything carrying an `href`), applied as
// `value / globalScale` so they hold at any zoom. The designed graph-unit radii take
// over again once you zoom past them, so the hub > project > small-project hierarchy
// still reads up close.
const MIN_HIT_R = 12;  // ≥24px pointer target, even at the zoomed-out overview
const MIN_DRAW_R = 4;  // ≥8px drawn dot, below which the white keyline stops reading

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
}: {
    flyTo: FlyTo | null;
    reduced: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    onAreaChange?: (i: number) => void;
    /** Bump to let every dragged-and-dropped node rejoin the simulation. */
    releasePinned?: number;
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
        const r = actionable ? Math.max(n.r, MIN_DRAW_R / scale) : n.r;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
        // Hubs stay a landmark even when faded — dimmed, not hidden — because they are
        // the other four doors out of the cluster you're in. Fading them to
        // near-invisible (as satellites correctly do, to declutter) made the rest of
        // the map read as disabled: nothing legible was left to click.
        const fadedAlpha = isHub ? 0.55 : n.kind === 'satellite' ? 0.08 : 0.16;
        if (n.kind === 'satellite') {
            ctx.globalAlpha = faded ? fadedAlpha : 0.55;
        } else {
            ctx.globalAlpha = faded ? fadedAlpha : 1;
        }
        ctx.fillStyle = n.color;
        ctx.fill();
        if (n.kind !== 'satellite') {
            ctx.lineWidth = 1.4 / scale;
            ctx.strokeStyle = BG;
            ctx.stroke();
        }
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
                ctx.globalAlpha = faded && isHub ? 0.6 : 1;
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
                ctx.globalAlpha = 1;
            }
        }
    }, [focused]);

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
            const r = n.kind !== 'satellite' ? Math.max(n.r + 4, MIN_HIT_R / scale) : n.r + 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
            ctx.fill();
        },
        []
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
                    linkColor={(l: any) =>
                        focused !== null &&
                        (l.source?.cluster ?? -1) !== focused &&
                        (l.target?.cluster ?? -1) !== focused
                            ? 'rgba(43,42,41,0.03)'
                            : 'rgba(43,42,41,0.13)'
                    }
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
