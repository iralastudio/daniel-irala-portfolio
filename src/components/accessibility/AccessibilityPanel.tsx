'use client';

import { useState } from 'react';
import { Settings, X, Volume2, Type, Eye, Wind, Eraser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useModal } from '@/hooks/useModal';
import { Toggle } from '@/components/ui/Toggle';
import { cn } from '@/lib/cn';
import { TextScale } from '@/types/accessibility';

export function AccessibilityPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { settings, updateSetting, resetSettings } = useAccessibility();
    const { isOpen: modalIsOpen } = useModal();

    if (modalIsOpen) return null;

    const textScalingOptions: { value: TextScale; label: string }[] = [
        { value: 'normal', label: 'Default' },
        { value: 'large', label: 'Large' },
        { value: 'extra-large', label: 'X-Large' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className="mb-6 bg-black/40 backdrop-blur-[24px] border border-white/10 rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.6)] p-6 w-[340px] relative overflow-hidden"
                    >
                        {/* Subtle gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                        <div className="flex justify-between items-center mb-8 relative">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                    <Settings size={18} className="text-white/80" />
                                </div>
                                <h3 className="text-base font-semibold tracking-tight text-white uppercase">Settings</h3>
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            {/* Text to Voice Section */}
                            <div className="bg-white/5 rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all group">
                                <Toggle
                                    label="Screen Reader Mode"
                                    checked={settings.textToVoice}
                                    onChange={(checked) => updateSetting('textToVoice', checked)}
                                    description="Auditory feedback for interactions"
                                />
                            </div>

                            {/* Appearance Section */}
                            <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-4">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Appearance</span>
                                
                                <div className="space-y-4">
                                    <Toggle
                                        label="Enhanced Contrast"
                                        checked={settings.highContrast}
                                        onChange={(checked) => updateSetting('highContrast', checked)}
                                    />
                                    <Toggle
                                        label="Minimal Motion"
                                        checked={settings.reduceMotion}
                                        onChange={(checked) => updateSetting('reduceMotion', checked)}
                                    />
                                    <Toggle
                                        label="OpenDyslexic Font"
                                        checked={settings.dyslexiaFont}
                                        onChange={(checked) => updateSetting('dyslexiaFont', checked)}
                                    />
                                </div>
                            </div>

                            {/* Text size selector - luxury styled */}
                            <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-3">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 ml-1">Font Scaling</span>
                                <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
                                    {textScalingOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => updateSetting('textScale', option.value)}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-medium rounded-md transition-all duration-300",
                                                settings.textScale === option.value 
                                                    ? "bg-white/10 text-white shadow-lg" 
                                                    : "text-white/40 hover:text-white/60"
                                            )}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center relative">
                            <button
                                onClick={resetSettings}
                                className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 hover:text-white/80 transition-all group"
                            >
                                <Eraser size={12} className="group-hover:rotate-12 transition-transform" />
                                Reset to Default
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative overflow-hidden group p-4 rounded-2xl transition-all duration-500",
                    "bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
                    isOpen && "border-white/20 bg-black shadow-[0_0_20px_rgba(255,120,197,0.3)]"
                )}
                aria-label="Accessibility settings"
                aria-expanded={isOpen}
            >
                {/* Visual state indicator */}
                <div className={cn(
                    "absolute inset-0 bg-gradient-to-tr from-[#FF78C5] via-[#B996F0] to-[#84E9FF] opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                    isOpen && "opacity-20"
                )} />
                
                {isOpen ? (
                    <X size={22} className="text-white relative z-10" />
                ) : (
                    <Settings size={22} className="text-white/80 group-hover:text-white relative z-10 transition-colors" />
                )}
            </motion.button>
        </div>
    );
}
