'use client';

import { createContext, useEffect, useRef, useState, type RefObject } from 'react';
import { animate, m, useInView, useScroll } from 'framer-motion';
import { EXPO, useMotionOK } from '@/lib/motion';

/**
 * Reading aids inside a window (Phase 5, docs/MOTION-PLAN-2026-10-12.md): the window's
 * scroll root for figures, honest count-ups on facts, a progress line, and a section
 * tracker for the sticky header.
 */

/** The window's own scroll container; figures read their scroll position from it. */
export const ScrollRoot = createContext<RefObject<HTMLElement | null> | null>(null);

/**
 * A fact value whose leading number counts up once, the first time it is seen.
 * Only quantities move: a number of 3 or more, with any prefix or suffix (+, ~, %,
 * "k+", " of 33") held still. Years and words never animate; a count-up on a year or
 * a pending figure would be a lie in motion. Screen readers get the final value.
 */
const COUNTABLE = /^([+~]?)(\d+)(.*)$/;
export function CountUp({ value }: { value: string }) {
    const ok = useMotionOK();
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const match = COUNTABLE.exec(value);
    const n = match ? parseInt(match[2], 10) : 0;
    const countable = Boolean(match) && n >= 3 && !/^(19|20)\d{2}$/.test(value);
    const [shown, setShown] = useState<number | null>(null);

    useEffect(() => {
        if (!countable || !ok || !inView) return;
        const ctl = animate(0, n, { duration: 0.9, ease: EXPO, onUpdate: (v) => setShown(Math.round(v)) });
        return () => ctl.stop();
    }, [countable, ok, inView, n]);

    if (!countable || !ok || !match) return <span>{value}</span>;
    return (
        <span ref={ref} aria-label={value}>
            <span aria-hidden="true">
                {match[1]}
                {shown ?? (inView ? n : 0)}
                {match[3]}
            </span>
        </span>
    );
}

/** A 2px line along the header's bottom edge, in the scale's colour, as far as you have read. */
export function ReadingProgress({ scrollRef, color }: { scrollRef: RefObject<HTMLElement | null>; color: string }) {
    const { scrollYProgress } = useScroll({ container: scrollRef });
    return (
        <m.div
            aria-hidden="true"
            className="absolute left-0 right-0 -bottom-px h-[2px] origin-left"
            style={{ scaleX: scrollYProgress, background: color }}
        />
    );
}

/**
 * Which section the reader is in: the `data-spy` label of the last marked element to
 * cross the upper band of the window. An empty label (the hero) means "none".
 */
export function useSectionSpy(scrollRef: RefObject<HTMLElement | null>, key: string): string | null {
    const [current, setCurrent] = useState<string | null>(null);
    useEffect(() => {
        const root = scrollRef.current;
        if (!root) return;
        const els = [...root.querySelectorAll<HTMLElement>('[data-spy]')];
        if (els.length === 0) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) setCurrent(e.target.getAttribute('data-spy') || null);
            },
            { root, rootMargin: '-12% 0px -78% 0px' }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [scrollRef, key]);
    return current;
}
