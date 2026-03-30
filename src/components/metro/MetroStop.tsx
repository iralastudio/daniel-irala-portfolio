'use client';

import { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useModal } from '@/hooks/useModal';
import { MetroStop as MetroStopType, LabelPosition } from '@/types/metro';
import { cn } from '@/lib/cn';
import { getContextAwareColor, isStationOnActiveLine } from '@/lib/colors';

interface MetroStopProps {
    stop: MetroStopType;
    isHighlighted: boolean;
    cx: number;
    cy: number;
    isMobile?: boolean;
}

// Calculate label offset and anchor based on position
function getLabelProps(position: LabelPosition, isMobile: boolean) {
    const offsetX = isMobile ? 12 : 18;
    const offsetY = isMobile ? 12 : 20;

    switch (position) {
        case 'left':
            return { dx: -offsetX, dy: 4, anchor: 'end' as const };
        case 'right':
            return { dx: offsetX, dy: 4, anchor: 'start' as const };
        case 'top':
            return { dx: 0, dy: -offsetY, anchor: 'middle' as const };
        case 'bottom':
            return { dx: 0, dy: offsetY + 8, anchor: 'middle' as const };
        default:
            return { dx: offsetX, dy: 4, anchor: 'start' as const };
    }
}

// Memoized component to prevent unnecessary re-renders
export const MetroStop = memo(function MetroStop({
    stop,
    isHighlighted,
    cx,
    cy,
    isMobile = false
}: MetroStopProps) {
    const { selectedLine, activeStop } = useMetroMap();
    const { settings } = useAccessibility();
    const { openModal, isOpen } = useModal();

    // Memoize computed values using centralized context-aware utilities
    const isOnSelectedLine = useMemo(() =>
        isStationOnActiveLine(stop.lines, selectedLine),
        [selectedLine, stop.lines]
    );

    const labelProps = useMemo(() =>
        getLabelProps(stop.labelPosition, isMobile),
        [stop.labelPosition, isMobile]
    );

    /**
     * CONTEXT-AWARE COLORING:
     * Color is STRICTLY derived from the active line context (selectedLine).
     * For shared stations like 'Experiments', the color follows the currently
     * selected line, NOT the station's first line in its array.
     */
    const primaryColor = useMemo(() =>
        getContextAwareColor(selectedLine, null, stop.lines[0]),
        [selectedLine, stop.lines]
    );

    // Home stop should not be clickable when we're on the main page (modal closed)
    const isHomeOnMainPage = stop.id === 'home' && !isOpen;
    const isClickable = !isHomeOnMainPage;

    // Memoize event handlers
    const handleClick = useCallback(() => {
        if (isHomeOnMainPage) return;
        openModal(stop.id);
    }, [isHomeOnMainPage, openModal, stop.id]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isHomeOnMainPage) return;
            openModal(stop.id);
        }
    }, [isHomeOnMainPage, openModal, stop.id]);

    // Home label is only visible when modal is open (so you can navigate back)
    // Other stops show labels when a line is selected or they're active
    const isLabelVisible = stop.id === 'home'
        ? isOpen
        : (selectedLine !== null || activeStop === stop.id);

    // Memoize transition config
    const transitionConfig = useMemo(() => ({
        duration: settings.reduceMotion ? 0 : 0.3
    }), [settings.reduceMotion]);

    // Memoize radii calculations
    const radii = useMemo(() => ({
        outerGlow: isHighlighted ? (isMobile ? 18 : 28) : (isMobile ? 10 : 16),
        ring: isMobile ? 7 : 11,
        core: isMobile ? 4 : 6,
        coreHighlighted: isMobile ? 5 : 7,
        innerDot: isMobile ? 2 : 3,
        focus: isMobile ? 10 : 16,
    }), [isHighlighted, isMobile]);

    // Memoize stroke widths
    const strokeWidths = useMemo(() => ({
        ring: isMobile ? 3 : 4,
        ringHighlighted: isMobile ? 4 : 5,
    }), [isMobile]);

    // Memoize style objects to prevent recreation
    const ringStyle = useMemo(() => ({
        filter: `drop-shadow(0 0 ${isHighlighted ? '6px' : '3px'} ${primaryColor})`
    }), [isHighlighted, primaryColor]);

    const coreStyle = useMemo(() => ({
        filter: isHighlighted ? 'drop-shadow(0 0 4px white)' : 'none'
    }), [isHighlighted]);

    const innerDotStyle = useMemo(() => ({
        filter: 'drop-shadow(0 0 2px white)'
    }), []);

    const labelStyle = useMemo(() => ({
        textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)',
        letterSpacing: isMobile ? '-0.02em' : 'normal'
    }), [isMobile]);

    // Memoize opacity calculations
    const groupOpacity = isOnSelectedLine || selectedLine === null ? 1 : 0.3;
    const glowOpacity = isHighlighted ? 0.5 : (isOnSelectedLine || selectedLine === null ? 0.25 : 0.1);
    const ringOpacity = isOnSelectedLine || selectedLine === null ? 1 : 0.4;
    const coreOpacity = isOnSelectedLine || selectedLine === null ? 1 : 0.5;

    return (
        <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: groupOpacity,
                scale: 1
            }}
            transition={transitionConfig}
            className={cn(
                "focus:outline-none group",
                isClickable ? "cursor-pointer" : "cursor-default"
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={isClickable ? 0 : -1}
            role="button"
            aria-label={isHomeOnMainPage ? "Home - You are here" : `View ${stop.name}`}
            aria-disabled={!isClickable}
        >
            {/* Layer 1: Outer glow halo (filtered, large radius) */}
            <motion.circle
                cx={cx}
                cy={cy}
                r={radii.outerGlow}
                fill={primaryColor}
                filter={isHighlighted ? "url(#glow-intense)" : "url(#glow-soft)"}
                animate={{
                    r: radii.outerGlow,
                    opacity: glowOpacity
                }}
                transition={transitionConfig}
            />

            {/* Layer 2: Colored ring (neon edge) */}
            <motion.circle
                cx={cx}
                cy={cy}
                r={radii.ring}
                fill="transparent"
                stroke={primaryColor}
                strokeWidth={strokeWidths.ring}
                animate={{
                    opacity: ringOpacity,
                    strokeWidth: isHighlighted ? strokeWidths.ringHighlighted : strokeWidths.ring
                }}
                transition={transitionConfig}
                style={ringStyle}
            />

            {/* Layer 3: White core (bright center) */}
            <motion.circle
                cx={cx}
                cy={cy}
                r={radii.core}
                fill="#FFFFFF"
                animate={{
                    r: isHighlighted ? radii.coreHighlighted : radii.core,
                    opacity: coreOpacity
                }}
                transition={transitionConfig}
                style={coreStyle}
            />

            {/* Layer 4: Inner bright dot (for extra glow on highlight) */}
            {isHighlighted && (
                <circle
                    cx={cx}
                    cy={cy}
                    r={radii.innerDot}
                    fill={primaryColor}
                    opacity={0.8}
                    style={innerDotStyle}
                />
            )}

            {/* Focus Ring (for keyboard users) */}
            <circle
                cx={cx}
                cy={cy}
                r={radii.focus}
                fill="transparent"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-0 group-focus-visible:opacity-100 outline-none"
            />

            {/* Stop name label - clean text with shadow */}
            {isLabelVisible && (
                <text
                    x={cx + labelProps.dx}
                    y={cy + (labelProps.dy > 0 ? labelProps.dy + 2 : labelProps.dy - 2)}
                    textAnchor={labelProps.anchor}
                    fill="#FFFFFF"
                    fontSize={isMobile ? 9 : 14}
                    fontWeight={(isHighlighted || activeStop === stop.id) ? 700 : 500}
                    className={cn(
                        "pointer-events-none",
                        !isHighlighted && !isOnSelectedLine && selectedLine !== null && "opacity-40",
                        settings.dyslexiaFont ? "font-sans" : "font-[family-name:var(--font-heading)]"
                    )}
                    style={labelStyle}
                >
                    {stop.name}
                </text>
            )}
        </motion.g>
    );
});
