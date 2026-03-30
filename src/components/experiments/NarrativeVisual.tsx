'use client';

import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { NarrativeVisualProps } from '@/types/experiments';
import { AnimatedMetroSvg } from './AnimatedMetroSvg';

/**
 * NarrativeVisual Component
 *
 * Renders visuals for each narrative step of the portfolio evolution.
 * Supports both:
 * - Image assets (preferred when imagePath is provided)
 * - SVG fallback visuals (when no image is available)
 *
 * Features:
 * - Smooth cross-fade transitions via AnimatePresence
 * - Image preloading to prevent flickering
 * - Context-aware border coloring
 */

// ============================================
// IMAGE VISUAL COMPONENT
// ============================================

interface ImageVisualProps {
    imagePath: string;
    alt: string;
    lineColor: string;
}

const ImageVisual = memo(function ImageVisual({
    imagePath,
    alt,
    lineColor
}: ImageVisualProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div
            className="relative w-full h-full"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <Image
                src={imagePath}
                alt={alt}
                fill
                className="object-cover"
                onLoad={() => setIsLoaded(true)}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Gradient overlay for depth */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
            />

            {/* Subtle line-colored vignette */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    background: `radial-gradient(ellipse at center, transparent 40%, ${lineColor}20 100%)`
                }}
            />
        </motion.div>
    );
});

// ============================================
// SVG VISUAL COMPONENTS (Fallback)
// ============================================

interface VisualProps {
    lineColor: string;
}

// THE ROOM - A simple contained space
const RoomVisual = memo(function RoomVisual({ lineColor }: VisualProps) {
    return (
        <motion.svg
            viewBox="0 0 400 400"
            className="w-full h-full max-w-[300px] max-h-[300px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <defs>
                <radialGradient id="room-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#room-glow)" />
            <motion.rect
                x="100" y="100" width="200" height="200"
                fill="none" stroke={lineColor} strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.rect
                x="120" y="120" width="160" height="160"
                fill={`${lineColor}10`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.circle
                cx="200" cy="200" r="8" fill={lineColor}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 1, delay: 1 }}
            />
        </motion.svg>
    );
});

// THE BUILDING - Vertical structure with floors
const BuildingVisual = memo(function BuildingVisual({ lineColor }: VisualProps) {
    return (
        <motion.svg
            viewBox="0 0 400 400"
            className="w-full h-full max-w-[300px] max-h-[300px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <defs>
                <linearGradient id="building-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor={lineColor} stopOpacity="0.1" />
                    <stop offset="100%" stopColor={lineColor} stopOpacity="0.3" />
                </linearGradient>
            </defs>
            <motion.rect
                x="120" y="60" width="160" height="280"
                fill="url(#building-gradient)" stroke={lineColor} strokeWidth="2"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "center bottom" }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
            {[0, 1, 2, 3, 4].map((floor, index) => (
                <motion.line
                    key={floor}
                    x1="120" y1={300 - floor * 50} x2="280" y2={300 - floor * 50}
                    stroke={lineColor} strokeWidth="1" strokeOpacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                />
            ))}
        </motion.svg>
    );
});

// THE CITY - Complex urban grid
const CityVisual = memo(function CityVisual({ lineColor }: VisualProps) {
    const buildings = [
        { x: 50, y: 200, w: 50, h: 120 },
        { x: 110, y: 180, w: 40, h: 140 },
        { x: 160, y: 140, w: 60, h: 180 },
        { x: 230, y: 160, w: 50, h: 160 },
        { x: 290, y: 200, w: 60, h: 120 },
    ];

    return (
        <motion.svg
            viewBox="0 0 400 400"
            className="w-full h-full max-w-[300px] max-h-[300px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <defs>
                <linearGradient id="city-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={lineColor} stopOpacity="0.05" />
                    <stop offset="100%" stopColor={lineColor} stopOpacity="0.15" />
                </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="320" fill="url(#city-sky)" />
            {buildings.map((b, index) => (
                <motion.rect
                    key={index}
                    x={b.x} y={b.y} width={b.w} height={b.h}
                    fill={`${lineColor}20`} stroke={lineColor} strokeWidth="1"
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    style={{ transformOrigin: `${b.x + b.w / 2}px ${b.y + b.h}px` }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                />
            ))}
        </motion.svg>
    );
});

// THE METRO - Uses the full AnimatedMetroSvg component
// This is the premium animated visualization for the final step
const MetroVisual = memo(function MetroVisual({ lineColor }: VisualProps) {
    return <AnimatedMetroSvg lineColor={lineColor} className="w-full h-full" />;
});

// ============================================
// VISUAL TYPE MAPPING (SVG Fallbacks)
// ============================================

const VISUAL_COMPONENTS: Record<string, React.ComponentType<VisualProps>> = {
    room: RoomVisual,
    building: BuildingVisual,
    city: CityVisual,
    metro: MetroVisual,
    custom: RoomVisual,
};

// ============================================
// MAIN COMPONENT
// ============================================

export const NarrativeVisual = memo(function NarrativeVisual({
    step,
    isActive,
    lineColor
}: NarrativeVisualProps) {
    // Determine if we should use image or SVG fallback
    const hasImage = step?.imagePath;

    // Get SVG fallback component
    const SvgFallback = useMemo(
        () => step ? VISUAL_COMPONENTS[step.visualType] || RoomVisual : RoomVisual,
        [step]
    );

    if (!step) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">No visual</p>
            </div>
        );
    }

    // Render image if available, otherwise SVG fallback
    if (hasImage) {
        return (
            <ImageVisual
                imagePath={step.imagePath!}
                alt={step.title}
                lineColor={lineColor}
            />
        );
    }

    // SVG Fallback
    return (
        <motion.div
            className="w-full h-full flex items-center justify-center p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <SvgFallback lineColor={lineColor} />
        </motion.div>
    );
});

export default NarrativeVisual;
