'use client';

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { MetroProvider } from '@/contexts/MetroContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { LazyMotion, domAnimation } from 'framer-motion';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LazyMotion features={domAnimation}>
            <AccessibilityProvider>
                <MetroProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </MetroProvider>
            </AccessibilityProvider>
        </LazyMotion>
    );
}
