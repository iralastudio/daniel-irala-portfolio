'use client';

import { useId, useState } from 'react';
import { m, type Variants } from 'framer-motion';
import type { RippleModel, GapsModel, SixChainModel, FixesModel, KeyBlock } from '@/data/keyModels';
import { useMotionOK, EXPO } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink } from './maturityParts';
import { Field, Clocks, Guardrail } from './keyField';
import { Atlas } from './keyAtlas';

/**
 * Explorable diagrams for the IT Key Roles Journey Atlas case study: weaken a link and watch
 * the weakness travel down the chain (01), read one gap from three desks (02), follow the six
 * selections as one chain (02), and, in keyField.tsx, the field of opportunities, the four
 * clocks and the architects' guardrail (03). Press a part to read it. Same bead language as
 * the map; reduced motion turns every glide and every draw into an instant change.
 */

const ROLE_COLOUR = [ACCENT, COPPER, GROUP[3]];
const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';

/* ------------------------------------------------------------------ Ripple */

const LX = [110, 300, 490];

/** Three links in one chain. Press one to make it the weak link and see what lands on the others. */
function Ripple({ model }: { model: RippleModel }) {
    const ok = useMotionOK();
    const [w, setW] = useState<number | null>(null);
    const stressed = (i: number) => w !== null && i >= w;
    const t = (i: number) => ({ transition: ok ? `opacity 400ms ease-out ${w === null ? 0 : (i - w) * 280}ms` : 'none' });
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg label="The weak link" value={w === null ? '' : String(w)} onChange={(v) => setW(Number(v))} options={model.links.map((l, i) => ({ value: String(i), label: l.role }))} />
                    {w !== null && (
                        <button type="button" onClick={() => setW(null)} className="tap rounded-sm border border-ink/15 bg-surface/60 px-3 py-1.5 text-ink transition-[border-color] duration-300 ease-out hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" style={small}>
                            All links clear
                        </button>
                    )}
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 180" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {[0, 1].map((i) => (
                            <g key={i}>
                                <line x1={LX[i] + 26} y1={80} x2={LX[i + 1] - 26} y2={80} stroke={ACCENT} strokeWidth={2} style={{ ...t(i + 1), opacity: stressed(i + 1) ? 0 : 0.7 }} />
                                <line x1={LX[i] + 26} y1={80} x2={LX[i + 1] - 26} y2={80} stroke={COPPER} strokeWidth={2.4} strokeDasharray="5 5" style={{ ...t(i + 1), opacity: stressed(i + 1) ? 1 : 0 }} />
                            </g>
                        ))}
                        {model.links.map((l, i) => {
                            const bad = stressed(i);
                            return (
                                <g key={l.key}>
                                    <g style={{ ...t(i), opacity: bad ? 0 : 1 }}><Bead cx={LX[i]} cy={80} r={24} color={ACCENT} /></g>
                                    <g style={{ ...t(i), opacity: bad ? 1 : 0 }}><Bead cx={LX[i]} cy={80} r={24} color={COPPER} hollow /></g>
                                    <text x={LX[i]} y={134} textAnchor="middle" fontSize={13} fontWeight={600} fill={ink} className="font-display">{l.role}</text>
                                </g>
                            );
                        })}
                        {w !== null && <text x={LX[w]} y={36} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fontWeight={700} fill={COPPER} className="font-display">WEAK LINK</text>}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {w === null && (
                            <ul className="list-none m-0 p-0 space-y-1.5">
                                {model.links.map((l) => (
                                    <li key={l.key} style={small}><span className="text-ink font-semibold">{l.role}: </span><span className="text-ink-soft">{l.hands}</span></li>
                                ))}
                            </ul>
                        )}
                        {w !== null && (
                            <ul className="list-none m-0 p-0 space-y-1.5">
                                {model.links.slice(w).map((l) => (
                                    <li key={l.key} style={small}><span className="text-ink font-semibold">{l.role}: </span><span className="text-ink">{l.bad}</span></li>
                                ))}
                            </ul>
                        )}
                        {w === null && <p className="mt-2 text-ink-soft" style={small}>{model.idle}</p>}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Gaps */

