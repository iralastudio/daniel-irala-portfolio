'use client';

import { useEffect, useState } from 'react';
import { GROUP } from '@/lib/systemMap';
import { Bead } from './storyInstruments';

/**
 * One drawing per tension in the #thinking window, each about what that tension means
 * (not one shape re-skinned). Every scene is a pure function of two numbers:
 *   e  the reframe, 0 = how the problem is usually described, 1 = how Dani describes it
 *      (already eased); it is what the slider and the opening play-through drive
 *   c  an ambient clock in seconds, so things keep moving gently once revealed
 * Reduced motion passes c = 0, so each scene sits still at whatever e says.
 * Drawn in the map's bead language: depth-shaded beads, thin links, dashed = not yet.
 */

const COLOR = GROUP[4];
const COPPER = GROUP[1];
const GREEN = GROUP[3];
const BLUE = GROUP[0];
const INK = 'var(--color-text-primary)';
const SURFACE = 'var(--color-surface)';

export type SceneProps = { e: number; c: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sm = (x: number, a: number, b: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};
const tag = {
    fontFamily: 'var(--font-display)',
    fontSize: 11.5,
    fontWeight: 600,
    paintOrder: 'stroke',
    stroke: SURFACE,
    strokeWidth: 3.5,
    strokeLinejoin: 'round',
} as const;

/** Ambient clock: seconds since mount, or a fixed 0 when motion is off. */
export function useClock(ok: boolean) {
    const [c, setC] = useState(0);
    useEffect(() => {
        if (!ok) return;
        let raf = 0;
        const t0 = performance.now();
        const tick = (now: number) => {
            setC(Math.max(0, now - t0) / 1000); // a rAF stamp can precede t0 by a hair
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [ok]);
    return ok ? c : 0;
}

/* 1 ─ The line and the system: a delay that started upstream lands on the last team. */
const CH = [46, 125, 204, 283, 362];
function Chain({ e, c }: SceneProps) {
    const y = 70;
    const x0 = CH[1];
    const x1 = CH[4];
    const tx = x0 + (x1 - x0) * ((c * 0.42) % 1);
    return (
        <>
            {CH.slice(1).map((x, i) => (
                <line key={i} x1={CH[i]} y1={y} x2={x} y2={y} stroke={INK} strokeOpacity={0.25} strokeWidth={1.6} />
            ))}
            <line x1={x0} y1={y} x2={x0 + (x1 - x0) * e} y2={y} stroke={COPPER} strokeWidth={3} strokeLinecap="round" strokeOpacity={0.85} />
            {e > 0.5 && <circle cx={tx} cy={y} r={4.5} fill={COPPER} opacity={sm(e, 0.5, 0.8)} />}
            {CH.map((x, i) => (
                <Bead key={i} cx={x} cy={y} r={11} color={i === 4 ? COPPER : COLOR} />
            ))}
            <circle cx={x1} cy={y} r={17 + Math.sin(c * 3) * 2} fill="none" stroke={COPPER} strokeOpacity={0.55} strokeWidth={1.4} />
            <circle cx={x0} cy={y} r={17} fill="none" stroke={COPPER} strokeWidth={1.4} strokeDasharray="3 3" strokeOpacity={sm(e, 0.2, 0.7)} />
            <text x={x0} y={108} textAnchor="middle" style={tag} fill={INK} opacity={sm(e, 0.3, 0.7)}>where it started</text>
            <text x={392} y={108} textAnchor="end" style={tag} fill={INK}>{e < 0.5 ? 'missed its date' : 'where it landed'}</text>
        </>
    );
}

/* 2 ─ Journeys and silos: the problem moves from a touchpoint into the gap between owners. */
const SILO = [[28, 130], [148, 252], [270, 372]];
const SB = [62, 98, 176, 224, 298, 338];
function Silos({ e, c }: SceneProps) {
    const y = 70;
    const ax = lerp(SB[1], 139, e);
    const px = 30 + 342 * ((c * 0.16) % 1);
    return (
        <>
            {SILO.map(([a, b]) => (
                <rect key={a} x={a} y={30} width={b - a} height={80} rx={6} fill="none" stroke={INK} strokeOpacity={0.32 * sm(e, 0.05, 0.6)} strokeWidth={1.3} strokeDasharray="4 4" />
            ))}
            <line x1={30} y1={y} x2={372} y2={y} stroke={INK} strokeOpacity={0.25} strokeWidth={1.6} />
            <line x1={139} y1={20} x2={139} y2={120} stroke={COPPER} strokeWidth={1.4} strokeDasharray="3 4" strokeOpacity={0.8 * e} />
            {SB.map((x, i) => (
                <Bead key={i} cx={x} cy={y} r={9} color={COLOR} />
            ))}
            <circle cx={px} cy={y} r={4.5} fill={SURFACE} stroke={BLUE} strokeWidth={2} />
            <circle cx={ax} cy={y} r={15 + Math.sin(c * 3) * 1.6} fill="none" stroke={COPPER} strokeWidth={2} />
            <circle cx={ax} cy={y} r={3.2} fill={COPPER} />
            <text x={139} y={134} textAnchor="middle" style={tag} fill={INK} opacity={sm(e, 0.5, 0.9)}>nobody’s space</text>
            <text x={SB[1]} y={134} textAnchor="middle" style={tag} fill={INK} opacity={1 - sm(e, 0.2, 0.6)}>one touchpoint</text>
        </>
    );
}

/* 3 ─ Designed or happened: the real, grown structure against the blueprint nobody drew. */
const GROWN = [[58, 98], [98, 52], [150, 90], [178, 44], [232, 84], [262, 118], [302, 58], [344, 96], [214, 126]];
function Blueprint({ e, c }: SceneProps) {
    return (
        <>
            {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
                <line key={x} x1={x} y1={20} x2={x} y2={130} stroke={INK} strokeOpacity={0.14 * e} strokeDasharray="2 5" />
            ))}
            {[30, 70, 110].map((y) => (
                <line key={y} x1={20} y1={y} x2={380} y2={y} stroke={INK} strokeOpacity={0.14 * e} strokeDasharray="2 5" />
            ))}
            {GROWN.map(([x, y], i) => {
                const gx = Math.round(x / 40) * 40;
                const gy = 30 + Math.round((y - 30) / 40) * 40;
                return (
                    <g key={`g${i}`} opacity={e}>
                        <line x1={x} y1={y} x2={gx} y2={gy} stroke={COPPER} strokeOpacity={0.5} strokeDasharray="2 3" />
                        <circle cx={gx} cy={gy} r={7} fill="none" stroke={COLOR} strokeWidth={1.3} strokeDasharray="3 3" />
                    </g>
                );
            })}
            {GROWN.slice(1).map(([x, y], i) => (
                <line key={i} x1={GROWN[i][0]} y1={GROWN[i][1]} x2={x} y2={y} stroke={INK} strokeOpacity={0.3} strokeWidth={1.5} />
            ))}
            {GROWN.map(([x, y], i) => (
                <Bead key={i} cx={x + Math.sin(c * 0.8 + i * 1.7) * 2.2} cy={y + Math.cos(c * 0.7 + i) * 2.2} r={7.5} color={i === 5 && e < 0.5 ? COPPER : COLOR} />
            ))}
            <text x={200} y={146} textAnchor="middle" style={tag} fill={INK} opacity={e}>the plan nobody drew</text>
        </>
    );
}

/* 4 ─ Speed and care: a fast maker sprints, and the wider system pays for it. */
function Tempo({ e, c }: SceneProps) {
    const y = 70;
    const w = 2.6;
    const mx = 112 + lerp(76, 26, e) * Math.sin(c * w);
    const vel = Math.cos(c * w);
    const dir = vel >= 0 ? -1 : 1;
    return (
        <>
            <line x1={36} y1={y} x2={188} y2={y} stroke={INK} strokeOpacity={0.2} strokeWidth={1.5} />
            {[0, 1, 2].map((i) => (
                <line key={i} x1={mx + dir * (16 + i * 8)} y1={y - 6 + i * 6} x2={mx + dir * (26 + i * 10)} y2={y - 6 + i * 6} stroke={BLUE} strokeWidth={2} strokeLinecap="round" strokeOpacity={(1 - e) * Math.abs(vel) * 0.7} />
            ))}
            <line x1={mx + 12} y1={y} x2={252} y2={y} stroke={COPPER} strokeWidth={1.6} strokeDasharray="4 4" strokeDashoffset={-c * 18} strokeOpacity={0.85 * e} />
            <Bead cx={mx} cy={y} r={10} color={BLUE} />
            {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                return (
                    <g key={i} opacity={lerp(0.25, 1, e)}>
                        <Bead cx={296 + Math.cos(a) * 46} cy={y + Math.sin(a) * 46} r={6} color={COLOR} />
                    </g>
                );
            })}
            <text x={112} y={118} textAnchor="middle" style={tag} fill={INK}>{e < 0.5 ? 'faster' : 'fast for whom'}</text>
            <text x={296} y={140} textAnchor="middle" style={tag} fill={INK} opacity={sm(e, 0.4, 0.9)}>the wider system</text>
        </>
    );
}

