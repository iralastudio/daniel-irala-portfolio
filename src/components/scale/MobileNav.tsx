'use client';

import { scenes } from '@/data/scenes';
import { cn } from '@/lib/cn';

const LABELS = ['About me', 'Touchpoint', 'Team', 'Organisation', 'Beyond'];

/**
 * MobileNav — a thumb-reachable bottom bar for stacked mode. Rendered at EVERY
 * width whenever the experience is stacked (phones, touch tablets, reduce
 * motion) — it is the only area navigation there, so it must never be hidden
 * by a breakpoint. Taps jump to the matching section; scrolling updates the
 * active state via the scroll-spy in ScaleExperience. Touch targets ≥ 48px.
 */
export function MobileNav({ activeIndex, onJump }: { activeIndex: number; onJump: (i: number) => void }) {
    return (
        <nav
            aria-label="Areas"
            className="fixed bottom-0 inset-x-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1"
        >
            <div className="rounded-2xl border border-ink/10 bg-[color-mix(in_srgb,var(--color-surface)_88%,transparent)] backdrop-blur-xl shadow-[0_8px_30px_rgba(43,42,41,0.14)] overflow-x-auto no-scrollbar">
                <ul className="flex items-stretch">
                    {scenes.map((s, i) => {
                        const active = i === activeIndex;
                        return (
                            <li key={s.id} className="flex-1">
                                <button
                                    onClick={() => onJump(i)}
                                    aria-current={active ? 'location' : undefined}
                                    className={cn(
                                        'w-full min-h-[48px] px-2 grid place-items-center whitespace-nowrap transition-colors duration-300',
                                        'label-mono !text-[10px] !tracking-[0.06em]',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl',
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
