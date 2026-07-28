'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import type { CaseStudy, CaseFigure, IcebergModel } from '@/data/caseStudies';
import type { NodeContent } from '@/data/nodeContent';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { useAccessibility } from '@/hooks/useAccessibility';
import { ActionPill } from './ActionPill';
import { Compass } from './Compass';
import { PodcastEmbed } from './PodcastEmbed';

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
 */

const EXPO = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const block: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO } },
};

function Figure({ fig, onOpen }: { fig: CaseFigure; onOpen: (f: CaseFigure) => void }) {
    return (
        <figure className="m-0">
            <button
                onClick={() => onOpen(fig)}
                className="group block w-full overflow-hidden rounded-xl border border-ink/10 bg-white cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Enlarge: ${fig.caption ?? fig.alt}`}
            >
                <Image
                    src={fig.src}
                    alt={fig.alt}
                    width={fig.w}
                    height={fig.h}
                    className="w-full h-auto transition-transform duration-300 ease-out group-hover:scale-[1.015]"
                    sizes="(max-width: 900px) 92vw, 820px"
                />
            </button>
            {fig.caption && (
                <figcaption className="label-mono !tracking-[0.1em] !text-[10px] mt-2.5 text-center text-ink-soft">
                    {fig.caption}
                </figcaption>
            )}
        </figure>
    );
}

/**
 * Iceberg — the signature systems-thinking diagram: one visible symptom above a
 * waterline, the structural causes hidden below. Adapted to the light editorial
 * palette (the source lived on a dark theme). Purely presentational; all copy is
 * real text, the berg shapes are aria-hidden.
 */
