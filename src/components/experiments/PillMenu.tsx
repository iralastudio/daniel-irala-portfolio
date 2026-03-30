'use client';

import { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { PillMenuProps, PillMenuItem, ExperimentId } from '@/types/experiments';

/**
 * PillMenu Component
 *
 * A horizontal menu with pill-shaped buttons and spring physics animations.
 * Features:
 * - Context-aware coloring via lineColor prop
 * - Spring-based selection indicator that slides between items
 * - Disabled state for "coming soon" items
 * - Keyboard accessible
 */

// ============================================
// PILL BUTTON (Memoized)
// ============================================

interface PillButtonProps {
    item: PillMenuItem;
    isActive: boolean;
    lineColor: string;
    onClick: () => void;
}

const PillButton = memo(function PillButton({
    item,
    isActive,
    lineColor,
    onClick
}: PillButtonProps) {
    const handleClick = useCallback(() => {
        if (!item.isDisabled) {
            onClick();
        }
    }, [item.isDisabled, onClick]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !item.isDisabled) {
            e.preventDefault();
            onClick();
        }
    }, [item.isDisabled, onClick]);

    return (
        <motion.button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={item.isDisabled}
            className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                "whitespace-nowrap z-10",
                item.isDisabled
                    ? "text-gray-600 cursor-not-allowed italic"
                    : isActive
                        ? "text-black"
                        : "text-gray-400 hover:text-gray-200"
            )}
            whileHover={!item.isDisabled && !isActive ? { scale: 1.02 } : undefined}
            whileTap={!item.isDisabled ? { scale: 0.98 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            aria-pressed={isActive}
            aria-disabled={item.isDisabled}
            role="tab"
            tabIndex={item.isDisabled ? -1 : 0}
        >
            {item.label}
        </motion.button>
    );
});

// ============================================
// MAIN PILL MENU COMPONENT
// ============================================

export const PillMenu = memo(function PillMenu({
    items,
    activeId,
    onSelect,
    lineColor
}: PillMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    // Calculate indicator position based on active item
    useEffect(() => {
        if (!containerRef.current || !activeId) return;

        const container = containerRef.current;
        const activeIndex = items.findIndex(item => item.id === activeId);
        if (activeIndex === -1) return;

        const buttons = container.querySelectorAll('button:not([disabled])');
        const activeButton = buttons[activeIndex] as HTMLElement;

        if (activeButton) {
            const containerRect = container.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();

            setIndicatorStyle({
                left: buttonRect.left - containerRect.left,
                width: buttonRect.width
            });
        }
    }, [activeId, items]);

    // Memoize handlers
    const handleSelect = useCallback((id: ExperimentId) => {
        onSelect(id);
    }, [onSelect]);

    // Memoize spring config for the sliding indicator
    const springConfig = useMemo(() => ({
        type: 'spring' as const,
        stiffness: 380,
        damping: 30,
        mass: 0.8
    }), []);

    // Memoize glow style
    const glowStyle = useMemo(() => ({
        backgroundColor: lineColor,
        boxShadow: `0 0 20px ${lineColor}60, 0 0 40px ${lineColor}30`
    }), [lineColor]);

    return (
        <div
            ref={containerRef}
            className="relative flex gap-1 p-1 bg-white/5 rounded-full border border-white/10 overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Experiment selection"
        >
            {/* Sliding Indicator - renders behind active button */}
            <AnimatePresence>
                {activeId && indicatorStyle.width > 0 && (
                    <motion.div
                        className="absolute top-1 bottom-1 rounded-full pointer-events-none"
                        style={glowStyle}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            left: indicatorStyle.left,
                            width: indicatorStyle.width
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={springConfig}
                        layoutId="pill-indicator"
                    />
                )}
            </AnimatePresence>

            {/* Pill Buttons */}
            {items.map((item) => (
                <PillButton
                    key={item.id}
                    item={item}
                    isActive={item.id === activeId}
                    lineColor={lineColor}
                    onClick={() => {
                        if (item.id !== 'coming-soon') {
                            handleSelect(item.id as ExperimentId);
                        }
                    }}
                />
            ))}
        </div>
    );
});

export default PillMenu;
