'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { StopId } from '@/types/metro';

interface ModalContextType {
    isOpen: boolean;
    activeStop: StopId | null;
    openModal: (stopId: StopId) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeStop, setActiveStop] = useState<StopId | null>(null);

    const openModal = useCallback((stopId: StopId) => {
        setActiveStop(stopId);
        setIsOpen(true);
        // Optional: Update URL hash here if desired
        // window.history.pushState(null, '', `#${stopId}`);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setActiveStop(null);
        // Optional: Clear hash
        // window.history.pushState(null, '', ' ');
    }, []);

    // CRITICAL: Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        isOpen,
        activeStop,
        openModal,
        closeModal
    }), [isOpen, activeStop, openModal, closeModal]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
}
