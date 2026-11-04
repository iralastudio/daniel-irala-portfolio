'use client';

import { useState } from 'react';
import type { TriageModel, HardGateModel, FunnelModel } from '@/data/agentModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, StepButton, small, ink, EASE } from './maturityParts';

/**
 * The three instruments about failure, for the Digital Agent case study: ask why one
 * symptom splits into three causes (triage), send three answers past a person and a gate
 * (hard gate), and find where the survey funnel leaked. Illustrations of behaviour, never
 * of data: nothing here is sized by a number.
 */

/* ------------------------------------------------------------------ Triage */

const CAUSE_X = [110, 300, 490];
const CAUSE_COLOUR = [COPPER, GROUP[4], GROUP[3]];

/** One symptom. Press "ask why" and it splits into three causes, each with its own fix and owner. */
function Triage({ model }: { model: TriageModel }) {
    const ok = useMotionOK();
    const [asked, setAsked] = useState(false);
    const [k, setK] = useState<string | null>(null);
    const fade = (v: boolean, delay = 0) => ({ opacity: v ? 1 : 0, transition: ok ? `opacity 500ms ease-out ${delay}ms` : 'none' });
    const cur = model.causes.find((c) => c.key === k);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <StepButton
                        onClick={() => {
                            setAsked(!asked);
                            setK(null);
                        }}
                    >
                        {asked ? 'Put it back' : model.ask}
                    </StepButton>
                    {asked && (
                        <Seg label="Cause" value={k ?? ''} onChange={setK} options={model.causes.map((c) => ({ value: c.key, label: c.name }))} />
                    )}
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 250" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {model.causes.map((c, i) => (
                            <g key={c.key} style={{ ...fade(asked, i * 120), opacity: asked ? (!k || k === c.key ? 1 : 0.35) : 0 }}>
                                <path d={`M 300 58 C 300 100, ${CAUSE_X[i]} 90, ${CAUSE_X[i]} 128`} fill="none" stroke={CAUSE_COLOUR[i]} strokeWidth={k === c.key ? 2.4 : 1.4} />
                                <Bead cx={CAUSE_X[i]} cy={146} r={17} color={CAUSE_COLOUR[i]} />
                                <text x={CAUSE_X[i]} y={186} textAnchor="middle" fontSize={13} fontWeight={600} fill={ink} className="font-display">{c.name}</text>
                                <line x1={CAUSE_X[i]} y1={194} x2={CAUSE_X[i]} y2={208} stroke={ink} strokeOpacity={0.4} />
                                <rect x={CAUSE_X[i] - 88} y={208} width={176} height={26} rx={2} fill="var(--color-surface)" stroke={CAUSE_COLOUR[i]} strokeOpacity={0.7} />
                                <text x={CAUSE_X[i]} y={225} textAnchor="middle" fontSize={11} fill={ink} className="font-display">{c.owner}</text>
                            </g>
                        ))}
                        <Bead cx={300} cy={40} r={20} color={ACCENT} hollow={asked} />
                        <text x={300 + 34} y={45} fontSize={14} fontWeight={700} fill={ink} className="font-display">{model.symptom}</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{asked ? 'Pick a cause to see what the user sees, what it is, what fixes it and who owns it.' : 'To a frustrated user every failure looks the same. Ask why.'}</p>}
                        {cur && (
                            <dl className="m-0 grid gap-x-4 gap-y-2 sm:grid-cols-[9rem_1fr]" style={small}>
                                {([['What the user sees', cur.sees], ['What it actually is', cur.is], ['What fixes it', cur.fix], ['Who owns it', cur.owner]] as const).map(([t, v]) => (
                                    <div key={t} className="contents">
                                        <dt className="label-mono !text-[10px] pt-1">{t}</dt>
                                        <dd className="m-0 text-ink">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Hard gate */

const LANE_Y = [60, 120, 180];
const START = 70;
const END = 536;
const GATE_X = 200;
const EYE_X = 340;

/** Three answers walk past a person. Only the empty one slips through unseen, until a gate stops it first. */
function HardGate({ model }: { model: HardGateModel }) {
    const ok = useMotionOK();
    const [gate, setGate] = useState<'off' | 'on'>('off');
    const [ran, setRan] = useState(false);
    const dest = (mock: 'right' | 'wrong' | 'empty') => (!ran ? START : mock === 'right' ? END : mock === 'wrong' ? EYE_X - 34 : gate === 'on' ? GATE_X - 30 : END);
    const out = (mock: 'right' | 'wrong' | 'empty') => (mock === 'right' ? model.outcomes.right : mock === 'wrong' ? model.outcomes.wrong : gate === 'on' ? model.outcomes.emptyOn : model.outcomes.emptyOff);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg label="Hard gate" value={gate} onChange={setGate} options={[{ value: 'off', label: 'No hard gate' }, { value: 'on', label: 'Hard gate on' }]} />
                    <StepButton onClick={() => setRan(!ran)}>{ran ? 'Reset' : 'Send them through →'}</StepButton>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 230" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <text x={EYE_X} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={ink} className="font-display">{model.person}</text>
                        <g style={{ opacity: gate === 'on' ? 1 : 0.18, transition: ok ? 'opacity 400ms ease-out' : 'none' }}>
                            <text x={GATE_X} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT} className="font-display">{model.gate}</text>
                            <rect x={GATE_X - 4} y={24} width={8} height={186} rx={1} fill={ACCENT} />
                        </g>
                        <g>
                            <ellipse cx={EYE_X} cy={118} rx={16} ry={9} fill="none" stroke={ink} strokeWidth={1.5} />
                            <circle cx={EYE_X} cy={118} r={3.5} fill={ink} />
                            <line x1={EYE_X} y1={28} x2={EYE_X} y2={106} stroke={ink} strokeOpacity={0.25} strokeDasharray="3 5" />
                            <line x1={EYE_X} y1={130} x2={EYE_X} y2={206} stroke={ink} strokeOpacity={0.25} strokeDasharray="3 5" />
                        </g>
                        {model.answers.map((a, i) => (
                            <g key={a.label}>
                                <line x1={START} y1={LANE_Y[i]} x2={END} y2={LANE_Y[i]} stroke={ink} strokeOpacity={0.18} strokeDasharray="4 5" />
                                <text x={START - 22} y={LANE_Y[i] - 26} fontSize={12} fontWeight={600} fill={ink} className="font-display">{a.label}</text>
                                <g style={{ transform: `translate(${dest(a.mock)}px, ${LANE_Y[i]}px)`, transition: ok ? `transform 1400ms ${EASE}` : 'none' }}>
                                    <Bead cx={0} cy={0} r={14} color={a.mock === 'wrong' ? COPPER : ACCENT} hollow={a.mock === 'empty'} />
                                </g>
                            </g>
                        ))}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!ran && <p className="text-ink-soft" style={small}>{model.captions[gate]}</p>}
                        {ran && (
                            <ul className="list-none m-0 p-0 space-y-1.5">
                                {model.answers.map((a) => (
                                    <li key={a.label} style={small} className={cn(a.mock === 'empty' ? 'text-ink font-semibold' : 'text-ink-soft')}>
                                        <span className="text-ink font-semibold">{a.label}: </span>{out(a.mock)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Funnel */

const STAGE_X = (i: number) => 20 + i * 148;

/** Four equal pipes. Follow one query down them and see which one it drips out of. */
function Funnel({ model }: { model: FunnelModel }) {
    const ok = useMotionOK();
    const [at, setAt] = useState(-1);
    const [sel, setSel] = useState(model.leak);
    const n = model.stages.length;
    const next = () => {
        const to = at >= n - 1 ? -1 : at + 1;
        setAt(to);
        if (to >= 0) setSel(to);
    };
    const s = model.stages[sel];
    const cx = (i: number) => STAGE_X(i) + 62;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg label="Stage" value={String(sel)} onChange={(v) => setSel(Number(v))} options={model.stages.map((x, i) => ({ value: String(i), label: x.name }))} />
                    <StepButton onClick={next}>{at >= n - 1 ? 'Start again' : at < 0 ? 'Follow a query →' : 'Next stage →'}</StepButton>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 190" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {model.stages.map((st, i) => (
                            <g key={st.name}>
                                {i < n - 1 && <line x1={STAGE_X(i) + 124} y1={72} x2={STAGE_X(i + 1)} y2={72} stroke={ink} strokeOpacity={0.35} strokeDasharray="3 4" />}
                                <rect x={STAGE_X(i)} y={46} width={124} height={52} rx={2} fill={sel === i ? ACCENT : 'var(--color-surface)'} fillOpacity={sel === i ? 0.08 : 1} stroke={sel === i ? ACCENT : ink} strokeOpacity={sel === i ? 1 : 0.3} strokeWidth={sel === i ? 1.6 : 1} style={{ transition: ok ? 'all 300ms ease-out' : 'none' }} />
                                <text x={cx(i)} y={77} textAnchor="middle" fontSize={14} fontWeight={600} fill={ink} className="font-display">{st.name}</text>
                            </g>
                        ))}
                        <g style={{ transform: `translate(${at < 0 ? 0 : cx(at)}px, 72px)`, opacity: at < 0 ? 0 : 1, transition: ok ? `transform 800ms ${EASE}, opacity 300ms ease-out` : 'none' }}>
                            <Bead cx={0} cy={-34} r={11} color={ACCENT} />
                        </g>
                        <g style={{ opacity: at >= model.leak ? 1 : 0, transition: ok ? 'opacity 400ms ease-out 500ms' : 'none' }}>
                            <Bead cx={cx(model.leak)} cy={146} r={10} color={COPPER} hollow />
                            <path d={`M ${cx(model.leak)} 100 v 26`} stroke={COPPER} strokeWidth={1.6} strokeDasharray="2 4" />
                            <text x={cx(model.leak) + 20} y={150} fontSize={12} fontWeight={700} fill={COPPER} className="font-display">The leak</text>
                        </g>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono !text-[10px]">Stage {sel + 1} of {n}</span>
                            {sel === model.leak && <span className="inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]" style={{ borderColor: COPPER, color: COPPER }}>The leak</span>}
                        </div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{s.name}</div>
                        <p className="mt-1.5 text-ink-soft" style={small}>{s.line}</p>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

export { Triage, HardGate, Funnel };
