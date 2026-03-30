'use client';

import { memo, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { PORTFOLIO_SITE_EXPERIMENT } from '@/data/experiments';
import { NarrativeStep } from '@/types/experiments';
import { NarrativeVisual } from './NarrativeVisual';

/**
 * PortfolioEvolution Component
 *
 * A premium interactive experience that tells the story of how this
 * portfolio evolved through different metaphors: Room → Building → City → Metro.
 *
 * DESIGN PATTERN: Click-Driven Vertical Tabs
 * - Left: Interactive step menu (click to activate, expandable)
 * - Right: Fixed visual stage showing the active step's asset
 *
 * UX PRINCIPLE: User Control and Freedom
 * Users click to navigate, not fight with scroll position.
 */

interface PortfolioEvolutionProps {
    lineColor: string;
}

// ============================================
// STEP MENU ITEM (Memoized)
// ============================================

interface StepMenuItemProps {
    step: NarrativeStep;
    index: number;
    isActive: boolean;
    lineColor: string;
    onClick: () => void;
}

const StepMenuItem = memo(function StepMenuItem({
    step,
    index,
    isActive,
    lineColor,
    onClick
}: StepMenuItemProps) {
    const Icon = step.icon;

    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "w-full text-left rounded-xl border transition-all duration-300 relative",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-[var(--focus-ring-color)]",
                isActive
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
            )}
            style={{
                '--focus-ring-color': lineColor
            } as React.CSSProperties}
            initial={false}
            animate={{
                scale: isActive ? 1 : 0.98,
            }}
            whileHover={{ scale: isActive ? 1 : 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Header (always visible) */}
            <div className="flex items-center gap-3 p-4">
                {/* Step indicator line */}
                <div className="relative flex flex-col items-center">
                    {/* Number badge */}
                    <motion.div
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300",
                            isActive ? "border-white/30" : "border-white/10"
                        )}
                        style={{
                            backgroundColor: isActive ? `${lineColor}25` : 'transparent',
                            borderColor: isActive ? `${lineColor}50` : undefined
                        }}
                        animate={isActive ? {
                            boxShadow: [`0 0 0px ${lineColor}00`, `0 0 15px ${lineColor}30`, `0 0 0px ${lineColor}00`]
                        } : {}}
                        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                    >
                        <Icon
                            size={20}
                            className="transition-colors duration-300"
                            style={{ color: isActive ? lineColor : '#6b7280' }}
                        />
                    </motion.div>
                </div>

                {/* Title & Subtitle */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                                isActive ? "opacity-80" : "opacity-50"
                            )}
                            style={{ color: isActive ? lineColor : '#9ca3af' }}
                        >
                            Step {index + 1}
                        </span>
                    </div>
                    <h4 className={cn(
                        "font-semibold transition-colors duration-300",
                        isActive ? "text-white" : "text-gray-400"
                    )}>
                        {step.title}
                    </h4>
                    {step.subtitle && (
                        <p className={cn(
                            "text-xs transition-colors duration-300",
                            isActive ? "text-gray-400" : "text-gray-600"
                        )}>
                            {step.subtitle}
                        </p>
                    )}
                </div>

                {/* Expand indicator */}
                <motion.div
                    animate={{ rotate: isActive ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronRight
                        size={18}
                        className={cn(
                            "transition-colors duration-300",
                            isActive ? "text-white" : "text-gray-600"
                        )}
                    />
                </motion.div>
            </div>

            {/* Expandable content (only when active) */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-0">
                            <div
                                className="w-full h-px mb-3"
                                style={{ backgroundColor: `${lineColor}30` }}
                            />
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {step.content}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active indicator bar */}
            <motion.div
                className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
                style={{ backgroundColor: lineColor }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                    scaleY: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    );
});

// ============================================
// VISUAL STAGE (Fixed Right Panel)
// ============================================

interface VisualStageProps {
    activeStep: NarrativeStep | undefined;
    lineColor: string;
    activeStepIndex: number;
    totalSteps: number;
}

