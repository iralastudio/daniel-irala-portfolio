'use client';

import { useState } from 'react';
import type { EvidenceModel, GroundingModel, GovMapModel, SynthBlock } from '@/data/synthModels';
import { useMotionOK } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink } from './maturityParts';
import { Rings, Docs } from './synthStack';

/**
 * Explorable diagrams for the Synthetic Users case study: the evidence ladder (01), where
 * an answer's content comes from (02), the map of rules that already exist and what was
 * missing (02), and, in synthStack.tsx, the layers a persona is built from and the
 * documents that govern it (03). Press a part to read what it is. Same bead language as the
 * map; reduced motion makes every change instant.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';

/* ------------------------------------------------------------------ Evidence ladder */

const RUNG_Y = [250, 175, 70];
const WALL_Y = 122;

/** Three rungs and a wall. A synthetic user can reach the first two; only real research crosses the line to the third. */
function Evidence({ model }: { model: EvidenceModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const cur = model.rungs.find((r) => r.key === k);
    const fade = { transition: ok ? 'opacity 300ms ease-out' : 'none' };
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Rung" value={k ?? ''} onChange={setK} options={model.rungs.map((r) => ({ value: r.key, label: r.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 310" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <line x1={250} y1={28} x2={250} y2={290} stroke={ink} strokeOpacity={0.4} strokeWidth={2} />
                        <line x1={330} y1={28} x2={330} y2={290} stroke={ink} strokeOpacity={0.4} strokeWidth={2} />
                        <line x1={36} y1={WALL_Y} x2={564} y2={WALL_Y} stroke={ink} strokeOpacity={0.6} strokeWidth={1.6} strokeDasharray="7 6" />
                        <text x={564} y={WALL_Y - 8} textAnchor="end" fontSize={11} letterSpacing="0.06em" fill={ink} fillOpacity={0.8} className="font-display">{model.labels.wall.toUpperCase()}</text>
                        <path d="M 112 168 H 104 V 262 H 112" fill="none" stroke={ACCENT} strokeWidth={1.8} />
                        <text x={94} y={206} textAnchor="end" fontSize={12} fontWeight={600} fill={ACCENT} className="font-display">{model.labels.synthetic[0]}</text>
                        <text x={94} y={222} textAnchor="end" fontSize={12} fontWeight={600} fill={ACCENT} className="font-display">{model.labels.synthetic[1]}</text>
                        <path d="M 112 52 H 104 V 90 H 112" fill="none" stroke={COPPER} strokeWidth={1.8} />
                        <text x={94} y={66} textAnchor="end" fontSize={12} fontWeight={600} fill={COPPER} className="font-display">{model.labels.real[0]}</text>
                        <text x={94} y={82} textAnchor="end" fontSize={12} fontWeight={600} fill={COPPER} className="font-display">{model.labels.real[1]}</text>
                        {model.rungs.map((r, i) => {
                            const y = RUNG_Y[i];
                            const on = k === r.key;
                            return (
                                <g key={r.key} onClick={() => setK(r.key)} style={{ cursor: 'pointer', ...fade, opacity: !k || on ? 1 : 0.45 }}>
                                    <line x1={250} y1={y} x2={330} y2={y} stroke={r.real ? COPPER : ACCENT} strokeWidth={4} strokeLinecap="round" />
                                    <Bead cx={290} cy={y} r={on ? 20 : 16} color={r.real ? COPPER : ACCENT} />
                                    <text x={362} y={y + 5} fontSize={15} fontWeight={on ? 700 : 600} fill={ink} className="font-display">{r.name}</text>
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
                                    <span className={cn(chip, cur.real ? '!text-ink border-ink/40' : 'border-accent !text-accent')}>{cur.real ? 'Only real research' : 'A synthetic user can reach it'}</span>
                                </div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink" style={small}>{cur.line}</p>
                                <p className="mt-1.5 text-ink-soft" style={small}>{cur.use}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Grounding */

/** Our research and general AI knowledge both feed one answer. Switch the setting and see which feeds still run. */
function Grounding({ model }: { model: GroundingModel }) {
    const ok = useMotionOK();
    const [on, setOn] = useState<'off' | 'on'>('off');
    const t = { transition: ok ? 'opacity 400ms ease-out, stroke-width 400ms ease-out' : 'none' };
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <div className="label-mono !text-[10px] mb-2">{model.setting.label}</div>
                    <Seg label={model.setting.label} value={on} onChange={setOn} options={[{ value: 'off', label: model.setting.off }, { value: 'on', label: model.setting.on }]} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 220" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <path d="M 130 60 C 260 60, 330 110, 462 110" fill="none" stroke={ACCENT} strokeWidth={3} style={t} />
                        <path d="M 130 160 C 260 160, 330 110, 462 110" fill="none" stroke={COPPER} strokeWidth={on === 'on' ? 1.4 : 3} strokeDasharray={on === 'on' ? '5 5' : undefined} style={t} />
                        <Bead cx={100} cy={60} r={22} color={ACCENT} />
                        <Bead cx={100} cy={160} r={22} color={COPPER} />
                        <Bead cx={490} cy={110} r={28} color={ACCENT} />
                        <text x={100} y={106} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.sources[0].name}</text>
                        <text x={100} y={206} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{model.sources[1].name}</text>
                        <text x={490} y={158} textAnchor="middle" fontSize={12} fontWeight={700} fill={ink} className="font-display">{model.answer}</text>
                        {on === 'on' && <text x={320} y={176} textAnchor="middle" fontSize={12} fontWeight={700} fill={COPPER} className="font-display">Still leaks in</text>}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <p className="text-ink font-semibold" style={small}>{model.outcomes[on]}</p>
                        <ul className="list-none m-0 mt-2 p-0 space-y-1">
                            {model.sources.map((s) => (
                                <li key={s.key} className="text-ink-soft" style={small}><span className="text-ink font-semibold">{s.name}: </span>{s.line}</li>
                            ))}
                        </ul>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Governance map */

const GC = { x: 300, y: 160 };
const RX = 136;
const RY = 118;
const place = (deg: number) => ({ x: GC.x + RX * Math.cos((deg * Math.PI) / 180), y: GC.y + RY * Math.sin((deg * Math.PI) / 180) });

/** The rules that already existed on one side, what was missing on the other, and synthetic users in the middle. */
function GovMap({ model }: { model: GovMapModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const have = model.nodes.filter((n) => n.group === 'have');
    const missing = model.nodes.filter((n) => n.group === 'missing');
    const pos: Record<string, { x: number; y: number; left: boolean }> = {};
    for (const [i, n] of have.entries()) pos[n.key] = { ...place(130 + (i * 100) / Math.max(1, have.length - 1)), left: true };
    for (const [i, n] of missing.entries()) pos[n.key] = { ...place(-50 + (i * 100) / Math.max(1, missing.length - 1)), left: false };
    const cur = model.nodes.find((n) => n.key === k);
    const fade = { transition: ok ? 'opacity 300ms ease-out' : 'none' };
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="flex flex-wrap gap-x-8 gap-y-4">
                    <div>
                        <div className="label-mono !text-[10px] mb-2">{model.groups.have}</div>
                        <Seg label={model.groups.have} value={cur?.group === 'have' ? cur.key : ''} onChange={setK} options={have.map((n) => ({ value: n.key, label: n.name }))} />
                    </div>
                    <div>
                        <div className="label-mono !text-[10px] mb-2">{model.groups.missing}</div>
                        <Seg label={model.groups.missing} value={cur?.group === 'missing' ? cur.key : ''} onChange={setK} options={missing.map((n) => ({ value: n.key, label: n.name }))} />
                    </div>
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 320" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <text x={100} y={20} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fill={ACCENT} className="font-display">{model.groups.have.toUpperCase()}</text>
                        <text x={500} y={20} textAnchor="middle" fontSize={11} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{model.groups.missing.toUpperCase()}</text>
                        {model.nodes.map((n) => {
                            const p = pos[n.key];
                            const isHave = n.group === 'have';
                            return <line key={n.key} x1={GC.x} y1={GC.y} x2={p.x} y2={p.y} stroke={isHave ? ACCENT : COPPER} strokeWidth={k === n.key ? 2.4 : 1.2} strokeDasharray={isHave ? undefined : '5 5'} style={{ ...fade, opacity: !k || k === n.key ? 0.6 : 0.15 }} />;
                        })}
                        <Bead cx={GC.x} cy={GC.y} r={30} color={ACCENT} />
                        <text x={GC.x} y={GC.y + 52} textAnchor="middle" fontSize={13} fontWeight={700} fill={ink} className="font-display">{model.centre}</text>
                        {model.nodes.map((n) => {
                            const p = pos[n.key];
                            const isHave = n.group === 'have';
                            return (
                                <g key={n.key} onClick={() => setK(n.key)} style={{ cursor: 'pointer', ...fade, opacity: !k || k === n.key ? 1 : 0.4 }}>
                                    <Bead cx={p.x} cy={p.y} r={k === n.key ? 17 : 14} color={isHave ? ACCENT : COPPER} hollow={!isHave} />
                                    <text x={p.left ? p.x - 22 : p.x + 22} y={p.y + 4} textAnchor={p.left ? 'end' : 'start'} fontSize={12} fontWeight={600} fill={ink} className="font-display">{n.name}</text>
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
                                <span className={cn(chip, cur.group === 'have' ? 'border-accent !text-accent' : 'border-dashed border-ink/30 !text-ink-soft')}>
                                    {cur.group === 'have' ? model.groups.have : model.groups.missing}
                                </span>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink-soft" style={small}>{cur.line}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function SynthInstrument({ block }: { block: SynthBlock }) {
    switch (block.kind) {
        case 'evidence':
            return <Evidence model={block.model} />;
        case 'grounding':
            return <Grounding model={block.model} />;
        case 'govmap':
            return <GovMap model={block.model} />;
        case 'rings':
            return <Rings model={block.model} />;
        case 'docs':
            return <Docs model={block.model} />;
    }
}
