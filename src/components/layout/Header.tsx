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
            description: "solutions co-created",
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
        "Service Design",
        "Systems Thinking",
        "Behavioral Science",
        "Enterprise & Healthcare",
        "Journey Management"
    ];

    return (
        <header className="px-8 md:px-16 pt-16 pb-8 md:pt-20 md:pb-12 flex flex-col min-h-full max-w-4xl z-10 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col h-full gap-4 md:gap-6"
            >

                <div className="flex flex-col gap-4">
                    {/* Role Tagline - uppercase small */}
                    <span className="text-[10px] md:text-[12px] uppercase tracking-[0.15em] font-medium text-white/60">
                        Service Design Lead · Systems Thinker
                    </span>

                    {/* Main Title - Responsive sizing */}
                    <h1 className="text-[28px] md:text-[38px] font-bold tracking-tight leading-[1.15]">
                        <span className="text-white">Making meaning out of chaos because </span>
                        <span className="bg-gradient-to-r from-[#FF78C5] via-[#B996F0] to-[#84E9FF] bg-clip-text text-transparent">
                            clarity is a form of kindness.
                        </span>
                    </h1>

                    {/* Main Description */}
                    <p className="text-[14px] md:text-[16px] leading-relaxed text-white/60 max-w-2xl font-light">
                        I design the systems behind the experience — mapping how organizations serve people, finding where they break, and <span className="text-white font-medium">bringing alignment to co-create the solutions</span> that hold them together. I work at the intersection of <span className="text-white font-medium">service design, systems thinking, and behavioral science</span> in enterprise and healthcare contexts.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {specialtyTags.map((tag, index) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] md:text-[12px] text-white/70 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Trusted By Section (Re-positioned) */}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-white/40">
                        Trusted By
                    </span>
                    <div className="flex items-center gap-6 h-10 transition-all duration-500">
                        {/* Nestle Logo - Monochromatic & Bigger */}
                        <img
                            src="/images/logos/nestle.png"
                            alt="Nestle"
                            className="h-20 w-auto object-contain opacity-40 grayscale brightness-0 invert hover:opacity-100 transition-all duration-300"
                        />
                        {/* Placeholder for other logos */}
                        <div className="w-16 h-5 bg-white/5 rounded-sm opacity-10" />
                        <div className="w-20 h-5 bg-white/5 rounded-sm opacity-5" />
                    </div>
                </div>

                {/* Explore Section (Metro Navigation) */}
                <div className="flex flex-col gap-4 mt-auto pt-4">
                    <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold text-white/40">
                        Explore
                    </span>

                    <nav
                        className="flex flex-col gap-1 md:gap-2"
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
                                        "flex items-center gap-4 group transition-all duration-300 cursor-pointer text-left -mx-2 px-2 py-1 rounded-lg",
                                        "focus:outline-none focus:ring-1 focus:ring-white/20",
                                        isSelected && "bg-white/5",
                                        !isSelected && "hover:bg-white/5"
                                    )}
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
                                                "text-[15px] md:text-[17px] font-semibold transition-all duration-300",
                                                isSelected ? "text-white" : "text-white/70",
                                                "group-hover:text-white"
                                            )}
                                        >
                                            {line.label}
                                        </span>
                                        <span className="text-white/20 text-[13px] md:text-[15px]">―</span>
                                        <span
                                            className={cn(
                                                "text-[13px] md:text-[15px] italic transition-all duration-300",
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
