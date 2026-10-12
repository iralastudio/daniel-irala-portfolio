'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useMemo, useEffect, useLayoutEffect, useCallback } from 'react';
import { forceX, forceY, forceCollide } from 'd3-force';
import { buildSystemMap, type SystemMapData, type MapNode } from '@/lib/systemMap';
import { paintNode, paintLink, paintHitArea, PAR_AMP, K_PERSP } from '@/lib/mapPaint';
import { runSignature, createSigState, type SigState, type SignatureProps } from '@/lib/mapSignature';
import { useMapMotion, FLY_MS } from '@/lib/mapMotion';
import { useWindowCamera, type Dolly } from '@/lib/mapWindow';

export interface FlyTo { index: number; key: number }
export type { SignatureProps };

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
    windowHref = null,
    dolly = null,
}: {
    flyTo: FlyTo | null;
    reduced: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    onAreaChange?: (i: number) => void;
    /** Bump to let every dragged-and-dropped node rejoin the simulation. */
    releasePinned?: number;
    /** Wire-up for the first-visit signature sequence; omit to disable it. */
    signature?: SignatureProps;
    /** The open window and its dolly request (Phase 4). */
    windowHref?: string | null;
    dolly?: Dolly | null;
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
    // Hover lift, focus fade, click ripple (Phase 2): eased values the paint reads.
    const motion = useMapMotion(data, focused, reduced);
    const { dimOf, inOf, liftOf, linkLift, addRipple } = motion;

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
    const sigRef = useRef<SigState>(createSigState());
    const sigCanvasRef = useRef<HTMLCanvasElement>(null);
    const sigCleanup = useRef<() => void>(() => {});
    const [sigActive, setSigActive] = useState(false);

    useEffect(() => {
        // Decide up front whether the signature runs, so the graph is hidden from its
        // first frame. It plays on every full load and never on in-page returns (this
        // runs once per mount); a once-per-session gate read as "broken" on reload.
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

    // One camera control: zoomToFit (centerAt + zoom together snap back). A fit owns
    // the camera for its duration + grace so area-detection doesn't fight it.
    const fitTo = useCallback(
        (ms: number, padding: number, filter?: (n: any) => boolean) => {
            const g = fgRef.current;
            if (!g || !data) return;
            flyingUntil.current = performance.now() + Math.max(ms, 0) + 450;
            userZoomed.current = false; // a programmatic fly owns the area, not detection
            if (filter) g.zoomToFit(ms, padding, filter);
            else g.zoomToFit(ms, padding);
        },
        [data]
    );
    const flyToView = useCallback(
        (index: number, ms: number) =>
            index < 0 ? fitTo(ms, 110) : fitTo(ms, 110, (n: any) => n.cluster === index),
        [fitTo]
    );

    // Opening a window dollies toward its node; closing settles on the cluster (Phase 4).
    useWindowCamera({
        data, windowHref, dolly, reduced, fitTo, setFocused,
        setAnchor: motion.setAnchor, neighboursOf: motion.neighboursOf,
    });

    // forceCollide keeps expanding the disc after the initial fits, eating their padding;
    // re-fit once the engine reports settled. Once only, and only while still on the
    // overview, so a visitor who has already focused a cluster is not yanked back.
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

    // The signature sequence (src/lib/mapSignature.ts). Skips itself under reduced
    // motion or when there is no accent word to sample (deep links, other scenes).
    const startSignature = useCallback(() => {
        const g = fgRef.current;
        const el = sigCanvasRef.current;
        const sig = sigRef.current;
        const skip = (reason: string) => {
            sig.phase = 'done';
            sig.linkT = 1;
            console.debug('[signature] skipped:', reason);
        };
        if (!g || !el || !data || !signature || reduced) return skip('not ready or reduced motion');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return skip('OS prefers reduced motion');
        const cleanup = runSignature({
            g, el, data, signature, sig, offsetOf,
            getZoom: () => zoomRef.current,
            setActive: setSigActive,
        });
        if (cleanup) sigCleanup.current = cleanup;
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
        flyToView(flyTo.index, FLY_MS);
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

    // Frame a cluster and hold it in focus. Always flies, so a click is never silent,
    // and reports up via `onAreaChange` so the map's fade, the rail and the panel agree.
    const focusCluster = useCallback(
        (i: number) => {
            setFocused(i);
            flyToView(i, FLY_MS);
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

    // Two behaviours, learnable in one sentence: a dot that owns an href opens it,
    // everything else focuses its cluster. The click position seeds the reveal; focus
    // on the node's cluster is set by the dolly (useWindowCamera).
    const onNodeClick = useCallback(
        (node: any, event?: MouseEvent) => {
            const n = node as MapNode;
            if (n.href && n.href !== '#') {
                addRipple(n); // the window's circle reveal grows from this ring
                onSelect(n.href, event ? { x: event.clientX, y: event.clientY } : undefined);
                return;
            }
            focusCluster(n.cluster);
        },
        [onSelect, focusCluster, addRipple]
    );

    // Paint lives in src/lib/mapPaint.ts; these wrappers hand it the live state.
    const drawNode = useCallback(
        (node: any, ctx: CanvasRenderingContext2D, scale: number) =>
            paintNode(node, ctx, scale, { offsetOf, sig: sigRef.current, dim: dimOf, focusIn: inOf, lift: liftOf }),
        [offsetOf, dimOf, inOf, liftOf]
    );
    const drawLink = useCallback(
        (link: any, ctx: CanvasRenderingContext2D, scale: number) =>
            paintLink(link, ctx, scale, { offsetOf, linkT: sigRef.current.linkT, dim: dimOf, lift: linkLift }),
        [offsetOf, dimOf, linkLift]
    );
    const pointerArea = useCallback(
        (node: any, color: string, ctx: CanvasRenderingContext2D, scale = 1) =>
            paintHitArea(node, color, ctx, scale, offsetOf),
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
                    autoPauseRedraw={!sigActive && !motion.busy}
                    onRenderFramePre={() => {
                        // Ease the parallax toward the pointer once per frame (~400 ms
                        // settle), so the field glides rather than jitters; refresh where
                        // the camera looks (perspective) and advance the Phase 2 clock.
                        const p = par.current;
                        p.x += (p.tx - p.x) * 0.055;
                        p.y += (p.ty - p.y) * 0.055;
                        const g = fgRef.current;
                        if (g) camCentre.current = g.screen2GraphCoords(size.w / 2, size.h / 2);
                        motion.framePre();
                    }}
                    onRenderFramePost={(ctx: CanvasRenderingContext2D, scale: number) => motion.framePost(ctx, scale, offsetOf)}
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
                        motion.onHover(hoverNode.current);
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
