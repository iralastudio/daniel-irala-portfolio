'use client';

import { useState } from 'react';
import { m, type Variants } from 'framer-motion';
import type { FieldModel, ClocksModel, GuardrailModel } from '@/data/keyModels';
import { useMotionOK, EXPO } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink, focusRing } from './maturityParts';

/**
 * The three larger instruments for the IT Key Roles case study: the field of scored
 * opportunities and what became of each, four dials for where each role stands, and the
 * architects' guardrail on a review. Beads and dials fill in as they scroll into view; a
 * filter, a dial or a step opens the detail. Only the opportunity counts the page already
 * states are drawn.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';
const pop: Variants = {
    hidden: { opacity: 0, scale: 0.3 },
    show: (i: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.4, ease: EXPO, delay: i * 0.018 } }),
};
const box = { transformBox: 'fill-box', transformOrigin: 'center' } as const;

/* ------------------------------------------------------------------ Field */

type Status = 'case' | 'dropped' | 'backlog';
const FCX = [86, 230, 380];
const FCOLS = [3, 4, 3];
const GAP = 24;

/**
 * Every scored opportunity as a bead, grouped by role, followed through four steps. First all
 * 41 are just scored. Then the seven signed off light up. Then one of them drops out. Then the
 * six that remain carry a business case, and the other 34 stay in the backlog.
 */
function Field({ model }: { model: FieldModel }) {
    const ok = useMotionOK();
    const [i, setI] = useState(0);
    const step = model.steps[i];
    let seq = 0;
    const lay = (on: boolean, delay: number) => ({ opacity: on ? 1 : 0, transition: ok ? `opacity 450ms ease-out ${delay}ms` : 'none' });
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg className="justify-center" label="Step" value={String(i)} onChange={(v) => setI(Number(v))} options={model.steps.map((x, k) => ({ value: String(k), label: x.label }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 250" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {model.roles.map((r, ri) => (
                            <g key={r.key}>
                                {Array.from({ length: r.total }, (_, k) => {
                                    const st: Status = k < r.case ? 'case' : k < r.case + r.dropped ? 'dropped' : 'backlog';
                                    const cols = FCOLS[ri];
                                    const x = FCX[ri] + ((k % cols) - (cols - 1) / 2) * GAP;
                                    const y = 44 + Math.floor(k / cols) * GAP;
                                    const n = seq++;
                                    const d = ri * 90 + k * 30;
                                    const neutral = st === 'backlog' ? (i === 3 ? 0.5 : 1) : i === 0 ? 1 : 0;
                                    const accent = st === 'case' ? i >= 1 : st === 'dropped' ? i === 1 : false;
                                    const gone = st === 'dropped' && i >= 2;
                                    return (
                                        <m.g key={k} variants={pop} custom={n} style={box}>
                                            <g style={lay(neutral > 0, d)}>
                                                <circle cx={x} cy={y} r={7.5} fill={ink} fillOpacity={0.22 * neutral} />
                                            </g>
                                            <g style={lay(accent, d)}>
                                                <Bead cx={x} cy={y} r={9} color={ACCENT} />
                                            </g>
                                            <g style={lay(st === 'case' && i === 3, d)}>
                                                <circle cx={x} cy={y} r={13} fill="none" stroke={ACCENT} strokeOpacity={0.55} />
                                            </g>
                                            <g style={lay(gone, 0)}>
                                                <Bead cx={x} cy={y} r={9} color={COPPER} hollow />
                                                <line x1={x - 7} y1={y + 7} x2={x + 7} y2={y - 7} stroke={COPPER} strokeWidth={1.8} strokeLinecap="round" />
                                            </g>
                                        </m.g>
                                    );
                                })}
                                <text x={FCX[ri]} y={202} textAnchor="middle" fontSize={12} fontWeight={700} fill={ink} className="font-display">{r.name}</text>
                                <text x={FCX[ri]} y={220} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.75} className="font-display">{r.total} scored</text>
                            </g>
                        ))}
                        <rect x={478} y={30} width={102} height={150} rx={2} fill="none" stroke={ink} strokeOpacity={0.4} strokeDasharray="5 5" />
                        <text x={529} y={110} textAnchor="middle" fontSize={20} fill={ink} fillOpacity={0.4} className="font-display">?</text>
                        <text x={529} y={202} textAnchor="middle" fontSize={12} fontWeight={700} fill={ink} className="font-display">{model.discovery.name}</text>
                        <text x={529} y={220} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.75} className="font-display">in discovery</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="label-mono !text-[10px]">Step {i + 1} of {model.steps.length}</div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{step.headline}</div>
                        <p className="mt-1.5 text-ink-soft" style={small}>{step.line}</p>
                        {i === 0 && <p className="mt-1.5 text-ink-soft" style={small}>{model.discovery.line}</p>}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Clocks */

