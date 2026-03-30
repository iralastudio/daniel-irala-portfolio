'use client';

import { ExperimentsLayout } from '@/components/experiments';

/**
 * Experiments Content Component
 *
 * This is the entry point for the Experiments station content.
 * It delegates to ExperimentsLayout which provides:
 * - Context-aware coloring via useLineTheme
 * - PillMenu for experiment selection
 * - Dynamic viewport with AnimatePresence transitions
 * - Split-screen scrollytelling for the Portfolio Evolution experiment
 *
 * The component is designed to be scalable - new experiments can be
 * added by updating the configuration in data/experiments.ts without
 * modifying this component.
 */
export function Experiments() {
    return <ExperimentsLayout />;
}
