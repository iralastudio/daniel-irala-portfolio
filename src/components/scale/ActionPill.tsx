'use client';

import { clickOrigin } from '@/lib/clickOrigin';
import { cn } from '@/lib/cn';

/**
 * ActionPill — THE single action control used everywhere (SectionPanel entries,
 * window actions). One hover behaviour (colour + arrow slide, 300ms ease-out),
 * one focus ring, one size per variant — do not restyle locally.
 *
 * Three variants, tight by design — this is an editorial surface, so controls
 * are compact and squared (3px), never pill-shaped blobs:
 *   `primary` — solid accent button, for the one real CTA in a panel.
 *   `row`     — a full-width index row (label · meta · arrow) for lists of
 *               projects, where labels are long and would wrap inside a box.
 *   default   — a compact bordered button for short standalone actions.
 *
 * Internal `#hrefs` render as buttons opening a window via `onSelect`
 * (keyboard-safe origin via clickOrigin); anything else renders as a link.
 */
export function ActionPill({
    label,
    href,
    meta,
    external,
    primary,
    row,
    dot,
    onSelect,
}: {
    label: string;
    href: string;
    meta?: string;
    external?: boolean;
    primary?: boolean;
    row?: boolean;
    /** Row variant only: a leading colour dot naming the scale the target lives at. */
    dot?: string;
    onSelect?: (href: string, origin?: { x: number; y: number }) => void;
}) {
    const focus =
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

    const cls = row
        ? cn('tap group flex w-full items-center gap-3 py-2.5 text-left rounded-xs', focus)
        : cn(
              'tap group inline-flex items-center gap-2 rounded-sm transition-[background-color,border-color,transform] duration-300 ease-out hover:-translate-y-0.5',
              focus,
              primary
                  ? 'bg-accent px-4 py-2 text-white font-medium hover:bg-accent-hover'
                  : 'border border-ink/15 bg-surface/60 px-3 py-1.5 text-ink hover:border-accent'
          );

    const arrow = (
        <span
            className={cn(
                'transition-transform duration-300 ease-out group-hover:translate-x-1',
                !primary && 'text-accent'
            )}
            aria-hidden="true"
        >
            {external ? '↗' : '→'}
        </span>
    );

    const body = row ? (
        <>
            {dot && <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: dot }} aria-hidden="true" />}
            <span className="flex-1 text-ink transition-colors duration-300 ease-out group-hover:text-accent">
                {label}
            </span>
            {meta && <span className="label-mono !text-[10px] !tracking-[0.08em] shrink-0">{meta}</span>}
            {arrow}
        </>
    ) : (
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
