'use client';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { LazyMotion, domAnimation } from 'framer-motion';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LazyMotion features={domAnimation} strict>
            <AccessibilityProvider>
                {children}
            </AccessibilityProvider>
        </LazyMotion>
    );
}
