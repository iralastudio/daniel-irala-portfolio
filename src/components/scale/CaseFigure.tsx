'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import type { CaseFigure } from '@/data/caseStudies';

/** A case-study image that opens full size in the lightbox. */
export function Figure({ fig, onOpen }: { fig: CaseFigure; onOpen: (f: CaseFigure) => void }) {
    return (
        <figure className="m-0">
            <button
                onClick={() => onOpen(fig)}
                className="group block w-full overflow-hidden rounded-xl border border-ink/10 bg-white cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Enlarge: ${fig.caption ?? fig.alt}`}
            >
                <Image
                    src={fig.src}
                    alt={fig.alt}
                    width={fig.w}
                    height={fig.h}
                    className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                    sizes="(max-width: 900px) 92vw, 820px"
                />
            </button>
            {fig.caption && (
                <figcaption className="label-mono !tracking-[0.1em] !text-[10px] mt-2.5 text-center text-ink-soft">
                    {fig.caption}
                </figcaption>
            )}
        </figure>
    );
}

/**
 * Lightbox — full-size view of a detailed map. Mounted only while open, so it is
 * its own focus layer: focus moves to its close button on mount (Tab is held there,
 * it is the only control) and returns to the triggering figure on unmount. Without
 * this, Tab walks the article content hidden behind the dark surround. Esc is
 * handled by the window, which knows whether a lightbox is open.
 */
export function Lightbox({ fig, onClose }: { fig: CaseFigure; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        closeRef.current?.focus();
        return () => trigger?.focus({ preventScroll: true });
    }, []);

    return (
        <m.div
            role="dialog"
            aria-label={`Image: ${fig.alt}`}
            className="absolute inset-0 z-20 grid place-items-center p-4 sm:p-10 cursor-zoom-out"
            style={{ background: 'color-mix(in srgb, var(--color-text-primary) 72%, transparent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onKeyDown={(e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    closeRef.current?.focus();
                }
            }}
            onClick={(e) => {
                // Close on the dark surround only — clicks on the image/caption
                // have a deeper target. (Esc is the keyboard equivalent.)
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <figure className="m-0 max-w-[96vw] max-h-[92vh]">
                <Image
                    src={fig.src}
                    alt={fig.alt}
                    width={fig.w}
                    height={fig.h}
                    className="w-auto h-auto max-w-[96vw] max-h-[86vh] rounded-lg bg-white shadow-2xl"
                    sizes="96vw"
                />
                {fig.caption && (
                    <figcaption className="label-mono !text-[10px] mt-3 text-center text-white/80">
                        {fig.caption}
                    </figcaption>
                )}
            </figure>
            {/* Same close control as the window header — sized/stroked identically;
                white ring + surfaces because this layer sits on a dark backdrop. */}
            <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close image"
                className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
            </button>
        </m.div>
    );
}
