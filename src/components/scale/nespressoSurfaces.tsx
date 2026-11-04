'use client';

import { useState } from 'react';
import type { SurfacesModel } from '@/data/nespressoModels';
import { useMotionOK } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { Beat, BeatItem, Instrument } from './instruments';
import { Bead, ACCENT, COPPER } from './storyInstruments';
import { Seg, small, ink } from './maturityParts';

/**
 * The surfaces that were tested, drawn as a small system. The programme sits in the
 * middle, Nespresso's own entry points and exit on the left, and a partner's catalogue
 * on the far side of a dashed line. Press a node, or pick it from the row, to read what
 * was tested there and who can change it.
 */

const chip = 'inline-block rounded-xs border px-2 py-0.5 label-mono !text-[10px] !tracking-[0.08em]';
const CENTRE = { x: 280, y: 130 };
const LINE_X = 410;

export function Surfaces({ model }: { model: SurfacesModel }) {
    const ok = useMotionOK();
    const [k, setK] = useState<string | null>(null);
    const own = model.nodes.filter((n) => n.side === 'own');
    const partner = model.nodes.filter((n) => n.side === 'partner');
    const POS: Record<string, { x: number; y: number }> = {};
    for (const [i, n] of own.entries()) POS[n.key] = { x: 80, y: 50 + i * (160 / Math.max(1, own.length - 1)) };
    for (const [i, n] of partner.entries()) POS[n.key] = { x: 520, y: 130 + (i - (partner.length - 1) / 2) * 70 };
    const cur = model.nodes.find((n) => n.key === k);
    const fade = { transition: ok ? 'opacity 300ms ease-out' : 'none' };
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6">
                <BeatItem>
                    <Seg label="Surface" value={k ?? ''} onChange={setK} options={model.nodes.map((n) => ({ value: n.key, label: n.name }))} />
                </BeatItem>
                <BeatItem>
                    <svg viewBox="0 0 600 260" className="w-full h-auto max-w-[620px] mx-auto block mt-3" aria-hidden="true">
                        <line x1={LINE_X} y1={12} x2={LINE_X} y2={248} stroke={ink} strokeOpacity={0.45} strokeDasharray="5 6" />
                        <text x={LINE_X - 12} y={20} textAnchor="end" fontSize={11} letterSpacing="0.08em" fill={ACCENT} className="font-display">{model.sides.own.toUpperCase()}</text>
                        <text x={LINE_X + 12} y={20} fontSize={11} letterSpacing="0.08em" fill={ink} fillOpacity={0.7} className="font-display">{model.sides.partner.toUpperCase()}</text>
                        {model.nodes.map((n) => {
                            const p = POS[n.key];
                            const isOwn = n.side === 'own';
                            return (
                                <line
                                    key={n.key}
                                    x1={p.x}
                                    y1={p.y}
                                    x2={CENTRE.x}
                                    y2={CENTRE.y}
                                    stroke={isOwn ? ACCENT : COPPER}
                                    strokeWidth={k === n.key ? 2.4 : 1.4}
                                    strokeDasharray={isOwn ? undefined : '5 5'}
                                    style={{ ...fade, opacity: !k || k === n.key ? 0.7 : 0.18 }}
                                />
                            );
                        })}
                        <Bead cx={CENTRE.x} cy={CENTRE.y} r={28} color={ACCENT} />
                        <text x={CENTRE.x} y={CENTRE.y + 50} textAnchor="middle" fontSize={13} fontWeight={700} fill={ink} className="font-display">{model.centre}</text>
                        {model.nodes.map((n) => {
                            const p = POS[n.key];
                            const isOwn = n.side === 'own';
                            const left = isOwn;
                            return (
                                <g key={n.key} onClick={() => setK(n.key)} style={{ cursor: 'pointer', ...fade, opacity: !k || k === n.key ? 1 : 0.4 }}>
                                    <Bead cx={p.x} cy={p.y} r={k === n.key ? 20 : 17} color={isOwn ? ACCENT : COPPER} hollow={!isOwn} />
                                    <text x={p.x} y={p.y + (left ? 36 : 36)} textAnchor="middle" fontSize={12} fontWeight={600} fill={ink} className="font-display">{n.name}</text>
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
                                    <span className="label-mono !text-[10px]">{cur.kind}</span>
                                    <span className={cn(chip, cur.side === 'own' ? 'border-accent !text-accent' : 'border-dashed border-ink/30 !text-ink-soft')}>
                                        {cur.side === 'own' ? model.sides.own : model.sides.partner}
                                    </span>
                                </div>
                                <div className="mt-1.5 font-display font-semibold text-ink" style={{ fontSize: 'var(--step-1)', lineHeight: 1.25 }}>{cur.name}</div>
                                <p className="mt-1.5 text-ink" style={small}>{cur.tested}</p>
                                <p className="mt-1.5 text-ink-soft" style={small}>{cur.detail}</p>
                            </>
                        )}
                    </div>
                </BeatItem>
            </Beat>
        </Instrument>
    );
}
