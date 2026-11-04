'use client';

import { useState } from 'react';
import type { RingsModel, DocsModel } from '@/data/synthModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT } from './storyInstruments';
import { Seg, small, ink, focusRing } from './maturityParts';

/**
 * The two stacked structures in the Synthetic Users case study: concentric layers of what a
 * persona is built from, and the documents that govern the practice. Press a layer or a
 * document to open it.
 */

const RING_R = [76, 112, 148, 184];
const RING_COLOUR = [ACCENT, GROUP[1], GROUP[3], GROUP[4]];

/** Four layers around one persona. The nearest is who it represents; the furthest is the organisation around them. */
export function Rings({ model }: { model: RingsModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const cur = model.rings.find((r) => r.key === k);
    const idx = model.rings.findIndex((r) => r.key === k);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Layer" value={k ?? ''} onChange={setK} options={model.rings.map((r) => ({ value: r.key, label: r.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 384" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        {model.rings.map((r, i) => {
                            const on = i === idx;
                            const rad = RING_R[i];
                            return (
                                <g key={r.key} onClick={() => setK(r.key)} style={{ cursor: 'pointer' }}>
                                    <circle cx={300} cy={192} r={rad} fill="none" stroke={RING_COLOUR[i]} strokeWidth={on ? 3.4 : 1.6} strokeOpacity={!cur || on ? 0.9 : 0.3} style={{ transition: ok ? 'stroke-width 300ms ease-out, stroke-opacity 300ms ease-out' : 'none' }} />
                                    <circle cx={300} cy={192} r={rad} fill="none" stroke="transparent" strokeWidth={22} pointerEvents="stroke" />
                                    <rect x={300 - 62} y={192 - rad - 9} width={124} height={18} rx={2} fill="var(--color-surface)" />
                                    <text x={300} y={192 - rad + 4} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 600} fill={ink} fillOpacity={!cur || on ? 1 : 0.55} className="font-display">{r.name}</text>
                                </g>
                            );
                        })}
                        <Bead cx={300} cy={192} r={40} color={ACCENT} />
                        <text x={300} y={176} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff" className="font-display">{model.centre}</text>
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {cur && (
                            <>
                                <div className="label-mono !text-[10px]">Layer {idx + 1} of {model.rings.length}, from the persona outwards</div>
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

/** The documents that govern the practice. One is open at a time, with what it contains. */
export function Docs({ model }: { model: DocsModel }) {
    const [k, setK] = useState(model.docs[0].key);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 space-y-2">
                {model.docs.map((d, i) => {
                    const on = d.key === k;
                    return (
                        <BeatItem key={d.key} className={cn('rounded-xs border transition-[border-color,background-color] duration-300 ease-out', on ? 'border-accent/60 bg-accent/[0.04]' : 'border-ink/15 bg-surface/60')}>
                            <button
                                type="button"
                                aria-expanded={on}
                                onClick={() => setK(d.key)}
                                className={cn('tap flex w-full items-center gap-3 px-4 py-3 text-left rounded-xs', focusRing)}
                            >
                                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="shrink-0">
                                    <Bead cx={9} cy={9} r={8} color={RING_COLOUR[i % RING_COLOUR.length]} />
                                </svg>
                                <span className="flex-1 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>{d.name}</span>
                                <span className="label-mono !text-[10px] shrink-0">{d.when}</span>
                            </button>
                            {on && (
                                <div className="px-4 pb-4 pl-[3.25rem]">
                                    <p className="text-ink" style={small}>{d.line}</p>
                                    <ul className="list-none m-0 mt-2 p-0 space-y-1">
                                        {d.contains.map((c) => (
                                            <li key={c} className="text-ink-soft flex gap-2" style={small}>
                                                <span aria-hidden="true" className="text-accent">·</span>
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </BeatItem>
                    );
                })}
            </Beat>
        </Instrument>
    );
}
