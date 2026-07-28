'use client';

import { clickOrigin } from '@/lib/clickOrigin';
import { cn } from '@/lib/cn';

/**
 * ActionPill — THE single pill CTA used everywhere (SectionPanel entries,
 * window actions). One hover behaviour (colour + 2px lift + arrow slide, 300ms
 * ease-out), one focus ring, one size per variant — do not restyle locally.
 * Internal `#hrefs` render as buttons opening a window via `onSelect`
 * (keyboard-safe origin via clickOrigin); anything else renders as a link.
 */
export function ActionPill({
    label,
    href,
    meta,
    external,
    primary,
    onSelect,
}: {
    label: string;
    href: string;
    meta?: string;
    external?: boolean;
    primary?: boolean;
    onSelect?: (href: string, origin?: { x: number; y: number }) => void;
}) {
    const cls = cn(
        'group inline-flex items-center gap-2 rounded-full transition-[background-color,border-color,transform] duration-300 ease-out hover:-translate-y-0.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        primary
            ? 'bg-accent px-6 py-3 text-white font-medium hover:bg-accent-hover'
            : 'border border-ink/15 bg-surface/60 px-4 py-2.5 text-ink hover:border-accent'
    );
    const arrow = (
        <span
            className={cn('transition-transform duration-300 ease-out group-hover:translate-x-1', !primary && 'text-accent')}
            aria-hidden="true"
        >
            {external ? '↗' : '→'}
        </span>
    );
    const body = (
        <>
            {label}
            {meta && <span className="label-mono !text-[10px] !tracking-[0.1em]">{meta}</span>}
            {arrow}
        </>
    );

    if (href.startsWith('#')) {
        return (
            <button onClick={(e) => onSelect?.(href, clickOrigin(e))} className={cls} style={{ fontSize: 'var(--step--1)' }}>
                {body}
            </button>
        );
    }
    return (
        <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cls}
            style={{ fontSize: 'var(--step--1)' }}
        >
            {body}
        </a>
    );
}
