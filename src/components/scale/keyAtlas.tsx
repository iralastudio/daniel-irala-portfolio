'use client';

import { useState } from 'react';
import type { AtlasModel } from '@/data/keyModels';
import { useMotionOK } from '@/lib/motion';
import { GROUP } from '@/lib/systemMap';
import { Beat, BeatItem, Instrument } from './instruments';
import { ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink } from './maturityParts';

/**
 * A journey atlas drawn without any of the real content: the same structure, with placeholders
 * where the words would be. Zoom in one level at a time and a new row of the map unfolds under
 * the last. The panel says what that level is for. Nothing here is data from a real atlas.
 */

const W = 64;
const GAPX = 11;
const X0 = 20;
const jx = (i: number) => X0 + i * (W + GAPX);
const STAGES: [number, number][] = [[0, 3], [4, 5], [6, 7]];
const GATES_AFTER = [0, 3, 4];
const TASKS = [4, 3, 3, 2, 1, 3, 1, 2];
const ROW_Y = [26, 86, 146, 204, 276];
const LEVEL_COLOUR = [ACCENT, GROUP[3], COPPER, ink, ACCENT];
const TAG_COLOUR = [ACCENT, GROUP[3], COPPER, GROUP[4]];
const VIEW_H = [74, 132, 198, 270, 380];
const ROW_LABEL = ['LEVEL 0 · LIFECYCLE', 'STAGE BAND', 'LEVEL 1 · JOURNEYS', 'JOB TO BE DONE', 'TASK LEVEL'];

