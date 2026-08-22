'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import type {
    CaseStudy, CaseFigure, IcebergModel, RoleTrackModel,
    ChainModel, MatrixModel, SwingModel,
} from '@/data/caseStudies';
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
                                    <span key={t} className="rounded-sm border border-ink/10 bg-background/60 px-2.5 py-1 text-ink-soft" style={{ fontSize: 'var(--step--1)' }}>
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

/**
 * RoleTrack — for programmes running several workstreams on one shared
 * maturity axis, each at a genuinely different stage. One row per role: a dot
 * on a common track, real metrics where a round of testing has produced them,
 * an explicit "not yet" chip where it hasn't. The gap is the honest part —
 * never papered over with an invented number.
 */
function RoleTrack({ model }: { model: RoleTrackModel }) {
    const lastIndex = model.stages.length - 1;
    return (
        <div className="rounded-2xl border border-ink/10 overflow-hidden bg-background/40">
            <div className="px-5 sm:px-7 py-5 border-b border-ink/10">
                <p className="font-display text-ink" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)', lineHeight: 1.35 }}>
                    <strong className="font-semibold">{model.prompt}</strong>
                </p>
            </div>

            <div className="px-5 sm:px-7 py-6 space-y-6">
                {model.rows.map((row) => {
                    const pct = lastIndex === 0 ? 0 : (row.stageIndex / lastIndex) * 100;
                    return (
                        <div key={row.role}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
                                <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)' }}>
                                    {row.role}
                                </div>
                                <div className="label-mono !text-accent !text-[10px] !tracking-[0.1em]">
                                    {model.stages[row.stageIndex]}
                                </div>
                            </div>

                            {/* Track: base line, travelled line, one dot per stage */}
                            <div className="relative h-4">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-ink/10" />
                                <div
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-accent/60"
                                    style={{ width: `${pct}%` }}
                                />
                                {model.stages.map((stage, i) => {
                                    const tickPct = lastIndex === 0 ? 0 : (i / lastIndex) * 100;
                                    const isCurrent = i === row.stageIndex;
                                    const isReached = i < row.stageIndex;
                                    return (
                                        <div
                                            key={stage}
                                            aria-hidden="true"
                                            className={
                                                isCurrent
                                                    ? 'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-accent/20'
                                                    : isReached
                                                        ? 'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/50'
                                                        : 'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ink/15'
                                            }
                                            style={{ left: `${tickPct}%` }}
                                        />
                                    );
                                })}
                            </div>

                            <p className="text-ink-soft mt-3" style={{ fontSize: 'var(--step--1)', lineHeight: 1.6 }}>
                                {row.status}
                            </p>

                            {row.metrics ? (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {row.metrics.map((m) => (
                                        <span
                                            key={m.label}
                                            className="rounded-full border border-accent/30 bg-surface px-3 py-1 label-mono !text-[10px] !tracking-[0.06em] text-ink"
                                        >
                                            <span className="text-accent font-semibold">{m.value}</span> {m.label}
                                        </span>
                                    ))}
                                </div>
                            ) : row.pending ? (
                                <div className="mt-3 inline-block rounded-full border border-dashed border-ink/25 px-3 py-1 label-mono !text-[10px] !tracking-[0.06em] text-ink-soft/70">
                                    {row.pending}
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            {/* Shared legend — the one axis every row above is plotted against */}
            <div className="px-5 sm:px-7 pb-5 pt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 label-mono !text-[9px] !tracking-[0.08em] text-ink-soft/60 border-t border-ink/10">
                <span className="pt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    {model.stages.map((stage, i) => (
                        <span key={stage} className="flex items-center gap-1.5">
                            {i > 0 && <span aria-hidden="true">&rarr;</span>}
                            {stage}
                        </span>
                    ))}
                </span>
            </div>
        </div>
    );
}

/**
 * Beat — the scroll-triggered reveal shared by every visual instrument below.
 *
 * The case study is read at the reader's own pace, so the storytelling unit is a
 * scroll step, not a second of playback: one instrument enters, makes one claim,
 * and stays. Children stagger in sequence so a diagram assembles rather than
 * appearing whole, which is what makes a static picture feel narrated.
 *
 * `once: true` so nothing re-animates on scroll-back (re-triggering reads as a
 * glitch, not a flourish). Reduced motion collapses the whole thing to a plain
 * static render, never a fade with movement.
 */
const beatWrap: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const beatItem: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EXPO } },
};

function Beat({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <m.div
            className={className}
            variants={beatWrap}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
        >
            {children}
        </m.div>
    );
}

/** One staggered element inside a Beat. Static when motion is reduced. */
function BeatItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const reduced = useReducedMotion();
    if (reduced) return <div className={className}>{children}</div>;
    return (
        <m.div className={className} variants={beatItem}>
            {children}
        </m.div>
    );
}

/** The shared shell every instrument sits in, so they read as one family. */
function Instrument({ prompt, note, children }: { prompt: string; note?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-ink/10 overflow-hidden bg-background/40">
            <div className="px-5 sm:px-7 py-5 border-b border-ink/10">
                <p className="font-display text-ink" style={{ fontSize: 'clamp(1.05rem, 1.7vw, 1.35rem)', lineHeight: 1.35 }}>
                    <strong className="font-semibold">{prompt}</strong>
                </p>
            </div>
            {children}
            {note && (
                <div className="px-5 sm:px-7 pb-5 pt-0 text-ink-soft" style={{ fontSize: 'var(--step--1)', lineHeight: 1.6 }}>
                    {note}
                </div>
            )}
        </div>
    );
}

