'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import type { GaugesModel, TrailModel, ShiftsModel, ItpoBlock } from '@/data/itpoModels';
import { useMotionOK, EXPO } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink, EASE, cssBead, focusRing } from './maturityParts';
import { OfferingMap } from './itpoMap';

/**
 * Interactive instruments for the E2E IT Product Offering case study: the four findings as
 * rings (02), the research trail from evidence to roadmap (03), the offering journey as one
 * map (03, in itpoMap.tsx), and the five shifts of the future state (03). The rings fill as
 * they scroll into view and the beads glide when pressed; reduced motion makes both instant.
 */

/* ------------------------------------------------------------------ Gauges */

/** Four findings, each a share of the people in the research. Press one to read it. */
function Gauges({ model }: { model: GaugesModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const cur = model.stats.find((s) => s.key === k);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {model.stats.map((s) => {
                        const on = s.key === k;
                        return (
                            <button
                                key={s.key}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setK(on ? null : s.key)}
                                className={cn('tap rounded-xs border px-2 py-3 text-center transition-[border-color,background-color] duration-300 ease-out', focusRing, on ? 'border-accent bg-accent/[0.06]' : 'border-ink/15 bg-surface/60 hover:border-accent')}
                            >
                                <svg viewBox="0 0 100 100" className="w-full max-w-[7rem] h-auto mx-auto block" aria-hidden="true">
                                    <circle cx={50} cy={50} r={38} fill="none" stroke={ink} strokeOpacity={0.12} strokeWidth={9} />
                                    <m.circle
                                        cx={50}
                                        cy={50}
                                        r={38}
                                        fill="none"
                                        stroke={ACCENT}
                                        strokeWidth={9}
                                        strokeLinecap="round"
                                        pathLength={100}
                                        transform="rotate(-90 50 50)"
                                        strokeDasharray={`${s.value} 100`}
                                        initial={ok ? { strokeDasharray: '0 100' } : false}
                                        whileInView={{ strokeDasharray: `${s.value} 100` }}
                                        viewport={{ once: true, amount: 0.6 }}
                                        transition={{ duration: 1.1, ease: EXPO, delay: 0.15 }}
                                    />
                                    <text x={50} y={58} textAnchor="middle" fontSize={24} fontWeight={700} fill={ink} className="font-display">{s.value}%</text>
                                </svg>
                                <span className="mt-1.5 block text-ink" style={{ fontSize: 'var(--step--1)', lineHeight: 1.35 }}>{s.label}</span>
                            </button>
                        );
                    })}
                </BeatItem>
                <BeatItem className="mt-3 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <p aria-live="polite" className={cn(cur ? 'text-ink' : 'text-ink-soft')} style={small}>{cur ? cur.line : model.idle}</p>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Trail */

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mixHex = (a: string, b: string, t: number) => {
    const p = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
    return `rgb(${lerp(p(a, 1), p(b, 1), t)},${lerp(p(a, 3), p(b, 3), t)},${lerp(p(a, 5), p(b, 5), t)})`;
};
const TX = (i: number) => 24 + i * 98;
const TH = [150, 128, 106, 86, 66, 48, 34];

/** Six stations, each a narrower channel than the last: wide evidence in, a sequenced roadmap out. */
function Trail({ model }: { model: TrailModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const idx = model.stations.findIndex((s) => s.key === k);
    const cur = idx >= 0 ? model.stations[idx] : null;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Station" value={k ?? ''} onChange={setK} options={model.stations.map((s, i) => ({ value: s.key, label: `${i + 1} · ${s.name}` }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 640 220" className="w-full h-auto max-w-[660px] mx-auto block mt-4" aria-hidden="true">
                        {model.stations.map((s, i) => {
                            const x0 = TX(i);
                            const x1 = x0 + 94;
                            const y = 100;
                            const on = i === idx;
                            const fill = mixHex(ACCENT, COPPER, i / (model.stations.length - 1));
                            return (
                                <g key={s.key} onClick={() => setK(s.key)} style={{ cursor: 'pointer', opacity: idx < 0 || on ? 1 : 0.5, transition: ok ? 'opacity 300ms ease-out' : 'none' }}>
                                    <polygon points={`${x0},${y - TH[i] / 2} ${x1},${y - TH[i + 1] / 2} ${x1},${y + TH[i + 1] / 2} ${x0},${y + TH[i] / 2}`} fill={fill} fillOpacity={0.92} stroke={on ? ink : 'none'} strokeWidth={2} />
                                    <text x={(x0 + x1) / 2} y={y + 6} textAnchor="middle" fontSize={20} fontWeight={700} fill="#fff" className="font-display">{i + 1}</text>
                                    <text x={(x0 + x1) / 2} y={y + TH[i] / 2 + 22} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 600} fill={ink} className="font-display">{s.name}</text>
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
                                <div className="label-mono !text-[10px]">Station {idx + 1} of {model.stations.length}</div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink" style={small}>{cur.line}</p>
                                {cur.facts.length > 0 && (
                                    <ul className="list-none m-0 mt-2.5 p-0 flex flex-wrap gap-1.5">
                                        {cur.facts.map((f) => (
                                            <li key={f} className="inline-block rounded-xs border border-ink/15 px-2 py-0.5 label-mono !text-[10px] !tracking-[0.06em] !text-ink-soft">{f}</li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Shifts */

/** Five shifts. Press one and its bead glides from the problem to the principle. */
function Shifts({ model }: { model: ShiftsModel }) {
    const ok = useMotionOK();
    const [done, setDone] = useState<Record<string, boolean>>({});
    const on = model.shifts.filter((s) => done[s.key]);
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem className="space-y-2">
                    {model.shifts.map((s) => {
                        const d = !!done[s.key];
                        return (
                            <button
                                key={s.key}
                                type="button"
                                aria-pressed={d}
                                onClick={() => setDone((x) => ({ ...x, [s.key]: !x[s.key] }))}
                                className={cn('tap grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-3 rounded-xs border px-3 py-3 text-left transition-[border-color,background-color] duration-300 ease-out', focusRing, d ? 'border-accent/60 bg-accent/[0.05]' : 'border-ink/15 bg-surface/60 hover:border-accent')}
                            >
                                <span className={cn('text-right font-display', d ? 'text-ink-soft line-through decoration-ink/30' : 'text-ink font-semibold')} style={small}>{s.from}</span>
                                <span className="relative block h-6" aria-hidden="true">
                                    <span className="absolute left-0 right-0 top-1/2 border-t border-dashed border-ink/30" />
                                    <span
                                        className="absolute top-0 h-6 w-6 rounded-full"
                                        style={{
                                            left: d ? 'calc(100% - 24px)' : '0%',
                                            background: d ? cssBead({ hi: '#7f9df0', mid: ACCENT, rim: '#00226f' }) : cssBead({ hi: '#e6ad8a', mid: COPPER, rim: '#a86943' }),
                                            transition: ok ? `left 800ms ${EASE}` : 'none',
                                        }}
                                    />
                                </span>
                                <span className={cn('font-display', d ? 'text-accent font-bold' : 'text-ink-soft')} style={small}>{s.to}</span>
                            </button>
                        );
                    })}
                </BeatItem>
                <BeatItem className="mt-3 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {on.length === 0 && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        <ul className="list-none m-0 p-0 space-y-1.5">
                            {on.map((s) => (
                                <li key={s.key} style={small}><span className="text-ink font-semibold">{s.to} over {s.from.toLowerCase()}: </span><span className="text-ink-soft">{s.line}</span></li>
                            ))}
                        </ul>
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}

/* ------------------------------------------------------------------ Dispatcher */

export function ItpoInstrument({ block }: { block: ItpoBlock }) {
    switch (block.kind) {
        case 'gauges':
            return <Gauges model={block.model} />;
        case 'offering':
            return <OfferingMap model={block.model} />;
        case 'trail':
            return <Trail model={block.model} />;
        case 'shifts':
            return <Shifts model={block.model} />;
    }
}

