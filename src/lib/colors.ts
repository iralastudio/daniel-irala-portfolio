import { LineId } from '@/types/metro';

/**
 * Centralized Metro Line Colors
 *
 * DESIGN PRINCIPLE: Context-Aware Coloring
 * The color of any element (stops, highlights, dots, lines) should ALWAYS
 * be derived from the ACTIVE LINE CONTEXT, not from the station's static properties.
 *
 * Example: 'Experiments' station belongs to both 'projects' (purple) and 'thinking' (blue).
 * - When viewing on Thinking Line → ALL elements should be BLUE
 * - When viewing on Projects Line → ALL elements should be PURPLE
 * - The only exception is Transfer Indicators, which show OTHER available lines
 */

// ============================================
// COLOR CONSTANTS
// ============================================

export const LINE_COLORS = {
    profile: '#FF78C5',   // Pink
    projects: '#B996F0',  // Purple
    thinking: '#84E9FF',  // Cyan/Blue
} as const;

export const LINE_COLORS_BRIGHT = {
    profile: '#FFB3DB',   // Lighter pink (for neon cores)
    projects: '#D4BFF7',  // Lighter purple
    thinking: '#B3F1FF',  // Lighter cyan
} as const;

export const DEFAULT_COLOR = '#ffffff';

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Get the color for a specific line
 * @param lineId - The line identifier
 * @returns The hex color string for that line
 */
export function getLineColor(lineId: LineId | string | null): string {
    if (!lineId) return DEFAULT_COLOR;
    return LINE_COLORS[lineId as keyof typeof LINE_COLORS] || DEFAULT_COLOR;
}

/**
 * Get the bright/lighter color for a specific line (used for neon cores)
 * @param lineId - The line identifier
 * @returns The bright hex color string for that line
 */
export function getLineBrightColor(lineId: LineId | string | null): string {
    if (!lineId) return DEFAULT_COLOR;
    return LINE_COLORS_BRIGHT[lineId as keyof typeof LINE_COLORS_BRIGHT] || DEFAULT_COLOR;
}

/**
 * CONTEXT-AWARE COLOR RESOLUTION
 *
 * This is the PRIMARY function for determining station/element colors.
 * It strictly prioritizes the active line context over station properties.
 *
 * Priority order:
 * 1. selectedLine (global context from MetroContext)
 * 2. currentLineId (local context, e.g., from modal navigation)
 * 3. stationFirstLine (fallback only when no context is available)
 *
 * @param selectedLine - The globally selected line from MetroContext (highest priority)
 * @param currentLineId - The current line context (e.g., from navigation)
 * @param stationFirstLine - The station's first line (lowest priority fallback)
 * @returns The appropriate color for the current context
 */
export function getContextAwareColor(
    selectedLine: LineId | null,
    currentLineId?: LineId | null,
    stationFirstLine?: LineId | string
): string {
    // Priority 1: Global selected line (user explicitly selected a line)
    if (selectedLine) {
        return getLineColor(selectedLine);
    }

    // Priority 2: Local line context (e.g., navigating within a modal)
    if (currentLineId) {
        return getLineColor(currentLineId);
    }

    // Priority 3: Fallback to station's first line (only when no context exists)
    if (stationFirstLine) {
        return getLineColor(stationFirstLine);
    }

    return DEFAULT_COLOR;
}

/**
 * Determine if a station should be styled as "on the active line"
 * Used for opacity and visibility calculations
 *
 * @param stationLines - Array of line IDs the station belongs to
 * @param selectedLine - The currently selected/active line
 * @returns true if the station is on the selected line (or if no line is selected)
 */
export function isStationOnActiveLine(
    stationLines: LineId[],
    selectedLine: LineId | null
): boolean {
    // If no line is selected, all stations are "active"
    if (!selectedLine) return true;

    // Station is active if it's on the selected line
    return stationLines.includes(selectedLine);
}

/**
 * Get transfer line colors for a station
 * Returns colors for lines OTHER than the current active line
 * (Used for transfer indicator dots)
 *
 * @param stationLines - Array of line IDs the station belongs to
 * @param currentLineId - The current active line (to exclude)
 * @returns Array of { lineId, color } for transfer indicators
 */
export function getTransferLineColors(
    stationLines: LineId[],
    currentLineId: LineId
): Array<{ lineId: LineId; color: string }> {
    return stationLines
        .filter(lineId => lineId !== currentLineId)
        .map(lineId => ({
            lineId,
            color: getLineColor(lineId)
        }));
}
