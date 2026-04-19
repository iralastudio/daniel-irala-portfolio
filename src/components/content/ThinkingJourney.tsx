'use client';

import { useEffect, useRef } from 'react';
import { useModal } from '@/hooks/useModal';
import { Articles } from './Articles';
import { TalksWorkshops } from './TalksWorkshops';
import { Reading } from './Reading';
import { Experiments } from './Experiments';
import { StopId } from '@/types/metro';

const SECTIONS: { id: StopId; Component: React.ComponentType }[] = [
    { id: 'articles',   Component: Articles       },
    { id: 'workshops',  Component: TalksWorkshops },
    { id: 'reading',    Component: Reading        },
    { id: 'experiments', Component: Experiments   },
];

interface ThinkingJourneyProps {
    initialSection: StopId;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function ThinkingJourney({ initialSection, scrollContainerRef }: ThinkingJourneyProps) {
    const { setActiveScrollSection } = useModal();
    const sectionRefs = useRef<Map<StopId, HTMLElement>>(new Map());

    // Jump to the entry section instantly on open
    useEffect(() => {
        const container = scrollContainerRef.current;
        const el = sectionRefs.current.get(initialSection);
        if (container && el) {
            container.scrollTop = el.offsetTop;
        }
        setActiveScrollSection(initialSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll-spy: use the glass card as root
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const observers: IntersectionObserver[] = [];

        sectionRefs.current.forEach((el, stopId) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setActiveScrollSection(stopId);
                        }
                    });
                },
                {
                    root: container,
                    rootMargin: '-10% 0px -55% 0px',
                    threshold: 0,
                }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, [setActiveScrollSection, scrollContainerRef]);

    return (
        <div>
            {SECTIONS.map(({ id, Component }, index) => (
                <div key={id}>
                    <section
                        id={id}
                        ref={el => {
                            if (el) sectionRefs.current.set(id, el);
                            else sectionRefs.current.delete(id);
                        }}
                        className="py-10 md:py-12 scroll-mt-2"
                    >
                        <Component />
                    </section>

                    {index < SECTIONS.length - 1 && (
                        <div className="h-px bg-white/10" />
                    )}
                </div>
            ))}
        </div>
    );
}
