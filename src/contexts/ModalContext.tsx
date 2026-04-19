'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { StopId } from '@/types/metro';

interface ModalContextType {
    isOpen: boolean;
    activeStop: StopId | null;
    activeScrollSection: StopId | null;
    openModal: (stopId: StopId) => void;
    closeModal: () => void;
    setActiveScrollSection: (id: StopId | null) => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeStop, setActiveStop] = useState<StopId | null>(null);
    const [activeScrollSection, setActiveScrollSection] = useState<StopId | null>(null);

    const openModal = useCallback((stopId: StopId) => {
        setActiveStop(stopId);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setActiveStop(null);
        setActiveScrollSection(null);
    }, []);

    const handleSetActiveScrollSection = useCallback((id: StopId | null) => {
        setActiveScrollSection(id);
    }, []);

    // CRITICAL: Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        isOpen,
        activeStop,
        activeScrollSection,
        openModal,
        closeModal,
        setActiveScrollSection: handleSetActiveScrollSection,
    }), [isOpen, activeStop, activeScrollSection, openModal, closeModal, handleSetActiveScrollSection]);

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
