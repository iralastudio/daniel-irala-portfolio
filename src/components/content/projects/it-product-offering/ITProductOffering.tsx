'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ImagePlaceholder } from '../shared/ImagePlaceholder';
import { CaseStudyLayout } from '@/components/content/shared/CaseStudyLayout';
import { CaseStudyHero } from '@/components/content/shared/CaseStudyHero';
import { CaseStudyMetrics } from '@/components/content/shared/CaseStudyMetrics';

const IcebergDiagram = dynamic(() => import('./IcebergDiagram').then(m => m.IcebergDiagram), {
    loading: () => <div className="w-full aspect-[4/3] animate-pulse bg-white/5 rounded-xl border border-[var(--line-projects)]/20" />
});

const WorkshopCarousel = dynamic(() => import('./WorkshopCarousel').then(m => m.WorkshopCarousel), {
    loading: () => <div className="w-full aspect-[16/9] animate-pulse bg-white/5 rounded-xl border border-[var(--line-projects)]/20" />
});

const metrics = [
    { value: 40, label: 'In-Depth Interviews', suffix: '+' },
    { value: 70, label: 'Survey Responses', suffix: '+' },
    { value: 4, label: 'Core Personas', suffix: '' },
    { value: 12, label: 'Pain Points Diagnosed', suffix: '' },
];

