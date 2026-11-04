'use client';

import { cn } from '@/lib/cn';

/** Shared pieces for the interactive maturity instruments. */

export const small = { fontSize: 'var(--step--1)', lineHeight: 1.5 } as const;
export const ink = 'var(--color-text-primary)';

/** The map's own easing, for CSS transitions that should feel like the rest of the site. */
export const EASE = 'cubic-bezier(0.16,1,0.3,1)';

/** A bead in CSS, shaded like the map's: highlight up-left, pigment, inked rim. */
export const cssBead = (c: { hi: string; mid: string; rim: string }) =>
    `radial-gradient(circle at 35% 35%, ${c.hi}, ${c.mid} 45%, ${c.rim} 90%)`;

const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** A small segmented switch: one pressed option at a time. 300ms, squared, 44px on touch. */
export function Seg<T extends string>({
    label,
    value,
    onChange,
    options,
    className,
}: {
    className?: string;
    label: string;
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string }[];
}) {
    return (
        <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', className)}>
            {options.map((o) => {
                const on = value === o.value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange(o.value)}
                        className={cn(
                            'tap rounded-sm border px-3 py-1.5 transition-[background-color,border-color,color] duration-300 ease-out',
                            focus,
                            on ? 'border-accent bg-accent text-white' : 'border-ink/15 bg-surface/60 text-ink hover:border-accent'
                        )}
                        style={small}
                    >
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

export const focusRing = focus;

/** A small text button in the same family as Seg's options, for a single action. */
export function StepButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'tap rounded-sm border border-ink/15 bg-surface/60 px-3 py-1.5 text-ink transition-[background-color,border-color,transform] duration-300 ease-out hover:border-accent hover:-translate-y-0.5',
                focus
            )}
            style={small}
        >
            {children}
        </button>
    );
}