const D = 62;
const DR = 42;
const ang = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
const pt = (i: number) => ({ x: D + DR * Math.cos(ang(i)), y: D + DR * Math.sin(ang(i)) });
const sweep: Variants = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.9, ease: EXPO, delay: 0.3 } } };

/** Four dials, one per role, six stages round each. A filled bead means that stage is done for that role. */
function Clocks({ model }: { model: ClocksModel }) {
    const [k, setK] = useState<string | null>(null);
    const cur = model.roles.find((r) => r.key === k);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {model.roles.map((r) => {
                        const on = r.key === k;
                        const end = pt(r.stage);
                        const start = pt(0);
                        return (
                            <button
                                key={r.key}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setK(on ? null : r.key)}
                                className={cn('tap rounded-xs border px-2 py-3 text-center transition-[border-color,background-color] duration-300 ease-out', focusRing, on ? 'border-accent bg-accent/[0.06]' : 'border-ink/15 bg-surface/60 hover:border-accent')}
                            >
                                <svg viewBox="0 0 124 124" className="w-full max-w-[8rem] h-auto mx-auto block" aria-hidden="true">
                                    <circle cx={D} cy={D} r={DR} fill="none" stroke={ink} strokeOpacity={0.18} strokeDasharray="3 4" />
                                    {r.stage > 0 && (
                                        <m.path d={`M ${start.x} ${start.y} A ${DR} ${DR} 0 ${r.stage * 60 > 180 ? 1 : 0} 1 ${end.x} ${end.y}`} fill="none" stroke={ACCENT} strokeWidth={2.4} variants={sweep} />
                                    )}
                                    {model.stages.map((s, i) => {
                                        const p = pt(i);
                                        return (
                                            <m.g key={s} variants={pop} custom={i * 5} style={box}>
                                                <Bead cx={p.x} cy={p.y} r={9} color={ACCENT} hollow={i > r.stage} />
                                                <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize={9} fontWeight={700} fill={i > r.stage ? ACCENT : '#fff'} className="font-display">{i + 1}</text>
                                            </m.g>
                                        );
                                    })}
                                    <text x={D} y={D + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={ink} className="font-display">{r.stage + 1}/{model.stages.length}</text>
                                </svg>
                                <span className="mt-1 block font-display font-semibold text-ink" style={small}>{r.name}</span>
                                <span className="block label-mono !text-[10px] mt-1">{model.stages[r.stage]}</span>
                            </button>
                        );
                    })}
                </BeatItem>
                <BeatItem className="mt-3 flex flex-wrap gap-x-4 gap-y-1 label-mono !text-[10px]">
                    {model.stages.map((s, i) => (
                        <span key={s}><span className="!text-accent">{i + 1}</span> {s}</span>
                    ))}
                </BeatItem>
                <BeatItem className="mt-3 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {cur && (
                            <>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={chip} style={{ borderColor: ACCENT, color: ACCENT }}>{model.stages[cur.stage]}</span>
                                </div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink-soft" style={small}>{cur.status}</p>
                                <ul className="list-none m-0 mt-2.5 p-0 flex flex-wrap gap-1.5">
                                    {cur.facts.map((x) => (
                                        <li key={x} className={cn(chip, 'border-ink/15 !text-ink-soft')}>{x}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Guardrail */

const GX = [70, 200, 330, 470];
const BLOCK = 'blocked';
const twoLines = (name: string) => {
    const w = name.split(' ');
    if (w.length < 3) return [name];
    const cut = Math.ceil(w.length / 2);
    return [w.slice(0, cut).join(' '), w.slice(cut).join(' ')];
};

/** The review flow the architects agreed: the agent helps up to the review, a human stays for the review, and auto-approval is out of bounds. */
function Guardrail({ model }: { model: GuardrailModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const step = model.steps.find((s) => s.key === k);
    const blocked = k === BLOCK;
    const colour = (by: 'agent' | 'human') => (by === 'agent' ? ACCENT : GROUP[3]);
    const fade = (on: boolean) => ({ opacity: !k || on ? 1 : 0.4, transition: ok ? 'opacity 300ms ease-out' : 'none' });
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Step" value={k ?? ''} onChange={setK} options={[...model.steps.map((s) => ({ value: s.key, label: s.name })), { value: BLOCK, label: model.blocked.name }]} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 250" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <path d="M 40 40 V 32 H 372 V 40" fill="none" stroke={ACCENT} strokeWidth={1.6} />
                        <text x={206} y={22} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fontWeight={700} fill={ACCENT} className="font-display">{model.labels.agent.toUpperCase()}</text>
                        <path d="M 428 40 V 32 H 512 V 40" fill="none" stroke={GROUP[3]} strokeWidth={1.6} />
                        <text x={470} y={22} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fontWeight={700} fill={GROUP[3]} className="font-display">{model.labels.human.toUpperCase()}</text>
                        {model.steps.slice(0, -1).map((s, i) => (
                            <line key={s.key} x1={GX[i] + 26} y1={92} x2={GX[i + 1] - 26} y2={92} stroke={ink} strokeOpacity={0.35} strokeWidth={1.6} />
                        ))}
                        {model.steps.map((s, i) => {
                            const on = s.key === k;
                            return (
                                <g key={s.key} onClick={() => setK(s.key)} style={{ cursor: 'pointer', ...fade(on) }}>
                                    <Bead cx={GX[i]} cy={92} r={on ? 26 : 22} color={colour(s.by)} />
                                    <text x={GX[i]} y={97} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff" className="font-display">{i + 1}</text>
                                    {twoLines(s.name).map((ln, li) => (
                                        <text key={li} x={GX[i]} y={142 + li * 16} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 600} fill={ink} className="font-display">{ln}</text>
                                    ))}
                                </g>
                            );
                        })}
                        <g onClick={() => setK(BLOCK)} style={{ cursor: 'pointer', ...fade(blocked) }}>
                            <line x1={GX[3] - 100} y1={196} x2={GX[3] - 30} y2={196} stroke={COPPER} strokeWidth={1.6} strokeDasharray="4 5" />
                            <Bead cx={GX[3]} cy={196} r={20} color={COPPER} hollow />
                            <line x1={GX[3] - 14} y1={210} x2={GX[3] + 14} y2={182} stroke={COPPER} strokeWidth={2.6} strokeLinecap="round" />
                            <text x={GX[3] + 32} y={200} fontSize={12} fontWeight={700} fill={COPPER} className="font-display">{model.blocked.name}</text>
                        </g>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!k && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {step && (
                            <>
                                <span className={chip} style={{ borderColor: colour(step.by), color: colour(step.by) }}>{step.by === 'agent' ? model.labels.agent : model.labels.human}</span>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{step.name}</div>
                                <p className="mt-1.5 text-ink-soft" style={small}>{step.line}</p>
                            </>
                        )}
                        {blocked && (
                            <>
                                <span className={chip} style={{ borderColor: COPPER, color: COPPER }}>Out of bounds</span>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{model.blocked.name}</div>
                                <p className="mt-1.5 text-ink-soft" style={small}>{model.blocked.line}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

export { Field, Clocks, Guardrail };
