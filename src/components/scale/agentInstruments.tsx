'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import type { PatchModel, GatesModel, ChatModel, BarModel, AgentBlock } from '@/data/agentModels';
import { useMotionOK } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, StepButton, small, ink, EASE } from './maturityParts';
import { Triage, HardGate, Funnel } from './agentTriage';

/**
 * Interactive instruments for the Digital Agent case study, one idea per beat: patch the
 * roles to the systems (01), open the gates on the road to launch (01), swap the model
 * under the same question (02), and set the bar before anyone sits down (02). The harder
 * three, triage, hard gate and funnel, live in agentTriage.tsx. Same bead language as the
 * map; every control is a real button and reduced motion makes every glide instant.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';

/* ------------------------------------------------------------------ Patch */

const ROLE_Y = [50, 130, 210];
const RX = 190;
const SX = 410;

/** Roles on the left, systems on the right, and a cable for every pairing that was tested. */
function Patch({ model }: { model: PatchModel }) {
    const ok = useMotionOK();
    const [sel, setSel] = useState<{ kind: 'role' | 'system'; key: string } | null>(null);
    const on = (l: { role: string; system: string }) => !sel || (sel.kind === 'role' ? l.role === sel.key : l.system === sel.key);
    const role = (k: string) => model.roles.find((r) => r.key === k)!;
    const system = (k: string) => model.systems.find((s) => s.key === k)!;
    const sys = sel?.kind === 'system' ? system(sel.key) : null;
    const rows = model.links.filter(on);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                        <div className="label-mono !text-[10px] mb-2">By role</div>
                        <Seg label="By role" value={sel?.kind === 'role' ? sel.key : ''} onChange={(v) => setSel({ kind: 'role', key: v })} options={model.roles.map((r) => ({ value: r.key, label: r.name }))} />
                    </div>
                    <div>
                        <div className="label-mono !text-[10px] mb-2">By system</div>
                        <Seg label="By system" value={sel?.kind === 'system' ? sel.key : ''} onChange={(v) => setSel({ kind: 'system', key: v })} options={model.systems.map((s) => ({ value: s.key, label: s.name }))} />
                    </div>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 260" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {model.links.map((l) => {
                            const y1 = ROLE_Y[model.roles.findIndex((r) => r.key === l.role)];
                            const y2 = ROLE_Y[model.systems.findIndex((s) => s.key === l.system)];
                            return (
                                <path
                                    key={l.role + l.system}
                                    d={`M ${RX + 20} ${y1} C ${RX + 110} ${y1}, ${SX - 110} ${y2}, ${SX - 20} ${y2}`}
                                    fill="none"
                                    stroke={ACCENT}
                                    strokeWidth={on(l) ? 2 : 1.2}
                                    style={{ opacity: on(l) ? (sel ? 0.9 : 0.35) : 0.08, transition: ok ? 'opacity 400ms ease-out' : 'none' }}
                                />
                            );
                        })}
                        {model.roles.map((r, i) => (
                            <g key={r.key} style={{ opacity: !sel || (sel.kind === 'role' ? sel.key === r.key : model.links.some((l) => l.role === r.key && l.system === sel.key)) ? 1 : 0.35, transition: ok ? 'opacity 400ms ease-out' : 'none' }}>
                                <Bead cx={RX} cy={ROLE_Y[i]} r={19} color={ACCENT} />
                                <text x={RX - 30} y={ROLE_Y[i] + 4} textAnchor="end" fontSize={13} fontWeight={600} fill={ink} className="font-display">{r.name}</text>
                            </g>
                        ))}
                        {model.systems.map((s, i) => (
                            <g key={s.key} style={{ opacity: !sel || (sel.kind === 'system' ? sel.key === s.key : model.links.some((l) => l.system === s.key && l.role === sel.key)) ? 1 : 0.35, transition: ok ? 'opacity 400ms ease-out' : 'none' }}>
                                <Bead cx={SX} cy={ROLE_Y[i]} r={19} color={COPPER} />
                                <text x={SX + 30} y={ROLE_Y[i] + 4} textAnchor="start" fontSize={13} fontWeight={600} fill={ink} className="font-display">{s.name}</text>
                            </g>
                        ))}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!sel && <p className="text-ink-soft" style={small}>Pick a role or a system to follow its cables.</p>}
                        {sys && (
                            <>
                                <div className="label-mono !text-[10px] mb-1">{sys.when}</div>
                                <p className="text-ink font-semibold" style={small}>{sys.name}: {sys.tested}</p>
                                <p className="mt-1 text-ink-soft" style={small}>{sys.sessions}</p>
                            </>
                        )}
                        {sel && (
                            <ul className="list-none m-0 mt-2 p-0 space-y-1">
                                {rows.map((l) => (
                                    <li key={l.role + l.system} className="text-ink-soft" style={small}>
                                        <span className="text-ink font-semibold">{sel.kind === 'role' ? system(l.system).name : role(l.role).name}</span>
                                        {': '}{l.seats}
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

/* ------------------------------------------------------------------ Gates */

const GX = (k: number) => 70 + k * 115;
const ANGLE = { go: -78, conditional: -36, planned: 0 } as const;
const GATE_COLOUR = { go: ACCENT, conditional: COPPER, planned: ink } as const;
const VERDICT_WORD = { go: 'Go', conditional: 'Conditional', planned: 'Planned' } as const;

/** Five gates on one road. Drive to a gate and its barrier lifts as far as that verdict allows. */
function Gates({ model }: { model: GatesModel }) {
    const ok = useMotionOK();
    const [i, setI] = useState(0);
    const n = model.gates.length;
    const g = model.gates[i];
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-start gap-3">
                    <Seg label="Gate" value={String(i)} onChange={(v) => setI(Number(v))} options={model.gates.map((x, k) => ({ value: String(k), label: x.when }))} />
                    <StepButton onClick={() => setI(i === n - 1 ? 0 : i + 1)}>{i === n - 1 ? 'Back to the start' : 'Next gate →'}</StepButton>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 190" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <line x1={20} y1={150} x2={580} y2={150} stroke={ink} strokeOpacity={0.3} strokeWidth={1.5} strokeDasharray="6 6" />
                        {model.gates.map((gt, k) => {
                            const reached = k <= i;
                            const v = reached ? gt.verdict : 'planned';
                            const x = GX(k);
                            return (
                                <g key={gt.title}>
                                    <text x={x} y={22} textAnchor="middle" fontSize={12} fontWeight={k === i ? 700 : 600} fill={ink} fillOpacity={k === i ? 1 : 0.6} className="font-display">{gt.when}</text>
                                    <rect x={x - 3} y={100} width={6} height={50} fill={ink} fillOpacity={0.45} />
                                    <line
                                        x1={x}
                                        y1={104}
                                        x2={x + 52}
                                        y2={104}
                                        stroke={reached ? GATE_COLOUR[gt.verdict] : ink}
                                        strokeOpacity={reached ? 1 : 0.35}
                                        strokeWidth={5}
                                        strokeLinecap="round"
                                        strokeDasharray={reached && gt.verdict === 'planned' ? '5 6' : undefined}
                                        style={{
                                            transformOrigin: `${x}px 104px`,
                                            transform: `rotate(${ANGLE[v]}deg)`,
                                            transition: ok ? `transform 900ms ${EASE}, stroke 300ms ease-out` : 'none',
                                        }}
                                    />
                                    <circle cx={x} cy={104} r={5} fill="var(--color-surface)" stroke={ink} strokeOpacity={0.6} />
                                </g>
                            );
                        })}
                        <g style={{ transform: `translate(${GX(i) - 34}px, 134px)`, transition: ok ? `transform 900ms ${EASE}` : 'none' }}>
                            <Bead cx={0} cy={0} r={13} color={ACCENT} />
                        </g>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono !text-[10px]">{g.when}</span>
                            <span className={chip} style={{ borderColor: GATE_COLOUR[g.verdict], color: GATE_COLOUR[g.verdict] }}>{VERDICT_WORD[g.verdict]}</span>
                        </div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{g.title}</div>
                        <p className="mt-1.5 text-ink-soft" style={small}>{g.detail}</p>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Chat */

/**
 * Same test, one layer changed, both answers side by side. Read them first as the person
 * sees them, then switch to what is really going on: the confident answer is the one that
 * looks fine and is wrong.
 */
function Chat({ model }: { model: ChatModel }) {
    const ok = useMotionOK();
    const [view, setView] = useState<'person' | 'real'>('person');
    const real = view === 'real';
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap items-center gap-2">
                    <span className="label-mono !text-[10px] mr-1">Held the same</span>
                    {model.held.map((h) => (
                        <span key={h} className={cn(chip, 'border-ink/15 !text-ink-soft')}>{h}</span>
                    ))}
                    <span className="label-mono !text-[10px] mx-1">·</span>
                    <span className={cn(chip, 'border-accent bg-accent/[0.06] !text-accent')}>{model.changed}</span>
                </BeatItem>
                <BeatItem className="mt-4 rounded-xs border border-dashed border-ink/25 px-3.5 py-2.5">
                    <div className="label-mono !text-[10px] mb-0.5">The situation</div>
                    <p className="text-ink-soft" style={small}>{model.situation}</p>
                    <p className="mt-2 text-ink" style={small}><span className="label-mono !text-[10px] mr-2">Asked</span>{model.question}</p>
                </BeatItem>
                <BeatItem className="mt-4">
                    <Seg label="Reading" value={view} onChange={setView} options={[{ value: 'person', label: model.views.person }, { value: 'real', label: model.views.real }]} />
                </BeatItem>
                <BeatItem className="mt-3 grid gap-3 sm:grid-cols-2">
                    {model.models.map((md) => {
                        const a = md.key === 'a';
                        return (
                            <div key={md.key} className={cn('rounded-xs border px-4 py-4 transition-[border-color,background-color] duration-300 ease-out', real ? (a ? 'border-ink/40 bg-surface/80' : 'border-accent/60 bg-accent/[0.05]') : 'border-ink/10 bg-surface/70')}>
                                <div className="flex items-center gap-2">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 22 22">
                                        <Bead cx={11} cy={11} r={10} color={a ? COPPER : ACCENT} />
                                    </svg>
                                    <span className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{md.name}</span>
                                    <span className="label-mono !text-[10px]">{md.tag}</span>
                                </div>
                                <p className="mt-3 rounded-xs bg-ink/[0.06] px-3 py-2 text-ink" style={small}>{md.answer}</p>
                                <m.div
                                    key={view}
                                    initial={ok ? { opacity: 0, y: 6 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: ok ? 0.35 : 0 }}
                                    aria-live="polite"
                                    className="mt-3"
                                >
                                    <div className="label-mono !text-[10px] mb-1">{real ? model.views.real : model.views.person}</div>
                                    <p className={cn(real ? 'text-ink font-semibold' : 'text-ink-soft')} style={small}>{real ? md.really : md.sees}</p>
                                    {real && <p className={cn('mt-2', a ? 'text-ink' : 'text-accent', 'font-semibold')} style={small}>{md.verdict}</p>}
                                </m.div>
                            </div>
                        );
                    })}
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Bar */

const TX0 = 40;
const TX1 = 560;
const BEAD_X = 300;
const BAR_LO = 232;
const BAR_HI = 388;
const VOICE_X = [170, 430];

/** A use case sits still. Without a bar, the line moves to wherever the loudest voice puts it. */
function Bar({ model }: { model: BarModel }) {
    const ok = useMotionOK();
    const [mode, setMode] = useState<'none' | 'set'>('none');
    const [voice, setVoice] = useState<number | null>(null);
    const t = { transition: ok ? `transform 700ms ${EASE}, opacity 400ms ease-out` : 'none' };
    const lineX = voice === null ? BEAD_X : VOICE_X[voice];
    const verdict = mode === 'set' ? model.captions.verdictSet : voice === null ? 'No verdict yet. Pick a voice.' : model.captions.verdictNone[voice];
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap gap-x-8 gap-y-4">
                    <Seg label="Bar" value={mode} onChange={setMode} options={[{ value: 'none', label: model.modes.none }, { value: 'set', label: model.modes.set }]} />
                    {mode === 'none' && (
                        <Seg
                            label="Who is loudest"
                            value={voice === null ? '' : String(voice)}
                            onChange={(v) => setVoice(Number(v))}
                            options={model.voices.map((x, k) => ({ value: String(k), label: `${x.name}: “${x.says}”` }))}
                        />
                    )}
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 190" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <g style={{ opacity: mode === 'set' ? 1 : 0, transition: ok ? 'opacity 500ms ease-out' : 'none' }}>
                            <rect x={TX0} y={90} width={BAR_LO - TX0} height={22} fill={ink} fillOpacity={0.14} />
                            <rect x={BAR_LO} y={90} width={BAR_HI - BAR_LO} height={22} fill={COPPER} fillOpacity={0.35} />
                            <rect x={BAR_HI} y={90} width={TX1 - BAR_HI} height={22} fill={ACCENT} fillOpacity={0.3} />
                            <text x={(TX0 + BAR_LO) / 2} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.zones[0]}</text>
                            <text x={(BAR_LO + BAR_HI) / 2} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.zones[1]}</text>
                            <text x={(BAR_HI + TX1) / 2} y={140} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.zones[2]}</text>
                            {[BAR_LO, BAR_HI].map((x) => (
                                <g key={x}>
                                    <line x1={x} y1={70} x2={x} y2={122} stroke={ink} strokeWidth={2} />
                                    <rect x={x - 6} y={52} width={12} height={10} rx={1.5} fill={ink} />
                                    <path d={`M ${x - 3.5} 52 v -4 a 3.5 3.5 0 0 1 7 0 v 4`} fill="none" stroke={ink} strokeWidth={1.6} />
                                </g>
                            ))}
                        </g>
                        <g style={{ opacity: mode === 'none' ? 1 : 0, transition: ok ? 'opacity 500ms ease-out' : 'none' }}>
                            <rect x={TX0} y={90} width={TX1 - TX0} height={22} fill={ink} fillOpacity={0.1} stroke={ink} strokeOpacity={0.3} strokeDasharray="4 4" />
                            <text x={TX0} y={140} fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.zones[0]}</text>
                            <text x={TX1} y={140} textAnchor="end" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.zones[2]}</text>
                            <g style={{ transform: `translateX(${lineX}px)`, ...t }}>
                                <line x1={0} y1={64} x2={0} y2={122} stroke={ACCENT} strokeWidth={2} strokeDasharray="3 4" />
                                <text x={0} y={56} textAnchor="middle" fontSize={16} fontWeight={700} fill={ACCENT} className="font-display">?</text>
                            </g>
                        </g>
                        <Bead cx={BEAD_X} cy={101} r={13} color={ACCENT} />
                        <text x={BEAD_X} y={176} textAnchor="middle" fontSize={11} fill={ink} fillOpacity={0.7} className="font-display">A use case, not moving</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <p className="text-ink font-semibold" style={small}>{verdict}</p>
                        <p className="mt-1.5 text-ink-soft" style={small}>{model.captions[mode]}</p>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function AgentInstrument({ block }: { block: AgentBlock }) {
    switch (block.kind) {
        case 'patch':
            return <Patch model={block.model} />;
        case 'gates':
            return <Gates model={block.model} />;
        case 'chat':
            return <Chat model={block.model} />;
        case 'bar':
            return <Bar model={block.model} />;
        case 'triage':
            return <Triage model={block.model} />;
        case 'hardgate':
            return <HardGate model={block.model} />;
        case 'funnel':
            return <Funnel model={block.model} />;
    }
}
