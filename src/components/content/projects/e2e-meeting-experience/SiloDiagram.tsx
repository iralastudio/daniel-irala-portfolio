'use client';

/*
 * Static diagram showing three disconnected data silos.
 * Directly maps to the narrative: "Technical performance data, experience
 * data, and operational data existed in separate silos."
 *
 * Pure SVG. No animation. No Framer Motion.
 */

const silos = [
    {
        label: 'Technical',
        subtitle: 'Performance Data',
        cx: 130,
        cy: 130,
        color: '#FF78C5'
    },
    {
        label: 'Experience',
        subtitle: 'Data',
        cx: 390,
        cy: 130,
        color: '#B996F0'
    },
    {
        label: 'Operational',
        subtitle: 'Data',
        cx: 260,
        cy: 320,
        color: '#84E9FF'
    },
];

const R = 65;
const GLOW_R = 88;

export function SiloDiagram() {
    return (
        <div className="flex flex-col items-center gap-5">
            <svg
                viewBox="0 0 520 430"
                className="w-full"
                role="img"
                aria-label="Three disconnected data silos: Technical Performance Data, Experience Data, and Operational Data"
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Silo circles with two-line labels */}
                {silos.map((silo) => (
                    <g key={silo.label}>
                        {/* Soft outer glow */}
                        <circle
                            cx={silo.cx}
                            cy={silo.cy}
                            r={GLOW_R}
                            fill={silo.color}
                            opacity={0.06}
                        />

                        {/* Primary ring */}
                        <circle
                            cx={silo.cx}
                            cy={silo.cy}
                            r={R}
                            fill="rgba(10,10,10,0.6)"
                            stroke={silo.color}
                            strokeWidth="2.5"
                            filter="url(#glow)"
                        />

                        {/* Two-line label */}
                        <text
                            x={silo.cx}
                            y={silo.cy - 8}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize="14"
                            fontWeight="700"
                            className="select-none"
                        >
                            {silo.label}
                        </text>
                        <text
                            x={silo.cx}
                            y={silo.cy + 10}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize="13"
                            fontWeight="400"
                            opacity="0.8"
                            className="select-none"
                        >
                            {silo.subtitle}
                        </text>
                    </g>
                ))}

            </svg>

            {/* Status label */}
            <div className="text-center px-4">
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest leading-relaxed">
                    <span className="text-gray-400 font-semibold">Separate silos</span> — No unified view
                </p>
            </div>
        </div>
    );
}
