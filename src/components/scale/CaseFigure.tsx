'use client';

import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { animate, m, useScroll, useTransform } from 'framer-motion';
import type { CaseFigure } from '@/data/caseStudies';
import { EXPO, REVEAL, useMotionOK } from '@/lib/motion';
import { ScrollRoot } from './ReadingAids';

/**
 * A case-study image that opens full size in the lightbox (Phase 5).
 * It is unveiled top-down by a retracting curtain the first time it is seen, and the
 * whole frame drifts a few pixels against the text as the window scrolls: a depth
 * cue that never crops the artefact itself (these are diagrams with text at the
 * edges, so the image is never scaled up inside its frame to make room).
 */
export function Figure({ fig, onOpen }: { fig: CaseFigure; onOpen: (f: CaseFigure, from: DOMRect | null) => void }) {
    const ok = useMotionOK();
    const root = useContext(ScrollRoot);
    const ref = useRef<HTMLElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const { scrollYProgress } = useScroll({ container: root ?? undefined, target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [10, -10]);

    return (
        <m.figure ref={ref} className="m-0" style={ok ? { y } : undefined}>
            <button
                ref={btnRef}
                onClick={() => onOpen(fig, btnRef.current?.getBoundingClientRect() ?? null)}
                className="group block w-full overflow-hidden rounded-xl border border-ink/10 bg-white cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Enlarge: ${fig.caption ?? fig.alt}`}
            >
                <div className="relative">
                    <Image
                        src={fig.src}
                        alt={fig.alt}
                        width={fig.w}
                        height={fig.h}
                        className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                        sizes="(max-width: 900px) 92vw, 820px"
                    />
                    {/* The reveal is a curtain that retracts downward, not a clip on the
                        image: a clip-path on the image's container also clips its
                        IntersectionObserver rect, so a lazily loaded image never loads. */}
                    {ok && (
                        <m.div
                            aria-hidden="true"
                            className="absolute inset-0 bg-white origin-bottom"
                            initial={{ scaleY: 1 }}
                            whileInView={{ scaleY: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 1.1, ease: REVEAL }}
                        />
                    )}
                </div>
            </button>
            {fig.caption && (
                <m.figcaption
                    className="label-mono !tracking-[0.1em] !text-[10px] mt-2.5 text-center text-ink-soft"
                    initial={ok ? { opacity: 0 } : false}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.5, duration: 0.6, ease: EXPO }}
                >
                    {fig.caption}
                </m.figcaption>
            )}
        </m.figure>
    );
}

/**
 * Lightbox — full-size view of a detailed map. Mounted only while open, so it is
 * its own focus layer: focus moves to its close button on mount (Tab is held there,
 * it is the only control) and returns to the triggering figure on unmount. Esc is
 * handled by the window, which knows whether a lightbox is open.
 *
 * The image grows from where the figure sat in the article to its full size (a
 * measured FLIP; the site's motion bundle has no layout animations), so the
 * enlargement reads as the same picture coming closer, not a new one appearing.
 */
export function Lightbox({ fig, from, onClose }: { fig: CaseFigure; from?: DOMRect | null; onClose: () => void }) {
    const ok = useMotionOK();
    const closeRef = useRef<HTMLButtonElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        closeRef.current?.focus();
        return () => trigger?.focus({ preventScroll: true });
    }, []);

    // FLIP: measure the final box, start the image transformed onto the figure's box
    // before first paint, then ease it home.
    useLayoutEffect(() => {
        const el = imgRef.current;
        if (!el || !from || !ok) return;
        const to = el.getBoundingClientRect();
        if (to.width === 0) return;
        const x = from.left + from.width / 2 - (to.left + to.width / 2);
        const y = from.top + from.height / 2 - (to.top + to.height / 2);
        const s = from.width / to.width;
        el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
        const ctl = animate(el, { x: [x, 0], y: [y, 0], scale: [s, 1] }, { duration: 0.8, ease: EXPO });
        return () => ctl.stop();
    }, [from, ok]);

    return (
        <m.div
            role="dialog"
            aria-label={`Image: ${fig.alt}`}
            className="absolute inset-0 z-20 grid place-items-center p-4 sm:p-10 cursor-zoom-out"
            style={{ background: 'color-mix(in srgb, var(--color-text-primary) 72%, transparent)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: ok ? 0.5 : 0, ease: EXPO }}
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
                <div ref={imgRef} className="will-change-transform">
                    <Image
                        src={fig.src}
                        alt={fig.alt}
                        width={fig.w}
                        height={fig.h}
                        className="w-auto h-auto max-w-[96vw] max-h-[86vh] rounded-lg bg-white shadow-2xl"
                        sizes="96vw"
                    />
                </div>
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