/* 5 ─ Experience and the dashboard: green bars say healthy; the felt curve says otherwise. */
const CURVE = Array.from({ length: 40 }, (_, i) => ({ x: 40 + i * (320 / 39), y: 64 + 26 * Math.sin(i * 0.42) + 10 * Math.sin(i * 1.1 + 1) }));
const CURVE_D = CURVE.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
function Dashboard({ e, c }: SceneProps) {
    const f = ((c * 0.1) % 1) * (CURVE.length - 1);
    const i = Math.min(CURVE.length - 2, Math.floor(f));
    const rx = lerp(CURVE[i].x, CURVE[i + 1].x, f - i);
    const ry = lerp(CURVE[i].y, CURVE[i + 1].y, f - i);
    return (
        <>
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} opacity={lerp(1, 0.4, e)}>
                    <rect x={48 + i * 60} y={128 - (44 + (i % 3) * 3)} width={26} height={44 + (i % 3) * 3} rx={2} fill={GREEN} fillOpacity={0.55} />
                    <circle cx={61 + i * 60} cy={128 - (44 + (i % 3) * 3) - 7} r={3} fill={GREEN} />
                </g>
            ))}
            <path d={CURVE_D} pathLength={1} fill="none" stroke={COLOR} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" strokeDashoffset={1 - e} />
            {e > 0.6 && <circle cx={rx} cy={ry} r={6} fill={COLOR} stroke={SURFACE} strokeWidth={2} opacity={sm(e, 0.6, 0.9)} />}
            <text x={48} y={22} style={tag} fill={INK} opacity={1 - e * 0.6}>technical KPIs</text>
            <text x={360} y={22} textAnchor="end" style={tag} fill={INK} opacity={sm(e, 0.3, 0.8)}>how it feels</text>
        </>
    );
}

