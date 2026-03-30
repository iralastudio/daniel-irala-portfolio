'use client';

import { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { MetroLine } from './MetroLine';
import { MetroStop } from './MetroStop';
import { ElectricPulse } from './ElectricPulse';
import { metroLines } from '@/data/metro-lines';
import { metroStops } from '@/data/stops';
import { StopId } from '@/types/metro';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Catmull-Rom spline interpolation for smooth organic curves
// tension: 0 = straight lines, 1 = very curved (0.3-0.5 works well for maps)
function catmullRomSpline(
    points: { x: number; y: number }[],
    tension: number = 0.4
): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
    }

    return d;
}

// Helper to generate smooth path d string from list of stop IDs
function generatePath(stopIds: StopId[], stopsData: typeof metroStops, isMobile: boolean) {
    if (stopIds.length < 2) return '';

    const coords = stopIds.map(id =>
        isMobile ? stopsData[id].coordinates.mobile : stopsData[id].coordinates.desktop
    );

    const tension = isMobile ? 0.5 : 0.6;
    return catmullRomSpline(coords, tension);
}

// Special path generator for Projects Line with rounded corner at Product Offering
function generateProjectsLinePath(stopsData: typeof metroStops, isMobile: boolean): string {
    const getCoords = (id: StopId) =>
        isMobile ? stopsData[id].coordinates.mobile : stopsData[id].coordinates.desktop;

    const stops: StopId[] = ['meeting-experience', 'workshops', 'podcast', 'product-offering', 'home', 'it-key-roles', 'experiments'];
    const coords = stops.map(getCoords);

    const tension = isMobile ? 0.5 : 0.6;
    const cornerRadius = isMobile ? 30 : 60;

    const segment1 = [coords[0], coords[1], coords[2]];
    let path = catmullRomSpline(segment1, tension);

    const podcast = coords[2];
    const productOffering = coords[3];

    path += ` L ${podcast.x} ${productOffering.y - cornerRadius}`;
    path += ` Q ${podcast.x} ${productOffering.y}, ${podcast.x + cornerRadius} ${productOffering.y}`;
    path += ` L ${productOffering.x} ${productOffering.y}`;

    const remainingStops = [coords[3], coords[4], coords[5], coords[6]];

    for (let i = 0; i < remainingStops.length - 1; i++) {
        const p0 = i > 0 ? remainingStops[i - 1] : remainingStops[i];
        const p1 = remainingStops[i];
        const p2 = remainingStops[i + 1];
        const p3 = i + 2 < remainingStops.length ? remainingStops[i + 2] : remainingStops[i + 1];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

        path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
    }

    return path;
}

// ── Line extension configuration ───────────────────────────────────────
const EXTENSION_DESKTOP = 100;
const EXTENSION_MOBILE = 40;

const LINE_GLOW_FILTERS: Record<string, string> = {
    profile: 'url(#glow-pink)',
    projects: 'url(#glow-purple)',
    thinking: 'url(#glow-cyan)',
};

/**
 * Projects a point outward from a terminal station along the direction
 * of the final segment. Used to extend lines beyond their end stops.
 */
function computeExtensionTip(
    terminal: { x: number; y: number },
    neighbor: { x: number; y: number },
    length: number
): { x: number; y: number } {
    const dx = terminal.x - neighbor.x;
    const dy = terminal.y - neighbor.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return { x: terminal.x, y: terminal.y };
    return {
        x: terminal.x + (dx / dist) * length,
        y: terminal.y + (dy / dist) * length,
    };
}

