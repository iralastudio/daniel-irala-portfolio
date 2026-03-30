'use client';

import { motion } from 'framer-motion';

const nodes = [
    { id: 'booking', label: 'Booking System', cx: 50, cy: 50, color: 'var(--line-profile)' },
    { id: 'room', label: 'Room Tech', cx: 250, cy: 50, color: 'var(--line-projects)' },
    { id: 'support', label: 'IT Support', cx: 50, cy: 250, color: 'var(--line-thinking)' },
    { id: 'content', label: 'Post-Meeting', cx: 250, cy: 250, color: '#B996F0' },
];

export function CoreInsightVisual() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center bg-white/5 p-6 md:p-10 rounded-2xl border border-[var(--line-projects)]/20 shadow-lg shadow-black/20">
            {/* ─── Visual Subject (Option C: Metro Map Disconnect) ─── */}
            <div className="w-full lg:w-5/12 relative aspect-square max-w-[320px] lg:max-w-none mx-auto flex-shrink-0">
                <svg
                    viewBox="-20 -20 340 340"
                    className="w-full h-full drop-shadow-xl"
                    role="img"
                    aria-label="Abstract diagram showing disconnected meeting systems: Booking, Room Technology, IT Support, and Post-Meeting Content"
                >
                    <defs>
                        <filter id="glow-insight">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Central Area - The Gap */}
                    <circle cx="150" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="150" y="150" textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.4)" fontSize="10" fontWeight="500" className="uppercase tracking-widest">
                        The Gap
                    </text>

                    {/* Animated Lines that fail to connect in the center */}
                    <motion.path
                        d="M 50 50 L 120 120"
                        stroke="var(--line-profile)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow-insight)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
                    />
                    <motion.path
                        d="M 250 50 L 180 120"
                        stroke="var(--line-projects)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow-insight)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1], delay: 0.5 }}
                    />
                    <motion.path
                        d="M 50 250 L 120 180"
                        stroke="var(--line-thinking)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow-insight)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1], delay: 1 }}
                    />
                    <motion.path
                        d="M 250 250 L 180 180"
                        stroke="#B996F0"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#glow-insight)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1], delay: 1.5 }}
                    />

                    {/* Fixed stub lines showing the disconnect */}
                    <path d="M 50 50 L 110 110" stroke="var(--line-profile)" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                    <path d="M 250 50 L 190 110" stroke="var(--line-projects)" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                    <path d="M 50 250 L 110 190" stroke="var(--line-thinking)" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                    <path d="M 250 250 L 190 190" stroke="#B996F0" strokeWidth="4" strokeLinecap="round" opacity="0.4" />


                    {/* Nodes (Stations) */}
                    {nodes.map((node) => (
                        <g key={node.id}>
                            {/* Outer Station Ring */}
                            <circle
                                cx={node.cx}
                                cy={node.cy}
                                r="24"
                                fill="rgba(10,10,10,0.8)"
                                stroke={node.color}
                                strokeWidth="3"
                            />
                            {/* Inner Station Dot */}
                            <circle
                                cx={node.cx}
                                cy={node.cy}
                                r="8"
                                fill={node.color}
                                filter="url(#glow-insight)"
                            />
                            {/* Label Box (for better readability) */}
                            <rect
                                x={node.cx - 50}
                                y={node.cy > 150 ? node.cy + 35 : node.cy - 55}
                                width="100"
                                height="24"
                                rx="4"
                                fill="rgba(0,0,0,0.6)"
                            />
                            {/* Text */}
                            <text
                                x={node.cx}
                                y={node.cy > 150 ? node.cy + 47 : node.cy - 43}
                                textAnchor="middle"
                                fill="white"
                                fontSize="11"
                                fontWeight="600"
                                className="select-none"
                            >
                                {node.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>

            {/* ─── Text Content ─── */}
            <div className="w-full lg:w-7/12 space-y-5 lg:pr-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--line-projects)]/10 border border-[var(--line-projects)]/20 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--line-projects)] animate-pulse" />
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--line-projects)]">
                        Core Insight
                    </h3>
                </div>

                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    The problem wasn&apos;t meetings — it was that no one owned the experience across them.
                </p>

                <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed">
                    <p>
                        Each team — collaboration tools, conference rooms, IT support, facilities — optimized for their piece. But employees experienced meetings as one continuous journey: finding a room, setting up technology, collaborating, and following up.
                    </p>
                    <p>
                        That journey had no owner, no shared data model, and no consistent measurement. The fragmentation was structural, not technical.
                    </p>
                    <div className="pl-4 border-l-2 border-white/20 my-6">
                        <p className="text-sm md:text-base text-gray-400 italic font-medium">
                            This reframed the challenge from &quot;fix the tools&quot; to &quot;design the connective tissue between them.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
