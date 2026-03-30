import { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

/**
 * Experiments Type Definitions
 *
 * Scalable configuration system for the Experiments station.
 * Add new experiments by creating a config entry - no parent component changes needed.
 */

// ============================================
// EXPERIMENT TYPES
// ============================================

export type ExperimentId = 'portfolio-site' | 'experiment-b' | 'experiment-c';

export interface NarrativeStep {
    id: string;
    title: string;
    subtitle?: string;
    content: string;
    icon: LucideIcon;
    /** Visual component to render in the sticky graphics panel */
    visualType: 'room' | 'building' | 'city' | 'metro' | 'custom';
    /** Optional image path for the visual */
    imagePath?: string;
}

export interface ExperimentConfig {
    id: ExperimentId;
    /** Short title shown in pill menu */
    menuLabel: string;
    /** Full title shown in content area */
    title: string;
    /** Subtitle/tagline */
    subtitle?: string;
    /** Main description paragraph */
    description: string;
    /** Narrative steps for scrollytelling */
    steps: NarrativeStep[];
    /** What was learned from this experiment */
    learned: string;
    /** Concluding statement */
    conclusion: string;
    /** Whether this experiment is ready to display */
    isActive: boolean;
}

// ============================================
// PILL MENU TYPES
// ============================================

export interface PillMenuItem {
    id: ExperimentId | 'coming-soon';
    label: string;
    isDisabled?: boolean;
}

// ============================================
// LAYOUT PROPS
// ============================================

export interface ExperimentsLayoutProps {
    /** Override the auto-detected line color */
    lineColor?: string;
}

export interface PillMenuProps {
    items: PillMenuItem[];
    activeId: ExperimentId | null;
    onSelect: (id: ExperimentId) => void;
    lineColor: string;
}

export interface PortfolioEvolutionProps {
    experiment: ExperimentConfig;
    lineColor: string;
}

export interface NarrativeVisualProps {
    step: NarrativeStep | undefined;
    isActive: boolean;
    lineColor: string;
}
