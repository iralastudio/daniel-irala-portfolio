'use client';

import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
    label: string;
    aspectRatio?: string;
}

export function ImagePlaceholder({ label, aspectRatio = '21/9' }: ImagePlaceholderProps) {
    return (
        <div
            className="relative bg-white/5 rounded-xl border border-[var(--line-projects)]/20 overflow-hidden"
            style={{ boxShadow: '0 0 24px rgba(185, 150, 240, 0.08)' }}
        >
            <div
                className="relative bg-gradient-to-br from-white/5 to-white/0 flex flex-col items-center justify-center"
                style={{ aspectRatio }}
            >
                <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-[var(--line-projects)]/30 mb-3" />
                <p className="text-sm md:text-base text-gray-500 font-medium">
                    {label}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Image coming soon
                </p>
            </div>
        </div>
    );
}
