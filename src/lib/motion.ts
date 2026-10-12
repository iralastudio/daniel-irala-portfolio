'use client';

import { useReducedMotion, type Variant, type Variants } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';

/**
 * Motion tokens for framer-motion (docs/MOTION-PLAN-2026-10-12.md, Phase 0).
 * The CSS mirror lives in globals.css (`--ease-out-expo`, `--ease-reveal`,
 * `--dur-*`); keep the two in step. Durations stay with the component that owns
 * them, chosen from the plan's tempo table, so only the curve and the variant
 * shapes are shared here.
 */

/** Entrances, camera-paired tweens, the window reveal. */
export const EXPO = [0.16, 1, 0.3, 1] as const;
/** Clip-path image reveals only (Phase 5). */
export const REVEAL = [0.77, 0, 0.175, 1] as const;

/** A parent that staggers its children in. */
export const stagger = (each: number, delay: number, exit?: Variant): Variants => ({
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: each, delayChildren: delay } },
    ...(exit ? { exit } : {}),
});

/** A child that rises `y` px into place over `duration` seconds on the EXPO curve. */
export const rise = (y: number, duration: number, exit?: Variant): Variants => ({
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration, ease: EXPO } },
    ...(exit ? { exit } : {}),
});

/**
 * True when motion may play. Honours BOTH the OS preference and the site's own
 * reduce-motion toggle (DisplayMenu): the two must always agree, or the toggle
 * silences CSS transitions while framer-driven motion carries on.
 */
export function useMotionOK(): boolean {
    const osReduced = useReducedMotion();
    const { settings } = useAccessibility();
    return !osReduced && !settings.reduceMotion;
}
