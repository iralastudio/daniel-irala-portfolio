'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useIsPresent } from 'framer-motion';
import { caseStudies, type CaseFigure } from '@/data/caseStudies';
import { nodeContent } from '@/data/nodeContent';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import type { WindowOrigin } from '@/lib/clickOrigin';
import { EXPO, WINDOW_MS, stagger, rise, useMotionOK } from '@/lib/motion';
import { ActionPill } from './ActionPill';
import { Compass } from './Compass';
import { Tensions } from './Tensions';
import { PodcastEmbed } from './PodcastEmbed';
import { Iceberg, RoleTrack, Chain, Matrix, Swing } from './instruments';
import { Figure, Lightbox } from './CaseFigure';
import { StoryBlock } from './storyInstruments';
import { isStoryBlock } from '@/data/storyModels';
import { isNespressoBlock } from '@/data/nespressoModels';
import { isMaturityBlock } from '@/data/maturityModels';
import { MaturityInstrument } from './maturityInstruments';
import { isAgentBlock } from '@/data/agentModels';
import { AgentInstrument } from './agentInstruments';
import { isSynthBlock } from '@/data/synthModels';
import { SynthInstrument } from './synthInstruments';
import { isKeyBlock } from '@/data/keyModels';
import { KeyInstrument } from './keyInstruments';
import { isItpoBlock } from '@/data/itpoModels';
import { ItpoInstrument } from './itpoInstruments';
import { NespressoInstrument } from './nespressoInstruments';
import { Connected, BookCall } from './WindowLinks';
import { ScrollRoot, CountUp, ReadingProgress, useSectionSpy } from './ReadingAids';

/**
 * CaseStudyOverlay — THE single content window for every node click. Whether it
 * holds a full immersive case study (`study`) or compact node content (`node`),
 * the surface is identical: a frosted-glass article centred over the live map,
 * same sticky header, same close affordances — one consistent window system.
 *
 * Signature move: the window is BORN FROM THE CLICKED CIRCLE — a clip-path
 * circle reveal expanding from the node's screen position (container-transform
 * pattern), so opening content reads as zooming into the node. Reduced motion
 * falls back to a plain fade. Esc / × / gutter click closes; images open in a
 * lightbox so the copy stays readable.
 *
 * Loaded lazily by ScaleExperience (nothing here is needed before the first click),
 * which is why it resolves its own content from `href`: the case-study text then
 * ships in this chunk instead of the initial bundle.
 */
// Tempo matches the map (docs/MOTION-PLAN, Phase 4): the reveal takes 1.1 s, the
// copy settles over 0.9 s per block with a 90 ms stagger, so a reader sees the
// window arrive rather than appear. Exit stays shorter than entry.
const container = stagger(0.1, 0.4);
const block = rise(22, 1.0);