export function Atlas({ model }: { model: AtlasModel }) {
    const ok = useMotionOK();
    const [z, setZ] = useState(0);
    const lv = model.levels[z];
    const row = (r: number) => ({
        opacity: z >= r ? (z === r ? 1 : 0.8) : 0,
        transform: `translateY(${z >= r ? 0 : -10}px)`,
        transition: ok ? 'opacity 450ms ease-out, transform 450ms cubic-bezier(0.16,1,0.3,1)' : 'none',
    });
    const blockDelay = (r: number, i: number) => (ok && z === r ? { transitionDelay: `${i * 45}ms` } : {});
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg className="justify-center" label="Zoom level" value={String(z)} onChange={(v) => setZ(Number(v))} options={model.levels.map((l, i) => ({ value: String(i), label: l.short }))} />
                </BeatItem>
                <BeatItem>
                    <div className="relative w-full max-w-[660px] mx-auto mt-4 overflow-hidden" style={{ height: 0, paddingBottom: `${(VIEW_H[z] / 640) * 100}%`, transition: ok ? 'padding-bottom 500ms cubic-bezier(0.16,1,0.3,1)' : 'none' }}>
                    <svg viewBox="0 0 640 380" className="absolute left-0 top-0 w-full h-auto block" aria-hidden="true">
                        {/* gates between journeys */}
                        <g style={{ opacity: z >= 2 ? 1 : 0, transition: ok ? 'opacity 450ms ease-out 150ms' : 'none' }}>
                            {GATES_AFTER.map((i) => (
                                <rect key={i} x={jx(i) + W + GAPX / 2 - 3} y={ROW_Y[2]} width={6} height={z >= 4 ? 100 + 98 : 50} rx={1} fill={GROUP[2]} fillOpacity={0.55} style={{ transition: ok ? 'height 450ms ease-out' : 'none' }} />
                            ))}
                        </g>

                        <g style={row(0)} onClick={() => setZ(0)}>
                            <text x={X0} y={ROW_Y[0] - 8} fontSize={10} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{ROW_LABEL[0]}</text>
                            <rect x={X0} y={ROW_Y[0]} width={jx(7) + W - X0} height={34} rx={2} fill={LEVEL_COLOUR[0]} />
                            <text x={(X0 + jx(7) + W) / 2} y={ROW_Y[0] + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill="#fff" className="font-display">The lifecycle</text>
                        </g>

                        <g style={row(1)} onClick={() => setZ(1)}>
                            <text x={X0} y={ROW_Y[1] - 8} fontSize={10} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{ROW_LABEL[1]}</text>
                            {STAGES.map(([a, b], i) => (
                                <g key={i} style={blockDelay(1, i)}>
                                    <rect x={jx(a)} y={ROW_Y[1]} width={jx(b) + W - jx(a)} height={32} rx={2} fill={LEVEL_COLOUR[1]} />
                                    <text x={(jx(a) + jx(b) + W) / 2} y={ROW_Y[1] + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" className="font-display">Stage {i + 1}</text>
                                </g>
                            ))}
                        </g>

                        <g style={row(2)} onClick={() => setZ(2)}>
                            <text x={X0} y={ROW_Y[2] - 8} fontSize={10} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{ROW_LABEL[2]}</text>
                            {TASKS.map((_, i) => {
                                const s = STAGES.findIndex(([a, b]) => i >= a && i <= b);
                                const n = i - STAGES[s][0] + 1;
                                return (
                                    <g key={i} style={blockDelay(2, i)}>
                                        <rect x={jx(i)} y={ROW_Y[2]} width={W} height={38} rx={2} fill={LEVEL_COLOUR[2]} />
                                        <text x={jx(i) + W / 2} y={ROW_Y[2] + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" className="font-display">{s + 1}.{n}</text>
                                    </g>
                                );
                            })}
                        </g>

                        <g style={row(3)} onClick={() => setZ(3)}>
                            <text x={X0} y={ROW_Y[3] - 8} fontSize={10} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{ROW_LABEL[3]}</text>
                            {TASKS.map((_, i) => (
                                <g key={i} style={blockDelay(3, i)}>
                                    <rect x={jx(i)} y={ROW_Y[3]} width={W} height={52} rx={2} fill={ink} fillOpacity={0.09} />
                                    {[0.86, 0.94, 0.6].map((f, k) => (
                                        <rect key={k} x={jx(i) + 6} y={ROW_Y[3] + 10 + k * 13} width={(W - 12) * f} height={5} rx={2.5} fill={ink} fillOpacity={0.25} />
                                    ))}
                                </g>
                            ))}
                        </g>

                        <g style={row(4)} onClick={() => setZ(4)}>
                            <text x={X0} y={ROW_Y[4] - 8} fontSize={10} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{ROW_LABEL[4]}</text>
                            {TASKS.map((count, i) =>
                                Array.from({ length: count }, (_, k) => (
                                    <g key={`${i}-${k}`} style={blockDelay(4, i + k)}>
                                        <rect x={jx(i)} y={ROW_Y[4] + k * 22} width={W} height={16} rx={2} fill={ACCENT} fillOpacity={0.16} stroke={ACCENT} strokeOpacity={0.35} />
                                        <rect x={jx(i)} y={ROW_Y[4] + k * 22} width={7} height={16} rx={2} fill={TAG_COLOUR[(i + k) % TAG_COLOUR.length]} />
                                        <rect x={jx(i) + 13} y={ROW_Y[4] + k * 22 + 5.5} width={W - 22} height={5} rx={2.5} fill={ink} fillOpacity={0.3} />
                                    </g>
                                ))
                            )}
                        </g>
                    </svg>
                    </div>
                </BeatItem>
                <BeatItem className="mt-2 rounded-xs border border-ink/10 bg-surface/70 px-4 py-3.5">
                    <div aria-live="polite">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="label-mono !text-[10px]">Zoom {z + 1} of {model.levels.length}</span>
                            <span className="inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]" style={{ borderColor: LEVEL_COLOUR[z], color: LEVEL_COLOUR[z] }}>{lv.nng}</span>
                        </div>
                        <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{lv.name}</div>
                        <p className="mt-1.5 text-ink" style={small}>{lv.purpose}</p>
                        <p className="mt-1.5 text-ink-soft" style={small}><span className="label-mono !text-[10px] mr-2">It answers</span>{lv.answers}</p>
                        {lv.extra && <p className="mt-1.5 text-ink-soft" style={small}>{lv.extra}</p>}
                        {z === model.levels.length - 1 && (
                            <ul className="list-none m-0 mt-3 p-0 grid gap-1.5 sm:grid-cols-2">
                                {model.tags.map((t, k) => (
                                    <li key={t.key} className="flex items-start gap-2 text-ink-soft" style={small}>
                                        <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 rounded-xs" style={{ background: TAG_COLOUR[k % TAG_COLOUR.length] }} />
                                        <span><span className="text-ink font-semibold">{t.name}: </span>{t.line}</span>
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
