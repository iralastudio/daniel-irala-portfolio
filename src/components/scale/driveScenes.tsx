'use client';

import { useEffect, useId, useState, type ComponentType, type PointerEvent, type ReactNode } from 'react';
import { m } from 'framer-motion';
import { GROUP } from '@/lib/systemMap';
import { EXPO } from '@/lib/motion';
import { mix, WHITE, INK } from './storyInstruments';

/**
 * Five small stage scenes for the "What drives me" window, one per thread. Each is the
 * same idea drawn in the system map's own bead language (depth-shaded beads, thin links,
 * dashed = not yet / honest gap). Pointer interaction is an enhancement only: the stage
 * is aria-hidden and the reading text under it carries every word of the content.
 * `ok` = motion allowed; when false each scene renders its settled end state.
 */

const [BLUE, COPPER, , GREEN, PURPLE] = GROUP;
const W = 400;
const H = 250;
const CX = 200;
const CY = 125;
const INK_V = 'var(--color-text-primary)';
const SOFT_V = 'var(--color-text-secondary)';
const SURFACE_V = 'var(--color-surface)';

const label = (size = 13, weight = 600) =>
    ({
        fontFamily: 'var(--font-display)',
        fontSize: size,
        fontWeight: weight,
        paintOrder: 'stroke',
        stroke: SURFACE_V,
        strokeWidth: 3.5,
        strokeLinejoin: 'round',
    }) as const;

function mulberry(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const useUid = () => useId().replace(/[^a-zA-Z0-9]/g, '');

function Grad({ id, color }: { id: string; color: string }) {
    const rim = mix(color, INK, 0.28);
    return (
        <radialGradient id={id} cx="35%" cy="35%" r="72%">
            <stop offset="0%" stopColor={mix(color, WHITE, 0.34)} />
            <stop offset="45%" stopColor={color} />
            <stop offset="85%" stopColor={rim} />
            <stop offset="100%" stopColor={rim} />
        </radialGradient>
    );
}

type Pt = { x: number; y: number } | null;
function usePointer() {
    const [pt, setPt] = useState<Pt>(null);
    const move = (e: PointerEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPt({ x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H });
    };
    return { pt, handlers: { onPointerMove: move, onPointerDown: move, onPointerLeave: () => setPt(null) } };
}

function Stage({ children, handlers }: { children: ReactNode; handlers?: ReturnType<typeof usePointer>['handlers'] }) {
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto select-none" style={{ touchAction: 'pan-y' }} aria-hidden="true" {...handlers}>
            {children}
        </svg>
    );
}

const draw = (ok: boolean, delay: number, duration = 0.9) =>
    ok
        ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration, delay, ease: EXPO } }
        : { initial: false as const, animate: { pathLength: 1, opacity: 1 } };

/* ------------------------------------------------------------------- Vision */

const rv = mulberry(11);
const V_BEADS = Array.from({ length: 28 }, (_, i) => ({
    x: 30 + (i % 7) * (340 / 6) + (rv() - 0.5) * 28,
    y: 34 + Math.floor(i / 7) * (182 / 3) + (rv() - 0.5) * 24,
    r: 5 + rv() * 5,
    c: rv() < 0.2 ? 'c' : 'b',
}));
const V_LINKS = V_BEADS.flatMap((_, i) => [
    i % 7 < 6 && rv() < 0.85 ? [i, i + 1] : null,
    i < 21 && rv() < 0.8 ? [i, i + 7] : null,
]).filter(Boolean) as number[][];

