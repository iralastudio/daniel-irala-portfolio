'use client';

import { useMetroMap } from '@/hooks/useMetroMap';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export function Navigation() {
    const { selectedLine, setSelectedLine } = useMetroMap();

    const lines = [
        { id: 'profile', label: 'Profile Line', color: '#FF78C5', bgClass: 'bg-[#FF78C5]' },
        { id: 'projects', label: 'Projects Line', color: '#B996F0', bgClass: 'bg-[#B996F0]' },
        { id: 'thinking', label: 'Thinking Line', color: '#84E9FF', bgClass: 'bg-[#84E9FF]' },
    ] as const;

    return (
        <nav
            className="fixed top-0 left-0 w-full z-20 flex justify-center pt-6 pointer-events-none"
            role="navigation"
            aria-label="Metro line navigation"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-auto flex flex-col items-center gap-3"
            >
                {/* Lines Container */}
                <div className="flex flex-col gap-2" role="group" aria-label="Metro lines">
                    {lines.map((line) => {
                        const isSelected = selectedLine === line.id;
                        const isDimmed = selectedLine !== null && !isSelected;

                        return (
                            <button
                                key={line.id}
                                onClick={() => setSelectedLine(isSelected ? null : line.id)}
                                className={cn(
                                    "h-1 rounded-full transition-all duration-300 cursor-pointer",
                                    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                                    "hover:opacity-70",
                                    isSelected ? "w-20 md:w-24" : "w-20",
                                    line.bgClass
                                )}
                                style={{
                                    opacity: isDimmed ? 0.2 : isSelected ? 1 : 0.5,
                                    height: isSelected ? '6px' : '4px',
                                }}
                                aria-label={`${line.label}${isSelected ? ' (selected)' : ''}`}
                                aria-pressed={isSelected}
                                tabIndex={0}
                            />
                        );
                    })}
                </div>

                {/* Labels Below Lines */}
                <div className="flex gap-4 text-xs md:text-sm text-gray-400 font-medium">
                    {lines.map((line) => {
                        const isSelected = selectedLine === line.id;
                        const isDimmed = selectedLine !== null && !isSelected;

                        return (
                            <span
                                key={`${line.id}-label`}
                                className={cn(
                                    "transition-all duration-300",
                                    isSelected && "text-white"
                                )}
                                style={{
                                    opacity: isDimmed ? 0.3 : 1,
                                }}
                            >
                                {line.label}
                            </span>
                        );
                    })}
                </div>
            </motion.div>
        </nav>
    );
}
