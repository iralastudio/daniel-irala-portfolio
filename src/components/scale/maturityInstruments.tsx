'use client';

import { useState } from 'react';
import type { LadderModel, ChampionModel, RingModel, MaturityBlock } from '@/data/maturityModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink, EASE, cssBead, focusRing } from './maturityParts';
import { DayTrack, Method, Ruler } from './maturityWorkshop';

/**
 * Interactive instruments for the UX maturity case study, one idea per section: climb the
 * scale (01), pull the champion out (02), open the assessment ring (02). Same bead language
 * as the map. Everything responds to a button, nothing autoplays, and reduced motion
 * swaps every glide for an instant change.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';

/* ------------------------------------------------------------------ Ladder */

const STEP = 34;
const BASE = 56;
const GAP = 6;

/** A staircase of stages. A bead stands on the baseline; one press and it climbs to the next step. */
function Ladder({ model }: { model: LadderModel }) {
    const ok = useMotionOK();
    const n = model.stages.length;
    const [sel, setSel] = useState(model.baseline);
    const [at, setAt] = useState(model.baseline);
    const h = (i: number) => BASE + i * STEP;
    const state =
        sel === model.baseline ? 'Baseline' : sel === model.next ? 'Next step' : sel < model.baseline ? 'Behind us' : 'Further ahead';
    const cell = `((100% - ${(n - 1) * GAP}px) / ${n})`;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 pt-6 pb-2">
                <BeatItem className="mb-5">
                    <Seg
                        label="Where the bead stands"
                        value={at === model.baseline ? 'baseline' : 'next'}
                        onChange={(v) => {
                            const to = v === 'baseline' ? model.baseline : model.next;
                            setAt(to);
                            setSel(to);
                        }}
                        options={[
                            { value: 'baseline', label: model.labels.baseline },
                            { value: 'next', label: model.labels.next },
                        ]}
                    />
                </BeatItem>
                <BeatItem>
                    <div className="relative" style={{ height: h(n - 1) + 52 }}>
                        <div
                            aria-hidden="true"
                            className="absolute z-10 h-6 w-6 rounded-full pointer-events-none"
                            style={{
                                left: `calc(${cell} * ${at + 0.5} + ${at * GAP}px)`,
                                bottom: h(at) + 10,
                                transform: 'translateX(-50%)',
                                background: cssBead({ hi: '#7f9df0', mid: ACCENT, rim: '#00226f' }),
                                boxShadow: '0 6px 14px rgba(0,62,215,0.28)',
                                transition: ok ? `left 800ms ${EASE}, bottom 800ms ${EASE}` : 'none',
                            }}
                        />
                        <div className="absolute inset-x-0 bottom-0 grid items-end" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, columnGap: GAP }}>
                            {model.stages.map((s, i) => {
                                const on = i === sel;
                                const reached = i <= model.baseline;
                                return (
                                    <button
                                        key={s.name}
                                        type="button"
                                        aria-pressed={on}
                                        aria-label={`Stage ${i + 1}, ${s.name}`}
                                        onClick={() => setSel(i)}
                                        className={cn(
                                            'relative flex flex-col justify-between rounded-xs border px-1.5 sm:px-2.5 py-2 text-left transition-[background-color,border-color] duration-300 ease-out',
                                            focusRing,
                                            on ? 'border-accent bg-accent/[0.10]' : reached ? 'border-ink/15 bg-surface/80 hover:border-accent' : 'border-dashed border-ink/25 bg-surface/40 hover:border-accent'
                                        )}
                                        style={{ height: h(i) }}
                                    >
                                        <span className="label-mono !text-[10px]">{i + 1}</span>
                                        <span className="hidden sm:block font-display font-semibold text-ink" style={{ fontSize: 'var(--step--1)', lineHeight: 1.2 }}>
                                            {s.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </BeatItem>
                <BeatItem className="mt-5 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <p aria-live="polite" className="text-ink">
                        <span className="font-display font-semibold" style={{ fontSize: 'var(--step-0)' }}>
                            {model.stages[sel].name}
                        </span>{' '}
                        <span className={cn(chip, sel === model.baseline ? 'bg-accent border-accent !text-white' : sel === model.next ? 'border-accent !text-accent' : 'border-ink/15 !text-ink-soft')}>
                            {state}
                        </span>
                    </p>
                    <p className="mt-1.5 text-ink-soft" style={small}>{model.stages[sel].line}</p>
                </BeatItem>
            </Beat>
            <div className="pb-4" />
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Champion */

const TEAM_X = [90, 230, 370, 510];

/** One person linked to four teams. Take them away and see whether the UX goes with them. */
function Champion({ model }: { model: ChampionModel }) {
    const ok = useMotionOK();
    const [mode, setMode] = useState<'emergent' | 'structured'>('emergent');
    const [gone, setGone] = useState(false);
    const st = model.states[mode];
    const fade = { transition: ok ? 'opacity 500ms ease-out' : 'none' };
    const stopped = mode === 'emergent' && gone;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 pt-6">
                <BeatItem className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                        <div className="label-mono !text-[10px] mb-2">How UX is carried</div>
                        <Seg
                            label="How UX is carried"
                            value={mode}
                            onChange={setMode}
                            options={[
                                { value: 'emergent', label: 'By one manager' },
                                { value: 'structured', label: 'By how we work' },
                            ]}
                        />
                    </div>
                    <div>
                        <div className="label-mono !text-[10px] mb-2">The champion</div>
                        <Seg
                            label="The champion"
                            value={gone ? 'gone' : 'here'}
                            onChange={(v) => setGone(v === 'gone')}
                            options={[
                                { value: 'here', label: 'Still here' },
                                { value: 'gone', label: 'Moves on' },
                            ]}
                        />
                    </div>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 310" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {TEAM_X.slice(0, model.teams.length).map((x) => (
                            <line key={x} x1={300} y1={74} x2={x} y2={183} stroke={ink} strokeWidth={1.3} strokeDasharray={gone ? '3 5' : undefined} style={{ ...fade, opacity: gone ? 0.15 : 0.4 }} />
                        ))}
                        <g style={{ ...fade, opacity: mode === 'structured' ? 1 : 0 }}>
                            {TEAM_X.slice(0, model.teams.length).map((x) => (
                                <line key={x} x1={x} y1={217} x2={x} y2={258} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.5} />
                            ))}
                            <rect x={40} y={258} width={520} height={30} rx={2} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeOpacity={0.5} />
                            <text x={300} y={277} textAnchor="middle" fontSize={13} fontWeight={600} fill={ACCENT} className="font-display">{model.shared}</text>
                        </g>
                        <g style={{ ...fade, opacity: gone ? 0.55 : 1 }}>
                            <Bead cx={300} cy={50} r={24} color={ACCENT} hollow={gone} />
                        </g>
                        <text x={300} y={14} textAnchor="middle" fontSize={13} fontWeight={600} fill={ink} className="font-display">{model.champion}</text>
                        {model.teams.map((t, i) => (
                            <g key={t}>
                                <Bead cx={TEAM_X[i]} cy={200} r={17} color={COPPER} hollow={stopped} />
                                <text x={TEAM_X[i]} y={238} textAnchor="middle" fontSize={13} fontWeight={600} fill={ink} fillOpacity={stopped ? 0.55 : 1} className="font-display">{t}</text>
                            </g>
                        ))}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 mb-6 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div className="label-mono !text-[10px] mb-1.5">{st.label}</div>
                    <p aria-live="polite" className={cn('font-semibold', stopped ? 'text-ink' : 'text-ink-soft')} style={small}>
                        {gone ? st.gone : st.here}
                    </p>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Ring */

const R = 88;
const CX = 120;
const polar = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: CX + R * Math.cos(a), y: CX + R * Math.sin(a) };
};
const arcPath = (from: number, to: number) => {
    const a = polar(from);
    const b = polar(to);
    return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`;
};

/** A ring of four factors. Pick one and its arc lights, its sub-factors appear as beads along it. */
function Ring({ model }: { model: RingModel }) {
    const ok = useMotionOK();
    const [i, setI] = useState(0);
    const f = model.factors[i];
    const cols = [ACCENT, COPPER, GROUP[3], GROUP[4]];
    const seg = 360 / model.factors.length;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 grid gap-6 sm:grid-cols-[15rem_minmax(0,1fr)] items-center">
                <BeatItem>
                    <svg viewBox="0 0 240 240" className="w-full max-w-[15rem] h-auto mx-auto block" aria-hidden="true">
                        {model.factors.map((fc, k) => {
                            const from = -90 + k * seg + 4;
                            const to = -90 + (k + 1) * seg - 4;
                            const on = k === i;
                            return (
                                <path
                                    key={fc.factor}
                                    d={arcPath(from, to)}
                                    fill="none"
                                    stroke={on ? cols[k % cols.length] : ink}
                                    strokeOpacity={on ? 1 : 0.14}
                                    strokeWidth={on ? 34 : 26}
                                    strokeLinecap="butt"
                                    onClick={() => setI(k)}
                                    style={{ cursor: 'pointer', transition: ok ? 'stroke-width 300ms ease-out, stroke-opacity 300ms ease-out' : 'none' }}
                                />
                            );
                        })}
                        {f.looked.map((l, k) => {
                            const from = -90 + i * seg + 4;
                            const span = seg - 8;
                            const p = polar(from + (span * (k + 0.5)) / f.looked.length);
                            return <circle key={l} cx={p.x} cy={p.y} r={5} fill="#fff" fillOpacity={0.95} />;
                        })}
                        <text x={CX} y={CX - 4} textAnchor="middle" fontSize={11} letterSpacing="0.1em" fill={ink} fillOpacity={0.7} className="font-display">FACTOR {i + 1} OF {model.factors.length}</text>
                        <text x={CX} y={CX + 18} textAnchor="middle" fontSize={20} fontWeight={700} fill={ink} className="font-display">{f.factor}</text>
                    </svg>
                </BeatItem>
                <BeatItem>
                    <Seg
                        label="Assessed factor"
                        value={f.factor}
                        onChange={(v) => setI(model.factors.findIndex((x) => x.factor === v))}
                        options={model.factors.map((x) => ({ value: x.factor, label: x.factor }))}
                    />
                    <div aria-live="polite">
                        <ul className="list-none m-0 mt-4 p-0 flex flex-wrap gap-1.5">
                            {f.looked.map((l) => (
                                <li key={l} className={cn(chip, 'border-ink/15 !text-ink-soft')}>{l}</li>
                            ))}
                        </ul>
                        <div className="label-mono !text-[10px] mt-4 mb-1">What we saw</div>
                        <p className="text-ink-soft" style={small}>{f.saw}</p>
                        <div className="label-mono !text-[10px] mt-3 mb-1 !text-accent">What we advised</div>
                        <p className="text-ink" style={small}>{f.advised}</p>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function MaturityInstrument({ block }: { block: MaturityBlock }) {
    switch (block.kind) {
        case 'ladder':
            return <Ladder model={block.model} />;
        case 'champion':
            return <Champion model={block.model} />;
        case 'ring':
            return <Ring model={block.model} />;
        case 'day':
            return <DayTrack model={block.model} />;
        case 'method':
            return <Method model={block.model} />;
        case 'ruler':
            return <Ruler model={block.model} />;
    }
}