/** Organisations that can see themselves clearly: a blurred web that a focus lens resolves. */
function Vision({ ok }: { ok: boolean }) {
    const uid = useUid();
    const { pt, handlers } = usePointer();
    const lens = pt ? { cx: pt.x, cy: pt.y, r: 78 } : { cx: CX, cy: CY, r: 340 };
    const tr = ok ? (pt ? { type: 'spring' as const, stiffness: 240, damping: 28 } : { duration: 1.8, ease: EXPO }) : { duration: 0 };
    const web = (
        <g>
            {V_LINKS.map(([a, b]) => (
                <line key={`${a}-${b}`} x1={V_BEADS[a].x} y1={V_BEADS[a].y} x2={V_BEADS[b].x} y2={V_BEADS[b].y} stroke={INK_V} strokeOpacity={0.22} strokeWidth={1} />
            ))}
            {V_BEADS.map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={`url(#${uid}${b.c})`} />
            ))}
        </g>
    );
    return (
        <Stage handlers={handlers}>
            <defs>
                <Grad id={`${uid}b`} color={BLUE} />
                <Grad id={`${uid}c`} color={COPPER} />
                <filter id={`${uid}f`} x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur stdDeviation="5.5" />
                </filter>
                <radialGradient id={`${uid}l`}>
                    <stop offset="0.7" stopColor="#fff" />
                    <stop offset="1" stopColor="#000" />
                </radialGradient>
                <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                    <rect width={W} height={H} fill="#000" />
                    <m.circle fill={`url(#${uid}l)`} initial={ok ? { cx: CX, cy: CY, r: 0 } : false} animate={lens} transition={tr} />
                </mask>
            </defs>
            <g filter={`url(#${uid}f)`} opacity={0.6}>{web}</g>
            <g mask={`url(#${uid}m)`}>{web}</g>
            {pt && (
                <m.circle fill="none" stroke={BLUE} strokeWidth={1.2} strokeOpacity={0.5} strokeDasharray="3 4" initial={{ cx: pt.x, cy: pt.y, r: 78 }} animate={{ cx: lens.cx, cy: lens.cy, r: 78 }} transition={tr} />
            )}
        </Stage>
    );
}

/* ------------------------------------------------------------------ Mission */

const MX = [40, 106, 172, 238, 304, 368];
const MY = [150, 100, 150, 100, 150, 100];
const BREAK = 2; // the link between bead 2 and bead 3
type Phase = 'map' | 'break' | 'mend';
const STEPS: [Phase, string, number][] = [['map', '1  Map', 22], ['break', '2  Find the break', 112], ['mend', '3  Easiest path', 262]];