/* 6 ─ Agents and trust: not a bug to fix but a person deciding whether to rely on it. */
function Trust({ e, c }: SceneProps) {
    const y = 70;
    const stones = 7;
    const p = (c * 0.2) % 1;
    const u = p < 0.4 ? (p / 0.4) * 0.5 : p < 0.62 ? 0.5 : 0.5 + ((p - 0.62) / 0.38) * 0.5;
    const pulse = ((c % 3) / 3);
    return (
        <>
            {Array.from({ length: stones }, (_, i) => {
                const x = 104 + i * 32;
                const on = e > (i + 0.5) / (stones + 1);
                return on ? <circle key={i} cx={x} cy={y} r={4.5} fill={COLOR} /> : <circle key={i} cx={x} cy={y} r={4} fill="none" stroke={INK} strokeOpacity={0.35} strokeDasharray="2 2" />;
            })}
            {e > 0.3 && <circle cx={200} cy={y} r={10 + pulse * 18} fill="none" stroke={COPPER} strokeWidth={1.4} strokeOpacity={(1 - pulse) * 0.6} />}
            {e > 0.3 && <circle cx={lerp(70, 330, u)} cy={y} r={5} fill={SURFACE} stroke={BLUE} strokeWidth={2} opacity={sm(e, 0.3, 0.6)} />}
            <path d="M326 36 l8 11 l-8 4 l10 13" fill="none" stroke={COPPER} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={(1 - e) * (Math.sin(c * 17) > 0 ? 1 : 0.35)} />
            <Bead cx={60} cy={y} r={12} color={BLUE} />
            <Bead cx={340} cy={y} r={13} color={COLOR} />
            <text x={60} y={108} textAnchor="middle" style={tag} fill={INK}>a person</text>
            <text x={340} y={108} textAnchor="middle" style={tag} fill={INK}>{e < 0.5 ? 'the bug' : 'the agent'}</text>
            <text x={200} y={118} textAnchor="middle" style={tag} fill={INK} opacity={sm(e, 0.5, 0.9)}>the moment of trust</text>
        </>
    );
}

// Indexed to the order of the entries in nodeContent '#thinking'.
export const TENSION_SCENES: React.ComponentType<SceneProps>[] = [Chain, Silos, Blueprint, Tempo, Dashboard, Trust];
