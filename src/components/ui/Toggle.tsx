'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="mr-4">
                <label className="text-white font-medium block cursor-pointer" onClick={() => onChange(!checked)}>
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                )}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={cn(
                    "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[var(--line-thinking)]",
                    checked ? "bg-[var(--line-thinking)]" : "bg-gray-700"
                )}
            >
                <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className={cn(
                        "block w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none ml-1",
                        checked && "ml-6"
                    )}
                />
            </button>
        </div>
    );
}
