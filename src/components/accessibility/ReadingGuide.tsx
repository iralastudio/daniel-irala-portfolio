'use client';

import { useEffect, useState } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

export function ReadingGuide() {
    const { settings } = useAccessibility();
    const [position, setPosition] = useState(0);

    useEffect(() => {
        if (!settings.readingGuide) return;

        const handleMouseMove = (e: MouseEvent) => {
            setPosition(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [settings.readingGuide]);

    if (!settings.readingGuide) return null;

    return (
        <div
            className="fixed left-0 w-full h-1 bg-[var(--line-thinking)]/50 pointer-events-none z-[100] mix-blend-difference"
            style={{ top: position }}
        />
    );
}
