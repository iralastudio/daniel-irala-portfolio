'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TourStep {
    title: string;
    description: string;
    position: { top?: string; bottom?: string; left?: string; right?: string };
}

const tourSteps: TourStep[] = [
    {
        title: '1. Explore Metro Lines',
        description: 'Click any colored line in the header to filter and view stations on that line.',
        position: { top: '80px', left: '50%' }
    },
    {
        title: '2. View Station Details',
        description: 'Click on any station dot on the metro map to open its content and explore.',
        position: { top: '50%', left: '50%' }
    },
    {
        title: '3. Transfer Between Lines',
        description: 'Use the colored dots next to station names in the sidebar to switch between interconnected lines.',
        position: { top: '50%', right: '30px' }
    },
    {
        title: '4. Return Home',
        description: 'Click the "Home Page" station anytime to return to the main map view.',
        position: { top: '50%', right: '30px' }
    }
];

interface TourGuideProps {
    isActive: boolean;
    onComplete: () => void;
}

export function TourGuide({ isActive, onComplete }: TourGuideProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onComplete();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isActive, onComplete]);

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    if (!isActive) return null;

    const step = tourSteps[currentStep];
    const isLastStep = currentStep === tourSteps.length - 1;

    return (
        <AnimatePresence>
            {isActive && (
                <>
                    {/* Dark overlay with spotlight effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                        style={{
                            background: 'radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), transparent 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.85) 100%)'
                        }}
                    />

                    {/* Tour tooltip */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed z-[201]"
                        style={{
                            top: step.position.top,
                            bottom: step.position.bottom,
                            left: step.position.left,
                            right: step.position.right,
                            transform: step.position.left === '50%' ? 'translateX(-50%)' :
                                      step.position.top === '50%' ? 'translateY(-50%)' : undefined
                        }}
                    >
                        <div className="glass-frontstage rounded-xl p-6 max-w-sm relative">
                            {/* Close button */}
                            <button
                                onClick={handleSkip}
                                className={cn(
                                    "absolute top-3 right-3",
                                    "w-6 h-6 rounded-full",
                                    "flex items-center justify-center",
                                    "text-gray-400 hover:text-white",
                                    "hover:bg-white/10 transition-all duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-white"
                                )}
                                aria-label="Skip tour"
                            >
                                <X size={14} />
                            </button>

                            {/* Content */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white pr-6">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Progress indicators */}
                                <div className="flex items-center gap-2 pt-2">
                                    {tourSteps.map((_, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                index === currentStep
                                                    ? "w-8 bg-white"
                                                    : index < currentStep
                                                    ? "w-1.5 bg-white/60"
                                                    : "w-1.5 bg-white/20"
                                            )}
                                        />
                                    ))}
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleSkip}
                                        className={cn(
                                            "flex-1 px-4 py-2 rounded-lg",
                                            "bg-white/10 hover:bg-white/20",
                                            "text-white text-sm font-medium transition-all duration-200",
                                            "focus:outline-none focus:ring-2 focus:ring-white"
                                        )}
                                    >
                                        Skip tour
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className={cn(
                                            "flex-1 px-4 py-2 rounded-lg",
                                            "bg-white text-black font-semibold text-sm",
                                            "hover:bg-gray-200 transition-all duration-200",
                                            "focus:outline-none focus:ring-2 focus:ring-white",
                                            "flex items-center justify-center gap-2"
                                        )}
                                    >
                                        {isLastStep ? 'Finish' : 'Next'}
                                        {!isLastStep && <ChevronRight size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
