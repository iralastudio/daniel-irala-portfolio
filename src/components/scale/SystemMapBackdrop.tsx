'use client';

import { useMemo } from 'react';
import { buildSystemMap, depthScale, depthAlpha, depthPigment } from '@/lib/systemMap';

const PAD = 60; // graph units of breathing room around the disc

/**
 * SystemMapBackdrop — the system map drawn once as static SVG, for stacked mode
 * (phones, touch tablets, reduce-motion), where the map is only a muted backdrop
 * behind an 82% veil. The layout is seeded, so each node's target position
 * (`tx`/`ty`) is deterministic: drawing the targets directly gives the same
 * picture the live graph settles into, without shipping react-force-graph + d3
 * or running a simulation on the devices least able to afford it.
 */
export function SystemMapBackdrop() {
    const { nodes, links, viewBox } = useMemo(() => {
        const data = buildSystemMap();
        const pos = new Map(data.nodes.map((n) => [n.id, n]));
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const n of data.nodes) {
            minX = Math.min(minX, n.tx - n.r);
            minY = Math.min(minY, n.ty - n.r);
            maxX = Math.max(maxX, n.tx + n.r);
            maxY = Math.max(maxY, n.ty + n.r);
        }
        return {
            nodes: data.nodes,
            links: data.links.flatMap((l) => {
                const a = pos.get(l.source);
                const b = pos.get(l.target);
                return a && b ? [{ key: `${l.source}>${l.target}`, x1: a.tx, y1: a.ty, x2: b.tx, y2: b.ty }] : [];
            }),
            viewBox: `${minX - PAD} ${minY - PAD} ${maxX - minX + PAD * 2} ${maxY - minY + PAD * 2}`,
        };
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <svg className="w-full h-full" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
                <g stroke="rgba(43,42,41,0.13)" strokeWidth={1} vectorEffect="non-scaling-stroke">
                    {links.map((l, i) => (
                        <line key={`${l.key}-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} vectorEffect="non-scaling-stroke" />
                    ))}
                </g>
                {/* Same depth as the live map: far nodes smaller and fainter, near ones
                    full size with a keyline. */}
                {nodes.map((n) =>
                    n.kind === 'satellite' ? (
                        <circle
                            key={n.id}
                            cx={n.tx}
                            cy={n.ty}
                            r={n.r * depthScale(n.z)}
                            fill={depthPigment(n.color, n.z)}
                            opacity={depthAlpha(n.z, false)}
                        />
                    ) : (
                        <circle
                            key={n.id}
                            cx={n.tx}
                            cy={n.ty}
                            r={n.r * depthScale(n.z)}
                            fill={depthPigment(n.color, n.z)}
                            opacity={depthAlpha(n.z, true)}
                        />
                    )
                )}
            </svg>
            <div className="grain-overlay absolute inset-0 pointer-events-none" />
        </div>
    );
}
