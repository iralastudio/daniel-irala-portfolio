import { Layout, Box, Map, Sparkles, Train } from 'lucide-react';
import { ExperimentConfig, PillMenuItem, ExperimentId } from '@/types/experiments';

/**
 * Experiments Configuration
 *
 * SCALABLE PATTERN:
 * To add a new experiment:
 * 1. Add the id to ExperimentId type in types/experiments.ts
 * 2. Create a new ExperimentConfig object below
 * 3. Add it to the EXPERIMENTS_MAP
 * 4. The PillMenu and viewport will automatically include it
 */

// ============================================
// EXPERIMENT CONFIGURATIONS
// ============================================

export const PORTFOLIO_SITE_EXPERIMENT: ExperimentConfig = {
    id: 'portfolio-site',
    menuLabel: 'Portfolio Site',
    title: 'Building This Site',
    subtitle: 'A Systems Thinking Exercise',
    description: 'This portfolio is itself a systems thinking exercise—an exploration of how AI tools and iterative design can shape something more intentional than a template.',
    steps: [
        {
            id: 'step-1',
            title: 'The Room',
            subtitle: 'Personal Space',
            content: 'From a personal space, where ideas are private and contained. Every portfolio begins somewhere intimate—a sketchbook, a notes app, a blank canvas. This is where raw thoughts live before they meet the world.',
            icon: Layout,
            visualType: 'room',
            imagePath: '/images/experiments/step-1-room.jpg'
        },
        {
            id: 'step-2',
            title: 'The Building',
            subtitle: 'Vertical Growth',
            content: 'Growing into a multi-level structure, exploring verticality and depth. Sections stack, hierarchies emerge, and navigation becomes necessary. The challenge: how do you move between floors without getting lost?',
            icon: Box,
            visualType: 'building',
            imagePath: '/images/experiments/step-2-building.jpg'
        },
        {
            id: 'step-3',
            title: 'The City',
            subtitle: 'Urban Complexity',
            content: 'Expanding into a complex urban system, where different functions coexist. Districts form around themes—work, thinking, projects. But cities can overwhelm. The question shifts from "what to include" to "how to wayfind."',
            icon: Map,
            visualType: 'city',
            imagePath: '/images/experiments/step-3-city.jpg'
        },
        {
            id: 'step-4',
            title: 'The Metro Line',
            subtitle: 'Clarity Through Metaphor',
            content: 'Connecting it all with a metro map. Lines become journeys, stops become destinations, transfers enable exploration. The complexity remains—but now there\'s a system to navigate it. Clarity through metaphor.',
            icon: Train,
            visualType: 'metro'
            // No imagePath - uses AnimatedMetroSvg component instead
        }
    ],
    learned: 'AI tools don\'t replace thinking—they accelerate iteration. Each tool brought a different lens: Gemini for rapid generation, Claude for refinement and structure, Bolt for implementation speed. The real work was knowing what to build, not just how to build it.',
    conclusion: 'This site is proof that experimentation compounds. What started as basic became intentional, one iteration at a time.',
    isActive: true
};

// Placeholder for future experiments
export const EXPERIMENT_B_PLACEHOLDER: ExperimentConfig = {
    id: 'experiment-b',
    menuLabel: 'Experiment B',
    title: 'Coming Soon',
    subtitle: 'In Development',
    description: 'A new experiment is brewing...',
    steps: [],
    learned: '',
    conclusion: '',
    isActive: false
};

// ============================================
// EXPERIMENTS MAP (Main Registry)
// ============================================

export const EXPERIMENTS_MAP: Record<ExperimentId, ExperimentConfig> = {
    'portfolio-site': PORTFOLIO_SITE_EXPERIMENT,
    'experiment-b': EXPERIMENT_B_PLACEHOLDER,
    'experiment-c': EXPERIMENT_B_PLACEHOLDER, // Reuse placeholder
};

// ============================================
// PILL MENU ITEMS (Derived from registry)
// ============================================

export function getExperimentMenuItems(): PillMenuItem[] {
    const activeItems: PillMenuItem[] = Object.values(EXPERIMENTS_MAP)
        .filter(exp => exp.isActive)
        .map(exp => ({
            id: exp.id,
            label: exp.menuLabel,
            isDisabled: false
        }));

    // Add "coming soon" placeholder
    activeItems.push({
        id: 'coming-soon',
        label: 'More coming soon...',
        isDisabled: true
    });

    return activeItems;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getExperimentById(id: ExperimentId): ExperimentConfig | null {
    return EXPERIMENTS_MAP[id] || null;
}

export function getActiveExperiments(): ExperimentConfig[] {
    return Object.values(EXPERIMENTS_MAP).filter(exp => exp.isActive);
}

export function getDefaultExperimentId(): ExperimentId {
    const active = getActiveExperiments();
    return active.length > 0 ? active[0].id : 'portfolio-site';
}
