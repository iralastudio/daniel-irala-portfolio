'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useModal } from '@/hooks/useModal';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';

export function AccessibilityPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, updateSetting, resetSettings } = useAccessibility();
    const { isOpen: modalIsOpen } = useModal();

    // Hide accessibility panel when modal is open to avoid overlap
    if (modalIsOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 bg-[#111] border border-white/10 rounded-lg shadow-2xl p-6 w-80"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Accessibility</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white"
                                aria-label="Close settings"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <Toggle
                                label="Dyslexia Friendly"
                                checked={settings.dyslexiaFont}
                                onChange={(checked) => updateSetting('dyslexiaFont', checked)}
                                description="Use OpenDyslexic font"
                            />
                            <Toggle
                                label="Reduce Motion"
                                checked={settings.reduceMotion}
                                onChange={(checked) => updateSetting('reduceMotion', checked)}
                                description="Minimize animations"
                            />
                            <Toggle
                                label="High Contrast"
                                checked={settings.highContrast}
                                onChange={(checked) => updateSetting('highContrast', checked)}
                                description="Increase contrast ratio"
                            />
                            <Toggle
                                label="Reading Guide"
                                checked={settings.readingGuide}
                                onChange={(checked) => updateSetting('readingGuide', checked)}
                                description="Line follows cursor"
                            />
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10">
                            <button
                                onClick={resetSettings}
                                className="text-xs text-gray-500 hover:text-white transition-colors underline"
                            >
                                Reset to defaults
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-lg border border-white/10",
                    isOpen && "bg-[var(--line-profile)] text-black hover:bg-[var(--line-profile)] border-transparent"
                )}
                aria-label="Accessibility settings"
                aria-expanded={isOpen}
            >
                <Settings size={24} />
            </button>
        </div>
    );
}
