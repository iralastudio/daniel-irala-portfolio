'use client';

import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useMetroMap } from '@/hooks/useMetroMap';
import { metroStops } from '@/data/stops';
import { metroLines } from '@/data/lines';
import { cn } from '@/lib/cn';
import { getLineColor, getTransferLineColors } from '@/lib/colors';
import { LineId, StopId, MetroStop } from '@/types/metro';
import { memo, useCallback, useMemo } from 'react';

interface MetroLineNavProps {
    currentStop: StopId;
}

// ============================================
// MEMOIZED: Return to Home Button
// ============================================
const HomeButton = memo(({ onClose }: { onClose: () => void }) => {
    return (
        <div className="glass-backstage border-b border-white/10 p-4">
            <motion.button
                onClick={onClose}
                className={cn(
                    "flex items-center gap-2 w-full px-4 py-2.5 rounded-lg relative overflow-hidden",
                    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent",
                    "group"
                )}
                whileTap={{ scale: 0.96 }}
                aria-label="Return to Home"
            >
                {/* Sliding background reveal */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/20 to-white/5"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                {/* Static background */}
                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/15 transition-colors duration-300" />

                {/* Content */}
                <div className="relative flex items-center gap-2 z-10">
                    <motion.div
                        whileHover={{ rotate: -15, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                        <Home className="w-4 h-4 text-white" />
                    </motion.div>
                    <span className="text-sm font-medium text-white">Return to Home</span>
                </div>
            </motion.button>
        </div>
    );
});

HomeButton.displayName = 'HomeButton';

// ============================================
// MEMOIZED: Transfer Indicator
// ============================================
interface TransferIndicatorProps {
    lineId: LineId;
    lineName: string;
    lineColor: string;
    onTransfer: (lineId: LineId, e: React.MouseEvent) => void;
}

const TransferIndicator = memo(({ lineId, lineName, lineColor, onTransfer }: TransferIndicatorProps) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        onTransfer(lineId, e);
    }, [lineId, onTransfer]);

    return (
        <motion.button
            onClick={handleClick}
            className={cn(
                "w-4 h-4 rounded-full relative",
                "ring-1 ring-white/20",
                "focus:outline-none focus:ring-2 focus:ring-white",
                "cursor-pointer"
            )}
            style={{
                backgroundColor: lineColor,
            }}
            whileHover={{
                scale: 1.4,
                boxShadow: `0 0 16px ${lineColor}80, inset 0 0 6px rgba(255,255,255,0.4)`
            }}
            whileTap={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            aria-label={`Switch to ${lineName}`}
            title={`Switch to ${lineName}`}
        />
    );
});

TransferIndicator.displayName = 'TransferIndicator';

// ============================================
// MEMOIZED: Metro Stop Item
// ============================================
interface MetroStopItemProps {
    stop: MetroStop;
    isCurrentStop: boolean;
    hasNextStop: boolean;
    lineColor: string;
    currentLineId: LineId;
    onStopClick: (stopId: StopId) => void;
    onLineTransfer: (lineId: LineId, e: React.MouseEvent) => void;
}

const MetroStopItem = memo(({
    stop,
    isCurrentStop,
    hasNextStop,
    lineColor,
    currentLineId,
    onStopClick,
    onLineTransfer
}: MetroStopItemProps) => {
    const isTransferStation = stop.lines.length > 1;

    const handleClick = useCallback(() => {
        onStopClick(stop.id);
    }, [stop.id, onStopClick]);

    /**
     * CONTEXT-AWARE COLORING:
     * Transfer indicators show OTHER lines the station connects to.
     * The main lineColor (passed as prop) is strictly from the current line context.
     */
    const transferLines = useMemo(() =>
        getTransferLineColors(stop.lines, currentLineId),
        [stop.lines, currentLineId]
    );

    return (
        <div className="flex flex-col">
            <motion.div
                className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg",
                    "text-left group relative",
                    isCurrentStop
                        ? "bg-white/10 text-white"
                        : "text-gray-400"
                )}
                whileHover={{
                    scale: 1.02,
                    backgroundColor: isCurrentStop ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                aria-current={isCurrentStop ? 'location' : undefined}
            >
                {/* Primary Action: Go to Stop */}
                <button
                    onClick={handleClick}
                    className="flex items-center gap-3 flex-1 min-w-0 focus:outline-none text-left"
                >
                    {/* Stop Dot with Premium Glow */}
                    <motion.div
                        className="relative flex-shrink-0"
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                        {/* Glow effect (only on current stop) */}
                        {isCurrentStop && (
                            <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    backgroundColor: lineColor,
                                    filter: 'blur(8px)',
                                    opacity: 0.6,
                                }}
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.6, 0.8, 0.6],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}

                        {/* Actual dot */}
                        <motion.div
                            className={cn(
                                "w-3 h-3 rounded-full border-2 relative z-10",
                                isCurrentStop
                                    ? "bg-white"
                                    : "bg-black border-gray-500"
                            )}
                            style={{
                                borderColor: isCurrentStop ? lineColor : undefined,
                            }}
                            initial={false}
                            animate={{
                                scale: isCurrentStop ? 1.25 : 1,
                            }}
                            whileHover={{
                                scale: isCurrentStop ? 1.35 : 1.15,
                                boxShadow: isCurrentStop
                                    ? `0 0 12px ${lineColor}`
                                    : '0 0 6px rgba(255,255,255,0.3)',
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        />
                    </motion.div>

                    {/* Stop Name */}
                    <motion.span
                        className={cn(
                            "text-sm font-medium truncate",
                            isCurrentStop && "font-semibold text-white"
                        )}
                        whileHover={{
                            color: isCurrentStop ? '#ffffff' : '#e5e7eb',
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {stop.name}
                    </motion.span>
                </button>

                {/* Transfer Indicators - Show OTHER lines this station connects to */}
                {isTransferStation && (
                    <div className="flex gap-2.5 flex-shrink-0" role="group" aria-label="Switch to other lines">
                        {transferLines.map(({ lineId, color }) => {
                            const lineName = metroLines.find(l => l.id === lineId)?.name || lineId;
                            return (
                                <TransferIndicator
                                    key={lineId}
                                    lineId={lineId}
                                    lineName={lineName}
                                    lineColor={color}
                                    onTransfer={onLineTransfer}
                                />
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Connecting Line - STABLE (no transforms applied) */}
            {hasNextStop && (
                <div
                    className="ml-[18px] w-0.5 h-4 flex-shrink-0"
                    style={{
                        backgroundColor: lineColor,
                        opacity: 0.3,
                    }}
                />
            )}
        </div>
    );
});

MetroStopItem.displayName = 'MetroStopItem';

// ============================================
// MAIN COMPONENT
// ============================================
export function MetroLineNav({ currentStop }: MetroLineNavProps) {
    const { openModal, closeModal } = useModal();
    const { selectedLine, setSelectedLine } = useMetroMap();

    // Get the current stop's data
    const stop = metroStops[currentStop];
    if (!stop) return null;

    // Determine which line we're on (prefer selectedLine, fallback to first line)
    const currentLineId: LineId = selectedLine || stop.lines[0];

    // Get the line data
    const currentLine = metroLines.find(line => line.id === currentLineId);
    if (!currentLine) return null;

    // Memoize expensive calculations
    const lineStops = useMemo(
        () => currentLine.stops.map(stopId => metroStops[stopId]),
        [currentLine.stops]
    );

    /**
     * CONTEXT-AWARE COLORING:
     * The lineColor is STRICTLY derived from currentLineId (the active line context).
     * All stops, bullets, and highlights use this single color.
     */
    const lineColor = useMemo(() => getLineColor(currentLineId), [currentLineId]);

    // Memoized handlers to prevent re-creating functions
    const handleStopClick = useCallback((stopId: StopId) => {
        openModal(stopId);
    }, [openModal]);

    const handleLineTransfer = useCallback((lineId: LineId, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedLine(lineId);
    }, [setSelectedLine]);

    const handleCloseModal = useCallback(() => {
        closeModal();
    }, [closeModal]);

    return (
        <div className="flex flex-col h-full glass-frontstage border-l border-white/20">
            {/* GLOBAL NAVIGATION - Dock Area */}
            <HomeButton onClose={handleCloseModal} />

            {/* LOCAL CONTEXT - Metro Line */}
            <div className="flex-1 overflow-auto p-6">
                {/* Line Header with glass accent */}
                <div className="mb-6 glass-backstage rounded-lg p-4">
                    <motion.div
                        className="h-1.5 w-20 rounded-full mb-3"
                        style={{
                            backgroundColor: lineColor,
                        }}
                        animate={{
                            boxShadow: `0 0 12px ${lineColor}60`,
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    <h3 className="text-sm font-semibold text-white tracking-wide">{currentLine.name}</h3>
                </div>

                {/* Stops List */}
                <nav className="flex-1 flex flex-col gap-1" role="navigation" aria-label="Metro line stops">
                    {lineStops.map((stop, index) => (
                        <MetroStopItem
                            key={stop.id}
                            stop={stop}
                            isCurrentStop={stop.id === currentStop}
                            hasNextStop={index < lineStops.length - 1}
                            lineColor={lineColor}
                            currentLineId={currentLineId}
                            onStopClick={handleStopClick}
                            onLineTransfer={handleLineTransfer}
                        />
                    ))}
                </nav>

                {/* Legend - Line indicators */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        <div
                            className="w-3 h-3 rounded-full bg-white border-2"
                            style={{ borderColor: lineColor }}
                        />
                        <span className="text-gray-400">You are here</span>
                    </div>

                    <div className="text-xs text-gray-500 mb-1.5">Switch to:</div>

                    {metroLines
                        .filter(line => line.id !== currentLineId)
                        .map(line => (
                            <div key={line.id} className="flex items-center gap-2 text-xs">
                                <div
                                    className="w-3 h-3 rounded-full ring-1 ring-white/30"
                                    style={{ backgroundColor: line.color }}
                                />
                                <span className="text-gray-400">{line.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}
