'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AccessibilitySettings } from '@/types/accessibility';

const defaultSettings: AccessibilitySettings = {
    dyslexiaFont: false,
    reduceMotion: false,
    simplifyMap: false,
    highContrast: false,
    readingGuide: false,
};

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => void;
    resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        // Fallback for SSR
        if (typeof window === 'undefined') return defaultSettings;

        const stored = localStorage.getItem('accessibility-settings');
        let initialSettings = defaultSettings;

        if (stored) {
            try {
                initialSettings = JSON.parse(stored);
            } catch {
                console.error('Failed to parse accessibility settings');
            }
        }

        // Check system preference for reduced motion
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            initialSettings = { ...initialSettings, reduceMotion: true };
        }

        return initialSettings;
    });

    const [isHydrated, setIsHydrated] = useState(false);

    // Initial hydration flag
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    // Save to localStorage when settings change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('accessibility-settings', JSON.stringify(settings));

            // Apply CSS custom properties
            document.documentElement.classList.toggle(
                'dyslexia-font',
                settings.dyslexiaFont
            );
            document.documentElement.classList.toggle(
                'reduce-motion',
                settings.reduceMotion
            );
            document.documentElement.classList.toggle(
                'high-contrast',
                settings.highContrast
            );
        }
    }, [settings, isHydrated]);

    const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
        key: K,
        newValue: AccessibilitySettings[K]
    ) => {
        setSettings(prev => ({ ...prev, [key]: newValue }));
    }, []);

    const resetSettings = useCallback(() => {
        setSettings(defaultSettings);
    }, []);

    // CRITICAL: Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        settings,
        updateSetting,
        resetSettings
    }), [settings, updateSetting, resetSettings]);

    return (
        <AccessibilityContext.Provider value={contextValue}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within AccessibilityProvider');
    }
    return context;
}
