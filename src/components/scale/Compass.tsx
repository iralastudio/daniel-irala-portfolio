'use client';

import { useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import type { ContentListItem } from '@/data/nodeContent';
import { cn } from '@/lib/cn';
import { EXPO, useMotionOK } from '@/lib/motion';
import { SCENES, HINTS } from './driveScenes';

/**
 * "What drives me" — the rendering of the #compass window. Five threads (Vision ·
 * Mission · Values · Direction · Past), each with its own small interactive
 * drawing on a shared stage (driveScenes.tsx), and the thread's line underneath.
 *
 * The plain text of all five lines still lives, server-rendered, in CrawlableContent
 * (as a <dl>), and the reading below the stage is always the full sentence, so the
 * stage is an enhancement: it is aria-hidden and pointer-driven, like the map.
 * Selection is click / focus / arrow keys (not hover) so sweeping across the row
 * does not replay scenes. Reduced motion renders every scene in its settled state.
 */

export function Compass({ items }: { items: ContentListItem[] }) {
    const [active, setActive] = useState(0);
    const ok = useMotionOK();
    const n = items.length;

    const move = useCallback((dir: 1 | -1) => setActive((i) => (i + dir + n) % n), [n]);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                move(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                move(-1);
            }
        },
        [move]
    );

    const item = items[active];
    const Scene = SCENES[item.term];

    return (
        <div className="mt-8">
            <div
                role="group"
                aria-label="What drives me — choose a thread"
                onKeyDown={onKeyDown}
                className="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
                {items.map((it, i) => {
                    const on = i === active;
                    return (
                        <button
                            key={it.term}
                            type="button"
                            onClick={() => setActive(i)}
                            onFocus={() => setActive(i)}
                            aria-pressed={on}
                            className={cn(
                                'tap relative text-left rounded-sm border px-3 py-2 transition-[color,background-color,border-color] duration-300',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                on ? 'border-accent bg-accent/5 text-accent' : 'border-ink/15 text-ink-soft hover:text-ink'
                            )}
                        >
                            <span className="label-mono !text-[10px] block !text-current">{String(i + 1).padStart(2, '0')}</span>
                            <span className="font-display font-semibold block" style={{ fontSize: 'var(--step--1)' }}>
                                {it.term}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 rounded-xl border border-ink/10 bg-surface/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-3">
                    <span className="label-mono !text-[10px]">{String(active + 1).padStart(2, '0')} · {item.term}</span>
                    <span className="label-mono !text-[10px]">{HINTS[item.term]}</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    <m.div
                        key={item.term}
                        initial={ok ? { opacity: 0 } : false}
                        animate={{ opacity: 1 }}
                        exit={ok ? { opacity: 0 } : undefined}
                        transition={{ duration: 0.25, ease: EXPO }}
                    >
                        {Scene && <Scene ok={ok} />}
                    </m.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 min-h-[5.5rem]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                    <m.div
                        key={active}
                        initial={ok ? { opacity: 0, y: 8 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={ok ? { opacity: 0, y: -8 } : undefined}
                        transition={{ duration: 0.3, ease: EXPO }}
                    >
                        <div className="label-mono !text-accent mb-2">{item.term}</div>
                        <p className="text-ink" style={{ fontSize: 'var(--step-0)', lineHeight: 1.6 }}>
                            {item.text}
                        </p>
                    </m.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
