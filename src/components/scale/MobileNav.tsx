'use client';

import { useEffect, useRef } from 'react';
import { scenes } from '@/data/scenes';
import { cn } from '@/lib/cn';

const LABELS = ['About me', 'Touchpoint', 'Team', 'Organisation', 'Beyond'];

/**
 * MobileNav — a thumb-reachable bottom bar for stacked mode. Rendered at EVERY
 * width whenever the experience is stacked (phones, touch tablets, reduce
 * motion) — it is the only area navigation there, so it must never be hidden
 * by a breakpoint. Taps jump to the matching section; scrolling updates the
 * active state via the scroll-spy in ScaleExperience. Touch targets ≥ 48px.
 *
 * Five full-length labels cannot fit a 375px screen at a legible size, so the
 * bar scrolls horizontally instead of shrinking type: items keep their natural
 * width, edge fades signal there is more, and the active item is always
 * scrolled into view — so nothing is silently unreachable.
 */
export function MobileNav({ activeIndex, onJump }: { activeIndex: number; onJump: (i: number) => void }) {
    const railRef = useRef<HTMLUListElement>(null);
    const activeRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const el = activeRef.current;
        const rail = railRef.current;
        if (!el || !rail || rail.scrollWidth <= rail.clientWidth) return;
        const target = el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
        rail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }, [activeIndex]);

    return (
        <nav
            aria-label="Areas"
            className="fixed bottom-0 inset-x-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1"
        >
            <div className="rounded-lg border border-ink/10 bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] backdrop-blur-xl shadow-[0_8px_30px_rgba(43,42,41,0.14)]">
                <ul
                    ref={railRef}
                    className="flex items-stretch overflow-x-auto no-scrollbar scroll-smooth"
                    style={{
                        maskImage: 'linear-gradient(90deg, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%)',
                        WebkitMaskImage:
                            'linear-gradient(90deg, transparent 0, #000 20px, #000 calc(100% - 20px), transparent 100%)',
                    }}
                >
                    {scenes.map((s, i) => {
                        const active = i === activeIndex;
                        return (
                            <li key={s.id} ref={active ? activeRef : undefined} className="shrink-0">
                                <button
                                    onClick={() => onJump(i)}
                                    aria-current={active ? 'location' : undefined}
                                    className={cn(
                                        'min-h-[48px] px-3.5 grid place-items-center whitespace-nowrap transition-colors duration-300',
                                        'label-mono !text-[10px] !tracking-[0.08em]',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded-md',
                                        active ? 'text-accent' : 'text-ink-soft'
                                    )}
                                >
                                    {LABELS[i] ?? s.scaleLabel}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
