'use client';

import { scenes } from '@/data/scenes';
import { cn } from '@/lib/cn';

// The right-edge navigation. Each item frames its area of the map. Labels are
// meaningful (About me, Touchpoint, …) with a short descriptor instead of a
// power-of-ten number.
const NAV: { label: string; hint: string }[] = [
    { label: 'About me', hint: 'the individual' },
    { label: 'Touchpoint', hint: 'one screen' },
    { label: 'Team', hint: 'a workflow' },
    { label: 'Organisation', hint: 'an enterprise' },
    { label: 'Beyond', hint: 'the wider field' },
];

export function ScaleRail({ activeIndex, onJump }: { activeIndex: number; onJump: (i: number) => void }) {
    return (
        <nav
            aria-label="Areas"
            className="fixed right-5 md:right-10 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-4 md:gap-5"
        >
            {scenes.map((_, i) => {
                const item = NAV[i] ?? { label: scenes[i].scaleLabel, hint: '' };
                const active = i === activeIndex;
                return (
                    <button
                        key={scenes[i].id}
                        onClick={() => onJump(i)}
                        aria-current={active ? 'location' : undefined}
                        className="group flex items-center justify-end gap-3 text-right rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <span className="flex flex-col items-end leading-tight">
                            <span
                                className={cn(
                                    'font-display font-semibold transition-colors duration-300',
                                    active ? 'text-accent' : 'text-ink/70 group-hover:text-ink'
                                )}
                                style={{ fontSize: '0.95rem' }}
                            >
                                {item.label}
                            </span>
                            <span
                                className={cn(
                                    'label-mono !text-[10px] !tracking-[0.14em] transition-colors duration-300',
                                    // Always legible: the descriptor is what explains the scale
                                    // metaphor, so hiding it until hover loses first-time visitors.
                                    // Full opacity — dimming this 10px label drops it under AA.
                                    active ? 'text-accent' : 'text-ink-soft'
                                )}
                            >
                                {item.hint}
                            </span>
                        </span>
                        <span
                            className={cn(
                                'h-px transition-all duration-300 shrink-0',
                                active ? 'w-10 bg-accent' : 'w-4 bg-ink-soft/40 group-hover:w-7'
                            )}
                        />
                    </button>
                );
            })}
        </nav>
    );
}
