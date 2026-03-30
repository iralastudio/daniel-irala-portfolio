'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { LineId, StopId } from '@/types/metro';

interface MetroContextType {
    selectedLine: LineId | null;
    setSelectedLine: (line: LineId | null) => void;
    activeStop: StopId | null;
    setActiveStop: (stop: StopId | null) => void;
}

const MetroContext = createContext<MetroContextType | null>(null);

export function MetroProvider({ children }: { children: ReactNode }) {
    const [selectedLine, setSelectedLineState] = useState<LineId | null>(null);
    const [activeStop, setActiveStopState] = useState<StopId | null>(null);

    // Memoize setters to maintain stable references
    const setSelectedLine = useCallback((line: LineId | null) => {
        setSelectedLineState(line);
    }, []);

    const setActiveStop = useCallback((stop: StopId | null) => {
        setActiveStopState(stop);
    }, []);

    // CRITICAL: Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        selectedLine,
        setSelectedLine,
        activeStop,
        setActiveStop
    }), [selectedLine, setSelectedLine, activeStop, setActiveStop]);

    return (
        <MetroContext.Provider value={value}>
            {children}
        </MetroContext.Provider>
    );
}

export function useMetroMap() {
    const context = useContext(MetroContext);
    if (!context) {
        throw new Error('useMetroMap must be used within MetroProvider');
    }
    return context;
}