function Iceberg({ model }: { model: IcebergModel }) {
    return (
        <div className="rounded-2xl border border-ink/10 overflow-hidden bg-background/40">
            <div className="px-5 sm:px-7 py-5 border-b border-ink/10">
                <p className="font-display text-ink" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)', lineHeight: 1.35 }}>
                    <strong className="font-semibold">{model.prompt}</strong>
                </p>
            </div>

            {/* Above the surface — the visible symptom */}
            <div className="px-5 sm:px-7 pt-5 pb-8">
                <div className="label-mono mb-4">Above the surface</div>
                <div className="flex items-center gap-5 sm:gap-7">
                    <svg width="96" height="76" viewBox="0 0 96 76" aria-hidden="true" className="shrink-0">
                        <defs>
                            <linearGradient id="berg-tip" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#5b73d6" />
                                <stop offset="1" stopColor="#8b93b8" />
                            </linearGradient>
                        </defs>
                        <path d="M48 4 L92 72 L4 72 Z" fill="url(#berg-tip)" />
                    </svg>
                    <div className="rounded-xl border border-accent/40 bg-surface px-5 py-4 shadow-[0_6px_24px_rgba(43,42,41,0.06)]">
                        <div className="font-display font-semibold text-accent" style={{ fontSize: 'var(--step-0)' }}>
                            {model.above.title}
                        </div>
                        <div className="text-ink-soft mt-1" style={{ fontSize: 'var(--step--1)' }}>
                            {model.above.note}
                        </div>
                    </div>
                </div>
            </div>

            {/* Waterline */}
            <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 45%, transparent), transparent)' }} />

            {/* Below the surface — the hidden causes */}
            <div className="relative px-5 sm:px-7 pt-6 pb-6 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0"
                    style={{
                        width: '58%',
                        height: '100%',
                        background: 'linear-gradient(180deg, color-mix(in srgb, #5b73d6 12%, transparent), transparent 78%)',
                        clipPath: 'polygon(20% 0, 80% 0, 62% 100%, 38% 100%)',
                    }}
                />
                <div className="relative">
                    <div className="label-mono mb-4">Hidden below the surface</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {model.below.map((c) => (
                            <div key={c.n} className="rounded-xl border border-ink/10 bg-surface/70 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="shrink-0 grid place-items-center w-7 h-7 rounded-full border border-accent/30 text-accent label-mono !text-[10px] !tracking-[0.08em]">
                                        {c.n}
                                    </span>
                                    <div>
                                        <div className="font-display font-semibold text-ink leading-snug" style={{ fontSize: 'var(--step-0)' }}>
                                            {c.title}
                                        </div>
                                        <div className="text-ink-soft mt-1.5" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                                            {c.note}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {model.outOfScope && model.outOfScope.length > 0 && (
                        <div className="mt-6">
                            <div className="label-mono mb-2.5">Out of scope for the workshop</div>
                            <div className="flex flex-wrap gap-2">
                                {model.outOfScope.map((t) => (
                                    <span key={t} className="rounded-full border border-ink/10 bg-background/60 px-3 py-1.5 text-ink-soft" style={{ fontSize: 'var(--step--1)' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CaseStudyOverlay({
    study,
    node,
    origin,
    onClose,
    onSelect,
}: {
    study?: CaseStudy;
    node?: NodeContent;
    origin?: { x: number; y: number } | null;
    onClose: () => void;
    onSelect: (href: string, origin?: { x: number; y: number }) => void;
}) {
    const [lightbox, setLightbox] = useState<CaseFigure | null>(null);
    const dialogRef = useDialogFocus<HTMLDivElement>();
    const { settings } = useAccessibility();
    // Honour BOTH the OS-level preference (framer) and the site's own
    // accessibility toggle — the two must always agree on skipping the reveal.
    const reduceMotion = useReducedMotion() || settings.reduceMotion;

    const kicker = study?.kicker ?? node?.kicker ?? '';
    const title = study?.title ?? node?.title ?? '';

    // The reveal grows from the clicked node's circle; without a pointer origin
    // (keyboard, internal switches) it blooms from the upper centre instead.
    // Radius animates px→px (mixed px→% units don't interpolate in clip-path).
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const ox = origin?.x ?? vw / 2;
    const oy = origin?.y ?? 160;
    const coverR = Math.ceil(Math.hypot(Math.max(ox, vw - ox), Math.max(oy, vh - oy))) + 40;

    // Native CSS clip-path transition for the reveal — framer's complex-value
    // parser mangles `circle(r at x y)` strings, so the circle is driven by the
    // browser's own interpolation. Cleared afterwards so nothing clips on
    // scroll/resize. (html.reduce-motion collapses the transition globally.)
    const vpRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = vpRef.current;
        if (!el || reduceMotion) return;
        el.style.clipPath = `circle(14px at ${ox}px ${oy}px)`;
        el.style.transition = 'clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        const raf = requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                el.style.clipPath = `circle(${coverR}px at ${ox}px ${oy}px)`;
            })
        );
        const t = setTimeout(() => {
            el.style.clipPath = 'none';
            el.style.transition = '';
        }, 760);
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(t);
        };
    }, [ox, oy, coverR, reduceMotion]);

    // The lightbox is its own focus layer: focus moves to its close button on
    // open (Tab is held there — it is the only control), and returns to the
    // triggering figure on close. Without this, Tab walks the article content
    // hidden behind the dark surround.
    const lightboxCloseRef = useRef<HTMLButtonElement>(null);
    const lightboxTrigger = useRef<HTMLElement | null>(null);
    useEffect(() => {
        if (lightbox) {
            lightboxTrigger.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
            lightboxCloseRef.current?.focus();
        } else if (lightboxTrigger.current) {
            lightboxTrigger.current.focus({ preventScroll: true });
            lightboxTrigger.current = null;
        }
    }, [lightbox]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
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
                transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* The scroll viewport. Block flow + mx-auto centres the surface
                horizontally while keeping it top-aligned, so the sticky header is
                always the first thing reachable at the top (no centred overflow
                pushing the title above the header). Breathing room top/bottom and
                on the sides lets the live map show around it. */}
            <m.div
                ref={vpRef}
                className="absolute inset-0 overflow-y-auto no-scrollbar px-4 sm:px-6 pb-6 sm:pb-10"
                initial={{ opacity: reduceMotion ? 0 : 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 16, transition: { duration: 0.3, ease: 'easeOut' } }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                onClick={(e) => {
                    // Close only when the gutter itself is clicked — clicks inside the
                    // article have a deeper target. (Esc is the keyboard equivalent.)
                    if (e.target === e.currentTarget) onClose();
                }}
            >
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
                        <span className="label-mono truncate">{kicker}</span>
                        <button
                            onClick={onClose}
                            aria-label={study ? 'Close case study' : `Close: ${title}`}
                            className="w-11 h-11 grid place-items-center rounded-full border border-ink/15 text-ink-soft hover:text-ink hover:border-accent transition-colors duration-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <m.div
                        variants={container}
                        initial="hidden"
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
                            className="font-display font-bold text-ink leading-[1.02] tracking-[-0.02em]"
                            style={{ fontSize: 'clamp(2rem, 4.4vw, 3.25rem)' }}
                        >
                            {study.title}
                        </m.h2>

                        <m.p
                            variants={block}
                            className="font-display italic text-ink-soft mt-4 max-w-[44ch]"
                            style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)' }}
                        >
                            {study.summary}
                        </m.p>

                        {/* Facts */}
                        <m.div variants={block} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-8">
                            {study.facts.map((f) => (
                                <div key={f.label} className="rounded-xl bg-background/70 border border-ink/10 px-4 py-3.5">
                                    <div className="font-display font-bold text-accent" style={{ fontSize: 'var(--step-1)' }}>
                                        {f.value}
                                    </div>
                                    <div className="label-mono mt-1 !text-[10px] !tracking-[0.12em]">{f.label}</div>
                                </div>
                            ))}
                        </m.div>

                        {/* Sections */}
                        {study.sections.map((sec) => (
                            <m.section key={sec.n} variants={block} className="mt-14 first:mt-16">
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
                                                    className="text-ink-soft max-w-[64ch]"
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
                                                    className="border-l-2 border-accent pl-5 py-1 font-display italic text-ink max-w-[52ch]"
                                                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.7rem)', lineHeight: 1.3 }}
                                                >
                                                    {b.text}
                                                </blockquote>
                                            );
                                        }
                                        if (b.kind === 'iceberg') {
                                            return <Iceberg key={i} model={b.model} />;
                                        }
                                        // gallery
                                        return (
                                            <div key={i} className="grid gap-5 pt-1">
                                                {b.items.map((fig) => (
                                                    <Figure key={fig.src} fig={fig} onOpen={setLightbox} />
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
                                                    {f.value}
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

                                {node.list && !node.compass && (
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
                    </m.div>
                </article>
            </m.div>

            {/* Lightbox — full-size view of a detailed map */}
            {lightbox && (
                <m.div
                    role="dialog"
                    aria-label={`Image: ${lightbox.alt}`}
                    className="absolute inset-0 z-20 grid place-items-center p-4 sm:p-10 cursor-zoom-out"
                    style={{ background: 'color-mix(in srgb, var(--color-text-primary) 72%, transparent)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onKeyDown={(e) => {
                        // The close button is the lightbox's only control — hold Tab
                        // there so keyboard focus never lands behind the dark surround.
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            lightboxCloseRef.current?.focus();
                        }
                    }}
                    onClick={(e) => {
                        // Close on the dark surround only — clicks on the image/caption
                        // have a deeper target. (Esc is the keyboard equivalent.)
                        if (e.target === e.currentTarget) setLightbox(null);
                    }}
                >
                    <figure className="m-0 max-w-[96vw] max-h-[92vh]">
                        <Image
                            src={lightbox.src}
                            alt={lightbox.alt}
                            width={lightbox.w}
                            height={lightbox.h}
                            className="w-auto h-auto max-w-[96vw] max-h-[86vh] rounded-lg bg-white shadow-2xl"
                            sizes="96vw"
                        />
                        {lightbox.caption && (
                            <figcaption className="label-mono !text-[10px] mt-3 text-center text-white/80">
                                {lightbox.caption}
                            </figcaption>
                        )}
                    </figure>
                    {/* Same close control as the window header — sized/stroked identically;
                        white ring + surfaces because this layer sits on a dark backdrop. */}
                    <button
                        ref={lightboxCloseRef}
                        onClick={() => setLightbox(null)}
                        aria-label="Close image"
                        className="absolute top-5 right-5 w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        </svg>
                    </button>
                </m.div>
            )}
        </div>
    );
}
