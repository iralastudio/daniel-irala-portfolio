'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { StopId, LineId } from '@/types/metro';
import { metroStops } from '@/data/stops';
import { MetroLineNav } from './MetroLineNav';
import { cn } from '@/lib/cn';

// Content components
import { ProfileJourney } from '@/components/content/ProfileJourney';
import { ThinkingJourney } from '@/components/content/ThinkingJourney';
import { Podcast } from '@/components/content/Podcast';
import { Articles } from '@/components/content/Articles';
import { Reading } from '@/components/content/Reading';
import { ProjectDetail } from '@/components/content/ProjectDetail';
import { Experiments } from '@/components/content/Experiments';
import { MeetingExperience } from '@/components/content/projects/e2e-meeting-experience/MeetingExperience';
import { ITProductOffering } from '@/components/content/projects/it-product-offering/ITProductOffering';
import { TalksWorkshops } from '@/components/content/TalksWorkshops';

// Stops that render as continuous scroll journeys, keyed by line
const JOURNEY_STOPS: Partial<Record<string, StopId[]>> = {
    profile:  ['about-me', 'how-i-work', 'podcast', 'what-i-do', 'contact'],
    thinking: ['articles', 'workshops', 'reading', 'experiments'],
};

// Flat lookup: which stop belongs to which journey
const STOP_TO_JOURNEY: Partial<Record<StopId, 'profile' | 'thinking'>> = {
    'about-me': 'profile', 'how-i-work': 'profile', 'podcast': 'profile',
    'what-i-do': 'profile', 'contact': 'profile',
    'articles': 'thinking', 'workshops': 'thinking',
    'reading': 'thinking', 'experiments': 'thinking',
};

// Map stop IDs to components for standalone (non-journey) access
const contentMap: Partial<Record<StopId, React.ComponentType>> = {
    'podcast': Podcast,
    'articles': Articles,
    'reading': Reading,
    'meeting-experience': MeetingExperience,
    'product-offering': ITProductOffering,
    'it-key-roles': ProjectDetail,
    'experiments': Experiments,
    'workshops': TalksWorkshops,
    'home': () => <div className="text-white">Home Content Placeholder</div>,
};

const ContentFallback = ({ activeStop }: { activeStop: StopId | null }) => (
    <div className="text-gray-400">
        <h2 className="text-2xl font-bold text-white mb-4">Content Coming Soon</h2>
        <p>The content for <span className="text-[var(--line-projects)]">{activeStop}</span> is under construction.</p>
    </div>
);

export function Modal() {
    const { isOpen, activeStop, closeModal } = useModal();
    const { selectedLine } = useMetroMap();
    const { settings } = useAccessibility();
    const modalRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Determine the active line for scrollbar theming
    const activeLineId = useMemo((): LineId | null => {
        if (selectedLine) return selectedLine;
        if (activeStop) {
            const stop = metroStops[activeStop];
            if (stop && stop.lines.length > 0) {
                return stop.lines[0];
            }
        }
        return null;
    }, [selectedLine, activeStop]);

    // Build scrollbar class with line-specific variant
    const scrollbarClass = useMemo(() => {
        const baseClass = 'premium-scrollbar';
        if (activeLineId) {
            return `${baseClass} premium-scrollbar--${activeLineId}`;
        }
        return baseClass;
    }, [activeLineId]);

    // Keyboard handling for Escape key
    useEffect(() => {
        if (isOpen) {

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') closeModal();
            };

            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = '';
            };
        }
    }, [isOpen, closeModal]);

    // Only activate scroll journey when the active line matches that journey's line.
    // Transfer stops (e.g. podcast on Profile+Projects) render standalone when
    // opened from a line that has no journey (e.g. Projects).
    const stopJourney = activeStop ? STOP_TO_JOURNEY[activeStop] : undefined;
    const activeJourney = (() => {
        if (!stopJourney) return undefined;
        if (stopJourney === 'profile' && activeLineId === 'profile') return 'profile';
        if (stopJourney === 'thinking' && activeLineId === 'thinking') return 'thinking';
        return undefined;
    })();
    const ContentComponent = activeStop ? contentMap[activeStop] : null;

    // Stops that should use full-width layout without sidebar
    const fullWidthStops: StopId[] = [];
    const isFullWidth = activeStop ? fullWidthStops.includes(activeStop) : false;

    const shouldDisableScroll = false;

    // Wide stops need room for 2-column case study layouts
    const wideStops: StopId[] = ['meeting-experience', 'product-offering', 'experiments', 'workshops'];
    const isWide = activeStop ? wideStops.includes(activeStop) : false;

    return (
        <AnimatePresence>
            {isOpen && activeStop && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: settings.reduceMotion ? 0 : 0.2 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        onClick={closeModal}
                        aria-hidden="true"
                    />

                    {/* Full-Screen Modal */}
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: settings.reduceMotion ? 0 : 0.3,
                            ease: "easeOut"
                        }}
                        className="fixed inset-0 z-50 flex"
                    >
                        {/* Content Area (85% or 100% if full-width) */}
                        <div className={cn(
                            "w-full h-full bg-[#0a0a0a] overflow-y-auto md:overflow-y-hidden relative",
                            isFullWidth ? "md:w-full" : "md:w-[85%]"
                        )}>
                            {/* Mobile-only close button */}
                            <button
                                onClick={closeModal}
                                className={cn(
                                    "md:hidden absolute top-6 right-6 z-10",
                                    "flex items-center justify-center",
                                    "w-10 h-10 rounded-full",
                                    "bg-white/10 hover:bg-white/20",
                                    "text-white transition-all duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-white"
                                )}
                                aria-label="Back to Home Page"
                            >
                                <X size={20} />
                            </button>

                            {/* Content Container - Floating glass card */}
                            <div className="p-8 md:p-8 min-h-screen md:min-h-0 md:h-full md:flex md:items-center md:justify-center">
                                <div
                                    ref={scrollContainerRef}
                                    className={cn(
                                        "glass-backstage rounded-2xl p-8 md:p-10",
                                        isWide ? "max-w-5xl" : "max-w-4xl",
                                        shouldDisableScroll ? "" : "md:max-h-[90vh] md:overflow-y-auto",
                                        !shouldDisableScroll && scrollbarClass
                                    )}
                                >
                                    {activeJourney === 'profile'
                                        ? <ProfileJourney initialSection={activeStop!} scrollContainerRef={scrollContainerRef} />
                                        : activeJourney === 'thinking'
                                            ? <ThinkingJourney initialSection={activeStop!} scrollContainerRef={scrollContainerRef} />
                                            : ContentComponent
                                                ? <ContentComponent />
                                                : <ContentFallback activeStop={activeStop} />
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Metro Line Navigation Sidebar (15%) - Hidden for full-width stops */}
                        {!isFullWidth && (
                            <div className="hidden md:block w-[15%] h-full">
                                <MetroLineNav currentStop={activeStop} />
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