export function ITProductOffering() {
    return (
        <CaseStudyLayout>
            <CaseStudyHero
                category="Service Design & Research · IT Governance · 2024–2025"
                title="Redesigning How an Organization Discovers and Adopts IT Solutions"
            />

            <CaseStudyMetrics metrics={metrics} />

            {/* ─── The Challenge ─── */}
            <section className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white">The Challenge</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    A Fortune 500 FMCG company operated hundreds of IT products globally — but markets couldn&apos;t find them, didn&apos;t trust them, and often built their own.
                </p>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    The product catalog was incomplete and overly technical, approval processes spanned five governance layers with no clear decision rights, and 58% of stakeholders reported shadow initiatives emerging when alignment broke down.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    The result: duplicated investment, eroding trust in central IT, and slower digital acceleration.
                </p>
            </section>

            {/* ─── Challenge Overview: Iceberg Diagram ─── */}
            <IcebergDiagram />

            {/* ─── My Role ─── */}
            <section className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white">My Role</h3>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Lead Design Researcher &amp; Service Designer — I owned the research strategy, synthesis, journey mapping, and workshop facilitation end to end. I planned the approach and aligned it with the Product Owner, mentored a graduate researcher, and delivered every phase on schedule.
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                    I designed the research instruments, ran statistical sample sizing, built the insight cards and personas, and facilitated the co-creation workshop that produced the prioritized solution roadmap.
                </p>
            </section>

            {/* ─── Core Insight — Full-Width Pullquote ─── */}
            <section className="relative py-8 md:py-10">
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                    style={{
                        background: 'linear-gradient(to bottom, var(--line-profile), var(--line-projects), var(--line-thinking))',
                    }}
                />
                <div className="pl-6 md:pl-8 space-y-4">
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--line-projects)]">
                        The Insight That Changed the Frame
                    </h3>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug">
                        The problem wasn&apos;t the products — it was that the system had no shared way to find, evaluate, or fund them.
                    </p>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl">
                        54% of respondents relied on personal networks and informal channels over the official catalog. Only 25% felt delivery pace met business needs. 66% found the approval path difficult to navigate.
                    </p>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl">
                        Markets weren&apos;t rejecting IT solutions — they couldn&apos;t see them, and when they could, they couldn&apos;t get them fast enough.
                    </p>
                    <p className="text-sm md:text-base text-gray-400 italic leading-relaxed">
                        This reframed the challenge from &quot;improve the catalog&quot; to &quot;redesign the entire offering experience — from discovery through governance to adoption.&quot;
                    </p>
                </div>
            </section>

            {/* ─── Image Placeholder: Insight Visualization ─── */}
            <ImagePlaceholder label="Research Findings & Data Visualization" />

            {/* ─── What I Did ─── */}
            <section className="space-y-6 md:space-y-8">
                <h3 className="text-xl md:text-2xl font-bold text-white">What I Did</h3>

                <div className="space-y-5">
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.01] transition-transform duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">1. Research &amp; Evidence Base — Surfacing Systemic Challenges</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Conducted 40+ interviews across Business Relationship Managers (BRMs), Functional Relationship Managers (FRMs), Product Owners, and market stakeholders — supplemented by a 70+ response survey with statistically validated sample sizing (95% confidence). Synthesised findings into six high-confidence insight cards that exposed systemic challenges, structural feedback loops, and the root causes behind low adoption and trust.
                        </p>
                    </div>

                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.01] transition-transform duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">2. Journey Mapping &amp; Structural Diagnosis — Assessing the As-Is Experience</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Mapped the full E2E journey from demand intake to post-launch support, identified three Moments That Matter (Decision Velocity, Priority at Intake, Findability at Discovery), and built a stakeholder map across Business and IT layers. Developed four enterprise personas — The Market Intermediary, The Governance Gatekeeper, The Global Product Steward, and The Business Requestor — each grounded in behavioural patterns and validated pain points to anchor the diagnosis in real user experiences.
                        </p>
                    </div>

                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.01] transition-transform duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">3. Co-Creation &amp; Future-State Vision — Aligning Cross-Functional Teams</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Facilitated a three-session stakeholder workshop (research sharing → ideation → planning) that brought Business, IT, and market teams around a shared understanding of the current experience. Produced prioritised solutions with ownership and success metrics. Defined the future-state vision: <strong className="text-white">Discoverability over Complexity, Clarity over Ambiguity, Efficiency over Redundancy, Transparency over Opacity, Seamless Experience over Fragmentation.</strong>
                        </p>
                    </div>

                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.01] transition-transform duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">4. Solution Validation &amp; Roadmap — Connecting with Owners</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Connected directly with the owners of each prioritised solution to assess feasibility, define dependencies, and validate implementation scope. Built the roadmap using a back-casting approach — starting from the desired future state and working backwards to identify the concrete steps, sequencing, and ownership needed to get there.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── E2E Journey Map Visual ─── */}
            <div className="glass-backstage p-3 md:p-4 rounded-xl">
                <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-lg bg-white">
                    <Image
                        src="/images/Project Images/IT Product Offering/Journey-Pain-Points-Light.png"
                        alt="E2E Journey Map showing the full IT solution lifecycle across Trigger, Understand, Initiate, and Complete/Roll Out phases — with swimlanes for global, local, and market stakeholders, front-stage and back-stage touchpoints, and diagnosed pain points mapped at each stage."
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 1000px"
                    />
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 italic text-center mt-3">
                    E2E Journey Map: Mapping the structural friction from demand intake to deployment
                </p>
            </div>

            {/* ─── Workshop Outputs & Personas Carousel ─── */}
            <WorkshopCarousel />

            {/* ─── Outcomes ─── */}
            <section className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-white">Outcomes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">AI &amp; automation unlocked</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            The E2E journey became a strategic input for identifying and sizing AI and automation use cases across IT workflows — connecting research directly to transformation planning.
                        </p>
                    </div>
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">Process integration</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Journey insights were embedded into the APM entry process, ensuring real employee challenges shape how new solutions enter the ecosystem.
                        </p>
                    </div>
                    <div className="glass-frontstage p-4 md:p-5 rounded-lg hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(185,150,240,0.15)] hover:border-[var(--line-projects)]/40 transition-all duration-300">
                        <h4 className="text-base md:text-lg font-bold text-[var(--line-projects)] mb-2">Reusable methodology</h4>
                        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                            Positioned Journey Management as a repeatable model — ensuring process, product, and automation teams work from a shared, evidence-based understanding of the current experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Reflection ─── */}
            <section className="pt-6 md:pt-8 border-t border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Reflection</h3>
                <p className="text-sm md:text-base text-gray-400 italic leading-relaxed max-w-3xl">
                    This project confirmed that governance isn&apos;t a constraint to design around — it&apos;s the design challenge itself. When people bypass the system, the answer isn&apos;t more control; it&apos;s making the right path the easiest path.
                </p>
            </section>
        </CaseStudyLayout>
    );
}