/**
 * Chain — a sequence where each link consumes the previous link's output. The
 * arrows are the argument: they say these roles are not three audiences, they are
 * one pipeline, so a weakness upstream lands on someone downstream.
 */
function Chain({ model }: { model: ChainModel }) {
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-2">
                {model.steps.map((s, i) => (
                    <Fragment key={s.role}>
                        {i > 0 && (
                            <BeatItem className="hidden md:flex items-center justify-center text-accent/50 px-1">
                                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
                                    <path d="M0 5h19M15 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </BeatItem>
                        )}
                        <BeatItem className="flex">
                            <div className="w-full rounded-xl border border-ink/12 bg-surface px-4 py-4 flex flex-col">
                                <div className="label-mono !text-accent mb-2">{`0${i + 1}`}</div>
                                <div className="font-display font-semibold text-ink" style={{ fontSize: 'var(--step-0)', lineHeight: 1.25 }}>
                                    {s.role}
                                </div>
                                <div className="text-ink-soft mt-2" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                                    {s.hands}
                                </div>
                            </div>
                        </BeatItem>
                    </Fragment>
                ))}
            </Beat>
        </Instrument>
    );
}

/**
 * Matrix — the correlation view. One row per shared gap, one column per role, so
 * the eye reads across and sees the same problem wearing three different costumes.
 * Rows are cards rather than table rows: the cells hold phrases, not values, and a
 * three-column table of phrases is unreadable on a phone. Semantics stay honest
 * via a definition list per row (role is the term, its symptom the description).
 */
function Matrix({ model }: { model: MatrixModel }) {
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 space-y-3">
                {model.rows.map((row) => (
                    <BeatItem key={row.gap}>
                        <div className="rounded-xl border border-ink/12 bg-surface overflow-hidden">
                            <div className="flex items-baseline gap-3 px-4 pt-4 pb-3">
                                <span className="font-display font-bold text-accent/45" style={{ fontSize: 'var(--step-0)' }}>
                                    {row.n}
                                </span>
                                <h4 className="font-display font-semibold text-ink m-0" style={{ fontSize: 'var(--step-0)' }}>
                                    {row.gap}
                                </h4>
                            </div>
                            <dl className="grid gap-px bg-ink/10 sm:grid-cols-3 border-t border-ink/10 m-0">
                                {row.cells.map((cell, ci) => (
                                    <div key={model.columns[ci]} className="bg-surface px-4 py-3.5">
                                        <dt className="label-mono !text-[9px] text-ink-soft/70 mb-1.5">{model.columns[ci]}</dt>
                                        <dd className="text-ink-soft m-0" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                                            {cell}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </BeatItem>
                ))}
            </Beat>
        </Instrument>
    );
}

/**
 * Swing — a controlled before/after. Two bars per pair, the second in accent, so
 * the size of the change is legible before any number is read. `better` decides
 * whether the movement is framed as a gain or a reduction, because "down 86%" and
 * "up 40 points" are both wins here and the reader should not have to work it out.
 */
function Swing({ model }: { model: SwingModel }) {
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 grid gap-4 sm:grid-cols-2">
                {model.pairs.map((p) => (
                    <BeatItem key={p.label}>
                        <div className="rounded-xl border border-ink/12 bg-surface px-4 py-4 h-full flex flex-col">
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="label-mono text-ink-soft/70">{p.label}</span>
                                <span className="label-mono !text-[9px] !tracking-[0.08em] text-ink-soft/50 shrink-0">
                                    {p.better === 'higher' ? 'higher is better' : 'lower is better'}
                                </span>
                            </div>

                            {/* The bars are decorative; this is what a screen reader gets. */}
                            <span className="sr-only">
                                {`${p.label}: ${p.from.value} before, ${p.to.value} after. ${p.better === 'higher' ? 'Higher' : 'Lower'} is better.`}
                            </span>

                            <div className="flex items-baseline gap-2.5 mt-3">
                                <span className="font-display text-ink-soft/60" style={{ fontSize: 'var(--step-1)' }}>
                                    {p.from.value}
                                </span>
                                <span className="text-accent/60" aria-hidden="true">
                                    <svg width="20" height="9" viewBox="0 0 20 9" fill="none">
                                        <path d="M0 4.5h17M13 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="font-display font-bold text-accent" style={{ fontSize: 'var(--step-2)', lineHeight: 1 }}>
                                    {p.to.value}
                                </span>
                            </div>

                            {/* Two tracks, same scale. The eye gets the delta before the digits. */}
                            <div className="mt-3.5 space-y-1.5" aria-hidden="true">
                                <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                                    <div className="h-full rounded-full bg-ink/25" style={{ width: `${p.from.pct}%` }} />
                                </div>
                                <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                                    <div className="h-full rounded-full bg-accent" style={{ width: `${p.to.pct}%` }} />
                                </div>
                            </div>

                            {p.note && (
                                <div className="text-ink-soft mt-3" style={{ fontSize: 'var(--step--1)', lineHeight: 1.55 }}>
                                    {p.note}
                                </div>
                            )}
                        </div>
                    </BeatItem>
                ))}
            </Beat>
        </Instrument>
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
