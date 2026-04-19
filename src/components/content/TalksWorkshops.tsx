'use client';

import { useState } from 'react';
import { ExternalLink, Calendar, Users } from 'lucide-react';
import { useLineTheme } from '@/hooks/useLineTheme';

type Category = 'case-studies' | 'workshops';

const content = {
    'case-studies': [
        {
            title: 'Systems Thinking in Practice: Real Constraints, No Fluff',
            organization: 'Si Design Hub',
            organizationUrl: 'https://www.linkedin.com/company/si-design-network/posts/?feedView=all',
            date: 'March 2026',
            type: 'Case Study Presentation',
            videoUrl: 'https://www.youtube.com/watch?v=fxMpMIVBsck',
            description: 'Walking through an end-to-end IT Product Offering project to show how design survives—and thrives—inside a global organisation. Focused on practice over theory: applying Systems Thinking inside a large organisation, navigating messy constraints, political realities, and adapting frameworks to context.',
            topics: [
                'Systems Thinking in Practice',
                'Design Constraints',
                'Service Design at Scale',
                'Behavioural Design',
            ],
        },
    ],
    'workshops': [
        {
            title: 'Design Maturity Workshop',
            organization: 'Nestlé',
            organizationUrl: '',
            date: '2023–2024',
            type: 'DesignOps & Strategy',
            videoUrl: '',
            description: 'Iterated on an existing initiative, running 5 workshops to transition teams from UX into the full spectrum of Design across Nestlé IT. Involved all Leads from the W360 Stream group in Barcelona and Milano, bringing service design and strategic thinking into practice — expanding beyond traditional UX to build holistic design capability and mindset.',
            topics: [
                'Design Maturity Transition',
                'Service Design Integration',
                'Strategic Design Thinking',
                'DesignOps',
            ],
        },
    ],
};

const categories = [
    { id: 'case-studies' as Category, label: 'Case Study Presentations', count: content['case-studies'].length },
    { id: 'workshops' as Category, label: 'Design Maturity Workshops', count: content['workshops'].length },
];

const reflections: Record<Category, { title: string; text: string }> = {
    'case-studies': {
        title: 'Why I Share',
        text: 'Systems thinking is not a superpower. It\'s a practice — and it starts imperfectly. I share my work because the gap between theory and real organisational constraints is where the hardest learning happens. If my experience helps someone else navigate their own complexity, then it was worth doing publicly.',
    },
    'workshops': {
        title: 'Why I Share',
        text: 'Design maturity isn\'t about perfecting processes — it\'s about building the mindset and capability to navigate complexity with clarity. I ran these workshops because embedding design thinking at scale requires more than frameworks; it requires shifting how teams see problems, make decisions, and collaborate across silos.',
    },
};

export function TalksWorkshops() {
    const [activeCategory, setActiveCategory] = useState<Category>('case-studies');
    const { color } = useLineTheme();

    const activeContent = content[activeCategory];

    return (
        <div className="space-y-5 md:space-y-6">
            {/* ─── Hero Header ─── */}
            <div>
                <div className="text-xs md:text-sm font-bold uppercase tracking-widest mb-2" style={{ color }}>
                    Speaking · Teaching · Community
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    Talks & Workshops
                </h2>
                <div className="h-1 w-16 md:w-20 rounded-full" style={{ backgroundColor: color }} />
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mt-4 md:mt-5 max-w-3xl">
                    I share what I learn — the real, messy, constraint-filled version of applying design thinking and systems approaches inside large organisations. Below are some of my recent talks and workshop sessions.
                </p>
            </div>

            {/* ─── Category Tabs ─── */}
            <div className="border-b border-white/10">
                <nav className="flex gap-1 overflow-x-auto no-scrollbar" role="tablist">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            role="tab"
                            aria-selected={activeCategory === category.id}
                            aria-controls={`panel-${category.id}`}
                            onClick={() => setActiveCategory(category.id)}
                            className="px-4 py-3 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-all duration-200"
                            style={
                                activeCategory === category.id
                                    ? { borderColor: color, color: 'white' }
                                    : { borderColor: 'transparent', color: '#6b7280' }
                            }
                        >
                            {category.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* ─── Content Area ─── */}
            <div
                role="tabpanel"
                id={`panel-${activeCategory}`}
                aria-labelledby={`tab-${activeCategory}`}
            >
                <section className="space-y-5 md:space-y-6">
                    {activeContent.map((item, index) => (
                        <article
                            key={index}
                            className="bg-white/5 rounded-xl transition-all duration-300 overflow-hidden"
                            style={{ border: `1px solid ${color}33` }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `${color}66`)}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = `${color}33`)}
                        >
                            {/* Header */}
                            <div className="p-5 md:p-6 border-b border-white/5">
                                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                    <span
                                        className="px-2 py-0.5 text-[10px] md:text-xs font-medium uppercase tracking-wider rounded"
                                        style={{ backgroundColor: `${color}1a`, color }}
                                    >
                                        {item.type}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Calendar size={14} />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                                    {item.title}
                                </h3>
                                {item.organizationUrl ? (
                                    <a
                                        href={item.organizationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                                        style={{ color }}
                                    >
                                        <Users size={14} />
                                        <span>{item.organization}</span>
                                        <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                                        <Users size={14} />
                                        <span>{item.organization}</span>
                                    </div>
                                )}
                            </div>

                            {/* Body */}
                            <div className="p-5 md:p-6 space-y-4">
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Topics */}
                                <div className="flex flex-wrap gap-2">
                                    {item.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-2 py-1 text-[10px] md:text-xs text-gray-400 bg-white/5 rounded border border-white/10"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                {/* Video Link */}
                                {item.videoUrl && (
                                    <a
                                        href={item.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200"
                                        style={{ backgroundColor: `${color}33`, border: `1px solid ${color}4d` }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.backgroundColor = `${color}4d`;
                                            el.style.borderColor = `${color}80`;
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.backgroundColor = `${color}33`;
                                            el.style.borderColor = `${color}4d`;
                                        }}
                                    >
                                        <ExternalLink size={16} />
                                        Watch Recording
                                    </a>
                                )}
                            </div>
                        </article>
                    ))}
                </section>
            </div>

            {/* ─── Reflection ─── */}
            <section className="pt-5 md:pt-6 border-t border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {reflections[activeCategory].title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 italic leading-relaxed max-w-3xl">
                    {reflections[activeCategory].text}
                </p>
            </section>
        </div>
    );
}
