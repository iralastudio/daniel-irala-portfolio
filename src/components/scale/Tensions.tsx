'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { m, AnimatePresence, animate } from 'framer-motion';
import type { ContentListItem } from '@/data/nodeContent';
import { cn } from '@/lib/cn';
import { EXPO, useMotionOK } from '@/lib/motion';
import { TENSION_SCENES, useClock } from './tensionScenes';

/**
 * Tensions — the rendering of the #thinking window. Each tension is a row that opens
 * a small reframing instrument: a slider from how the problem is usually described
 * to how Dani describes it, driving a drawing made for that tension (tensionScenes.tsx).
 * On open it plays through once by itself, then the slider replays it. Under it, the
 * plain reading and the question he still carries.
 *
 * The instrument is an enhancement: the slider is a real keyboard-operable slider,
 * but every word (usual framing, my framing, reading, question) is on screen as text
 * and mirrored server-side in CrawlableContent. Reduced motion jumps instead of easing.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Panel({ item, index, ok }: { item: ContentListItem; index: number; ok: boolean }) {
    const [t, setTState] = useState(0); // 0 = the usual framing, 1 = mine
    const tRef = useRef(0);
    const run = useRef<{ stop: () => void } | null>(null);
    const track = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const touched = useRef(false);
    const c = useClock(ok);
    const Scene = TENSION_SCENES[index % TENSION_SCENES.length];

    const setT = useCallback((v: number) => {
        tRef.current = v;
        setTState(v);
    }, []);
    const goto = useCallback(
        (v: number, duration = 0.6) => {
            run.current?.stop();
            if (!ok) return setT(v);
            run.current = animate(tRef.current, v, { duration, ease: EXPO, onUpdate: setT });
        },
        [ok, setT]
    );
    // Play once on open so the reframe is seen before it is handed over; any touch cancels it.
    useEffect(() => {
        if (!ok) return;
        const id = setTimeout(() => {
            if (!touched.current) goto(1, 2.8);
        }, 650);
        return () => clearTimeout(id);
    }, [ok, goto]);
    const fromEvent = (e: React.PointerEvent) => {
        const r = track.current!.getBoundingClientRect();
        return clamp01((e.clientX - r.left) / r.width);
    };

    const e = t * t * (3 - 2 * t);

    return (
        <div className="pb-6">
            <div className="grid grid-cols-2 gap-5">
                <div style={{ opacity: 1 - 0.6 * e }}>
                    <div className="label-mono !text-[10px] mb-1">Usually framed as</div>
                    <p className="text-ink" style={{ fontSize: 'var(--step-0)', lineHeight: 1.4 }}>{item.from}</p>
                </div>
                <div className="text-right" style={{ opacity: 0.4 + 0.6 * e }}>
                    <div className="label-mono !text-[10px] mb-1 !text-accent">How I see it</div>
                    <p className="text-ink font-semibold" style={{ fontSize: 'var(--step-0)', lineHeight: 1.4 }}>{item.to}</p>
                </div>
            </div>

            <svg viewBox="0 0 400 150" className="block w-full h-auto mt-3" aria-hidden="true">
                <Scene e={e} c={c} />
            </svg>

            <div
                ref={track}
                role="slider"
                tabIndex={0}
                aria-label={`${item.term}: from the usual framing to mine`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(t * 100)}
                aria-valuetext={t > 0.5 ? `How I see it: ${item.to}` : `Usually framed as: ${item.from}`}
                onPointerDown={(ev) => {
                    touched.current = true;
                    ev.currentTarget.setPointerCapture(ev.pointerId);
                    dragging.current = true;
                    goto(fromEvent(ev));
                }}
                onPointerMove={(ev) => {
                    if (!dragging.current) return;
                    run.current?.stop();
                    setT(fromEvent(ev));
                }}
                onPointerUp={() => { dragging.current = false; }}
                onPointerCancel={() => { dragging.current = false; }}
                onKeyDown={(ev) => {
                    touched.current = true;
                    const step = { ArrowRight: 0.15, ArrowUp: 0.15, ArrowLeft: -0.15, ArrowDown: -0.15 }[ev.key];
                    if (step !== undefined) { ev.preventDefault(); goto(clamp01(tRef.current + step)); }
                    else if (ev.key === 'Home') { ev.preventDefault(); goto(0); }
                    else if (ev.key === 'End') { ev.preventDefault(); goto(1); }
                }}
                className="tap relative mx-3 mt-2 h-11 cursor-pointer touch-none select-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <div className="absolute inset-x-0 top-1/2 h-px bg-ink/20" />
                <div className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent" style={{ width: `${t * 100}%` }} />
                <span aria-hidden="true" className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-ink/40 bg-surface" />
                <span aria-hidden="true" className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/60" />
                <span aria-hidden="true" className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent shadow-md" style={{ left: `${t * 100}%` }} />
            </div>
            <p className="label-mono !text-[10px] text-center mt-1">Drag to reframe</p>

            <p className="mt-5 text-ink-soft" style={{ fontSize: 'var(--step-0)', lineHeight: 1.6 }}>{item.text}</p>
            <div className="mt-4 border-l-2 border-accent pl-4">
                <div className="label-mono !text-[10px] !text-accent mb-1">The question I carry</div>
                <p className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)', lineHeight: 1.4 }}>{item.ask}</p>
            </div>
        </div>
    );
}

export function Tensions({ items }: { items: ContentListItem[] }) {
    const [open, setOpen] = useState(0);
    const ok = useMotionOK();

    return (
        <div className="mt-8 border-t border-ink/10">
            {items.map((it, i) => {
                const on = i === open;
                return (
                    <div key={it.term} className="border-b border-ink/10">
                        <button
                            type="button"
                            aria-expanded={on}
                            aria-controls={`tension-${i}`}
                            onClick={() => setOpen(on ? -1 : i)}
                            className="tap group flex w-full items-center gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <span className="label-mono !text-[10px] w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                            <span className={cn('flex-1 font-display font-semibold transition-colors duration-300', on ? 'text-accent' : 'text-ink group-hover:text-accent')} style={{ fontSize: 'var(--step-0)' }}>
                                {it.term}
                            </span>
                            <span aria-hidden="true" className={cn('text-accent transition-transform duration-300 ease-out', on && 'rotate-90')}>→</span>
                        </button>
                        <AnimatePresence initial={false}>
                            {on && (
                                <m.div
                                    id={`tension-${i}`}
                                    role="region"
                                    aria-label={it.term}
                                    initial={ok ? { height: 0, opacity: 0 } : false}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={ok ? { height: 0, opacity: 0 } : undefined}
                                    transition={{ duration: 0.5, ease: EXPO }}
                                    className="overflow-hidden"
                                >
                                    <Panel item={it} index={i} ok={ok} />
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
