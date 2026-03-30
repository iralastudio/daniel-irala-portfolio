'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CaseStudySectionProps {
    children: ReactNode;
    visual: ReactNode;
    reverse?: boolean;
}

export function CaseStudySection({ children, visual, reverse = false }: CaseStudySectionProps) {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* Narrative Column */}
            <div className={cn(
                "space-y-4",
                reverse && "lg:order-2"
            )}>
                {children}
            </div>

            {/* Visual Anchor Column — Sticky */}
            <div className={cn(
                reverse && "lg:order-1"
            )}>
                <div className="lg:sticky lg:top-0">
                    {/*
                     * Glow: static radial gradient background — no blur filter.
                     * The previous blur-3xl triggered a Gaussian blur composite on every
                     * frame during scroll, which was the primary source of jank.
                     * This pre-baked gradient achieves the same depth at zero runtime cost.
                     */}
                    <div className="relative">
                        <div
                            className="absolute -inset-6 rounded-3xl pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(185,150,240,0.08) 0%, rgba(132,233,255,0.04) 40%, transparent 70%)'
                            }}
                            aria-hidden="true"
                        />
                        <div className="relative">
                            {visual}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