// Memoized SVG Filters component - prevents filter recreation on every render
const SVGFilters = memo(function SVGFilters({ isMobile }: { isMobile: boolean }) {
    // PERFORMANCE: Reduced blur values by ~50% for better performance
    // Original values were causing significant GPU load
    const lineBlur = isMobile ? 2 : 4;
    const stopBlurSoft = isMobile ? 2 : 3;
    const stopBlurIntense = isMobile ? 3 : 5;
    const electricBlur = isMobile ? 1 : 2;

    return (
        <defs>
            {/* Glow filter for lines - Pink - OPTIMIZED */}
            <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={lineBlur} result="blur" />
                <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 0.5 0 0 0  0 0 0.8 0 0  0 0 0 1 0"
                />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Glow filter for lines - Purple - OPTIMIZED */}
            <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={lineBlur} result="blur" />
                <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0.7 0 0 0 0  0 0.6 0 0 0  0 0 1 0 0  0 0 0 1 0"
                />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Glow filter for lines - Cyan/Blue - OPTIMIZED */}
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={lineBlur} result="blur" />
                <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0.5 0 0 0 0  0 0.9 0 0 0  0 0 1 0 0  0 0 0 1 0"
                />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Generic soft glow for stops - OPTIMIZED: reduced merge nodes */}
            <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={stopBlurSoft} result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Intense glow for highlighted/active stops - OPTIMIZED: reduced merge nodes */}
            <filter id="glow-intense" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={stopBlurIntense} result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>

            {/* Electric pulse glow - OPTIMIZED */}
            <filter id="glow-electric" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={electricBlur} result="blur" />
                <feColorMatrix
                    in="blur"
                    type="saturate"
                    values="2"
                />
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
    );
});

