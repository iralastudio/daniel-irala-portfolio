'use client';

import { m } from 'framer-motion';
import type { Scene } from '@/data/scenes';
import { stagger, rise } from '@/lib/motion';
import { ActionPill } from './ActionPill';

/**
 * SectionPanel — the readable copy for the area you are looking at, set over the
 * live map. Editorial type, confident scale, a staggered ease-out reveal each time
 * the area changes. Its CTAs open the matching window (the map stays visible).
 */

const container = stagger(0.055, 0.04, { opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } });
const item = rise(18, 0.6, { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeOut' } });

export function SectionPanel({
    scene,
    isH1,
    onSelect,
    accentRef,
    hideAccent = false,
}: {
    scene: Scene;
    isH1: boolean;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    /** The accent word's element — the signature sequence samples its glyphs. */
    accentRef?: React.Ref<HTMLSpanElement>;
    /** While the signature runs, the canvas draws the word; the DOM word stays invisible. */
    hideAccent?: boolean;
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
            className="pointer-events-none m-auto w-full max-w-[34rem] px-6 md:px-12 lg:px-20 py-9"
        >
            {/* pointer-events-auto per block, not on the wrapper above: the wrapper's
                own padding is a visually-transparent gutter over the map by this point
                in the frosted fade, and capturing clicks there stole them from the
                canvas beneath (see ScaleExperience.tsx's matching wrapper). */}
            <m.div variants={item} className="pointer-events-auto flex items-center gap-3 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                <span className="label-mono text-ink uppercase">{eyebrow}</span>
                {descriptor && <span className="h-px w-6 bg-ink/20" aria-hidden="true" />}
                {descriptor && <span className="label-mono text-ink-soft">{descriptor}</span>}
            </m.div>

            <Heading
                variants={item}
                className="pointer-events-auto font-display font-bold text-ink leading-[0.98] tracking-[-0.02em] text-balance"
                style={{ fontSize: 'var(--step-4)' }}
            >
                {scene.headline.lead}
                <span
                    ref={accentRef}
                    className="italic text-accent"
                    // Hides instantly (the canvas takes over the same pixels), fades back in.
                    style={{ opacity: hideAccent ? 0 : 1, transition: hideAccent ? 'none' : 'opacity 320ms ease-out' }}
                >
                    {scene.headline.accent}
                </span>
            </Heading>

            {scene.headline.sub && (
                <m.p
                    variants={item}
                    className="pointer-events-auto font-display italic text-ink-soft mt-3 text-balance"
                    style={{ fontSize: 'var(--step-1)' }}
                >
                    {scene.headline.sub}
                </m.p>
            )}

            <m.p
                variants={item}
                className="pointer-events-auto mt-6 text-ink-soft max-w-[46ch] text-pretty"
                style={{ fontSize: 'var(--step-0)', lineHeight: 1.65 }}
            >
                {scene.body}
            </m.p>

            {scene.cta && (
                <m.div variants={item} className="pointer-events-auto mt-8">
                    <ActionPill primary label={scene.cta.label} href={scene.cta.href} onSelect={onSelect} />
                </m.div>
            )}

            {/* Project entries read as an index, not a stack of boxes — long
                titles get the full width instead of wrapping inside a button. */}
            {scene.links && scene.links.length > 0 && (
                <m.div variants={item} className="pointer-events-auto mt-7 border-t border-ink/12">
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
