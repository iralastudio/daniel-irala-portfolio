'use client';

import { m } from 'framer-motion';
import { EXPO } from '@/lib/motion';

/**
 * BrandMark — the wordmark, top-left. Clicking it frames the whole system (overview),
 * the same way zooming all the way out does.
 */
export function BrandMark({ onHome }: { onHome: () => void }) {
    return (
        <m.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EXPO }}
            className="fixed top-0 inset-x-0 z-30 pointer-events-none"
        >
            {/* Content scrolls under the wordmark in stacked mode — this fade keeps
                the mark legible without drawing a hard bar across the page. */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-24"
                style={{
                    background:
                        'linear-gradient(180deg, var(--color-background) 0%, color-mix(in srgb, var(--color-background) 72%, transparent) 45%, transparent 100%)',
                }}
            />
            <div className="relative px-6 md:px-12 lg:px-20 py-5">
                <button
                    onClick={onHome}
                    className="tap pointer-events-auto inline-flex items-center font-mono text-[12px] tracking-[0.22em] font-semibold text-ink hover:text-accent transition-colors duration-300 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Irala Studio — view the whole system"
                >
                    IRALA.STUDIO
                </button>
            </div>
        </m.header>
    );
}
