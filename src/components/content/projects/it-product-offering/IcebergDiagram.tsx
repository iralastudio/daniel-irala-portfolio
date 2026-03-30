'use client';

import { motion } from 'framer-motion';

const surfaceProblem = {
    title: 'IT Solutions Adoption',
    description: 'Low adoption and trust in IT offering',
};

const hiddenChallenges = [
    {
        title: 'Alternative Technology Solutions',
        description:
            'Markets often bypass standard IT channels due to slow governance and unclear ownership, seeking faster, local alternatives.',
    },
    {
        title: 'Product Catalog & Information Discovery',
        description:
            'IT service information is fragmented, overly technical, and hard to find — leading to low adoption and trust.',
    },
    {
        title: 'Unclear Funding / Ownership',
        description:
            'Unclear boundaries between IT and business funding responsibilities delay innovation and create confusion.',
    },
    {
        title: 'Governance Process Efficiency',
        description:
            'Governance is layered and slow, with unclear decision rights.',
    },
];

const outOfScope = [
    'BRM/FRM Role Clarity & Implementation Consistency',
    'Market Representation & Voice',
];

export function IcebergDiagram() {
    return (
        <figure
            role="figure"
            aria-label="Iceberg model diagram showing that low IT solution adoption is the visible symptom, while hidden root causes include alternative technology solutions, poor discoverability, unclear funding, and slow governance."
            className="w-full rounded-xl overflow-hidden border border-white/10"
        >
            {/* ─── Title ─── */}
            <figcaption className="px-5 md:px-8 py-4 md:py-5 bg-[var(--glass-bg-1)] border-b border-[var(--glass-border-1)]">
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    <span className="text-white font-semibold">
                        If nothing changes beneath the surface,
                    </span>{' '}
                    what patterns or problems will keep showing up above it?
                </p>
            </figcaption>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── ABOVE THE SURFACE ─── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div
                className="relative overflow-hidden px-5 md:px-8 pt-6 md:pt-8 pb-16 md:pb-20"
                style={{
                    background:
                        'linear-gradient(180deg, rgba(185,150,240,0.06) 0%, rgba(185,150,240,0.03) 50%, rgba(10,10,10,0.95) 100%)',
                }}
            >
                {/* Decorative: atmospheric glow */}
                <div
                    className="absolute top-0 left-1/4 w-1/2 h-3/4 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse at top, rgba(185,150,240,0.08) 0%, transparent 70%)',
                    }}
                    aria-hidden="true"
                />

                {/* Section label */}
                <p className="relative z-10 text-[10px] md:text-xs text-[var(--line-projects)]/50 uppercase tracking-[0.2em] font-medium mb-5 md:mb-7">
                    Above the surface
                </p>

                {/* Content: Iceberg tip + visible problem */}
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">

                    {/* ─── Iceberg Tip SVG ─── */}
                    <div className="flex-shrink-0" aria-hidden="true">
                        <svg
                            viewBox="0 0 200 140"
                            className="w-28 h-20 md:w-40 md:h-28 lg:w-48 lg:h-32"
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="iceberg-tip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--line-profile)" stopOpacity="0.35" />
                                    <stop offset="50%" stopColor="var(--line-projects)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="var(--line-thinking)" stopOpacity="0.25" />
                                </linearGradient>
                                <linearGradient id="iceberg-tip-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="var(--line-profile)" stopOpacity="0.5" />
                                    <stop offset="50%" stopColor="var(--line-projects)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="var(--line-thinking)" stopOpacity="0.3" />
                                </linearGradient>
                                <filter id="tip-glow">
                                    <feGaussianBlur stdDeviation="6" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {/* Glow layer */}
                            <polygon
                                points="100,15 165,125 35,125"
                                fill="url(#iceberg-tip-grad)"
                                filter="url(#tip-glow)"
                                opacity="0.5"
                            />
                            {/* Main shape */}
                            <polygon
                                points="100,15 165,125 35,125"
                                fill="url(#iceberg-tip-grad)"
                            />
                            {/* Edge highlight */}
                            <polygon
                                points="100,15 165,125 35,125"
                                fill="none"
                                stroke="url(#iceberg-tip-edge)"
                                strokeWidth="1"
                            />
                            {/* Shimmer at base */}
                            <line
                                x1="20" y1="130" x2="180" y2="130"
                                stroke="var(--line-projects)"
                                strokeOpacity="0.15"
                                strokeWidth="1"
                            />
                        </svg>
                    </div>

                    {/* ─── Connector line (desktop) ─── */}
                    <div
                        className="hidden sm:block w-8 md:w-12 border-t border-dashed border-[var(--line-projects)]/30"
                        aria-hidden="true"
                    />

                    {/* ─── Surface Problem Card ─── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full sm:max-w-xs"
                    >
                        <div className="bg-white/5 rounded-lg p-4 md:p-5 border border-[var(--line-projects)]/30 border-l-2 border-l-[var(--line-projects)] hover:border-[var(--line-projects)]/50 transition-all duration-300 shadow-lg shadow-black/20">
                            <h4 className="text-sm md:text-base font-bold text-[var(--line-projects)] mb-1.5">
                                {surfaceProblem.title}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                {surfaceProblem.description}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Waterline Wave ─── */}
                <div className="absolute bottom-0 left-0 right-0 z-20" aria-hidden="true">
                    <svg
                        viewBox="0 0 1440 50"
                        fill="none"
                        preserveAspectRatio="none"
                        className="w-full h-5 md:h-7 block"
                    >
                        <defs>
                            <linearGradient id="waterline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--line-profile)" stopOpacity="0.3" />
                                <stop offset="50%" stopColor="var(--line-projects)" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="var(--line-thinking)" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        {/* Fill below the wave */}
                        <path
                            d="M0,25 C180,10 360,40 540,25 C720,10 900,40 1080,25 C1260,10 1440,40 1440,25 L1440,50 L0,50 Z"
                            fill="var(--background)"
                        />
                        {/* Gradient wave stroke */}
                        <path
                            d="M0,25 C180,10 360,40 540,25 C720,10 900,40 1080,25 C1260,10 1440,40 1440,25"
                            stroke="url(#waterline-grad)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── HIDDEN BELOW THE SURFACE ─── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div
                className="relative overflow-hidden px-5 md:px-8 py-6 md:py-10"
                style={{
                    background:
                        'linear-gradient(180deg, var(--background) 0%, #050508 100%)',
                }}
            >
                {/* Decorative: iceberg body SVG silhouette */}
                <div className="absolute inset-0 flex justify-center pointer-events-none" aria-hidden="true">
                    <svg
                        viewBox="0 0 300 400"
                        className="w-56 md:w-72 lg:w-80 h-full"
                        fill="none"
                        preserveAspectRatio="xMidYMin slice"
                    >
                        <defs>
                            <linearGradient id="iceberg-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--line-profile)" stopOpacity="0.07" />
                                <stop offset="50%" stopColor="var(--line-projects)" stopOpacity="0.05" />
                                <stop offset="100%" stopColor="var(--line-thinking)" stopOpacity="0.03" />
                            </linearGradient>
                            <filter id="body-glow">
                                <feGaussianBlur stdDeviation="12" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        {/* Outer glow */}
                        <polygon
                            points="110,0 190,0 220,80 245,180 240,280 225,350 200,390 100,390 75,350 60,280 55,180 80,80"
                            fill="url(#iceberg-body-grad)"
                            filter="url(#body-glow)"
                            opacity="0.6"
                        />
                        {/* Main shape */}
                        <polygon
                            points="110,0 190,0 220,80 245,180 240,280 225,350 200,390 100,390 75,350 60,280 55,180 80,80"
                            fill="url(#iceberg-body-grad)"
                        />
                    </svg>
                </div>

                {/* Section label */}
                <p className="relative z-10 text-[10px] md:text-xs text-[var(--line-projects)]/30 uppercase tracking-[0.2em] font-medium mb-5 md:mb-7">
                    Hidden below the surface
                </p>

                {/* Hidden Challenge Cards — 2×2 grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {hiddenChallenges.map((challenge, i) => (
                        <motion.div
                            key={challenge.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.12 * (i + 1) }}
                        >
                            <div className="bg-white/5 rounded-lg p-4 md:p-5 border border-[var(--line-projects)]/20 hover:border-[var(--line-projects)]/40 transition-all duration-300 h-full">
                                <div className="flex items-start gap-3 mb-2">
                                    {/* Numbered badge */}
                                    <span
                                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-[var(--line-projects)]/30"
                                        style={{
                                            background: 'linear-gradient(135deg, var(--line-profile), var(--line-projects), var(--line-thinking))',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h4 className="text-xs md:text-sm font-bold text-[var(--line-projects)]">
                                        {challenge.title}
                                    </h4>
                                </div>
                                <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed pl-9">
                                    {challenge.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* ─── OUT OF SCOPE ─── */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="px-5 md:px-8 py-3 md:py-4 border-t border-white/5 bg-white/[0.02]">
                <p className="text-[10px] md:text-xs text-gray-600 uppercase tracking-[0.15em] font-medium mb-2">
                    Out of scope for the workshop
                </p>
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-5">
                    {outOfScope.map((item) => (
                        <span
                            key={item}
                            className="text-[10px] md:text-xs text-gray-500/70 italic flex items-center gap-2"
                        >
                            <span
                                className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0"
                                aria-hidden="true"
                            />
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </figure>
    );
}
