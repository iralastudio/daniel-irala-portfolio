'use client';

import { nodeContent, contentOrder, HREF_SCENE } from '@/data/nodeContent';
import { GROUP } from '@/lib/systemMap';
import { ActionPill } from './ActionPill';

/**
 * The window's tie back to the system (Phase 4, docs/MOTION-PLAN-2026-10-12.md).
 *
 * `Connected` ends every window with where to go next. A connection is a claim, so it
 * comes only from a hand-written `related` list on the window's nodeContent entry;
 * without one the window lists the other windows at its own scale, under a title
 * that says exactly that, so nothing is presented as a link that nobody wrote.
 * Opening one is a lateral move: the window crossfades and the camera pans behind.
 */
export function Connected({
    href,
    onSelect,
}: {
    href: string;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
}) {
    const curated = (nodeContent[href]?.related ?? []).filter((h) => h !== href && nodeContent[h]);
    const scene = HREF_SCENE[href];
    const items = curated.length
        ? curated
        : contentOrder.filter((h) => h !== href && HREF_SCENE[h] === scene && nodeContent[h]);
    if (items.length === 0) return null;
    const title = curated.length ? 'Connected' : 'More at this scale';
    return (
        <nav aria-label={title} className="mt-14">
            <div className="label-mono mb-3">{title}</div>
            <div className="border-t border-ink/10">
                {items.map((h) => (
                    <div key={h} className="border-b border-ink/10">
                        <ActionPill
                            row
                            dot={GROUP[HREF_SCENE[h] ?? 0]}
                            label={nodeContent[h].title}
                            href={h}
                            onSelect={onSelect}
                        />
                    </div>
                ))}
            </div>
        </nav>
    );
}
