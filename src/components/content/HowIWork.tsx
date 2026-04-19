'use client';

import { Network, TrendingUp, Users, Link, BookOpen } from 'lucide-react';

const methodologies = [
    {
        icon: Network,
        title: 'Map the invisible',
        description: 'I surface the unstated rules, dependencies, and power dynamics that shape how work actually happens — so leadership can see the full system before deciding where to intervene.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: TrendingUp,
        title: 'Trace the patterns',
        description: 'I use behavioral science to understand why systems behave the way they do. Patterns don\'t just reveal what\'s broken — they reveal where the system is ready to change.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: Users,
        title: 'Co-create the vision',
        description: 'I bring cross-functional teams into alignment through facilitated workshops. Shared ownership of the vision accelerates decisions and reduces resistance downstream.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: Link,
        title: 'Connect across silos',
        description: 'I translate between design, product, engineering, and business. When everyone sees the same picture, strategic alignment happens faster and holds longer.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    },
    {
        icon: BookOpen,
        title: 'Shape the narrative',
        description: 'I frame insights as opportunities that make stakeholders lean in. The right narrative turns analysis into action and decision-makers into champions of change.',
        color: '#FF78C5',
        glowColor: 'rgba(255, 120, 197, 0.3)'
    }
];

export function HowIWork() {
    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">How I Work</h2>
                <div className="h-1 w-16 md:w-20 bg-[var(--line-profile)] rounded-full" />
            </div>

            <div className="space-y-3 md:space-y-4">
                {methodologies.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <div
                            key={index}
                            className="group flex gap-3 md:gap-4 p-4 md:p-5 rounded-xl glass-frontstage border border-white/10 hover:border-white/25 hover:shadow-[0_0_30px_rgba(255,120,197,0.15)] transition-all duration-300"
                        >
                            {/* Icon Circle */}
                            <div
                                className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                                style={{
                                    borderColor: method.color,
                                    backgroundColor: `${method.color}15`,
                                    boxShadow: `0 0 15px ${method.glowColor}`
                                }}
                            >
                                <Icon
                                    className="w-5 h-5 md:w-6 md:h-6"
                                    style={{ color: method.color }}
                                    strokeWidth={2}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3
                                    className="text-base md:text-lg font-semibold mb-1 md:mb-2"
                                    style={{ color: method.color }}
                                >
                                    {method.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