const RY = [46, 110, 174];
const draw: Variants = { hidden: { pathLength: 0 }, show: (d: number) => ({ pathLength: 1, transition: { duration: 0.7, ease: EXPO, delay: d } }) };

/** One gap, three desks. Pick the gap, and the three roles' versions of it converge on a single bead. */
function Gaps({ model }: { model: GapsModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState(model.gaps[0].key);
    const gap = model.gaps.find((g) => g.key === k)!;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Capability gap" value={k} onChange={setK} options={model.gaps.map((g) => ({ value: g.key, label: g.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 220" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <m.g key={k} initial={ok ? 'hidden' : false} animate="show">
                            {model.roles.map((r, i) => (
                                <m.path key={r} d={`M 214 ${RY[i]} C 320 ${RY[i]}, 340 110, 410 110`} fill="none" stroke={ROLE_COLOUR[i]} strokeWidth={2.2} variants={draw} custom={i * 0.15} />
                            ))}
                        </m.g>
                        {model.roles.map((r, i) => (
                            <g key={r}>
                                <Bead cx={192} cy={RY[i]} r={20} color={ROLE_COLOUR[i]} />
                                <text x={164} y={RY[i] + 4} textAnchor="end" fontSize={12} fontWeight={600} fill={ink} className="font-display">{r}</text>
                            </g>
                        ))}
                        <Bead cx={440} cy={110} r={28} color={ACCENT} />
                        <text x={440} y={166} textAnchor="middle" fontSize={14} fontWeight={700} fill={ink} className="font-display">{gap.name}</text>
                        <text x={440} y={184} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.7} className="font-display">One problem</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 grid gap-3 sm:grid-cols-3">
                    {model.roles.map((r, i) => (
                        <m.div key={`${k}-${r}`} initial={ok ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: ok ? 0.45 : 0, delay: ok ? i * 0.1 : 0 }} className="rounded-xs border border-ink/10 bg-surface/70 px-3.5 py-3">
                            <div className="label-mono !text-[10px] mb-1.5" style={{ color: ROLE_COLOUR[i] }}>{r}</div>
                            <p aria-live="polite" className="text-ink" style={small}>{gap.cells[i]}</p>
                        </m.div>
                    ))}
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Six-step chain */

const CX = (i: number, n: number) => 50 + (i * 500) / (n - 1);