/** Map it, find where it breaks, make the right path the easiest: click the break to mend it. */
function Mission({ ok }: { ok: boolean }) {
    const uid = useUid();
    const [phase, setPhase] = useState<Phase>(ok ? 'map' : 'mend');
    useEffect(() => {
        if (!ok) return;
        const a = setTimeout(() => setPhase('break'), 1500);
        const b = setTimeout(() => setPhase('mend'), 3600);
        return () => { clearTimeout(a); clearTimeout(b); };
    }, [ok]);
    const [x2, y2, x3, y3] = [MX[BREAK], MY[BREAK], MX[BREAK + 1], MY[BREAK + 1]];
    const at = (t: number) => ({ x: x2 + (x3 - x2) * t, y: y2 + (y3 - y2) * t });
    const gap = at(0.5);
    return (
        <Stage>
            <defs>
                <Grad id={`${uid}b`} color={BLUE} />
                <Grad id={`${uid}c`} color={COPPER} />
            </defs>
            {MX.slice(0, -1).map((x, i) =>
                i === BREAK ? null : (
                    <m.line key={i} x1={x} y1={MY[i]} x2={MX[i + 1]} y2={MY[i + 1]} stroke={BLUE} strokeOpacity={0.5} strokeWidth={2} {...draw(ok, 0.2 + i * 0.18)} />
                )
            )}
            {phase === 'mend' ? (
                <m.line x1={x2} y1={y2} x2={x3} y2={y3} stroke={BLUE} strokeOpacity={0.5} strokeWidth={2} {...draw(ok, 0, 0.7)} />
            ) : (
                <>
                    <line x1={x2} y1={y2} x2={at(0.36).x} y2={at(0.36).y} stroke={BLUE} strokeOpacity={0.5} strokeWidth={2} />
                    <line x1={at(0.64).x} y1={at(0.64).y} x2={x3} y2={y3} stroke={BLUE} strokeOpacity={0.5} strokeWidth={2} />
                    {phase === 'break' && (
                        <m.g initial={ok ? { opacity: 0 } : false} animate={{ opacity: 1 }}>
                            <path d={`M${gap.x - 6} ${gap.y - 6}l12 12M${gap.x + 6} ${gap.y - 6}l-12 12`} stroke={COPPER} strokeWidth={2.4} strokeLinecap="round" />
                            {ok && <m.circle cx={gap.x} cy={gap.y} r={8} fill="none" stroke={COPPER} strokeWidth={1.4} animate={{ r: [8, 24], opacity: [0.7, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }} />}
                        </m.g>
                    )}
                </>
            )}
            {MX.map((x, i) => (
                <m.circle key={i} cx={x} cy={MY[i]} fill={`url(#${uid}${i === MX.length - 1 ? 'c' : 'b'})`} initial={ok ? { r: 0 } : false} animate={{ r: i === 0 || i === MX.length - 1 ? 13 : 10 }} transition={{ duration: 0.7, delay: i * 0.18, ease: EXPO }} />
            ))}
            {phase === 'mend' && ok && (
                <m.circle cx={MX[0]} cy={MY[0]} r={5} fill={SURFACE_V} stroke={BLUE} strokeWidth={2} animate={{ cx: MX, cy: MY }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} />
            )}
            <circle cx={gap.x} cy={gap.y} r={26} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => setPhase((p) => (p === 'mend' ? 'break' : 'mend'))} />
            {STEPS.map(([p, text, x]) => (
                <text key={p} x={x} y={236} style={{ ...label(12.5, phase === p ? 700 : 500), stroke: 'none' }} fill={phase === p ? 'var(--color-accent)' : SOFT_V}>{text}</text>
            ))}
        </Stage>
    );
}

/* ------------------------------------------------------------------- Values */

const VALUES = [
    { x: 80, lines: ['Close to', 'the evidence'] },
    { x: 200, lines: ['Honest about', 'the gaps'] },
    { x: 320, lines: ['Useful to whoever', 'has to act on it'] },
];

/** Three commitments: standing on evidence, showing the gap as a gap, handing off to whoever acts. */
function Values({ ok }: { ok: boolean }) {
    const uid = useUid();
    const [h, setH] = useState<number | null>(null);
    const R = (i: number) => (h === i ? 21 : 17);
    return (
        <Stage>
            <defs>
                <Grad id={`${uid}b`} color={BLUE} />
                <Grad id={`${uid}g`} color={GREEN} />
            </defs>
            {[0, 1].map((i) => (
                <m.line key={i} x1={VALUES[i].x + 26} y1={100} x2={VALUES[i + 1].x - 26} y2={100} stroke={INK_V} strokeOpacity={0.25} strokeWidth={1.4} {...draw(ok, 0.5 + i * 0.2)} />
            ))}
            {VALUES.map((v, i) => (
                <m.g key={i} initial={false} animate={{ opacity: h === null || h === i ? 1 : 0.4 }} transition={{ duration: 0.3 }}>
                    {i === 0 && (
                        <>
                            {Array.from({ length: 9 }, (_, k) => {
                                const a = (k / 9) * Math.PI * 2;
                                return <circle key={k} cx={v.x + Math.cos(a) * 32} cy={100 + Math.sin(a) * 32} r={2.3} fill={INK_V} fillOpacity={0.45} />;
                            })}
                            <m.circle cx={v.x} cy={100} r={17} fill={`url(#${uid}b)`} initial={false} animate={{ r: R(0) }} />
                        </>
                    )}
                    {i === 1 && (
                        <m.circle cx={v.x} cy={100} r={17} fill={SURFACE_V} stroke={COPPER} strokeWidth={2} strokeDasharray="5 5" initial={false} animate={ok ? { r: R(1), strokeDashoffset: [0, -40] } : { r: R(1) }} transition={{ strokeDashoffset: { duration: 6, repeat: Infinity, ease: 'linear' }, r: { duration: 0.3 } }} />
                    )}
                    {i === 2 && (
                        <>
                            {[-26, 0, 26].map((dy) => (
                                <g key={dy}>
                                    <line x1={v.x} y1={100} x2={v.x + 38} y2={100 + dy} stroke={GREEN} strokeOpacity={0.55} strokeWidth={1.4} />
                                    <circle cx={v.x + 42} cy={100 + dy} r={4.5} fill={GREEN} />
                                </g>
                            ))}
                            <m.circle cx={v.x} cy={100} r={17} fill={`url(#${uid}g)`} initial={false} animate={{ r: R(2) }} />
                        </>
                    )}
                    {v.lines.map((t, k) => (
                        <text key={t} x={v.x} y={166 + k * 17} textAnchor="middle" style={label(13.5, k === 0 ? 600 : 500)} fill={INK_V}>{t}</text>
                    ))}
                    <rect x={v.x - 58} y={52} width={116} height={142} fill="transparent" style={{ cursor: 'pointer' }} onPointerEnter={() => setH(i)} onPointerLeave={() => setH(null)} onClick={() => setH(h === i ? null : i)} />
                </m.g>
            ))}
        </Stage>
    );
}

