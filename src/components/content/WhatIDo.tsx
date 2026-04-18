'use client';

import { Footprints, Coffee, Sparkles, Music } from 'lucide-react';

const interests = [
    {
        icon: Footprints,
        title: 'Walking',
        description: 'Long walks through cities and forests. I notice how people navigate space, how systems fail or flow. Movement clears the head — patterns surface when you\'re not looking for them.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: Coffee,
        title: 'Coffee',
        description: 'Specialty coffee, brewed with intention. The ritual mirrors good design: attention to variables, patience, and knowing when to let things develop on their own.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: Sparkles,
        title: 'Handcraft',
        description: 'Working with my hands keeps me grounded in the tangible while I work in the abstract. Making is thinking.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: Music,
        title: 'Music',
        description: 'I explore around 250 genres per year. Right now I\'m deep into city pop — smooth Japanese tracks from the \'80s that sound like sunset and neon had a baby.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    }
];

export function WhatIDo() {
    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">What I Do</h2>
                <h3 className="text-lg md:text-xl text-gray-400 mb-3">(When I&apos;m Not Mapping Systems)</h3>
                <div className="h-1 w-16 md:w-20 bg-[var(--line-profile)] rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {interests.map((interest, index) => {
                    const Icon = interest.icon;
                    return (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center p-4 md:p-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
                            style={{
                                boxShadow: `0 0 0px ${interest.glowColor}`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 30px ${interest.glowColor}`;
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = `0 0 0px ${interest.glowColor}`;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Icon Circle */}
                            <div
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 mb-3 md:mb-4 transition-all duration-300"
                                style={{
                                    borderColor: interest.color,
                                    backgroundColor: `${interest.color}15`,
                                    boxShadow: `0 0 20px ${interest.glowColor}`
                                }}
                            >
                                <Icon
                                    className="w-7 h-7 md:w-8 md:h-8"
                                    style={{ color: interest.color }}
                                    strokeWidth={2}
                                />
                            </div>

                            {/* Content */}
                            <h3
                                className="text-base md:text-lg font-semibold mb-1 md:mb-2"
                                style={{ color: interest.color }}
                            >
                                {interest.title}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                {interest.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
