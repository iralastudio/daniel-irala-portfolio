'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLineTheme } from '@/hooks/useLineTheme';
import { PillMenu } from './PillMenu';
import { PortfolioEvolution } from './PortfolioEvolution';
import {
    getExperimentMenuItems,
    getExperimentById,
    getDefaultExperimentId
} from '@/data/experiments';
import { ExperimentId, ExperimentsLayoutProps } from '@/types/experiments';

/**
 * ExperimentsLayout Component
 *
 * Container component for the Experiments station that provides:
 * - Context-aware header with dynamic line color
 * - PillMenu for experiment selection
 * - Dynamic viewport that renders the appropriate experiment component
 * - AnimatePresence for smooth cross-fade transitions
 *
 * SCALABILITY:
 * To add a new experiment, simply:
 * 1. Add its config to data/experiments.ts
 * 2. Create its component
 * 3. Register it in the EXPERIMENT_COMPONENTS map below
 */

// ============================================
// EXPERIMENT COMPONENT REGISTRY
// ============================================

const EXPERIMENT_COMPONENTS: Record<ExperimentId, React.ComponentType<{ lineColor: string }>> = {
    'portfolio-site': PortfolioEvolution,
    'experiment-b': PlaceholderExperiment,
    'experiment-c': PlaceholderExperiment,
};

// Placeholder for future experiments
function PlaceholderExperiment({ lineColor }: { lineColor: string }) {
    return (
        <div className="flex items-center justify-center h-64 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-gray-500">Coming soon...</p>
        </div>
    );
}

// ============================================
// MAIN LAYOUT COMPONENT
// ============================================

export function ExperimentsLayout({ lineColor: overrideColor }: ExperimentsLayoutProps) {
    const theme = useLineTheme();
    const [activeExperimentId, setActiveExperimentId] = useState<ExperimentId>(getDefaultExperimentId());

    // Use override color if provided, otherwise use theme color
    const lineColor = overrideColor || theme.color;

    // Get menu items (memoized in the data layer)
    const menuItems = useMemo(() => getExperimentMenuItems(), []);

    // Get current experiment config
    const currentExperiment = useMemo(
        () => getExperimentById(activeExperimentId),
        [activeExperimentId]
    );

    // Get the component for the current experiment
    const ExperimentComponent = useMemo(
        () => EXPERIMENT_COMPONENTS[activeExperimentId] || PlaceholderExperiment,
        [activeExperimentId]
    );

    // Handle experiment selection
    const handleExperimentSelect = useCallback((id: ExperimentId) => {
        setActiveExperimentId(id);
    }, []);

    // Animation variants for cross-fade
    const contentVariants = useMemo(() => ({
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 }
    }), []);

    const transitionConfig = useMemo(() => ({
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number]
    }), []);

    return (
        <div className="space-y-6">
            {/* ============================================
                HEADER SECTION
                ============================================ */}
            <header className="space-y-4">
                {/* Title with context-aware accent */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Experiments
                    </h2>
                    <motion.div
                        className="h-1 w-20 rounded-full"
                        style={{ backgroundColor: lineColor }}
                        animate={{
                            boxShadow: `0 0 12px ${lineColor}60`
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                {/* Pill Menu */}
                <PillMenu
                    items={menuItems}
                    activeId={activeExperimentId}
                    onSelect={handleExperimentSelect}
                    lineColor={lineColor}
                />
            </header>

            {/* ============================================
                DYNAMIC VIEWPORT
                ============================================ */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeExperimentId}
                    variants={contentVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transitionConfig}
                >
                    {currentExperiment ? (
                        <ExperimentComponent lineColor={lineColor} />
                    ) : (
                        <PlaceholderExperiment lineColor={lineColor} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default ExperimentsLayout;
