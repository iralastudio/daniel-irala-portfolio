'use client';

import { useState } from 'react';
import { m, type Variants } from 'framer-motion';
import type { OfferingModel } from '@/data/itpoModels';
import { useMotionOK, EXPO } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink } from './maturityParts';

/**
 * The offering journey as one map, rebuilt without any of the original's content. Stages run
 * across the top, four lanes of who does what run down, and under each step sit the
 * pain-point themes that cluster there. Press a step to light its column and read what each
 * lane holds. A star marks the three moments that matter.
 */

const LABEL_W = 108;
const X0 = LABEL_W + 4;
const COL = 64;
const CGAP = 3;
const cx = (i: number) => X0 + i * (COL + CGAP);
const LANE_Y = [96, 140, 184, 228];
const LANE_COLOUR = [ACCENT, COPPER, GROUP[3], GROUP[4]];
const PAIN = '#B5483F';
const rise: Variants = { hidden: { opacity: 0, y: 6 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, ease: EXPO, delay: i * 0.05 } }) };

const star = (x: number, y: number, r: number) => {
    const pts = Array.from({ length: 10 }, (_, k) => {
        const a = (-90 + k * 36) * (Math.PI / 180);
        const rad = k % 2 ? r * 0.45 : r;
        return `${x + rad * Math.cos(a)},${y + rad * Math.sin(a)}`;
    });
    return pts.join(' ');
};

export function OfferingMap({ model }: { model: OfferingModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<number | null>(null);
    const n = model.steps.length;
    const cur = k === null ? null : model.steps[k];
    const lane = (key: 'users' | 'front' | 'back' | 'external', i: number) => model.steps[i][key];
    const right = cx(n - 1) + COL;
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Step" value={k === null ? '' : String(k)} onChange={(v) => setK(Number(v))} options={model.steps.map((s, i) => ({ value: String(i), label: `${i + 1} · ${s.name}` }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 656 340" className="w-full h-auto max-w-[720px] mx-auto block mt-4" aria-hidden="true">
                        {k !== null && <rect x={cx(k) - 2} y={34} width={COL + 4} height={282} rx={3} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeOpacity={0.4} style={{ transition: ok ? 'x 400ms cubic-bezier(0.16,1,0.3,1)' : 'none' }} />}

                        {model.stages.map((st, i) => (
                            <m.g key={st.name} variants={rise} custom={i}>
                                <rect x={cx(st.steps[0])} y={4} width={cx(st.steps[1]) + COL - cx(st.steps[0])} height={24} rx={2} fill={ACCENT} fillOpacity={0.9 - i * 0.14} />
                                <text x={(cx(st.steps[0]) + cx(st.steps[1]) + COL) / 2} y={20} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff" className="font-display">{st.name}</text>
                            </m.g>
                        ))}

                        {model.steps.map((s, i) => (
                            <g key={s.key} onClick={() => setK(i)} style={{ cursor: 'pointer' }}>
                                <rect x={cx(i)} y={36} width={COL} height={34} fill="transparent" />
                                <circle cx={cx(i) + COL / 2} cy={54} r={10} fill={k === i ? ACCENT : 'var(--color-surface)'} stroke={ACCENT} strokeWidth={1.4} style={{ transition: ok ? 'fill 300ms ease-out' : 'none' }} />
                                <text x={cx(i) + COL / 2} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={k === i ? '#fff' : ACCENT} className="font-display">{i + 1}</text>
                                {s.moment && <polygon points={star(cx(i) + COL / 2 + 16, 46, 6)} fill={COPPER} />}
                            </g>
                        ))}

                        {model.lanes.map((l, li) => (
                            <g key={l.key}>
                                <line x1={X0} y1={LANE_Y[li] + 18} x2={right} y2={LANE_Y[li] + 18} stroke={ink} strokeOpacity={0.1} />
                                <text x={LABEL_W} y={LANE_Y[li] + 4} textAnchor="end" fontSize={11} fontWeight={600} fill={ink} className="font-display">{l.name}</text>
                                {model.steps.map((s, i) => {
                                    const has = !!lane(l.key, i);
                                    return (
                                        <m.g key={s.key} variants={rise} custom={i + li * 2} onClick={() => setK(i)} style={{ cursor: 'pointer' }}>
                                            {has ? (
                                                <Bead cx={cx(i) + COL / 2} cy={LANE_Y[li]} r={k === i ? 12 : 10} color={LANE_COLOUR[li]} />
                                            ) : (
                                                <circle cx={cx(i) + COL / 2} cy={LANE_Y[li]} r={3} fill={ink} fillOpacity={0.18} />
                                            )}
                                        </m.g>
                                    );
                                })}
                            </g>
                        ))}

                        <text x={LABEL_W} y={268} textAnchor="end" fontSize={11} fontWeight={600} fill={ink} className="font-display">Touchpoints</text>
                        <rect x={X0} y={259} width={right - X0} height={14} rx={7} fill={ink} fillOpacity={0.1} />
                        <text x={(X0 + right) / 2} y={269} textAnchor="middle" fontSize={9.5} fill={ink} fillOpacity={0.75} className="font-display">{model.touchpoints}</text>

                        <text x={LABEL_W} y={302} textAnchor="end" fontSize={11} fontWeight={600} fill={PAIN} className="font-display">Pain points</text>
                        {model.steps.map((s, i) =>
                            s.themes.map((_, t) => (
                                <m.g key={`${s.key}-${t}`} variants={rise} custom={i + t} onClick={() => setK(i)} style={{ cursor: 'pointer' }}>
                                    <circle cx={cx(i) + 14 + (t % 4) * 12} cy={292 + Math.floor(t / 4) * 12} r={4.6} fill={PAIN} fillOpacity={k === null || k === i ? 0.9 : 0.35} style={{ transition: ok ? 'fill-opacity 300ms ease-out' : 'none' }} />
                                </m.g>
                            ))
                        )}
                    </svg>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        {!cur && <p className="text-ink-soft" style={small}>{model.idle}</p>}
                        {cur && k !== null && (
                            <>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="label-mono !text-[10px]">Step {k + 1} of {n}</span>
                                    <span className="inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]" style={{ borderColor: ACCENT, color: ACCENT }}>{model.stages.find((s) => k >= s.steps[0] && k <= s.steps[1])?.name}</span>
                                    {cur.moment && <span className="inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]" style={{ borderColor: COPPER, color: COPPER }}>★ Moment that matters: {cur.moment}</span>}
                                </div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <ul className="list-none m-0 mt-2.5 p-0 space-y-1.5">
                                    {model.lanes.map((l, li) => {
                                        const t = lane(l.key, k);
                                        return t ? (
                                            <li key={l.key} className="flex items-start gap-2.5 text-ink" style={small}>
                                                <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: LANE_COLOUR[li] }} />
                                                <span><span className="font-semibold">{l.name}: </span><span className="text-ink-soft">{t}</span></span>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                                {cur.themes.length > 0 && (
                                    <ul className="list-none m-0 mt-3 p-0 flex flex-wrap gap-1.5">
                                        {cur.themes.map((t) => (
                                            <li key={t} className={cn('inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.06em]')} style={{ borderColor: PAIN, color: PAIN }}>{t}</li>
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