const VisualStage = memo(function VisualStage({
    activeStep,
    lineColor,
    activeStepIndex,
    totalSteps
}: VisualStageProps) {
    return (
        <div className="relative">
            {/* Visual Container - Metro styled card */}
            <motion.div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border bg-black/60"
                style={{
                    borderColor: `${lineColor}30`,
                    boxShadow: `0 0 40px ${lineColor}15, inset 0 0 80px ${lineColor}05`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Animated border glow */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-10"
                    style={{
                        border: `1px solid ${lineColor}`,
                        opacity: 0.4
                    }}
                    animate={{
                        boxShadow: [
                            `0 0 15px ${lineColor}20`,
                            `0 0 25px ${lineColor}40`,
                            `0 0 15px ${lineColor}20`
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Cross-fade Visual Container */}
                <AnimatePresence mode="wait">
                    <NarrativeVisual
                        key={activeStep?.id}
                        step={activeStep}
                        isActive={true}
                        lineColor={lineColor}
                    />
                </AnimatePresence>

                {/* Step indicator overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
                    <span
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-sm"
                        style={{ color: lineColor }}
                    >
                        {activeStep?.title}
                    </span>
                    <span className="text-xs text-gray-400 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {activeStepIndex + 1} / {totalSteps}
                    </span>
                </div>
            </motion.div>

            {/* Progress dots */}
            <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <motion.div
                        key={index}
                        className="w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer"
                        style={{
                            backgroundColor: index === activeStepIndex
                                ? lineColor
                                : 'rgba(255,255,255,0.2)'
                        }}
                        animate={index === activeStepIndex ? {
                            scale: [1, 1.4, 1]
                        } : { scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                ))}
            </div>
        </div>
    );
});

// ============================================
// WHAT I LEARNED SECTION (Split Layout)
// ============================================

interface LearnedSectionProps {
    learned: string;
    conclusion: string;
    lineColor: string;
}

const LearnedSection = memo(function LearnedSection({
    learned,
    conclusion,
    lineColor
}: LearnedSectionProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <motion.div
            className="rounded-3xl border border-white/10 overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${lineColor}10 0%, ${lineColor}05 100%)`
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {/* Split Layout: Text Left, Image Right (stacked on mobile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* LEFT: The Insight */}
                <div className="p-8 lg:p-10 space-y-4 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Sparkles style={{ color: lineColor }} />
                        What I Learned
                    </h3>
                    <p className="text-gray-300 leading-relaxed italic text-lg">
                        &quot;{learned}&quot;
                    </p>
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-white font-medium">
                            {conclusion}
                        </p>
                    </div>
                </div>

                {/* RIGHT: The Evidence (Antigravity IDE Screenshot) */}
                <div className="p-6 lg:p-8 lg:border-l border-t lg:border-t-0 border-white/10">
                    <motion.div
                        className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 group cursor-pointer"
                        style={{
                            boxShadow: `0 4px 20px ${lineColor}10, 0 0 40px ${lineColor}05`
                        }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                        {/* Image Container */}
                        <div className="relative aspect-video w-full">
                            <Image
                                src="/images/experiments/tool-antigravity.png"
                                alt="Antigravity IDE - The development environment where this portfolio was built"
                                fill
                                className={cn(
                                    "object-cover object-top transition-all duration-500",
                                    isImageLoaded ? "opacity-100" : "opacity-0"
                                )}
                                onLoad={() => setIsImageLoaded(true)}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />

                            {/* Loading placeholder */}
                            {!isImageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <div
                                        className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                                        style={{ borderColor: `${lineColor} transparent ${lineColor} ${lineColor}` }}
                                    />
                                </div>
                            )}

                            {/* Hover overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Subtle corner accents */}
                            <div
                                className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-xl opacity-30"
                                style={{ borderColor: lineColor }}
                            />
                            <div
                                className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-xl opacity-30"
                                style={{ borderColor: lineColor }}
                            />
                        </div>
                    </motion.div>

                    {/* Caption */}
                    <p className="mt-3 text-xs text-gray-500 text-center">
                        The Workbench:{' '}
                        <span style={{ color: lineColor }} className="font-medium">
                            Antigravity IDE
                        </span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

// ============================================
// MAIN COMPONENT
// ============================================

export const PortfolioEvolution = memo(function PortfolioEvolution({
    lineColor
}: PortfolioEvolutionProps) {
    const experiment = PORTFOLIO_SITE_EXPERIMENT;

    // Click-driven state - no scroll listeners!
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    // Memoize the active step
    const activeStep = useMemo(
        () => experiment.steps[activeStepIndex],
        [experiment.steps, activeStepIndex]
    );

    // Click handler for step selection
    const handleStepClick = useCallback((index: number) => {
        setActiveStepIndex(index);
    }, []);

    return (
        <div className="space-y-8">
            {/* Description Header */}
            <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: lineColor }}
                    />
                    {experiment.title}
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                    {experiment.description}
                </p>
            </motion.div>

            {/* ============================================
                INTERACTIVE VERTICAL TABS LAYOUT
                Left: Step Menu | Right: Visual Stage
                ============================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                {/* LEFT: Interactive Step Menu */}
                <div className="space-y-3 lg:order-1 order-2">
                    {experiment.steps.map((step, index) => (
                        <StepMenuItem
                            key={step.id}
                            step={step}
                            index={index}
                            isActive={index === activeStepIndex}
                            lineColor={lineColor}
                            onClick={() => handleStepClick(index)}
                        />
                    ))}
                </div>

                {/* RIGHT: Visual Stage (Fixed) */}
                <div className="lg:order-2 order-1 lg:sticky lg:top-20 lg:self-start">
                    <VisualStage
                        activeStep={activeStep}
                        lineColor={lineColor}
                        activeStepIndex={activeStepIndex}
                        totalSteps={experiment.steps.length}
                    />

                    {/* Mobile: Quick navigation hint */}
                    <p className="lg:hidden mt-4 text-xs text-gray-500 text-center">
                        Tap any step below to explore
                    </p>
                </div>
            </div>

            {/* What I Learned Section */}
            <LearnedSection
                learned={experiment.learned}
                conclusion={experiment.conclusion}
                lineColor={lineColor}
            />
        </div>
    );
});

export default PortfolioEvolution;
