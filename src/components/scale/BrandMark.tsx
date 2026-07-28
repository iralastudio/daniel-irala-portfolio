'use client';

import { m } from 'framer-motion';

/**
 * BrandMark — the wordmark, top-left. Clicking it frames the whole system (overview),
 * the same way zooming all the way out does.
 */
export function BrandMark({ onHome }: { onHome: () => void }) {
    return (
        <m.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 z-30 px-6 md:px-12 lg:px-20 py-5"
        >
            <button
                onClick={onHome}
                className="font-mono text-[12px] tracking-[0.22em] font-semibold text-ink hover:text-accent transition-colors duration-300 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Irala Studio — view the whole system"
            >
                IRALA.STUDIO
            </button>
        </m.header>
    );
}
