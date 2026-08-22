'use client';

import { m, type Variants } from 'framer-motion';
import type { Scene } from '@/data/scenes';
import { ActionPill } from './ActionPill';

/**
 * SectionPanel — the readable copy for the area you are looking at, set over the
 * live map. Editorial type, confident scale, a staggered ease-out reveal each time
 * the area changes. Its CTAs open the matching window (the map stays visible).
 */

const EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};
const item: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeOut' } },
};

export function SectionPanel({
    scene,
    isH1,
    onSelect,
}: {
    scene: Scene;
    isH1: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
}) {
    // Always h2. The document's single h1 is the one in CrawlableContent, which names
    // the person and the role — the strongest heading for search and answer engines,
    // and server-rendered so it exists before hydration. A second visible h1 here gave
    // the page two competing h1s. `isH1` still marks the lead scene for styling intent.
    void isH1;
    const Heading = m.h2;
    const eyebrow = scene.id === 'overview' ? 'Overview' : scene.id === 'profile' ? 'About me' : scene.scaleLabel;
    // Overview's kicker is 'Overview · the whole system' — pairing the eyebrow with
    // that descriptor says the same thing twice ("overview" already means the whole
    // system), unlike every other scale, where eyebrow (name) and descriptor (the
    // scale it operates at) are two different facts. Drop it for this one scene only;
    // the body copy right below already explains what the whole system is.
    const descriptor = scene.id === 'overview' ? '' : scene.kicker.split('·')[1]?.trim() ?? '';

    return (
        <m.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="pointer-events-auto m-auto w-full max-w-[34rem] px-6 md:px-12 lg:px-20 py-9"
        >
            <m.div variants={item} className="flex items-center gap-3 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                <span className="label-mono text-ink uppercase">{eyebrow}</span>
                {descriptor && <span className="h-px w-6 bg-ink/20" aria-hidden="true" />}
                {descriptor && <span className="label-mono text-ink-soft">{descriptor}</span>}
            </m.div>

            <Heading
                variants={item}
                className="font-display font-bold text-ink leading-[0.98] tracking-[-0.02em] text-balance"
                style={{ fontSize: 'var(--step-4)' }}
            >
                {scene.headline.lead}
                <span className="italic text-accent">{scene.headline.accent}</span>
            </Heading>

            {scene.headline.sub && (
                <m.p
                    variants={item}
                    className="font-display italic text-ink-soft mt-3 text-balance"
                    style={{ fontSize: 'var(--step-1)' }}
                >
                    {scene.headline.sub}
                </m.p>
            )}

            <m.p
                variants={item}
                className="mt-6 text-ink-soft max-w-[46ch] text-pretty"
                style={{ fontSize: 'var(--step-0)', lineHeight: 1.65 }}
            >
                {scene.body}
            </m.p>

            {scene.cta && (
                <m.div variants={item} className="mt-8">
                    <ActionPill primary label={scene.cta.label} href={scene.cta.href} onSelect={onSelect} />
                </m.div>
            )}

            {/* Project entries read as an index, not a stack of boxes — long
                titles get the full width instead of wrapping inside a button. */}
            {scene.links && scene.links.length > 0 && (
                <m.div variants={item} className="mt-7 border-t border-ink/12">
                    {scene.links.map((l) => (
                        <div key={l.href + l.label} className="border-b border-ink/12">
                            <ActionPill row label={l.label} href={l.href} meta={l.meta} onSelect={onSelect} />
                        </div>
                    ))}
                </m.div>
            )}
        </m.div>
    );
}
