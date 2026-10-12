'use client';

import { useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import type { ContentListItem } from '@/data/nodeContent';
import { cn } from '@/lib/cn';
import { EXPO } from '@/lib/motion';

/**
 * Compass — the referential rendering of the #compass window: the six things
 * that steer the work (Vision · Mission · Values · Direction · Future · Past)
 * laid out around a dial, with a NEEDLE that swings to whichever direction you
 * point at. Choosing a direction rotates the needle to it and reveals its line.
 *
 * The plain-text of all six lines still lives, server-rendered, in
 * CrawlableContent (as a <dl>), so SEO / screen readers get the full substance;
 * here the same items become an instrument you can actually read a heading off.
 *
 * Motion is CSS transform on the SVG needle group (transitions cleanly, and
 * html.reduce-motion collapses the duration globally — the needle then snaps).
 */

const VB = 340; // svg viewBox is 0 0 VB VB
const C = VB / 2; // centre
const RING_R = 98; // dial ring radius (the white face fills to here)
const LABEL_R = 142; // radius the labels sit at — well outside the white face
const NEEDLE_N = 78; // north (accent) tip length
const NEEDLE_S = 48; // south (muted) tail length

// Angle of item i, measured clockwise from north (top). Six items → 60° apart.
const angleOf = (i: number, n: number) => (i * 360) / n;

// Point on a circle of radius r at angle θ (deg, clockwise from north).
function polar(r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180; // -90 so 0° is up
    return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

export function Compass({ items }: { items: ContentListItem[] }) {
    const [active, setActive] = useState(0);
    const n = items.length;
    const angle = angleOf(active, n);

    const move = useCallback(
        (dir: 1 | -1) => setActive((i) => (i + dir + n) % n),
        [n]
    );

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                move(1);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                move(-1);
            }
        },
        [move]
    );

    return (
        <div className="mt-8 flex flex-col items-center">
            {/* The instrument. Labels are the controls; the dial is decorative. */}
            <div
                role="group"
                aria-label="The compass — choose what steers the work"
                onKeyDown={onKeyDown}
                className="relative w-full max-w-[360px] aspect-square mx-auto select-none"
            >
                <svg viewBox={`0 0 ${VB} ${VB}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
                    {/* the white face — kept inside the ring so the labels never sit on it */}
                    <circle cx={C} cy={C} r={RING_R} fill="color-mix(in srgb, var(--color-surface) 60%, transparent)" />
                    {/* dial ring */}
                    <circle cx={C} cy={C} r={RING_R} fill="none" stroke="var(--color-text-primary)" strokeOpacity="0.14" strokeWidth="1.5" />
                    <circle cx={C} cy={C} r={RING_R - 12} fill="none" stroke="var(--color-text-primary)" strokeOpacity="0.06" strokeWidth="1" />

                    {/* one tick per direction; the active tick is accent */}
                    {items.map((_, i) => {
                        const a = angleOf(i, n);
                        const outer = polar(RING_R, a);
                        const inner = polar(RING_R - 14, a);
                        const on = i === active;
                        return (
                            <line
                                key={i}
                                x1={inner.x}
                                y1={inner.y}
                                x2={outer.x}
                                y2={outer.y}
                                stroke={on ? 'var(--color-accent)' : 'var(--color-text-primary)'}
                                strokeOpacity={on ? 1 : 0.25}
                                strokeWidth={on ? 2.5 : 1.5}
                                strokeLinecap="round"
                                style={{ transition: 'stroke 0.3s, stroke-opacity 0.3s, stroke-width 0.3s' }}
                            />
                        );
                    })}

                    {/* the needle — rotates to the active direction */}
                    <g
                        style={{
                            transform: `rotate(${angle}deg)`,
                            transformOrigin: `${C}px ${C}px`,
                            transformBox: 'view-box',
                            transition: 'transform 0.7s var(--ease-out-expo)',
                        }}
                    >
                        {/* south tail (muted) */}
                        <path d={`M ${C} ${C} L ${C - 7} ${C} L ${C} ${C + NEEDLE_S} L ${C + 7} ${C} Z`} fill="var(--color-text-primary)" fillOpacity="0.32" />
                        {/* north tip (accent) */}
                        <path d={`M ${C} ${C} L ${C - 7} ${C} L ${C} ${C - NEEDLE_N} L ${C + 7} ${C} Z`} fill="var(--color-accent)" />
                    </g>

                    {/* hub */}
                    <circle cx={C} cy={C} r="8" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="2" />
                    <circle cx={C} cy={C} r="2.5" fill="var(--color-accent)" />
                </svg>

                {/* label controls, positioned around the ring */}
                {items.map((item, i) => {
                    const a = angleOf(i, n);
                    const p = polar(LABEL_R, a);
                    const on = i === active;
                    return (
                        <button
                            key={item.term}
                            type="button"
                            onClick={() => setActive(i)}
                            onPointerEnter={(e) => {
                                if (e.pointerType === 'mouse') setActive(i);
                            }}
                            onFocus={() => setActive(i)}
                            aria-pressed={on}
                            className={cn(
                                'absolute font-display font-semibold whitespace-nowrap rounded-sm px-2.5 py-1 transition-[color,background-color,transform] duration-300 ease-out',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                on ? 'text-accent scale-105' : 'text-ink/55 hover:text-ink'
                            )}
                            style={{
                                left: `${(p.x / VB) * 100}%`,
                                top: `${(p.y / VB) * 100}%`,
                                transform: 'translate(-50%, -50%)',
                                fontSize: 'var(--step-0)',
                            }}
                        >
                            {item.term}
                        </button>
                    );
                })}
            </div>

            {/* the reading — the active direction's line. aria-live so a keyboard /
                screen-reader user hears each heading as the needle swings. */}
            <div className="mt-7 min-h-[5.5rem] w-full max-w-[46ch] text-center" aria-live="polite">
                <AnimatePresence mode="wait">
                    <m.div
                        key={active}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: EXPO }}
                    >
                        <div className="label-mono !text-accent mb-2">{items[active].term}</div>
                        <p className="text-ink-soft" style={{ fontSize: 'var(--step-0)', lineHeight: 1.6 }}>
                            {items[active].text}
                        </p>
                    </m.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
