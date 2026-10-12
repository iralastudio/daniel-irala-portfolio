'use client';

import { useEffect, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Accessibility, Check } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/cn';
import { EXPO } from '@/lib/motion';
import type { TextScale } from '@/types/accessibility';

/**
 * DisplayMenu — the visitor-facing controls for the accessibility engine in
 * AccessibilityContext (contrast, motion, dyslexia-friendly type, text size).
 * Those settings drive <html> classes read by globals.css; without this menu
 * the only one reachable is the OS reduced-motion preference.
 *
 * Deliberately quiet: a single square glyph in the top-right that opens a
 * compact popover. Esc or an outside click closes it and focus returns to the
 * trigger — the same dismissal contract as the content window.
 */

const SIZES: { value: TextScale; label: string }[] = [
    { value: 'normal', label: 'Default' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'X-Large' },
];

function Switch({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="tap group flex w-full items-center justify-between gap-3 py-2 text-left rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            style={{ fontSize: 'var(--step--1)' }}
        >
            <span className="text-ink transition-colors duration-300 group-hover:text-accent">{label}</span>
            <span
                aria-hidden="true"
                className={cn(
                    'grid h-4 w-4 shrink-0 place-items-center rounded-xs border transition-colors duration-300',
                    checked ? 'border-accent bg-accent text-white' : 'border-ink/25 text-transparent'
                )}
            >
                <Check size={11} strokeWidth={3} />
            </span>
        </button>
    );
}

export function DisplayMenu() {
    const [open, setOpen] = useState(false);
    const { settings, updateSetting, resetSettings } = useAccessibility();
    const wrapRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setOpen(false);
            triggerRef.current?.focus();
        };
        const onPointer = (e: PointerEvent) => {
            if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        document.addEventListener('pointerdown', onPointer);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('pointerdown', onPointer);
        };
    }, [open]);

    return (
        <div ref={wrapRef} className="fixed top-4 right-5 md:right-10 z-40">
            <button
                ref={triggerRef}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="Display settings"
                className={cn(
                    'tap grid h-10 w-10 place-items-center rounded-sm border backdrop-blur-xl transition-colors duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    open
                        ? 'border-accent text-accent bg-surface'
                        : 'border-ink/15 text-ink-soft bg-surface/70 hover:border-accent hover:text-accent'
                )}
            >
                <Accessibility size={17} strokeWidth={1.9} />
            </button>

            <AnimatePresence>
                {open && (
                    <m.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: EXPO }}
                        className="absolute right-0 mt-2 w-[248px] rounded-md border border-ink/12 bg-surface p-4 shadow-[0_12px_40px_rgba(43,42,41,0.16)]"
                    >
                        <div className="label-mono mb-1">Display</div>

                        <Switch
                            label="Enhanced contrast"
                            checked={settings.highContrast}
                            onChange={(v) => updateSetting('highContrast', v)}
                        />
                        <Switch
                            label="Reduce motion"
                            checked={settings.reduceMotion}
                            onChange={(v) => updateSetting('reduceMotion', v)}
                        />
                        <Switch
                            label="Dyslexia-friendly type"
                            checked={settings.dyslexiaFont}
                            onChange={(v) => updateSetting('dyslexiaFont', v)}
                        />

                        <div className="label-mono mt-4 mb-2">Text size</div>
                        <div className="flex gap-1">
                            {SIZES.map((s) => (
                                <button
                                    key={s.value}
                                    onClick={() => updateSetting('textScale', s.value)}
                                    aria-pressed={settings.textScale === s.value}
                                    className={cn(
                                        'tap flex-1 rounded-xs border px-2 py-1.5 transition-colors duration-300',
                                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                                        settings.textScale === s.value
                                            ? 'border-accent bg-accent text-white'
                                            : 'border-ink/15 text-ink-soft hover:border-accent hover:text-accent'
                                    )}
                                    style={{ fontSize: '11px' }}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={resetSettings}
                            className="tap label-mono mt-4 !text-[10px] w-full text-left transition-colors duration-300 hover:text-accent rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                            Reset
                        </button>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}
