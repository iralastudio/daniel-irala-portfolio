'use client';

import { nodeContent, contentOrder, HREF_SCENE, BOOKING_URL, DEFAULT_CLOSE, PROJECT_HREFS } from '@/data/nodeContent';
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
        // #contact is a way to reach Dani, not more work at this scale; listing it here
        // stacked a second "talk to me" under windows that already end with one.
        : contentOrder.filter((h) => h !== href && h !== '#contact' && HREF_SCENE[h] === scene && nodeContent[h]);
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

/**
 * BookCall: the close of every PROJECT window. Reading convinces; this converts. One
 * line (per window, else the default) and one action, the booking calendar. Projects
 * only (PROJECT_HREFS): personal windows already end with their own action, and two
 * ways to say "talk to me" on one page is noise.
 */
export function BookCall({ href }: { href: string }) {
    if (!PROJECT_HREFS.includes(href)) return null;
    const close = nodeContent[href]?.close;
    return (
        <aside aria-label="Book a call" className="mt-12 rounded-sm border border-ink/10 bg-background/70 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
                <div className="label-mono mb-1.5">Next step</div>
                <p className="text-ink max-w-[46ch]" style={{ fontSize: 'var(--step-0)', lineHeight: 1.5 }}>
                    {close ?? DEFAULT_CLOSE}
                </p>
            </div>
            <div className="mt-4 shrink-0 sm:mt-0">
                <ActionPill primary external label="Book a call" href={BOOKING_URL} />
            </div>
        </aside>
    );
}
