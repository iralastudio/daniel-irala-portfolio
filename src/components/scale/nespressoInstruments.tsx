'use client';

import { useCallback, useId, useMemo, useRef, useState } from 'react';
import type { RelayModel, CorridorModel, WalkModel, NespressoBlock } from '@/data/nespressoModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, StepButton, small, ink, EASE, focusRing } from './maturityParts';
import { Surfaces } from './nespressoSurfaces';

/**
 * Interactive instruments for the Nespresso case study, one idea per section: hand the
 * result on (01), tighten the corridor (02), walk a member's path and open the map of surfaces
 * (03). Same bead language as the map; every control is a real button, nothing autoplays,
 * and reduced motion swaps each glide for an instant change.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';
const PHASE_COLOUR = [ACCENT, COPPER, GROUP[4]];

/* ------------------------------------------------------------------ Relay */

const ST_X = [100, 300, 500];
const A_POS = [{ x: 100, y: 100 }, { x: 300, y: 72 }, { x: 500, y: 100 }];
const B_POS = [{ x: 100, y: 100 }, { x: 300, y: 128 }, { x: 500, y: 100 }];

/** One bead handed along three stations: it starts unsorted, splits by who can act, then lands as one. */
function Relay({ model }: { model: RelayModel }) {
    const ok = useMotionOK();
    const [i, setI] = useState(0);
    const last = model.stations.length - 1;
    const move = (p: { x: number; y: number }) => ({
        transform: `translate(${p.x}px, ${p.y}px)`,
        transition: ok ? `transform 800ms ${EASE}, opacity 500ms ease-out` : 'none',
    });
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg
                        label="Station"
                        value={String(i)}
                        onChange={(v) => setI(Number(v))}
                        options={model.stations.map((s, k) => ({ value: String(k), label: s.title }))}
                    />
                    <StepButton onClick={() => setI(i === last ? 0 : i + 1)}>{i === last ? 'Start again' : 'Hand it on →'}</StepButton>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 200" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <line x1={ST_X[0]} y1={100} x2={ST_X[last]} y2={100} stroke={ink} strokeOpacity={0.25} strokeDasharray="4 4" />
                        {model.stations.map((s, k) => (
                            <g key={s.title}>
                                <circle cx={ST_X[k]} cy={100} r={5} fill="var(--color-surface)" stroke={ink} strokeOpacity={k <= i ? 0.7 : 0.3} />
                                <text x={ST_X[k]} y={26} textAnchor="middle" fontSize={13} fontWeight={k === i ? 700 : 600} fill={ink} fillOpacity={k === i ? 1 : 0.6} className="font-display">{s.title}</text>
                            </g>
                        ))}
                        <g style={{ ...move(B_POS[i]), opacity: i === 1 ? 1 : 0 }}>
                            <Bead cx={0} cy={0} r={15} color={COPPER} />
                        </g>
                        <g style={move(A_POS[i])}>
                            <Bead cx={0} cy={0} r={i === 2 ? 26 : 15} color={ACCENT} hollow={i === 0} />
                            {i === 2 && <circle cx={0} cy={0} r={36} fill="none" stroke={ACCENT} strokeOpacity={0.6} strokeDasharray="3 4" />}
                        </g>
                        <g style={{ transition: ok ? 'opacity 400ms ease-out' : 'none', opacity: i === 1 ? 1 : 0 }}>
                            <text x={324} y={76} fontSize={12} fill={ACCENT} fontWeight={600} className="font-display">Nespresso can change</text>
                            <text x={324} y={132} fontSize={12} fill={COPPER} fontWeight={600} className="font-display">A partner controls</text>
                        </g>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="label-mono !text-[10px] mb-1">Station {i + 1} of {model.stations.length}</div>
                        <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{model.stations[i].title}</div>
                        <p className="mt-1.5 text-ink-soft" style={small}>{model.stations[i].line}</p>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Corridor */

/** Three constraints, switched on one at a time. Each one narrows the corridor the test has to travel. */
function Corridor({ model }: { model: CorridorModel }) {
    const ok = useMotionOK();
    const id = `hatch-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    const [on, setOn] = useState<Record<string, boolean>>({});
    const active = model.constraints.filter((c) => on[c.key]);
    const fade = (v: boolean) => ({ opacity: v ? 1 : 0, transition: ok ? 'opacity 500ms ease-out' : 'none' });
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="grid gap-2 sm:grid-cols-3">
                    {model.constraints.map((c) => {
                        const pressed = !!on[c.key];
                        return (
                            <button
                                key={c.key}
                                type="button"
                                aria-pressed={pressed}
                                onClick={() => setOn((o) => ({ ...o, [c.key]: !o[c.key] }))}
                                className={cn(
                                    'tap flex items-center justify-between gap-3 text-left rounded-xs border px-3 py-2.5 transition-[background-color,border-color] duration-300 ease-out',
                                    focusRing,
                                    pressed ? 'border-accent bg-accent/[0.06]' : 'border-ink/15 bg-surface/60 hover:border-accent'
                                )}
                                style={small}
                            >
                                <span className="font-display font-semibold text-ink">{c.title}</span>
                                <span className={cn(chip, pressed ? 'bg-accent border-accent !text-white' : 'border-ink/15 !text-ink-soft')}>{pressed ? 'On' : 'Off'}</span>
                            </button>
                        );
                    })}
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 230" className="w-full h-auto max-w-[620px] mx-auto block mt-4" aria-hidden="true">
                        <defs>
                            <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <line x1="0" y1="0" x2="0" y2="8" stroke={ink} strokeOpacity={0.3} strokeWidth="2" />
                            </pattern>
                        </defs>
                        <rect x={0} y={0} width={600} height={18} fill={ink} fillOpacity={0.14} />
                        <rect x={0} y={182} width={600} height={18} fill={ink} fillOpacity={0.14} />
                        <rect x={110} y={18} width={150} height={164} fill={`url(#${id})`} style={fade(!!on.view)} />
                        <rect x={282} y={18} width={44} height={164} fill={ink} fillOpacity={0.08} stroke={ink} strokeOpacity={0.5} strokeDasharray="4 4" style={fade(!!on.catalogue)} />
                        <g style={fade(!!on.time)}>
                            <polygon points="360,18 600,18 600,74" fill={ink} fillOpacity={0.22} />
                            <polygon points="360,182 600,182 600,126" fill={ink} fillOpacity={0.22} />
                        </g>
                        <line x1={64} y1={100} x2={548} y2={100} stroke={ACCENT} strokeOpacity={0.4} strokeDasharray="2 6" />
                        <Bead cx={60} cy={100} r={19} color={ACCENT} />
                        <Bead cx={548} cy={100} r={14} color={ACCENT} hollow />
                        <text x={60} y={222} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">The test</text>
                        <text x={548} y={222} textAnchor="end" fontSize={12} fontWeight={600} fill={ink} className="font-display">Findings the team can act on</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {active.length === 0 && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        <ul className="list-none m-0 p-0 space-y-2">
                            {active.map((c) => (
                                <li key={c.key} className="text-ink" style={small}>
                                    <span className="font-semibold">{c.title}. </span>
                                    <span className="text-ink-soft">{c.effect}</span>
                                </li>
                            ))}
                        </ul>
                        {active.length === model.constraints.length && <p className="mt-3 text-ink font-semibold" style={small}>{model.all}</p>}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Walk */

const WALK_D = 'M 36 150 C 110 30, 190 30, 250 105 S 370 205, 430 115 S 520 35, 566 80';
const ease3 = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** A member's path as a winding line. A bead walks it task by task; the way out is the last stop on purpose. */
function Walk({ model }: { model: WalkModel }) {
    const ok = useMotionOK();
    const n = model.tasks.length;
    const [pathEl, setPathEl] = useState<SVGPathElement | null>(null);
    const [i, setI] = useState(0);
    const [len, setLen] = useState(0);
    const lenRef = useRef(0);
    const raf = useRef(0);
    const geo = useMemo(() => {
        if (!pathEl) return null;
        const total = pathEl.getTotalLength();
        return {
            total,
            stops: model.tasks.map((_, k) => {
                const l = (total * k) / (n - 1);
                const p = pathEl.getPointAtLength(l);
                return { l, x: p.x, y: p.y };
            }),
        };
    }, [pathEl, model.tasks, n]);
    const bindPath = useCallback((el: SVGPathElement | null) => setPathEl(el), []);

    const go = (to: number) => {
        setI(to);
        if (!geo) return;
        const target = geo.stops[to].l;
        cancelAnimationFrame(raf.current);
        if (!ok) {
            lenRef.current = target;
            setLen(target);
            return;
        }
        const from = lenRef.current;
        const t0 = performance.now();
        const step = (t: number) => {
            const k = Math.min(1, (t - t0) / 800);
            lenRef.current = from + (target - from) * ease3(k);
            setLen(lenRef.current);
            if (k < 1) raf.current = requestAnimationFrame(step);
        };
        raf.current = requestAnimationFrame(step);
    };

    const t = model.tasks[i];
    const walker = pathEl && geo ? pathEl.getPointAtLength(Math.min(len, geo.total)) : null;
    const colour = PHASE_COLOUR[t.phase % PHASE_COLOUR.length];
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg
                        label="Task"
                        value={String(i)}
                        onChange={(v) => go(Number(v))}
                        options={model.tasks.map((_, k) => ({ value: String(k), label: `Task ${k + 1}` }))}
                    />
                    <StepButton onClick={() => go(i === n - 1 ? 0 : i + 1)}>{i === n - 1 ? 'Start again' : 'Next task →'}</StepButton>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 230" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <path ref={bindPath} d={WALK_D} fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth={1.5} strokeDasharray="4 5" />
                        {geo && <path d={WALK_D} fill="none" stroke={ACCENT} strokeWidth={2.2} strokeLinecap="round" strokeDasharray={`${Math.min(len, geo.total)} ${geo.total + 20}`} />}
                        {geo?.stops.map((s, k) => {
                            const c = PHASE_COLOUR[model.tasks[k].phase % PHASE_COLOUR.length];
                            return (
                                <g key={model.tasks[k].task} onClick={() => go(k)} style={{ cursor: 'pointer' }}>
                                    <Bead cx={s.x} cy={s.y} r={14} color={c} hollow={k > i} />
                                    <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={k > i ? c : '#fff'} className="font-display">{k + 1}</text>
                                </g>
                            );
                        })}
                        {walker && <circle cx={walker.x} cy={walker.y} r={22} fill="none" stroke={colour} strokeWidth={2} />}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono !text-[10px]">Task {i + 1} of {n}</span>
                            <span className={chip} style={{ borderColor: colour, color: colour }}>{model.phases[t.phase]}</span>
                        </div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{t.task}</div>
                        <p className="mt-1.5 text-ink-soft" style={small}>{t.tells}</p>
                        {t.extra && <p className="mt-2 text-ink font-semibold" style={small}>{t.extra}</p>}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function NespressoInstrument({ block }: { block: NespressoBlock }) {
    switch (block.kind) {
        case 'relay':
            return <Relay model={block.model} />;
        case 'corridor':
            return <Corridor model={block.model} />;
        case 'walk':
            return <Walk model={block.model} />;
        case 'surfaces':
            return <Surfaces model={block.model} />;
    }
}
