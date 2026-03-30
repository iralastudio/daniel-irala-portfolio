'use client';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedMetroSvg Component
 *
 * An animated SVG that represents the transformation from chaos to order:
 * scattered points become connected by clean, organized metro lines.
 *
 * Animation sequence:
 * 1. Chaotic dots appear scattered
 * 2. Dots settle into organized positions
 * 3. Metro lines draw themselves connecting the dots
 * 4. Glow effects illuminate the connections
 * 5. Electric pulse travels along the lines
 */

interface AnimatedMetroSvgProps {
    lineColor: string;
    className?: string;
}

export const AnimatedMetroSvg = memo(function AnimatedMetroSvg({
    lineColor,
    className = ''
}: AnimatedMetroSvgProps) {
    // Define the metro network structure
    const stations = useMemo(() => [
        // Main line (horizontal)
        { id: 'a1', x: 60, y: 200, chaosX: 45, chaosY: 120 },
        { id: 'a2', x: 140, y: 200, chaosX: 180, chaosY: 280 },
        { id: 'a3', x: 220, y: 200, chaosX: 200, chaosY: 90 },
        { id: 'a4', x: 300, y: 200, chaosX: 320, chaosY: 310 },
        { id: 'a5', x: 380, y: 200, chaosX: 350, chaosY: 150 },

        // Branch line (diagonal up)
        { id: 'b1', x: 220, y: 120, chaosX: 280, chaosY: 60 },
        { id: 'b2', x: 300, y: 80, chaosX: 100, chaosY: 50 },

        // Branch line (diagonal down)
        { id: 'c1', x: 220, y: 280, chaosX: 150, chaosY: 340 },
        { id: 'c2', x: 300, y: 320, chaosX: 380, chaosY: 360 },
    ], []);

    // Define metro line paths
    const lines = useMemo(() => [
        // Main horizontal line
        {
            id: 'main',
            path: 'M 60 200 L 140 200 L 220 200 L 300 200 L 380 200',
            color: lineColor,
            delay: 1.5
        },
        // Upper branch
        {
            id: 'branch-up',
            path: 'M 220 200 L 220 120 L 300 80',
            color: '#B996F0', // Purple
            delay: 2.2
        },
        // Lower branch
        {
            id: 'branch-down',
            path: 'M 220 200 L 220 280 L 300 320',
            color: '#FF78C5', // Pink
            delay: 2.5
        }
    ], [lineColor]);

    // Animation variants
    const dotVariants = useMemo(() => ({
        chaos: (station: typeof stations[0]) => ({
            x: station.chaosX,
            y: station.chaosY,
            scale: 0.5,
            opacity: 0.3
        }),
        organized: (station: typeof stations[0]) => ({
            x: station.x,
            y: station.y,
            scale: 1,
            opacity: 1
        })
    }), []);

    return (
        <motion.svg
            viewBox="0 0 440 400"
            className={`w-full h-full ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <defs>
                {/* Glow filters for each line color */}
                <filter id="glow-main" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feFlood floodColor={lineColor} floodOpacity="0.6" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feFlood floodColor="#B996F0" floodOpacity="0.5" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feFlood floodColor="#FF78C5" floodOpacity="0.5" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="glow" />
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Dot glow */}
                <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background grid (subtle) */}
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <line
                        key={`h-${i}`}
                        x1="20"
                        y1={40 + i * 40}
                        x2="420"
                        y2={40 + i * 40}
                        stroke={lineColor}
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                    />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <line
                        key={`v-${i}`}
                        x1={20 + i * 40}
                        y1="20"
                        x2={20 + i * 40}
                        y2="380"
                        stroke={lineColor}
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                    />
                ))}
            </motion.g>

            {/* Metro Lines - Draw animation */}
            {lines.map((line) => (
                <g key={line.id}>
                    {/* Glow layer */}
                    <motion.path
                        d={line.path}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={line.id === 'main' ? 'url(#glow-main)' : line.id === 'branch-up' ? 'url(#glow-purple)' : 'url(#glow-pink)'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{
                            pathLength: { delay: line.delay, duration: 1.2, ease: "easeInOut" },
                            opacity: { delay: line.delay, duration: 0.3 }
                        }}
                    />

                    {/* Main line */}
                    <motion.path
                        d={line.path}
                        fill="none"
                        stroke={line.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                            pathLength: { delay: line.delay, duration: 1.2, ease: "easeInOut" },
                            opacity: { delay: line.delay, duration: 0.3 }
                        }}
                    />

                    {/* Bright core */}
                    <motion.path
                        d={line.path}
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{
                            pathLength: { delay: line.delay + 0.1, duration: 1.2, ease: "easeInOut" },
                            opacity: { delay: line.delay + 0.1, duration: 0.3 }
                        }}
                    />
                </g>
            ))}

            {/* Electric pulse on main line */}
            <motion.circle
                r="4"
                fill="white"
                filter="url(#dot-glow)"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0, 1, 1, 0],
                    cx: [60, 140, 220, 300, 380],
                    cy: [200, 200, 200, 200, 200]
                }}
                transition={{
                    duration: 2,
                    delay: 3.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    times: [0, 0.1, 0.5, 0.9, 1]
                }}
            />

            {/* Station dots - Chaos to Order animation */}
            {stations.map((station, index) => (
                <motion.g key={station.id}>
                    {/* Outer glow ring */}
                    <motion.circle
                        r="14"
                        fill={lineColor}
                        fillOpacity="0.2"
                        custom={station}
                        variants={dotVariants}
                        initial="chaos"
                        animate="organized"
                        transition={{
                            delay: 0.3 + index * 0.08,
                            duration: 1,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }}
                        style={{ cx: 0, cy: 0 }}
                        cx={station.x}
                        cy={station.y}
                    />

                    {/* Station ring */}
                    <motion.circle
                        r="8"
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="3"
                        filter="url(#dot-glow)"
                        initial={{
                            cx: station.chaosX,
                            cy: station.chaosY,
                            scale: 0.3,
                            opacity: 0
                        }}
                        animate={{
                            cx: station.x,
                            cy: station.y,
                            scale: 1,
                            opacity: 1
                        }}
                        transition={{
                            delay: 0.3 + index * 0.08,
                            duration: 1,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }}
                    />

                    {/* Station core (white) */}
                    <motion.circle
                        r="4"
                        fill="white"
                        initial={{
                            cx: station.chaosX,
                            cy: station.chaosY,
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            cx: station.x,
                            cy: station.y,
                            scale: 1,
                            opacity: 1
                        }}
                        transition={{
                            delay: 0.5 + index * 0.08,
                            duration: 0.8,
                            type: "spring",
                            stiffness: 120,
                            damping: 12
                        }}
                    />
                </motion.g>
            ))}

            {/* "METRO" label that fades in */}
            <motion.text
                x="220"
                y="380"
                textAnchor="middle"
                fill={lineColor}
                fontSize="14"
                fontWeight="600"
                fontFamily="var(--font-heading)"
                letterSpacing="0.2em"
                initial={{ opacity: 0, y: 390 }}
                animate={{ opacity: 0.6, y: 380 }}
                transition={{ delay: 3.5, duration: 0.8 }}
            >
                METRO SYSTEM
            </motion.text>
        </motion.svg>
    );
});

export default AnimatedMetroSvg;
