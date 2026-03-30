'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/cn';

interface Slide {
    src: string;
    alt: string;
    caption: string;
}

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (dir: number) => ({
        x: dir < 0 ? 300 : -300,
        opacity: 0,
    }),
};

export function JourneyCarousel({ slides }: { slides: Slide[] }) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);
    const { settings } = useAccessibility();

    const goTo = useCallback((index: number) => {
        setDirection(index > current ? 1 : -1);
        setCurrent(index);
    }, [current]);

    const prev = useCallback(() => {
        setDirection(-1);
        setCurrent(i => (i === 0 ? slides.length - 1 : i - 1));
    }, [slides.length]);

    const next = useCallback(() => {
        setDirection(1);
        setCurrent(i => (i === slides.length - 1 ? 0 : i + 1));
    }, [slides.length]);

    const animated = !settings.reduceMotion;

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl md:text-2xl font-bold text-white">Current-State Journey Mapping</h3>
                <span className="text-xs text-gray-500 font-mono tabular-nums">
                    {current + 1} / {slides.length}
                </span>
            </div>

            <p className="text-sm md:text-base text-gray-400">
                Mapping the meeting experience across four employee personas revealed systemic pain points and disconnects invisible from any single team&apos;s perspective.
            </p>

            <div
                className="relative bg-white/5 rounded-xl border border-[var(--line-projects)]/20 overflow-hidden"
                style={{ boxShadow: '0 0 24px rgba(185, 150, 240, 0.08)' }}
            >
                {/* Slide Area */}
                <div className="relative aspect-[21/9] bg-white overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={animated ? slideVariants : undefined}
                            initial={animated ? 'enter' : false}
                            animate="center"
                            exit={animated ? 'exit' : undefined}
                            transition={{
                                x: { type: 'tween', duration: 0.3, ease: 'easeInOut' },
                                opacity: { duration: 0.2 },
                            }}
                            className="absolute inset-0 will-change-transform"
                        >
                            <Image
                                src={slides[current].src}
                                alt={slides[current].alt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                                priority
                                quality={95}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--line-projects)]"
                        aria-label="Previous journey map"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--line-projects)]"
                        aria-label="Next journey map"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Caption + Dot Indicators */}
                <div className="p-4 md:p-5">
                    <p className="text-xs md:text-sm text-gray-400 italic text-center mb-3">
                        {slides[current].caption}
                    </p>

                    <div className="flex justify-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={cn(
                                    "h-2 rounded-full transition-all duration-300",
                                    i === current
                                        ? "w-6 bg-[var(--line-projects)]"
                                        : "w-2 bg-gray-600 hover:bg-gray-500"
                                )}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === current ? 'true' : undefined}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