/** The six selected opportunities as one chain. Press a step to see whose it is and what it does. */
function SixChain({ model }: { model: SixChainModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const n = model.steps.length;
    const idx = model.steps.findIndex((s) => s.key === k);
    const colour = (role: string) => ROLE_COLOUR[model.roles.findIndex((r) => r.key === role)];
    const cur = idx >= 0 ? model.steps[idx] : null;
    const gid = `six-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
                    {model.roles.map((r, i) => (
                        <span key={r.key} className="flex items-center gap-2 label-mono !text-[10px]">
                            <span className="h-2 w-2 rounded-full" style={{ background: ROLE_COLOUR[i] }} aria-hidden="true" />
                            {r.name}
                        </span>
                    ))}
                </BeatItem>
                <BeatItem>
                    <Seg label="Step" value={k ?? ''} onChange={setK} options={model.steps.map((s) => ({ value: s.key, label: s.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 130" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <defs>
                            <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1={CX(0, n)} y1={0} x2={CX(n - 1, n)} y2={0}>
                                <stop offset="0%" stopColor={ACCENT} />
                                <stop offset="50%" stopColor={GROUP[3]} />
                                <stop offset="100%" stopColor={COPPER} />
                            </linearGradient>
                        </defs>
                        <line x1={CX(0, n)} y1={56} x2={CX(n - 1, n)} y2={56} stroke={`url(#${gid})`} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
                        <line x1={CX(0, n)} y1={56} x2={CX(Math.max(idx, 0), n)} y2={56} stroke={`url(#${gid})`} strokeWidth={3.4} strokeLinecap="round" style={{ transition: ok ? 'all 600ms cubic-bezier(0.16,1,0.3,1)' : 'none', opacity: idx >= 0 ? 1 : 0 }} />
                        {model.steps.map((s, i) => {
                            const on = i === idx;
                            return (
                                <g key={s.key} onClick={() => setK(s.key)} style={{ cursor: 'pointer', opacity: idx < 0 || on ? 1 : 0.5, transition: ok ? 'opacity 300ms ease-out' : 'none' }}>
                                    <Bead cx={CX(i, n)} cy={56} r={on ? 22 : 17} color={colour(s.role)} />
                                    <text x={CX(i, n)} y={61} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff" className="font-display">{i + 1}</text>
                                    <text x={CX(i, n)} y={104} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 600} fill={ink} className="font-display">{s.name}</text>
                                </g>
                            );
                        })}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {cur && (
                            <>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="label-mono !text-[10px]">Step {idx + 1} of {n}</span>
                                    <span className={chip} style={{ borderColor: colour(cur.role), color: colour(cur.role) }}>{model.roles.find((r) => r.key === cur.role)?.name}</span>
                                </div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}: {cur.opportunity}</div>
                                <p className="mt-1.5 text-ink-soft" style={small}>{cur.line}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Four kinds of fix */

const FIX_COLOUR = [ACCENT, COPPER, GROUP[3], GROUP[4]];

/** Four kinds of fix. Only the first is an AI capability; the other three are why a backlog needs typing. */
function Fixes({ model }: { model: FixesModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const idx = model.types.findIndex((t) => t.key === k);
    const cur = idx >= 0 ? model.types[idx] : null;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Kind of fix" value={k ?? ''} onChange={setK} options={model.types.map((t) => ({ value: t.key, label: t.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 150" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <line x1={60} y1={64} x2={540} y2={64} stroke={ink} strokeOpacity={0.2} strokeDasharray="4 5" />
                        {model.types.map((t, i) => {
                            const x = 90 + i * 140;
                            const on = i === idx;
                            return (
                                <g key={t.key} onClick={() => setK(t.key)} style={{ cursor: 'pointer', opacity: idx < 0 || on ? 1 : 0.4, transition: ok ? 'opacity 300ms ease-out' : 'none' }}>
                                    <g style={{ transform: `translateY(${on ? -8 : 0}px)`, transition: ok ? 'transform 400ms cubic-bezier(0.16,1,0.3,1)' : 'none' }}>
                                        <Bead cx={x} cy={64} r={on ? 28 : 22} color={FIX_COLOUR[i]} hollow={i > 0 && !on} />
                                    </g>
                                    <text x={x} y={118} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 600} fill={ink} className="font-display">{t.name}</text>
                                </g>
                            );
                        })}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {cur && (
                            <>
                                <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink" style={small}><span className="label-mono !text-[10px] mr-2">Needs</span>{cur.needs}</p>
                                <p className="mt-1.5 text-ink-soft" style={small}><span className="label-mono !text-[10px] mr-2">So</span>{cur.then}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function KeyInstrument({ block }: { block: KeyBlock }) {
    switch (block.kind) {
        case 'atlas':
            return <Atlas model={block.model} />;
        case 'ripple':
            return <Ripple model={block.model} />;
        case 'gaps':
            return <Gaps model={block.model} />;
        case 'sixchain':
            return <SixChain model={block.model} />;
        case 'field':
            return <Field model={block.model} />;
        case 'clocks':
            return <Clocks model={block.model} />;
        case 'guardrail':
            return <Guardrail model={block.model} />;
        case 'fixes':
            return <Fixes model={block.model} />;
    }
}