/* ---------------------------------------------------------------- Direction */

const DX = 104;
const RINGS = [
    { r: 28, label: 'Design researcher', y: 96 },
    { r: 62, label: 'Service design', y: 126 },
    { r: 96, label: 'Systems leadership', y: 156 },
];

/** Each step widens the frame, from a single screen to the whole enterprise. */
function Direction({ ok }: { ok: boolean }) {
    const uid = useUid();
    const { pt, handlers } = usePointer();
    const [row, setRow] = useState<number | null>(null);
    const d = pt ? Math.hypot(pt.x - DX, pt.y - CY) : -1;
    const ringHit = d < 0 ? -1 : d < 28 ? 0 : d < 62 ? 1 : d < 96 ? 2 : -1;
    const h = row ?? (ringHit >= 0 ? ringHit : null);
    return (
        <Stage handlers={handlers}>
            <defs><Grad id={`${uid}b`} color={BLUE} /></defs>
            {[...RINGS].reverse().map((g, k) => {
                const i = 2 - k;
                const on = h === i;
                return (
                    <m.circle key={i} cx={DX} cy={CY} fill="var(--color-accent)" fillOpacity={on ? 0.08 : 0} stroke={on ? BLUE : INK_V} strokeOpacity={on ? 0.9 : 0.3} strokeWidth={on ? 2 : 1.4}
                        strokeDasharray={i === 2 ? '6 6' : undefined}
                        initial={ok ? { r: 0, strokeDashoffset: 0 } : false}
                        animate={ok && i === 2 ? { r: g.r, strokeDashoffset: [0, -48] } : { r: g.r }}
                        transition={{ r: { duration: 1.3, delay: 0.25 + i * 0.4, ease: EXPO }, strokeDashoffset: { duration: 9, repeat: Infinity, ease: 'linear' } }} />
                );
            })}
            <circle cx={DX} cy={CY} r={9} fill={`url(#${uid}b)`} />
            {RINGS.map((g, i) => {
                const on = h === i;
                return (
                    <m.g key={g.label} initial={ok ? { opacity: 0, x: -8 } : false} animate={{ opacity: h === null || on ? 1 : 0.5, x: 0 }} transition={{ duration: 0.5, delay: ok ? 0.6 + i * 0.35 : 0 }}>
                        <circle cx={232} cy={g.y - 4} r={5} fill={on ? BLUE : SURFACE_V} stroke={on ? BLUE : INK_V} strokeOpacity={on ? 1 : 0.45} strokeWidth={1.6} strokeDasharray={i === 2 ? '2.5 2.5' : undefined} />
                        <text x={244} y={g.y} style={{ ...label(13.5, on ? 700 : 600), stroke: 'none' }} fill={on ? 'var(--color-accent)' : INK_V}>{g.label}</text>
                        <rect x={222} y={g.y - 18} width={172} height={26} fill="transparent" style={{ cursor: 'pointer' }} onPointerEnter={() => setRow(i)} onPointerLeave={() => setRow(null)} onClick={() => setRow(row === i ? null : i)} />
                    </m.g>
                );
            })}
            <text x={232} y={206} style={{ ...label(11.5, 500), stroke: 'none' }} fill={SOFT_V}>from a single screen</text>
            <text x={232} y={222} style={{ ...label(11.5, 500), stroke: 'none' }} fill={SOFT_V}>to the whole enterprise →</text>
        </Stage>
    );
}