export function CaseStudyOverlay({
    href,
    origin,
    onClose,
    onSelect,
    color = '#003ED7',
    lateral = false,
}: {
    href: string;
    origin?: WindowOrigin | null;
    onClose: () => void;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
    /** The scale's colour: header dot and the opening wash (model B). */
    color?: string;
    /** Arrived from another window: crossfade in, no circle. */
    lateral?: boolean;
}) {
    const study = caseStudies[href];
    const node = nodeContent[href];
    // The figure and where it sat on screen, so the lightbox can grow from it.
    const [lightbox, setLightbox] = useState<{ fig: CaseFigure; from: DOMRect | null } | null>(null);
    const dialogRef = useDialogFocus<HTMLDivElement>();
    // Honours both the OS preference and the site's own toggle (see useMotionOK).
    const reduceMotion = !useMotionOK();

    const kicker = study?.kicker ?? node?.kicker ?? '';
    const title = study?.title ?? node?.title ?? '';

    // The reveal grows from the clicked node's circle; without a pointer origin
    // (keyboard, internal switches) it blooms from the upper centre instead.
    // Radius animates px→px (mixed px→% units don't interpolate in clip-path).
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const ox = origin?.x ?? vw / 2;
    const oy = origin?.y ?? 160;
    const r0 = Math.max(14, origin?.r ?? 14); // the dot's own drawn radius
    const coverR = Math.ceil(Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy))) + 40;
    // Two openings, one per entry point: out of a dot as a circle, out of a list row
    // as a rectangle that starts as the row itself and unfolds to the whole screen.
    const rect = origin?.rect;
    const clipFrom = rect
        ? `inset(${rect.top}px ${vw - rect.right}px ${vh - rect.bottom}px ${rect.left}px round 3px)`
        : `circle(${r0}px at ${ox}px ${oy}px)`;
    const clipTo = rect ? 'inset(0px 0px 0px 0px round 0px)' : `circle(${coverR}px at ${ox}px ${oy}px)`;

    // Native CSS clip-path transition for the reveal — framer's complex-value
    // parser mangles `circle(r at x y)` strings, so the circle is driven by the
    // browser's own interpolation. Cleared afterwards so nothing clips on
    // scroll/resize. (html.reduce-motion collapses the transition globally.)
    const vpRef = useRef<HTMLDivElement>(null);
    const section = useSectionSpy(vpRef, href);
    // Model B: a pointer-opened window is first the bead's own colour, which then
    // dissolves into the glass, so it reads as the node opened up.
    const wash = Boolean(origin) && !rect && !reduceMotion && !lateral; // the dot's tint only
    useEffect(() => {
        const el = vpRef.current;
        if (!el || reduceMotion || lateral) return;
        // Starts at the dot's own edge, so the window reads as the dot opening up.
        el.style.clipPath = clipFrom;
        el.style.transition = 'clip-path var(--dur-window) var(--ease-out-expo)';
        // The clip MUST be cleared at the end: a clip-path on this ancestor makes it the
        // backdrop root, and the article's frosted glass then stops blurring the map.
        // The clean-up timer starts only once the circle is actually expanding, so a
        // late frame (slow device, background tab) can never re-apply the circle after
        // it was cleared, which is what left the glass unfrosted before.
        let done = false;
        let raf2 = 0;
        let t = 0;
        const finish = () => {
            if (done) return;
            done = true;
            el.style.clipPath = 'none';
            el.style.transition = '';
        };
        const onEnd = (e: TransitionEvent) => {
            if (e.target === el && e.propertyName === 'clip-path') finish();
        };
        el.addEventListener('transitionend', onEnd);
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
                if (done) return;
                el.style.clipPath = clipTo;
                t = window.setTimeout(finish, WINDOW_MS + 150); // --dur-window + grace
            });
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
            clearTimeout(t);
            el.removeEventListener('transitionend', onEnd);
        };
    }, [clipFrom, clipTo, reduceMotion, lateral]);

    // A window on its way out (the old one during a crossfade) must stop answering
    // Esc: otherwise both windows close, history goes back twice, and the visitor can
    // be thrown off the page. Read through a ref so the scroll lock below never re-runs.
    const isPresent = useIsPresent();
    const presentRef = useRef(true);
    useEffect(() => {
        presentRef.current = isPresent;
    }, [isPresent]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape' || !presentRef.current) return;
            if (lightbox) setLightbox(null);
            else onClose();
        };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose, lightbox]);

    return (
        <div
            ref={dialogRef}
            tabIndex={-1}
            className="fixed inset-0 z-50 outline-none"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Light dim — keeps the map clearly present behind the reading surface.
                Purely visual: the scroll viewport covers it, so clicks land there. */}
            <m.div
                className="absolute inset-0"
                style={{ background: 'color-mix(in srgb, var(--color-text-primary) 16%, transparent)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: EXPO }}
            />


            {/* The scroll viewport. Block flow + mx-auto centres the surface
                horizontally while keeping it top-aligned, so the sticky header is
                always the first thing reachable at the top (no centred overflow
                pushing the title above the header). Breathing room top/bottom and
                on the sides lets the live map show around it. */}
            <m.div
                ref={vpRef}
                className="absolute inset-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pb-6 sm:pb-10"
                initial={{ opacity: reduceMotion || lateral ? 0 : 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.5, ease: 'easeOut' } }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                onClick={(e) => {
                    // Close only when the gutter itself is clicked — clicks inside the
                    // article have a deeper target. (Esc is the keyboard equivalent.)
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                {wash && (
                    <m.div
                        aria-hidden="true"
                        className="absolute inset-0 z-20 pointer-events-none"
                        style={{ background: `color-mix(in srgb, ${color} 18%, var(--color-surface))` }}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 0.35, duration: 0.9, ease: EXPO }}
                    />
                )}
                <ScrollRoot.Provider value={vpRef}>
                <article
                    className={`relative w-full ${study ? 'max-w-[880px]' : 'max-w-[720px]'} mx-auto mt-6 sm:mt-10 rounded-3xl border border-ink/10`}
                    style={{
                        background: 'color-mix(in srgb, var(--color-surface) 82%, transparent)',
                        backdropFilter: 'blur(26px) saturate(1.1)',
                        WebkitBackdropFilter: 'blur(26px) saturate(1.1)',
                        boxShadow: '0 30px 90px rgba(43,42,41,0.22)',
                    }}
                >
                    {/* Sticky header — kicker + close, frosted so it reads while scrolling */}
                    <div
                        className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 sm:px-10 lg:px-14 py-4 rounded-t-3xl border-b border-ink/10"
                        style={{
                            background: 'color-mix(in srgb, var(--color-surface) 78%, transparent)',
                            backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                        }}
                    >
                        <span className="flex items-center gap-2.5 min-w-0">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
                            {/* Becomes the current section once you are reading one (Phase 5g). */}
                            <AnimatePresence mode="wait" initial={false}>
                                <m.span
                                    key={section ?? 'kicker'}
                                    className="label-mono truncate"
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: EXPO }}
                                >
                                    {section ?? kicker}
                                </m.span>
                            </AnimatePresence>
                        </span>
                        <button
                            onClick={onClose}
                            aria-label={study ? 'Close case study' : `Close: ${title}`}
                            className="w-11 h-11 grid place-items-center rounded-full border border-ink/15 text-ink-soft hover:text-ink hover:border-accent transition-colors duration-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        </button>
                        <ReadingProgress scrollRef={vpRef} color={color} />
                    </div>

                    <m.div
                        variants={container}
                        // Reduced motion: render the copy in place, no staggered rise.
                        // `false` propagates down the variant tree to every block.
                        initial={reduceMotion ? false : 'hidden'}
                        animate="show"
                        className="px-6 sm:px-10 lg:px-14 pt-8 pb-14"
                    >
                        {study && (
                            <>
                        {/* Hero */}
                        {study.positioning && (
                            <m.p variants={block} className="flex items-center gap-2.5 mb-4">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                                <span className="label-mono !text-accent">{study.positioning}</span>
                            </m.p>
                        )}

                        <m.h2
                            variants={block}
                            data-spy=""
                            className="font-display font-bold text-ink leading-[1.02] tracking-[-0.02em]"
                            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.25rem)' }}
                        >
                            {study.title}
                        </m.h2>

                        <m.p
                            variants={block}
                            className="font-display italic text-ink-soft mt-4"
                            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)' }}
                        >
                            {study.summary}
                        </m.p>

                        {/* Facts */}
                        <m.div variants={block} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-8">
                            {study.facts.map((f) => (
                                <div key={f.label} className="rounded-xl bg-background/70 border border-ink/10 px-4 py-3.5">
                                    <div className="font-display font-bold text-accent" style={{ fontSize: 'var(--step-1)' }}>
                                        <CountUp value={f.value} />
                                    </div>
                                    <div className="label-mono mt-1 !text-[10px] !tracking-[0.12em]">{f.label}</div>
                                </div>
                            ))}
                        </m.div>

                        {/* Sections */}
                        {study.sections.map((sec) => (
                            <m.section key={sec.n} variants={block} data-spy={`${sec.n} · ${sec.heading}`} className="mt-14 first:mt-16">
                                <div className="flex items-baseline gap-3 mb-5">
                                    <span className="font-display font-bold text-accent/40" style={{ fontSize: 'var(--step-1)' }}>
                                        {sec.n}
                                    </span>
                                    <h3 className="font-display font-bold text-ink" style={{ fontSize: 'var(--step-2)' }}>
                                        {sec.heading}
                                    </h3>
                                </div>

                                <div className="space-y-5">
                                    {sec.blocks.map((b, i) => {
                                        if (b.kind === 'text') {
                                            return (
                                                <p
                                                    key={i}
                                                    className="text-ink-soft"
                                                    style={{ fontSize: 'var(--step-0)', lineHeight: 1.7 }}
                                                >
                                                    {b.text}
                                                </p>
                                            );
                                        }
                                        if (b.kind === 'quote') {
                                            return (
                                                <blockquote
                                                    key={i}
                                                    className="border-l-2 border-accent pl-5 py-1 font-display italic text-ink"
                                                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.7rem)', lineHeight: 1.3 }}
                                                >
                                                    {b.text}
                                                </blockquote>
                                            );
                                        }
                                        if (b.kind === 'iceberg') {
                                            return <Iceberg key={i} model={b.model} />;
                                        }
                                        if (b.kind === 'roletrack') {
                                            return <RoleTrack key={i} model={b.model} />;
                                        }
                                        if (b.kind === 'chain') {
                                            return <Chain key={i} model={b.model} />;
                                        }
                                        if (b.kind === 'matrix') {
                                            return <Matrix key={i} model={b.model} />;
                                        }
                                        if (b.kind === 'swing') {
                                            return <Swing key={i} model={b.model} />;
                                        }
                                        if (isStoryBlock(b)) return <StoryBlock key={i} block={b} />;
                                        if (isNespressoBlock(b)) return <NespressoInstrument key={i} block={b} />;
                                        if (isMaturityBlock(b)) return <MaturityInstrument key={i} block={b} />;
                                        if (isAgentBlock(b)) return <AgentInstrument key={i} block={b} />;
                                        if (isSynthBlock(b)) return <SynthInstrument key={i} block={b} />;
                                        if (isKeyBlock(b)) return <KeyInstrument key={i} block={b} />;
                                        if (isItpoBlock(b)) return <ItpoInstrument key={i} block={b} />;
                                        // gallery
                                        return (
                                            <div key={i} className="grid gap-5 pt-1">
                                                {b.items.map((fig) => (
                                                    <Figure key={fig.src} fig={fig} onOpen={(f, from) => setLightbox({ fig: f, from })} />
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            </m.section>
                        ))}
                            </>
                        )}

                        {/* Compact node content — same surface, same voice, shorter read */}
                        {!study && node && (
                            <>
                                <m.h2
                                    variants={block}
                                    className="font-display font-bold text-ink leading-[1.05] tracking-[-0.02em]"
                                    style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)' }}
                                >
                                    {node.title}
                                </m.h2>

                                {node.facts && (
                                    <m.div variants={block} className="grid grid-cols-2 gap-2.5 mt-8">
                                        {node.facts.map((f) => (
                                            <div key={f.label} className="rounded-xl bg-background/70 border border-ink/10 px-4 py-3.5">
                                                <div className="font-display font-bold text-accent" style={{ fontSize: 'var(--step-1)' }}>
                                                    <CountUp value={f.value} />
                                                </div>
                                                <div className="label-mono mt-1 !text-[10px] !tracking-[0.12em]">{f.label}</div>
                                            </div>
                                        ))}
                                    </m.div>
                                )}

                                {node.paragraphs.length > 0 && (
                                    <div className="mt-8 space-y-4">
                                        {node.paragraphs.map((p, i) => (
                                            <m.p
                                                key={i}
                                                variants={block}
                                                className="text-ink-soft max-w-[64ch]"
                                                style={{ fontSize: 'var(--step-0)', lineHeight: 1.7 }}
                                            >
                                                {p}
                                            </m.p>
                                        ))}
                                    </div>
                                )}

                                {node.gallery && (
                                    <m.div variants={block} className="grid gap-5 mt-8">
                                        {node.gallery.map((fig) => (
                                            <Figure key={fig.src} fig={fig} onOpen={(f, from) => setLightbox({ fig: f, from })} />
                                        ))}
                                    </m.div>
                                )}

                                {node.podcast && (
                                    <m.div variants={block} className="mt-8">
                                        <PodcastEmbed {...node.podcast} />
                                    </m.div>
                                )}

                                {node.list && node.compass && (
                                    <m.div variants={block}>
                                        <Compass items={node.list} />
                                    </m.div>
                                )}

                                {node.list && node.tensions && (
                                    <m.div variants={block}>
                                        <Tensions items={node.list} />
                                    </m.div>
                                )}

                                {node.list && !node.compass && !node.tensions && (
                                    <m.dl
                                        variants={block}
                                        className={node.list.length > 1 ? 'grid sm:grid-cols-2 gap-3 mt-8' : 'grid gap-3 mt-8'}
                                    >
                                        {node.list.map((item) => (
                                            <div key={item.term} className="rounded-xl bg-background/70 border border-ink/10 px-4 py-3.5">
                                                <dt className="font-display font-semibold text-accent" style={{ fontSize: 'var(--step-0)' }}>
                                                    {item.term}
                                                </dt>
                                                <dd className="m-0 mt-1 text-ink-soft" style={{ fontSize: 'var(--step--1)', lineHeight: 1.6 }}>
                                                    {item.text}
                                                </dd>
                                            </div>
                                        ))}
                                    </m.dl>
                                )}

                                {node.note && (
                                    <m.p
                                        variants={block}
                                        className="text-ink-soft italic mt-8 max-w-[60ch]"
                                        style={{ fontSize: 'var(--step--1)', lineHeight: 1.65 }}
                                    >
                                        {node.note}
                                    </m.p>
                                )}

                                {node.actions && (
                                    <m.div variants={block} className="flex flex-wrap items-center gap-2.5 mt-8">
                                        {node.actions.map((a, i) => (
                                            <ActionPill
                                                key={a.href + a.label}
                                                primary={i === 0}
                                                label={a.label}
                                                href={a.href}
                                                external={a.external}
                                                onSelect={onSelect}
                                            />
                                        ))}
                                    </m.div>
                                )}
                            </>
                        )}

                        <m.div variants={block}>
                            <Connected href={href} onSelect={onSelect} />
                        </m.div>
                        <m.div variants={block}>
                            <BookCall href={href} />
                        </m.div>
                    </m.div>
                </article>
                </ScrollRoot.Provider>
            </m.div>

            {lightbox && <Lightbox fig={lightbox.fig} from={lightbox.from} onClose={() => setLightbox(null)} />}
        </div>
    );
}
