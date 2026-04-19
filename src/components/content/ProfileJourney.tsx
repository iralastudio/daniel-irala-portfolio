'use client';

import { useEffect, useRef } from 'react';
import { useModal } from '@/hooks/useModal';
import { AboutMe } from './AboutMe';
import { HowIWork } from './HowIWork';
import { Podcast } from './Podcast';
import { WhatIDo } from './WhatIDo';
import { Contact } from './Contact';
import { StopId } from '@/types/metro';

const SECTIONS: { id: StopId; label: string; Component: React.ComponentType }[] = [
    { id: 'about-me',   label: 'About Me',   Component: AboutMe   },
    { id: 'how-i-work', label: 'How I Work', Component: HowIWork  },
    { id: 'podcast',    label: 'Podcast',     Component: Podcast   },
    { id: 'what-i-do',  label: 'What I Do',  Component: WhatIDo   },
    { id: 'contact',    label: 'Contact',     Component: Contact   },
];

interface ProfileJourneyProps {
    initialSection: StopId;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function ProfileJourney({ initialSection, scrollContainerRef }: ProfileJourneyProps) {
    const { setActiveScrollSection } = useModal();
    const sectionRefs = useRef<Map<StopId, HTMLElement>>(new Map());

    // Scroll to the entry section instantly on open
    useEffect(() => {
        const container = scrollContainerRef.current;
        const el = sectionRefs.current.get(initialSection);
        if (container && el) {
            container.scrollTop = el.offsetTop;
        }
        setActiveScrollSection(initialSection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll-spy: use the glass card as root so intersection fires inside the modal scroll
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
                    // Fires when section enters the top 10-45% of the scroll container
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