/* --------------------------------------------------------------------- Past */

const LENSES = [
    { c: COPPER, dx: 0, dy: -32, word: 'Make', sub: 'industrial design', tx: 200, ty: 64 },
    { c: PURPLE, dx: -27.7, dy: 16, word: 'Why', sub: 'psychology', tx: 134, ty: 178 },
    { c: BLUE, dx: 27.7, dy: 16, word: 'Connect', sub: 'service design', tx: 268, ty: 178 },
];

/** Three lenses, one practice: they start apart and settle into one overlap. */
function Past({ ok }: { ok: boolean }) {
    const [h, setH] = useState<number | null>(null);
    return (
        <Stage>
            <g style={{ mixBlendMode: 'multiply' }}>
                {LENSES.map((l, i) => (
                    <m.circle key={l.word} r={58} fill={l.c} stroke={l.c} strokeWidth={1.5} strokeOpacity={0.8}
                        initial={ok ? { cx: CX + l.dx * 3.2, cy: CY + l.dy * 3.2, fillOpacity: 0.3 } : false}
                        animate={{ cx: CX + l.dx, cy: CY + l.dy, fillOpacity: h === null ? 0.34 : h === i ? 0.6 : 0.14 }}
                        transition={{ cx: { duration: 1.5, ease: EXPO }, cy: { duration: 1.5, ease: EXPO }, fillOpacity: { duration: 0.3 } }}
                        style={{ cursor: 'pointer' }}
                        onPointerEnter={() => setH(i)} onPointerLeave={() => setH(null)} onClick={() => setH(h === i ? null : i)} />
                ))}
            </g>
            {LENSES.map((l, i) => (
                <m.g key={l.word} initial={ok ? { opacity: 0 } : false} animate={{ opacity: h === null || h === i ? 1 : 0.45 }} transition={{ duration: 0.4, delay: ok && h === null ? 0.9 : 0 }} style={{ pointerEvents: 'none' }}>
                    <text x={l.tx} y={l.ty} textAnchor="middle" style={label(16, 700)} fill={INK_V}>{l.word}</text>
                    <text x={l.tx} y={l.ty + 15} textAnchor="middle" style={label(11.5, 600)} fill={INK_V}>{l.sub}</text>
                </m.g>
            ))}
            <m.g initial={ok ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: ok ? 1.3 : 0 }} style={{ pointerEvents: 'none' }}>
                <text x={CX} y={CY + 1} textAnchor="middle" style={label(10.5, 700)} fill={INK_V}>one</text>
                <text x={CX} y={CY + 13} textAnchor="middle" style={label(10.5, 700)} fill={INK_V}>practice</text>
            </m.g>
        </Stage>
    );
}

export const SCENES: Record<string, ComponentType<{ ok: boolean }>> = { Vision, Mission, Values, Direction, Past };
export const HINTS: Record<string, string> = {
    Vision: 'Move across to focus',
    Mission: 'Click the break',
    Values: 'Touch a commitment',
    Direction: 'Touch a ring',
    Past: 'Touch a lens',
};