export function MetroMap() {
    const { selectedLine, activeStop } = useMetroMap();
    const { settings } = useAccessibility();
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Memoize viewBox
    const viewBox = useMemo(() =>
        isMobile ? "40 30 320 420" : "850 50 1150 950",
        [isMobile]
    );

    // Memoize path calculations - expensive operations that should only run when isMobile changes
    const linePaths = useMemo(() => {
        const extLen = isMobile ? EXTENSION_MOBILE : EXTENSION_DESKTOP;

        return metroLines.map(line => {
            const coords = line.stops.map(id =>
                isMobile ? metroStops[id].coordinates.mobile : metroStops[id].coordinates.desktop
            );

            return {
                line,
                path: line.id === 'projects'
                    ? generateProjectsLinePath(metroStops, isMobile)
                    : generatePath(line.stops, metroStops, isMobile),
                extensions: {
                    start: {
                        tip: computeExtensionTip(coords[0], coords[1], extLen),
                        station: coords[0],
                    },
                    end: {
                        tip: computeExtensionTip(coords[coords.length - 1], coords[coords.length - 2], extLen),
                        station: coords[coords.length - 1],
                    },
                },
            };
        });
    }, [isMobile]);

    // Memoize stops with coordinates
    const stopsWithCoords = useMemo(() => {
        return Object.values(metroStops).map(stop => ({
            stop,
            coords: isMobile ? stop.coordinates.mobile : stop.coordinates.desktop
        }));
    }, [isMobile]);

    return (
        <div className="w-full h-full overflow-auto relative">
            {/* Map SVG */}
            <svg
                viewBox={viewBox}
                className="w-full h-full block"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden={settings.simplifyMap ? "true" : "false"}
            >
                {/* SVG Definitions for Neon Glow Effects - MEMOIZED */}
                <SVGFilters isMobile={isMobile} />

                {/* Extension fade gradients */}
                <defs>
                    {linePaths.flatMap(({ line, extensions }) => [
                        <linearGradient
                            key={`fade-${line.id}-start`}
                            id={`fade-${line.id}-start`}
                            gradientUnits="userSpaceOnUse"
                            x1={extensions.start.tip.x}
                            y1={extensions.start.tip.y}
                            x2={extensions.start.station.x}
                            y2={extensions.start.station.y}
                        >
                            <stop offset="0%" stopColor={line.color} stopOpacity={0} />
                            <stop offset="100%" stopColor={line.color} stopOpacity={0.9} />
                        </linearGradient>,
                        <linearGradient
                            key={`fade-${line.id}-end`}
                            id={`fade-${line.id}-end`}
                            gradientUnits="userSpaceOnUse"
                            x1={extensions.end.station.x}
                            y1={extensions.end.station.y}
                            x2={extensions.end.tip.x}
                            y2={extensions.end.tip.y}
                        >
                            <stop offset="0%" stopColor={line.color} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={line.color} stopOpacity={0} />
                        </linearGradient>,
                    ])}
                </defs>

                {/* Extensions Layer — rendered before main lines so they sit behind */}
                <g className="extensions-layer">
                    {linePaths.map(({ line, extensions }) => {
                        const isDimmed = selectedLine !== null && selectedLine !== line.id;
                        const filter = LINE_GLOW_FILTERS[line.id];
                        const glowW = isMobile ? 5 : 10;
                        const baseW = isMobile ? 2.5 : 4;

                        return (
                            <motion.g
                                key={`ext-${line.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: isDimmed ? 0.1 : 1 }}
                                transition={{ duration: settings.reduceMotion ? 0 : 1.5, ease: "easeInOut" }}
                            >
                                {/* Start extension — glow layer */}
                                <line
                                    x1={extensions.start.tip.x} y1={extensions.start.tip.y}
                                    x2={extensions.start.station.x} y2={extensions.start.station.y}
                                    stroke={`url(#fade-${line.id}-start)`}
                                    strokeWidth={glowW}
                                    strokeLinecap="round"
                                    opacity={0.4}
                                    filter={filter}
                                />
                                {/* Start extension — base layer */}
                                <line
                                    x1={extensions.start.tip.x} y1={extensions.start.tip.y}
                                    x2={extensions.start.station.x} y2={extensions.start.station.y}
                                    stroke={`url(#fade-${line.id}-start)`}
                                    strokeWidth={baseW}
                                    strokeLinecap="round"
                                />
                                {/* End extension — glow layer */}
                                <line
                                    x1={extensions.end.station.x} y1={extensions.end.station.y}
                                    x2={extensions.end.tip.x} y2={extensions.end.tip.y}
                                    stroke={`url(#fade-${line.id}-end)`}
                                    strokeWidth={glowW}
                                    strokeLinecap="round"
                                    opacity={0.4}
                                    filter={filter}
                                />
                                {/* End extension — base layer */}
                                <line
                                    x1={extensions.end.station.x} y1={extensions.end.station.y}
                                    x2={extensions.end.tip.x} y2={extensions.end.tip.y}
                                    stroke={`url(#fade-${line.id}-end)`}
                                    strokeWidth={baseW}
                                    strokeLinecap="round"
                                />
                            </motion.g>
                        );
                    })}
                </g>

                {/* Lines Layer */}
                <g className="lines-layer">
                    {linePaths.map(({ line, path }) => (
                        <g key={line.id}>
                            <MetroLine line={line} pathDefinition={path} isMobile={isMobile} />
                            {(!selectedLine || selectedLine === line.id) && !settings.simplifyMap && (
                                <ElectricPulse
                                    pathDefinition={path}
                                    color={line.color}
                                    delay={metroLines.indexOf(line) * 2}
                                />
                            )}
                        </g>
                    ))}
                </g>

                {/* Stops Layer */}
                <g className="stops-layer">
                    {stopsWithCoords.map(({ stop, coords }) => (
                        <MetroStop
                            key={stop.id}
                            stop={stop}
                            isHighlighted={activeStop === stop.id}
                            cx={coords.x}
                            cy={coords.y}
                            isMobile={isMobile}
                        />
                    ))}
                </g>
            </svg>

            {/* Simplified List View (Accessible Fallback) */}
            {settings.simplifyMap && (
                <div className="absolute inset-0 bg-[var(--background)] p-8 overflow-y-auto z-10">
                    <h2 className="text-2xl font-bold mb-4 text-white">Metro Stations List</h2>
                    <div className="grid gap-4">
                        {metroLines.map(line => (
                            <div key={line.id} className="border border-white/10 p-4 rounded bg-white/5">
                                <h3 className="text-xl font-bold mb-2" style={{ color: line.color }}>{line.name}</h3>
                                <ul className="list-disc list-inside text-gray-300">
                                    {line.stops.map(stopId => (
                                        <li key={stopId} className="py-1">
                                            <button
                                                className="hover:underline hover:text-white text-left text-base"
                                                onClick={() => document.querySelector<HTMLElement>(`[aria-label="View ${metroStops[stopId].name}"]`)?.click()}
                                            >
                                                {metroStops[stopId].name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
