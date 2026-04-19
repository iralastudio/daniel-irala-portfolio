'use client';

import { PenLine } from 'lucide-react';

export function Articles() {
    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">
                    Writing · Reflection · Practice
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Articles</h2>
                <div className="h-1 w-16 md:w-20 bg-[var(--line-thinking)] rounded-full" />
            </div>

            <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
                Essays and reflections on design research, systems thinking, behavioral science, and
                what it actually takes to do meaningful work inside large organisations.
            </p>

            <div className="glass-frontstage rounded-xl border border-[var(--line-thinking)]/20 p-8 md:p-10 flex flex-col items-center text-center gap-4">
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center border-2"
                    style={{
                        borderColor: 'var(--line-thinking)',
                        backgroundColor: 'rgba(132,233,255,0.08)',
                        boxShadow: '0 0 20px rgba(132,233,255,0.15)',
                    }}
                >
                    <PenLine className="w-6 h-6" style={{ color: 'var(--line-thinking)' }} strokeWidth={1.5} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white/80 mb-1">Articles coming soon</p>
                    <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                        Writing is in progress. Check back soon or follow along on LinkedIn.
                    </p>
                </div>
            </div>
        </div>
    );
}
