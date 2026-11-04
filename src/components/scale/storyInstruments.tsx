'use client';

import { useId } from 'react';
import { m, type Variants } from 'framer-motion';
import type { JourneyModel, WaysInModel, SwapModel, SilentModel, StoryCaseBlock, Verdict } from '@/data/storyModels';
import { EXPO, useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';

/**
 * Storytelling instruments drawn in the system map's own language: depth-shaded beads
 * joined by thin links that draw themselves, so a case study reads as a close-up of one
 * part of the map rather than a set of generic charts (spec:
 * docs/superpowers/specs/2026-11-03-digital-agent-visuals-design.md).
 *
 * Same family as instruments.tsx: the shared Instrument shell, the Beat reveal (plays
 * once on arrival, static under reduced motion), one verdict grammar everywhere. Nothing
 * here is sized by a number, so no score can be read off a drawing.
 */

export const ACCENT = GROUP[0];
export const COPPER = GROUP[1]; // the Touchpoint cluster's colour on the map

// The map's bead shading (mapPaint.ts), for SVG: highlight up-left, pigment, inked rim.
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const mix = (h: string, to: number[], t: number) =>
    `rgb(${rgb(h).map((v, i) => Math.round(v + (to[i] - v) * t)).join(',')})`;
export const WHITE = [255, 255, 255];
export const INK = [43, 42, 41];

export function Bead({ cx, cy, r, color, hollow = false }: { cx: number; cy: number; r: number; color: string; hollow?: boolean }) {
    const id = `bead-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    if (hollow) {
        return <circle cx={cx} cy={cy} r={r - 1} fill="var(--color-surface)" stroke={color} strokeWidth={1.5} strokeDasharray="3 3" />;
    }
    const rim = mix(color, INK, 0.28);
    return (
        <g>
            <defs>
                <radialGradient id={id} cx="35%" cy="35%" r="72%">
                    <stop offset="0%" stopColor={mix(color, WHITE, 0.34)} />
                    <stop offset="45%" stopColor={color} />
                    <stop offset="85%" stopColor={rim} />
                    <stop offset="100%" stopColor={rim} />
                </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} />
        </g>
    );
}

const VERDICT_LABEL: Record<Verdict, string> = { go: 'Go', conditional: 'Conditional', planned: 'Planned' };
const VERDICT_CLASS: Record<Verdict, string> = {
    go: 'bg-accent border-accent !text-white',
    conditional: 'border-accent !text-accent',
    planned: 'border-dashed border-ink/30 !text-ink-soft',
};

function VerdictBadge({ verdict }: { verdict: Verdict }) {
    return (
        <span className={cn('inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]', VERDICT_CLASS[verdict])}>
            {VERDICT_LABEL[verdict]}
        </span>
    );
}

const small = { fontSize: 'var(--step--1)', lineHeight: 1.5 } as const;

/* ------------------------------------------------------------------ Journey */

/** Milestones on one track: solid where it has been, dashed where it is going. */
function Journey({ model }: { model: JourneyModel }) {
    const n = model.steps.length;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-7">
                <ol
                    className="grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] list-none m-0 p-0"
                    style={{ ['--n' as string]: n }}
                >
                    {model.steps.map((s, i) => (
                        <li key={s.title} className="relative pl-8 pb-6 lg:pl-0 lg:pb-0 lg:pr-4 lg:pt-8">
                        <BeatItem>
                            {i < n - 1 && (
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'absolute left-[8.5px] top-[18px] bottom-0 border-l',
                                        'lg:left-[18px] lg:right-0 lg:top-[8.5px] lg:bottom-auto lg:border-l-0 lg:border-t',
                                        i < model.lived ? 'border-accent/50' : 'border-dashed border-ink/25'
                                    )}
                                />
                            )}
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="absolute left-0 top-0">
                                <Bead cx={9} cy={9} r={8} color={COPPER} hollow={i > model.lived} />
                            </svg>
                            <div className="label-mono !text-[10px] mb-1.5">{s.when}</div>
                            <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)', lineHeight: 1.3 }}>
                                {s.title}
                            </div>
                            <div className="mt-2"><VerdictBadge verdict={s.verdict} /></div>
                            <p className="mt-2 text-ink-soft" style={small}>{s.detail}</p>
                        </BeatItem>
                        </li>
                    ))}
                </ol>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Ways in */

const C = { x: 300, y: 165 };
const SPOKE_END = [{ x: 105, y: 68 }, { x: 495, y: 68 }, { x: 300, y: 285 }];
const drawAt: Variants = {
    hidden: { pathLength: 0 },
    show: (d: number) => ({ pathLength: 1, transition: { duration: 0.8, ease: EXPO, delay: d } }),
};

/** One agent at the centre; each spoke draws in the order its round ran, then pulses once. */
function WaysIn({ model }: { model: WaysInModel }) {
    const ok = useMotionOK();
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-3 sm:px-7 pt-6">
                <svg viewBox="0 0 600 340" className="w-full h-auto max-w-[620px] mx-auto block" aria-hidden="true">
                    {model.spokes.map((s, i) => {
                        const p = SPOKE_END[i % SPOKE_END.length];
                        const d = 0.2 + i * 0.45;
                        const pulse: Variants = {
                            hidden: { cx: C.x, cy: C.y, opacity: 0 },
                            show: { cx: [C.x, p.x], cy: [C.y, p.y], opacity: [0, 1, 0], transition: { duration: 0.9, delay: d + 0.5, ease: 'easeInOut' } },
                        };
                        const mid = { x: (C.x + p.x) / 2, y: (C.y + p.y) / 2 };
                        return (
                            <g key={s.system}>
                                <m.line x1={C.x} y1={C.y} x2={p.x} y2={p.y} stroke="var(--color-text-primary)" strokeOpacity={0.25} strokeWidth={1.2} variants={drawAt} custom={d} />
                                {ok && <m.circle r={4} fill={ACCENT} variants={pulse} />}
                                <rect x={mid.x - 15} y={mid.y - 10} width={30} height={20} rx={2} fill="var(--color-surface)" stroke="var(--color-text-primary)" strokeOpacity={0.12} />
                                <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={ACCENT} className="font-display">{String(i + 1).padStart(2, '0')}</text>
                                <Bead cx={p.x} cy={p.y} r={17} color={COPPER} />
                                <text x={p.x} y={i === 2 ? p.y + 40 : p.y - 28} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-text-primary)" className="font-display">{s.system}</text>
                            </g>
                        );
                    })}
                    <Bead cx={C.x} cy={C.y} r={25} color={ACCENT} />
                    <text x={C.x} y={C.y - 38} textAnchor="middle" fontSize={15} fontWeight={600} fill={ACCENT} className="font-display">{model.centre}</text>
                </svg>
            </Beat>
            <Beat className="px-5 sm:px-7 pt-4 pb-6 grid gap-3 sm:grid-cols-3">
                {model.spokes.map((s, i) => (
                    <BeatItem key={s.system} className="rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                        <div className="label-mono !text-[10px] mb-1.5"><span className="!text-accent">{String(i + 1).padStart(2, '0')}</span> · {s.when}</div>
                        <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{s.system}</div>
                        <p className="mt-1.5 text-ink" style={small}>{s.tested}</p>
                        <p className="mt-1.5 text-ink-soft" style={small}>{s.roles}</p>
                        <p className="mt-1.5 label-mono !text-[10px] !text-ink">{s.sessions}</p>
                    </BeatItem>
                ))}
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Model swap */

const slideIn: Variants = {
    hidden: { x: 24, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.6, ease: EXPO, delay: 1.1 } },
};
const landLast = (delay: number): Variants => ({
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO, delay } },
});

const slab = 'rounded-xs border px-3 py-2.5 h-full break-words';

function Connector({ changed }: { changed?: boolean }) {
    const line = changed ? 'border-accent/60' : 'border-dashed border-ink/25';
    return (
        <div className="hidden sm:flex items-center gap-1.5" aria-hidden="true">
            <span className={cn('flex-1 border-t', line)} />
            <span className={cn('label-mono !text-[9px]', changed && '!text-accent')}>{changed ? 'changed' : 'same'}</span>
            <span className={cn('flex-1 border-t', line)} />
        </div>
    );
}

/** Two identical stacks; only the model layer is swapped, and the verdict follows it. */
function ModelSwap({ model }: { model: SwapModel }) {
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2">
                <BeatItem className="label-mono !text-[10px]">Before</BeatItem>
                <div className="hidden sm:block" />
                <BeatItem className="label-mono !text-[10px]">After</BeatItem>
                {model.same.map((s) => (
                    <SwapRow key={s} left={<div className={cn(slab, 'border-ink/10 bg-surface/70 text-ink')} style={small}>{s}</div>}
                        right={<div className={cn(slab, 'border-ink/10 bg-surface/70 text-ink')} style={small}>{s}</div>} />
                ))}
                <SwapRow
                    changed
                    left={<div className={cn(slab, 'border-ink/15 border-dashed text-ink-soft font-semibold')} style={small}>{model.before.model}</div>}
                    right={
                        <m.div variants={slideIn} className={cn(slab, 'border-accent bg-accent/[0.06] !text-accent font-semibold')} style={small}>
                            {model.after.model}
                        </m.div>
                    }
                />
                <BeatItem className="pt-3 text-ink-soft" ><p style={small}>{model.before.verdict}</p></BeatItem>
                <div className="hidden sm:block" />
                <BeatItem className="pt-3">
                    <m.p variants={landLast(1.6)} className="text-accent font-semibold" style={small}>{model.after.verdict}</m.p>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

function SwapRow({ left, right, changed }: { left: React.ReactNode; right: React.ReactNode; changed?: boolean }) {
    return (
        <>
            <BeatItem>{left}</BeatItem>
            <Connector changed={changed} />
            <BeatItem>{right}</BeatItem>
        </>
    );
}

/* ------------------------------------------------------------------ Silent failure */

function MockAnswer({ kind }: { kind: 'right' | 'wrong' | 'empty' }) {
    if (kind === 'empty') {
        return <div aria-hidden="true" className="h-14 rounded-xs border border-dashed border-ink/25" />;
    }
    const bars = ['92%', '78%', '64%'];
    return (
        <div aria-hidden="true" className="h-14 rounded-xs border border-ink/10 bg-surface/70 px-3 py-2.5 flex flex-col justify-between">
            {bars.map((w, i) => (
                <span
                    key={w}
                    className={cn('block h-1.5 rounded-xs', kind === 'wrong' && i === 1 ? 'bg-ink/50' : 'bg-ink/15')}
                    style={{ width: w, ...(kind === 'wrong' && i === 1 ? { backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 3px, rgba(246,245,243,.9) 3px 5px)' } : {}) }}
                />
            ))}
        </div>
    );
}

const scan: Variants = {
    hidden: { left: '0%', opacity: 0 },
    show: { left: ['0%', '100%'], opacity: [0, 1, 1, 0], transition: { duration: 1.6, delay: 0.7, ease: 'easeInOut' } },
};

/** Three answers under one question; only the empty one cannot be caught by the person. */
function SilentFailure({ model }: { model: SilentModel }) {
    const ok = useMotionOK();
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="label-mono !text-[10px] mb-3">{model.question}</BeatItem>
                <div className="relative grid gap-3 sm:grid-cols-3">
                    {model.cards.map((c) => (
                        <BeatItem key={c.answer} className={cn('rounded-xs border px-4 py-4 bg-background/50', c.flagged ? 'border-accent/50' : 'border-ink/10')}>
                            <MockAnswer kind={c.mock} />
                            <div className="mt-3 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{c.answer}</div>
                            {c.flagged ? (
                                <m.div variants={landLast(2.2)} className="mt-1.5">
                                    <p className="text-accent font-semibold" style={small}>{c.tell}</p>
                                    {c.badge && (
                                        <span className="mt-2 inline-block rounded-xs border border-accent px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em] !text-accent">
                                            {c.badge}
                                        </span>
                                    )}
                                </m.div>
                            ) : (
                                <p className="mt-1.5 text-ink-soft" style={small}>{c.tell}</p>
                            )}
                        </BeatItem>
                    ))}
                    {ok && <m.span aria-hidden="true" variants={scan} className="pointer-events-none absolute top-0 bottom-0 w-px bg-accent" />}
                </div>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function StoryBlock({ block }: { block: StoryCaseBlock }) {
    switch (block.kind) {
        case 'journey':
            return <Journey model={block.model} />;
        case 'waysin':
            return <WaysIn model={block.model} />;
        case 'swap':
            return <ModelSwap model={block.model} />;
        case 'silent':
            return <SilentFailure model={block.model} />;
    }
}
