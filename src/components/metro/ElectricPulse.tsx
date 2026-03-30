'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';

interface ElectricPulseProps {
    pathDefinition: string;
    color: string;
    duration?: number;
    delay?: number;
}

// Get brighter/lighter color for the electric pulse core - MOVED OUTSIDE
const BRIGHT_COLOR_MAP: Record<string, string> = {
    '#FF78C5': '#FFBCE0', // Brighter pink
    '#B996F0': '#E0D0FF', // Brighter purple
    '#84E9FF': '#C8F5FF', // Brighter cyan
};

// Memoized component to prevent unnecessary re-renders
export const ElectricPulse = memo(function ElectricPulse({
    pathDefinition,
    color,
    duration = 3,
    delay = 0
}: ElectricPulseProps) {
    const { settings } = useAccessibility();

    // Early return for reduced motion - no hooks needed after this
    if (settings.reduceMotion) return null;

    const brightColor = BRIGHT_COLOR_MAP[color] || '#FFFFFF';

    // Memoize transition configs to prevent recreation
    const outerTransition = useMemo(() => ({
        duration: duration,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        delay: delay,
        repeatDelay: 2,
        times: [0, 0.1, 0.9, 1]
    }), [duration, delay]);

    const coreTransition = useMemo(() => ({
        duration: duration,
        repeat: Infinity,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
        delay: delay,
        repeatDelay: 2,
        times: [0, 0.1, 0.9, 1]
    }), [duration, delay]);

    // Memoize style objects
    const outerStyle = useMemo(() => ({
        strokeLinecap: 'round' as const
    }), []);

    const coreStyle = useMemo(() => ({
        strokeLinecap: 'round' as const,
        filter: 'drop-shadow(0 0 3px white)'
    }), []);

    // Memoize animation keyframes
    const outerAnimate = useMemo(() => ({
        pathLength: [0, 0.12, 0.12, 0],
        opacity: [0, 0.7, 0.7, 0],
        pathOffset: [0, 0, 0.88, 1]
    }), []);

    const coreAnimate = useMemo(() => ({
        pathLength: [0, 0.06, 0.06, 0],
        opacity: [0, 1, 1, 0],
        pathOffset: [0, 0.03, 0.94, 1]
    }), []);

    return (
        <g className="electric-pulse-group pointer-events-none">
            {/* Outer glow trail - REDUCED from 4 to 2 paths for performance */}
            <motion.path
                d={pathDefinition}
                stroke={color}
                strokeWidth={6}
                fill="none"
                filter="url(#glow-electric)"
                initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
                animate={outerAnimate}
                transition={outerTransition}
                style={outerStyle}
            />

            {/* Bright core (sharp, white-hot center) */}
            <motion.path
                d={pathDefinition}
                stroke={brightColor}
                strokeWidth={2}
                fill="none"
                initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
                animate={coreAnimate}
                transition={coreTransition}
                style={coreStyle}
            />
        </g>
    );
});
