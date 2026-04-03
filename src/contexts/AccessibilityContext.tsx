'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { AccessibilitySettings } from '@/types/accessibility';

const defaultSettings: AccessibilitySettings = {
    dyslexiaFont: false,
    reduceMotion: false,
    highContrast: false,
    textToVoice: false,
    textScale: 'normal',
};

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: <K extends keyof AccessibilitySettings>(
        key: K,
        value: AccessibilitySettings[K]
    ) => void;
    resetSettings: () => void;
    announce: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        if (typeof window === 'undefined') return defaultSettings;

        const stored = localStorage.getItem('accessibility-settings');
        let initialSettings = defaultSettings;

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Merge with defaults to handle new fields
                initialSettings = { ...defaultSettings, ...parsed };
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

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Save to localStorage and apply CSS/TTS when settings change
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('accessibility-settings', JSON.stringify(settings));

            // Apply CSS custom properties
            const doc = document.documentElement;
            doc.classList.toggle('dyslexia-font', settings.dyslexiaFont);
            doc.classList.toggle('reduce-motion', settings.reduceMotion);
            doc.classList.toggle('high-contrast', settings.highContrast);
            
            // Text Scale classes
            doc.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-extra-large');
            doc.classList.add(`text-scale-${settings.textScale}`);
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

    const announce = useCallback((text: string) => {
        if (!settings.textToVoice || typeof window === 'undefined') return;

        // Cancel previous speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    }, [settings.textToVoice]);

    const contextValue = useMemo(() => ({
        settings,
        updateSetting,
        resetSettings,
        announce
    }), [settings, updateSetting, resetSettings, announce]);

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
