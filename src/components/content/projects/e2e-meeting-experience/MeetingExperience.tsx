'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { KeyMetricsDisplay } from './KeyMetricsDisplay';
import { CaseStudyLayout } from '@/components/content/shared/CaseStudyLayout';
import { CaseStudyHero } from '@/components/content/shared/CaseStudyHero';
import { CaseStudySection } from '@/components/content/shared/CaseStudySection';

// Dynamically import heavy visual components
const SiloDiagram = dynamic(() => import('./SiloDiagram').then(m => m.SiloDiagram), {
    loading: () => <div className="w-full aspect-[5/4] animate-pulse bg-white/5 rounded-xl border border-white/10" />
});

const JourneyCarousel = dynamic(() => import('./JourneyCarousel').then(m => m.JourneyCarousel), {
    loading: () => <div className="w-full aspect-[21/9] animate-pulse bg-white/5 rounded-xl border border-white/10" />
});

const CoreInsightVisual = dynamic(() => import('./CoreInsightVisual').then(m => m.CoreInsightVisual), {
    loading: () => <div className="w-full h-64 animate-pulse bg-white/5 rounded-2xl border border-white/10" />
});

const journeySlides = [
    {
        src: '/images/Project Images/Seamless Conferencing/Journey 1.PNG',
        alt: 'Front-stage journey map showing employee personas, touchpoints, and pain points across the meeting lifecycle',
        caption: 'Front-stage journey: employee personas navigating the meeting experience',
    },
    {
        src: '/images/Project Images/Seamless Conferencing/Journey 2.PNG',
        alt: 'Continuation of the journey map showing additional employee personas and friction points',
        caption: 'Continuation: additional personas revealing cross-cutting pain points',
    },
    {
        src: '/images/Project Images/Seamless Conferencing/Journey Back end.PNG',
        alt: 'Backend journey map showing IT and Facilities backstage operations supporting the meeting experience',
        caption: 'Backstage layer: IT and Facilities operations — the invisible infrastructure',
    },
];

export function MeetingExperience() {
    return (
        <CaseStudyLayout>
            <CaseStudyHero
                category="Service Design & Research | Digital Experience | 2024–2025"
                title="Redesigning the End-to-End Meeting Experience Across Nestlé"
            />

            {/* ─── Impact Bar — Animated Counters ─── */}
            <KeyMetricsDisplay />

            {/* ─── ACT 1: Context & Challenge + Silo Diagram ─── */}
            <CaseStudySection
                visual={<SiloDiagram />}
            >
                <h3 className="text-xl md:text-2xl font-bold text-white">Context &amp; Challenge</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Nestlé&apos;s workforce of 270,000+ employees relied on meetings as their primary collaboration tool — yet the experience was fragmented and inconsistent.
                </p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Technical performance data, experience data, and operational data existed in separate silos, making it impossible to understand what employees actually experienced from scheduling to follow-up.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    Without a unified view, leadership couldn&apos;t diagnose issues holistically or prioritize the right investments.
                </p>
            </CaseStudySection>

            {/* ─── ACT 2: My Role & Approach + Backcasting Diagram ─── */}
            <CaseStudySection
                reverse
                visual={
                    <div className="glass-backstage p-3 md:p-4 rounded-xl">
                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-white">
                            <Image
                                src="/images/Project Images/Seamless Conferencing/Approach.PNG"
                                alt="Backcasting model diagram: moving from current challenges through strategic decisions to the future vision"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-500 italic text-center mt-3">
                            Backcasting model: designing from the future backward
                        </p>
                    </div>
                }
            >
                <h3 className="text-xl md:text-2xl font-bold text-white">My Role &amp; Approach</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    As lead design researcher and service designer, I owned the end-to-end research strategy — from planning and execution to stakeholder alignment and delivery.
                </p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    I designed a multi-phase research approach: synthesizing previous studies, conducting 25 in-depth interviews across 5 global zones, and validating pain points through a 322-response survey.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    I mentored a graduate researcher throughout, and worked directly with the product owner to shape the approach, propose direction, and ensure on-time delivery of every phase.
                </p>
            </CaseStudySection>

            {/* ─── Core Insight — Dynamic Visual Component ─── */}
            <section className="relative py-4 md:py-8">
                <CoreInsightVisual />
            </section>

            {/* ─── Journey Carousel — Current State Maps ─── */}
            <JourneyCarousel slides={journeySlides} />

            {/* ─── ACT 3: Design Response + Envision Journey ─── */}
            <CaseStudySection
                visual={
                    <div className="glass-backstage p-3 md:p-4 rounded-xl">
                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-white">
                            <Image
                                src="/images/Project Images/Seamless Conferencing/Envision Journey.PNG"
                                alt="Future-state journey map: the envisioned meeting experience organized in three phases — before, during, and after the meeting"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-500 italic text-center mt-3">
                            Future-state journey: before, during, after — with integrated touchpoints
                        </p>
                    </div>
                }
            >
                <h3 className="text-xl md:text-2xl font-bold text-white">Design Response</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    I mapped the current-state journey across four distinct employee personas and an IT/Facilities backstage layer, revealing systemic disconnects invisible from any single team&apos;s perspective.
                </p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Using a backcasting model, I then facilitated envisioning workshops where key stakeholders defined a shared vision statement and co-created a future-state journey organized around three phases: before, during, and after the meeting.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    This produced a prioritized feature roadmap assessed against feasibility, ownership, and tool dependencies — translating systemic insight into actionable, governed interventions rather than isolated feature requests.
                </p>
            </CaseStudySection>

            {/* ─── Impact & Outcomes ─── */}
            <section className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-white">Impact &amp; Outcomes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">Employee experience</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Identified and validated the top 5 pain points for both virtual and in-person meetings, grounded in evidence from 347 participants across all global zones — giving leadership a trusted, user-centered foundation for investment decisions.
                        </p>
                    </div>
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">Service level</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Established journey mapping and experience-level agreements (XLAs) as operational tools, shifting measurement from technical KPIs to experience-driven indicators that reflect what employees actually feel.
                        </p>
                    </div>
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">Organizational level</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Gained OCIO endorsement to apply the methodology to other digital experiences, creating a repeatable, scalable model. Positioned journey management as the connective layer between data, process, and experience across the enterprise.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Reflection ─── */}
            <section className="pt-6 md:pt-8 border-t border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Reflection</h3>
                <p className="text-sm md:text-base text-gray-400 italic leading-relaxed max-w-3xl">
                    This project reinforced that in enterprise-scale service design, the most impactful intervention is often not a new feature — it&apos;s making the organization see its own experience as one connected system, not a collection of tools managed by separate teams.
                </p>
            </section>
        </CaseStudyLayout>
    );
}
