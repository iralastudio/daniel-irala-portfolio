'use client';

import { useMemo } from 'react';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useModal } from '@/hooks/useModal';
import { metroStops } from '@/data/stops';
import { getLineColor, getLineBrightColor, LINE_COLORS } from '@/lib/colors';
import { LineId } from '@/types/metro';

/**
 * useLineTheme Hook
 *
 * Provides context-aware theme colors based on the currently selected metro line.
 * This hook ensures consistent coloring throughout the application by:
 *
 * 1. Reading the globally selected line from MetroContext
 * 2. Falling back to the current modal stop's first line
 * 3. Providing both primary and bright color variants
 *
 * DESIGN PRINCIPLE:
 * The active line context determines ALL colors in the UI.
 * - If viewing Experiments via Thinking Line → Blue theme
 * - If viewing Experiments via Projects Line → Purple theme
 */

export interface LineTheme {
    /** Primary line color (e.g., #84E9FF for thinking) */
    color: string;
    /** Bright/lighter variant for highlights and cores */
    brightColor: string;
    /** The active line ID (if any) */
    lineId: LineId | null;
    /** CSS variable name for the line color */
    cssVar: string;
    /** Whether a line is actively selected */
    hasActiveLine: boolean;
    /** Tailwind-compatible color classes */
    classes: {
        bg: string;
        text: string;
        border: string;
        ring: string;
    };
}

export function useLineTheme(): LineTheme {
    const { selectedLine } = useMetroMap();
    const { activeStop } = useModal();

    return useMemo(() => {
        // Determine the effective line ID
        let effectiveLineId: LineId | null = selectedLine;

        // Fallback: If no line selected, derive from current stop
        if (!effectiveLineId && activeStop) {
            const stop = metroStops[activeStop];
            if (stop && stop.lines.length > 0) {
                effectiveLineId = stop.lines[0];
            }
        }

        // Get colors
        const color = effectiveLineId ? getLineColor(effectiveLineId) : LINE_COLORS.thinking;
        const brightColor = effectiveLineId ? getLineBrightColor(effectiveLineId) : LINE_COLORS.thinking;

        // Map line ID to CSS variable name
        const cssVarMap: Record<LineId, string> = {
            profile: '--line-profile',
            projects: '--line-projects',
            thinking: '--line-thinking'
        };

        const cssVar = effectiveLineId
            ? `var(${cssVarMap[effectiveLineId]})`
            : 'var(--line-thinking)';

        // Generate Tailwind-compatible classes (using arbitrary values)
        const classes = {
            bg: `bg-[${color}]`,
            text: `text-[${color}]`,
            border: `border-[${color}]`,
            ring: `ring-[${color}]`
        };

        return {
            color,
            brightColor,
            lineId: effectiveLineId,
            cssVar,
            hasActiveLine: effectiveLineId !== null,
            classes
        };
    }, [selectedLine, activeStop]);
}

/**
 * Utility hook for getting theme colors for a specific line
 * Useful when you need colors for a line other than the active one
 */
export function useLineColors(lineId: LineId | null) {
    return useMemo(() => ({
        color: getLineColor(lineId),
        brightColor: getLineBrightColor(lineId)
    }), [lineId]);
}
