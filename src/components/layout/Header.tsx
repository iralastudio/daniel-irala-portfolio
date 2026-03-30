'use client';

import { motion } from 'framer-motion';
import { useMetroMap } from '@/hooks/useMetroMap';
import { cn } from '@/lib/cn';

export function Header() {
    const { selectedLine, setSelectedLine } = useMetroMap();

    const lines = [
        { id: 'profile', label: 'Profile Line', color: '#FF78C5', bgClass: 'bg-[var(--line-profile)]' },
        { id: 'projects', label: 'Projects Line', color: '#B996F0', bgClass: 'bg-[var(--line-projects)]' },
        { id: 'thinking', label: 'Thinking Line', color: '#84E9FF', bgClass: 'bg-[var(--line-thinking)]' },
    ] as const;
    return (
        <header className="p-8 md:p-16 flex flex-col justify-center h-full max-w-2xl z-10 relative pointer-events-none">
            <div className="pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Main Tagline - 40px */}
                    <h1 className="text-[40px] font-bold tracking-tight mb-6 leading-tight">
                        <span className="text-white">Making meaning out of chaos because </span>
                        <span className="bg-gradient-to-r from-[#FF78C5] via-[#B996F0] to-[#84E9FF] bg-clip-text text-transparent">
                            clarity is a form of kindness.
                        </span>
                    </h1>

                    {/* Author Name - 20px */}
                    <p className="text-[20px] text-gray-300 font-normal mb-8 text-left" style={{ fontFamily: 'var(--font-body)' }}>
                        Daniel Irala
                    </p>

                    {/* Metro line navigation */}
                    <nav
                        className="flex flex-col gap-3"
                        role="navigation"
                        aria-label="Metro line navigation"
                    >
                        {lines.map((line, index) => {
                            const isSelected = selectedLine === line.id;
                            const isDimmed = selectedLine !== null && !isSelected;

                            return (
                                <motion.button
                                    key={line.id}
                                    onClick={() => setSelectedLine(isSelected ? null : line.id)}
                                    className={cn(
                                        "flex items-center gap-3 group transition-all duration-300 cursor-pointer rounded-lg px-3 py-2 -mx-1",
                                        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent",
                                        isSelected && "glass-frontstage",
                                        !isSelected && "hover:glass-backstage"
                                    )}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ x: isSelected ? 0 : 4 }}
                                    aria-label={`${line.label}${isSelected ? ' (selected)' : ''}`}
                                    aria-pressed={isSelected}
                                    tabIndex={0}
                                    style={{
                                        boxShadow: isSelected
                                            ? `0 0 20px ${line.color}40, var(--glass-shadow-2)`
                                            : undefined
                                    }}
                                >
                                    {/* Line indicator */}
                                    <motion.div
                                        className={cn("rounded-full", line.bgClass)}
                                        style={{
                                            width: isSelected ? '80px' : '64px',
                                            height: isSelected ? '6px' : '4px',
                                            opacity: isDimmed ? 0.2 : isSelected ? 1 : 0.5,
                                        }}
                                        animate={{
                                            width: isSelected ? '80px' : '64px',
                                            height: isSelected ? '6px' : '4px',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            "text-sm font-medium transition-all duration-300",
                                            isSelected ? "text-white font-semibold" : "text-gray-400",
                                            "group-hover:text-gray-200"
                                        )}
                                        style={{
                                            opacity: isDimmed ? 0.3 : 1,
                                        }}
                                    >
                                        {line.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </nav>
                </motion.div>
            </div>
        </header>
    );
}
