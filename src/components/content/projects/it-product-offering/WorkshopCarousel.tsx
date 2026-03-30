'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        src: '/images/Project Images/IT Product Offering/Personas-E2E.png',
        alt: 'Four enterprise personas developed from research: The Market Intermediary (bridges business and IT), The Business Requestor (initiates solution requests), The Global Product Steward (maintains global IT products), and The Governance Gatekeeper (controls approval processes) — each detailing background, core responsibilities, pains, behaviours, and needs.',
        caption: 'Enterprise Personas: Four behavioural archetypes grounded in research evidence',
    },
    {
        src: '/images/Project Images/IT Product Offering/Problems-Identified.jpg',
        alt: 'Overview of Selected Pain Points and Solutions direction — mapping diagnosed problems across Product Catalog and Information Discovery, Governance Process Efficiency, and Alternative Technology Solutions to their corresponding prioritised solution directions.',
        caption: 'Overview: Selected Pain Points & Solutions Direction',
    },
    {
        src: '/images/Project Images/IT Product Offering/Solution-01.png',
        alt: 'Workshop output board for "Clear Roles, Simple Gates, One Visible Path in Governance" — with two solution areas covering governance simplification, role clarity, accountability structures, dot-vote results, RACI matrices, and roadmaps.',
        caption: 'Solution 1: Clear Roles, Simple Gates, One Visible Path in Governance',
    },
    {
        src: '/images/Project Images/IT Product Offering/Solution-02.png',
        alt: 'Workshop output board for "Clarity First — Shared Standards + Problem Framing Formalization" — covering shared knowledge standards, request formalization, How Might We framing, minimum changes, success metrics, dot-vote prioritisation, RACI matrix, and roadmap.',
        caption: 'Solution 2: Clarity First — Shared Standards + Problem Framing Formalization',
    },
    {
        src: '/images/Project Images/IT Product Offering/Solution-03.png',
        alt: 'Workshop output board for "A Trusted, Complete, and Connected IT Product Catalog" — showing key ideas, How Might We framing, pain point mapping, minimum changes, success metrics, dot-vote prioritisation, RACI matrix, and implementation roadmap.',
        caption: 'Solution 3: A Trusted, Complete, and Connected IT Product Catalog',
    },
];

export function WorkshopCarousel() {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(0);

    const goTo = useCallback((index: number, dir: number) => {
        setDirection(dir);
        setCurrent(index);
    }, []);

    const prev = useCallback(() => {
        goTo(current === 0 ? slides.length - 1 : current - 1, -1);
    }, [current, goTo]);

    const next = useCallback(() => {
        goTo(current === slides.length - 1 ? 0 : current + 1, 1);
    }, [current, goTo]);

    const swipeThreshold = 50;

    return (
        <div
            className="bg-white/5 p-3 md:p-4 rounded-xl border border-[var(--line-projects)]/20"
            role="region"
            aria-roledescription="carousel"
            aria-label="Co-Creation Workshop Outputs"
        >
            {/* Slide area */}
            <div className="relative w-full aspect-[3/4] md:aspect-[16/9] overflow-hidden rounded-lg bg-white">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={current}
                        custom={direction}
                        initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.15}
                        onDragEnd={(_e, info) => {
                            if (info.offset.x > swipeThreshold) prev();
                            else if (info.offset.x < -swipeThreshold) next();
                        }}
                        className="absolute inset-0"
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${current + 1} of ${slides.length}`}
                    >
                        <Image
                            src={slides[current].src}
                            alt={slides[current].alt}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 1000px"
                            priority={current === 0}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation arrows */}
                <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 hover:border-[var(--line-projects)]/40 transition-all duration-200"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 hover:border-[var(--line-projects)]/40 transition-all duration-200"
                    aria-label="Next slide"
                >
                    <ChevronRight size={18} />
                </button>

                {/* Slide counter badge */}
                <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[10px] md:text-xs text-white/70 font-medium">
                    {current + 1} / {slides.length}
                </div>
            </div>

            {/* Caption + dot indicators */}
            <div className="mt-3 space-y-2">
                <p className="text-[10px] md:text-xs text-gray-500 italic text-center">
                    {slides[current].caption}
                </p>

                {/* Dot indicators */}
                <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Slide navigation">
                    {slides.map((slide, i) => (
                        <button
                            key={slide.src}
                            onClick={() => goTo(i, i > current ? 1 : -1)}
                            className={`rounded-full transition-all duration-300 ${i === current
                                    ? 'w-5 h-1.5 bg-[var(--line-projects)]'
                                    : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                                }`}
                            role="tab"
                            aria-selected={i === current}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
