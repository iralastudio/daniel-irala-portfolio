'use client';

import { motion } from 'framer-motion';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/cn';

export function Header() {
    const { selectedLine, setSelectedLine } = useMetroMap();
    const { announce } = useAccessibility();

    const lines = [
        {
            id: 'profile',
            label: 'Profile',
            description: 'who I am',
            color: '#FF78C5',
            bgClass: 'bg-[var(--line-profile)]'
        },
        {
            id: 'projects',
            label: 'Projects',
            description: "case studies",
            color: '#B996F0',
            bgClass: 'bg-[var(--line-projects)]'
        },
        {
            id: 'thinking',
            label: 'Thinking',
            description: 'how I see the world',
            color: '#84E9FF',
            bgClass: 'bg-[var(--line-thinking)]'
        },
    ] as const;

    const specialtyTags = [
        "Qualitative & Quantitative Research",
        "Service Design",
        "Systems Thinking",
        "Enterprise Contexts",
        "Journey Management"
    ];

    return (
        <header className="px-8 md:px-16 pt-20 pb-8 md:pt-24 md:pb-12 flex flex-col min-h-full max-w-4xl z-10 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col h-full gap-6 md:gap-8"
            >

                <div className="flex flex-col gap-4">
                    {/* Role Tagline - uppercase small */}
                    <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-white/60">
                        Senior UX Researcher · Service Designer
                    </span>

                    {/* Main Title - Responsive sizing */}
                    <h1 className="text-[40px] md:text-[52px] font-bold tracking-tight leading-[1.08]">
                        <span className="text-white">Making meaning out of chaos because </span>
                        <span className="bg-gradient-to-r from-[#FF78C5] via-[#B996F0] to-[#84E9FF] bg-clip-text text-transparent">
                            clarity is a form of kindness.
                        </span>
                    </h1>

                    {/* Main Description */}
                    <p className="text-sm md:text-base leading-relaxed text-white/60 max-w-2xl font-light">
                        I design the systems behind the experience — mapping how organisations serve people, finding where they break, and helping teams align around solutions that hold together. Based in Barcelona, I work at the intersection of <span className="text-white font-medium">qualitative and quantitative research, service design, and systems thinking</span> inside large enterprise environments.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {specialtyTags.map((tag, index) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Currently At */}
                <div className="flex flex-col gap-3 pt-4 pb-2 border-t border-white/5">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/50">
                        Currently at
                    </span>
                    <div className="flex items-center">
                        <img
                            src="/images/logos/nestle.png"
                            alt="Nestlé"
                            className="h-16 w-auto object-contain opacity-50 grayscale brightness-0 invert hover:opacity-100 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Explore Section (Metro Navigation) */}
                <div className="flex flex-col gap-4 mt-auto pt-4">
                    <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-white/50">
                        Explore
                    </span>

                    <nav
                        className="flex flex-col gap-1 md:gap-1.5"
                        role="navigation"
                        aria-label="Metro navigation"
                    >
                        {lines.map((line, index) => {
                            const isSelected = selectedLine === line.id;
                            const isDimmed = selectedLine !== null && !isSelected;

                            return (
                                <motion.button
                                    key={line.id}
                                    onClick={() => {
                                        const nextState = isSelected ? null : line.id;
                                        setSelectedLine(nextState);
                                        if (nextState) {
                                            announce(`Selected ${line.label} line. ${line.description}`);
                                        } else {
                                            announce(`Deselected ${line.label} line.`);
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-4 group transition-all duration-300 cursor-pointer text-left -mx-2 px-2 py-2.5 md:py-1.5 rounded-lg border-l-2",
                                        "focus:outline-none focus:ring-2 focus:ring-white/40",
                                        isSelected ? "bg-white/5 border-l-current" : "border-l-transparent hover:bg-white/5"
                                    )}
                                    style={{
                                        borderLeftColor: isSelected ? line.color : 'transparent'
                                    }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    aria-label={`${line.label} ${line.description}`}
                                    aria-pressed={isSelected}
                                >
                                    {/* Line colored dot instead of line */}
                                    <motion.div
                                        className={cn("rounded-full flex-shrink-0 shadow-lg", line.bgClass)}
                                        style={{
                                            width: isSelected ? '12px' : '10px',
                                            height: isSelected ? '12px' : '10px',
                                            opacity: isDimmed ? 0.3 : 1,
                                            boxShadow: isSelected ? `0 0 15px ${line.color}80` : 'none'
                                        }}
                                        animate={{
                                            scale: isSelected ? 1.2 : 1,
                                        }}
                                    />

                                    {/* Label and Sub-label */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "text-sm md:text-base font-semibold transition-all duration-300",
                                                isSelected ? "text-white" : "text-white/70",
                                                "group-hover:text-white"
                                            )}
                                        >
                                            {line.label}
                                        </span>
                                        <span className="text-white/20 text-xs md:text-sm">―</span>
                                        <span
                                            className={cn(
                                                "text-xs md:text-sm italic transition-all duration-300",
                                                isSelected ? "text-white/60" : "text-white/30",
                                                "group-hover:text-white/50"
                                            )}
                                        >
                                            {line.description}
                                        </span>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </nav>
                </div>
            </motion.div>
        </header>
    );
}
