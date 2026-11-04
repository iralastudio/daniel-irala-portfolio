'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import type { DayModel, MethodModel, RulerModel } from '@/data/maturityModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink, focusRing } from './maturityParts';

/**
 * The workshop-side instruments for the UX maturity case study: scrub one workshop day
 * (03), switch evidence on and off to see why the assessment uses both (03), and read the
 * same team on one ruler or two (04). Illustrations only, nothing here carries a score.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';
const DAY_COLOURS = [ACCENT, COPPER, GROUP[3]];

/* ------------------------------------------------------------------ Day track */

/** One day on a slider. Drag, or use the arrow keys, and the day's own movements light up as you pass them. */
function DayTrack({ model }: { model: DayModel }) {
    const ok = useMotionOK();
    const n = model.sessions.length;
    const [i, setI] = useState(0);
    const s = model.sessions[i];
    const colour = DAY_COLOURS[s.group % DAY_COLOURS.length];
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap gap-x-5 gap-y-1.5 mb-5">
                    {model.groups.map((g, k) => (
                        <span key={g} className="flex items-center gap-2 label-mono !text-[10px]">
                            <span className="h-2 w-2 rounded-full" style={{ background: DAY_COLOURS[k % DAY_COLOURS.length] }} aria-hidden="true" />
                            {g}
                        </span>
                    ))}
                </BeatItem>
                <BeatItem>
                    <div className="relative h-16 mx-2" aria-hidden="true">
                        <div className="absolute left-0 right-0 top-[22px] border-t border-ink/25" />
                        <div
                            className="absolute left-0 top-[22px] border-t-2"
                            style={{ width: `${(i / (n - 1)) * 100}%`, borderColor: colour, transition: ok ? 'width 300ms ease-out, border-color 300ms ease-out' : 'none' }}
                        />
                        {model.sessions.map((se, k) => {
                            const c = DAY_COLOURS[se.group % DAY_COLOURS.length];
                            const passed = k <= i;
                            return (
                                <div key={se.time} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${(k / (n - 1)) * 100}%` }}>
                                    <span
                                        className="mx-auto block rounded-full border-2"
                                        style={{
                                            width: k === i ? 22 : 12,
                                            height: k === i ? 22 : 12,
                                            marginTop: k === i ? 0 : 5,
                                            background: passed ? c : 'var(--color-surface)',
                                            borderColor: c,
                                            transition: ok ? 'all 300ms ease-out' : 'none',
                                        }}
                                    />
                                    <span className={cn('mt-2 label-mono !text-[9px] sm:!text-[10px]', k === i ? '!text-ink' : 'hidden sm:block')}>{se.time}</span>
                                </div>
                            );
                        })}
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={n - 1}
                        step={1}
                        value={i}
                        onChange={(e) => setI(Number(e.target.value))}
                        aria-label="Workshop session"
                        aria-valuetext={`${s.time}, ${s.title}`}
                        className={cn('tap w-full accent-accent cursor-pointer', focusRing)}
                    />
                </BeatItem>
                <BeatItem className="mt-4 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono !text-[10px]">{s.time}</span>
                            <span className={chip} style={{ borderColor: colour, color: colour }}>{model.groups[s.group]}</span>
                        </div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{s.title}</div>
                        {s.detail && <p className="mt-1.5 text-ink-soft" style={small}>{s.detail}</p>}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Method */

/** Two sources of evidence as switches. Each alone leaves something out; together they feed one result. */
function Method({ model }: { model: MethodModel }) {
    const ok = useMotionOK();
    const [on, setOn] = useState({ quiz: false, interviews: false });
    const key = on.quiz && on.interviews ? 'both' : on.quiz ? 'quiz' : on.interviews ? 'interviews' : 'none';
    const count = Number(on.quiz) + Number(on.interviews);
    const src = [
        { k: 'quiz' as const, y: 38 },
        { k: 'interviews' as const, y: 112 },
    ];
    const t = { transition: ok ? 'opacity 400ms ease-out' : 'none' };
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="grid gap-3 sm:grid-cols-2">
                    {model.parts.map((p) => {
                        const pressed = on[p.key];
                        return (
                            <button
                                key={p.key}
                                type="button"
                                aria-pressed={pressed}
                                onClick={() => setOn((o) => ({ ...o, [p.key]: !o[p.key] }))}
                                className={cn(
                                    'tap text-left rounded-xs border px-4 py-3.5 transition-[background-color,border-color] duration-300 ease-out',
                                    focusRing,
                                    pressed ? 'border-accent bg-accent/[0.06]' : 'border-ink/15 bg-surface/60 hover:border-accent'
                                )}
                            >
                                <span className="flex items-center justify-between gap-3">
                                    <span className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{p.title}</span>
                                    <span className={cn(chip, pressed ? 'bg-accent border-accent !text-white' : 'border-ink/15 !text-ink-soft')}>{pressed ? 'On' : 'Off'}</span>
                                </span>
                                <span className="mt-1.5 block text-ink-soft" style={small}>{p.line}</span>
                                <span className="mt-1.5 block label-mono !text-[10px]">{p.duration}</span>
                            </button>
                        );
                    })}
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 150" className="w-full h-auto max-w-[620px] mx-auto block mt-4" aria-hidden="true">
                        {src.map((s) => (
                            <line key={s.k} x1={120} y1={s.y} x2={480} y2={75} stroke={ACCENT} strokeWidth={1.6} style={{ ...t, opacity: on[s.k] ? 0.7 : 0.12 }} strokeDasharray={on[s.k] ? undefined : '4 4'} />
                        ))}
                        {src.map((s) => (
                            <Bead key={s.k} cx={100} cy={s.y} r={16} color={COPPER} hollow={!on[s.k]} />
                        ))}
                        <text x={100} y={67} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.75} className="font-display">Quiz</text>
                        <text x={100} y={142} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.75} className="font-display">Interviews</text>
                        <Bead cx={500} cy={75} r={count === 2 ? 30 : count === 1 ? 20 : 14} color={ACCENT} hollow={count === 0} />
                        <text x={500} y={125} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.75} className="font-display">What it tells you</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <p aria-live="polite" className={cn(key === 'both' ? 'text-ink font-semibold' : 'text-ink-soft')} style={small}>
                        {model.states[key]}
                    </p>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Ruler */

const Y0 = 34;
const Y1 = 214;
const LX = 150;
const RX = 450;
const ticksY = (count: number) => Array.from({ length: count }, (_, k) => Y0 + (k * (Y1 - Y0)) / (count - 1));

/** The same team read twice. On one scale you can say what moved; on another, the ruler moved too. */
function Ruler({ model }: { model: RulerModel }) {
    const ok = useMotionOK();
    const [mode, setMode] = useState<'same' | 'different'>('same');
    const left = ticksY(model.now.length);
    const rightNames = mode === 'same' ? model.now : model.later;
    const right = ticksY(rightNames.length);
    const by = left[model.baseline];
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg
                        label="Scale used the second time"
                        value={mode}
                        onChange={setMode}
                        options={[
                            { value: 'same', label: model.modes.same },
                            { value: 'different', label: model.modes.different },
                        ]}
                    />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 240" className="w-full h-auto max-w-[620px] mx-auto block mt-4" aria-hidden="true">
                        <text x={LX} y={14} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fill={ink} fillOpacity={0.75} className="font-display">{model.heads.then.toUpperCase()}</text>
                        <text x={RX} y={14} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fill={ink} fillOpacity={0.75} className="font-display">{model.heads.later.toUpperCase()}</text>
                        <line x1={LX} y1={Y0} x2={LX} y2={Y1} stroke={ink} strokeOpacity={0.3} />
                        {left.map((y, k) => (
                            <g key={model.now[k]}>
                                <line x1={LX - 8} y1={y} x2={LX + 8} y2={y} stroke={ink} strokeOpacity={0.5} />
                                <text x={LX - 16} y={y + 4} textAnchor="end" fontSize={12} fill={ink} fillOpacity={k === model.baseline ? 1 : 0.65} fontWeight={k === model.baseline ? 700 : 400} className="font-display">{model.now[k]}</text>
                            </g>
                        ))}
                        <m.g key={mode} initial={ok ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: ok ? 0.4 : 0 }}>
                            <line x1={RX} y1={Y0} x2={RX} y2={Y1} stroke={ink} strokeOpacity={0.3} />
                            {right.map((y, k) => (
                                <g key={rightNames[k]}>
                                    <line x1={RX - 8} y1={y} x2={RX + 8} y2={y} stroke={ink} strokeOpacity={0.5} />
                                    <text x={RX + 16} y={y + 4} textAnchor="start" fontSize={12} fill={ink} fillOpacity={mode === 'same' && k === model.baseline ? 1 : 0.65} fontWeight={mode === 'same' && k === model.baseline ? 700 : 400} className="font-display">{rightNames[k]}</text>
                                </g>
                            ))}
                            {mode === 'same' ? (
                                <>
                                    <line x1={LX + 12} y1={by} x2={RX - 12} y2={by} stroke={ACCENT} strokeWidth={1.8} />
                                    <Bead cx={RX} cy={by} r={11} color={ACCENT} />
                                </>
                            ) : (
                                <>
                                    <line x1={LX + 12} y1={by} x2={RX - 36} y2={by} stroke={ACCENT} strokeWidth={1.6} strokeDasharray="4 4" />
                                    <Bead cx={RX - 24} cy={by} r={11} color={ACCENT} hollow />
                                    <text x={RX - 24} y={by + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={ACCENT} className="font-display">?</text>
                                </>
                            )}
                        </m.g>
                        <Bead cx={LX} cy={by} r={11} color={ACCENT} />
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <p aria-live="polite" className={cn(mode === 'same' ? 'text-ink font-semibold' : 'text-ink-soft')} style={small}>
                        {model.captions[mode]}
                    </p>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

export { DayTrack, Method, Ruler };
