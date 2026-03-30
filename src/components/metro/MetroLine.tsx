'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { MetroLine as MetroLineType } from '@/types/metro';
import { getLineBrightColor, LINE_COLORS } from '@/lib/colors';

interface MetroLineProps {
    line: MetroLineType;
    pathDefinition: string;
    isMobile?: boolean;
}

// Get the glow filter ID based on line ID
const GLOW_FILTER_MAP: Record<string, string> = {
    'profile': 'url(#glow-pink)',
    'projects': 'url(#glow-purple)',
    'thinking': 'url(#glow-cyan)',
};

// Memoized component to prevent unnecessary re-renders
export const MetroLine = memo(function MetroLine({
    line,
    pathDefinition,
    isMobile = false
}: MetroLineProps) {
    const { selectedLine } = useMetroMap();
    const { settings } = useAccessibility();

    const isSelected = selectedLine === line.id;
    const isDimmed = selectedLine !== null && !isSelected;

    // Memoize width calculations
    const widths = useMemo(() => ({
        glow: isMobile ? 5 : 10,
        base: isMobile ? 2.5 : 4,
        core: isMobile ? 1 : 1.5,
        selectedGlow: isMobile ? 6 : 12,
        selectedBase: isMobile ? 3 : 5,
        selectedCore: isMobile ? 1.5 : 2,
    }), [isMobile]);

    // Memoize filter and color lookups using centralized color utilities
    const glowFilter = GLOW_FILTER_MAP[line.id] || 'url(#glow-soft)';
    const coreColor = getLineBrightColor(line.id);

    // Memoize animation config
    const transitionConfig = useMemo(() => ({
        duration: settings.reduceMotion ? 0 : 1.5,
        ease: "easeInOut" as const
    }), [settings.reduceMotion]);

    // Memoize the core path style to prevent object recreation
    const coreStyle = useMemo(() => ({
        filter: isDimmed ? 'none' : 'drop-shadow(0 0 2px white)'
    }), [isDimmed]);

    return (
        <g className="metro-line-group">
            {/* Layer 1: Outer Glow Path (blurred, thicker, lower opacity) */}
            <motion.path
                d={pathDefinition}
                stroke={line.color}
                strokeWidth={isSelected ? widths.selectedGlow : widths.glow}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={glowFilter}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: 1,
                    opacity: isDimmed ? 0.05 : 0.4,
                    strokeWidth: isSelected ? widths.selectedGlow : widths.glow
                }}
                transition={transitionConfig}
            />

            {/* Layer 2: Base Colored Path (main visible line) */}
            <motion.path
                d={pathDefinition}
                stroke={line.color}
                strokeWidth={isSelected ? widths.selectedBase : widths.base}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: 1,
                    opacity: isDimmed ? 0.15 : 0.9,
                    strokeWidth: isSelected ? widths.selectedBase : widths.base
                }}
                transition={transitionConfig}
            />

            {/* Layer 3: Bright Core Path (sharp center, highest intensity) */}
            <motion.path
                d={pathDefinition}
                stroke={coreColor}
                strokeWidth={isSelected ? widths.selectedCore : widths.core}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: 1,
                    opacity: isDimmed ? 0.1 : 1,
                    strokeWidth: isSelected ? widths.selectedCore : widths.core
                }}
                transition={transitionConfig}
                style={coreStyle}
            />
        </g>
    );
});
