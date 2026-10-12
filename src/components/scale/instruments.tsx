'use client';

import { Fragment } from 'react';
import { m, type Variants } from 'framer-motion';
import type {
    IcebergModel, RoleTrackModel, ChainModel, MatrixModel, SwingModel,
} from '@/data/caseStudies';
import { EXPO, rise, useMotionOK } from '@/lib/motion';

/**
 * The visual storytelling instruments rendered inside case studies. Every one sits
 * in the same `Instrument` shell and reveals through the same `Beat`, so they read
 * as one family rather than a collection of widgets (see CONTENT-STANDARDS.md,
 * "Visual storytelling: the instruments").
 */

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
// The wrapper only orchestrates (no opacity of its own), so it stays local rather
// than using the shared `stagger`, which fades the parent too.
const beatWrap: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const beatItem = rise(14, 0.8);

// Instrument motion (Phase 5e): each move says what the instrument means. All are
// variant children of a Beat, so they wait for it, and render static without one.
/** Grows along its axis from its origin (a waterline, a bar, a travelled line). */
const grow: Variants = {
    hidden: { scaleX: 0 },
    show: (delay: number = 0) => ({ scaleX: 1, transition: { duration: 1, ease: EXPO, delay } }),
};
/** Rises out of a blur: what was hidden below the surface comes into focus. */
const surface: Variants = {
    hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EXPO } },
};
/** Lands last: the marker for where a row actually is. */
const settle: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EXPO, delay: 0.7 } },
};
/** A connector drawing itself after the cards it joins. */
const draw: Variants = {
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { duration: 0.8, ease: EXPO, delay: 0.3 } },
};

function Beat({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    // Both the OS preference and the site toggle: before Phase 0 this read the OS
    // setting only, so DisplayMenu's reduce-motion left the instruments animating.
    const reduced = !useMotionOK();
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
    const reduced = !useMotionOK();
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
 * Iceberg — the signature systems-thinking diagram: one visible symptom above a
 * waterline, the structural causes hidden below. Adapted to the light editorial
 * palette (the source lived on a dark theme). Purely presentational; all copy is
 * real text, the berg shapes are aria-hidden.
 */
export function Iceberg({ model }: { model: IcebergModel }) {
    return (
        <Instrument prompt={model.prompt}>
            <Beat>
            {/* Above the surface — the visible symptom */}
            <BeatItem className="px-5 sm:px-7 pt-5 pb-8">
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
            </BeatItem>

            {/* Waterline: draws outward from the middle before anything surfaces */}
            <m.div variants={grow} className="h-px w-full origin-center" style={{ background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 45%, transparent), transparent)' }} />

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
                            <m.div key={c.n} variants={surface} className="rounded-xl border border-ink/10 bg-surface/70 p-4">
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
                            </m.div>
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
            </Beat>
        </Instrument>
    );
}

/**
 * RoleTrack — for programmes running several workstreams on one shared
 * maturity axis, each at a genuinely different stage. One row per role: a dot
 * on a common track, real metrics where a round of testing has produced them,
 * an explicit "not yet" chip where it hasn't. The gap is the honest part —
 * never papered over with an invented number.
 */
export function RoleTrack({ model }: { model: RoleTrackModel }) {
    const lastIndex = model.stages.length - 1;
    return (
        <Instrument prompt={model.prompt}>
            <Beat className="px-5 sm:px-7 py-6 space-y-6">
                {model.rows.map((row) => {
                    const pct = lastIndex === 0 ? 0 : (row.stageIndex / lastIndex) * 100;
                    return (
                        <BeatItem key={row.role}>
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
                                {/* The distance travelled, drawn out to where the row stands */}
                                <m.div
                                    variants={grow}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-accent/60 origin-left"
                                    style={{ width: `${pct}%` }}
                                />
                                {model.stages.map((stage, i) => {
                                    const tickPct = lastIndex === 0 ? 0 : (i / lastIndex) * 100;
                                    const isCurrent = i === row.stageIndex;
                                    const isReached = i < row.stageIndex;
                                    // The current stage's marker lands after the line reaches it.
                                    const Dot = isCurrent ? m.div : 'div';
                                    return (
                                        <Dot
                                            key={stage}
                                            {...(isCurrent ? { variants: settle } : {})}
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
                                    {row.metrics.map((mt) => (
                                        <span
                                            key={mt.label}
                                            className="rounded-full border border-accent/30 bg-surface px-3 py-1 label-mono !text-[10px] !tracking-[0.06em] text-ink"
                                        >
                                            <span className="text-accent font-semibold">{mt.value}</span> {mt.label}
                                        </span>
                                    ))}
                                </div>
                            ) : row.pending ? (
                                <div className="mt-3 inline-block rounded-full border border-dashed border-ink/25 px-3 py-1 label-mono !text-[10px] !tracking-[0.06em] text-ink-soft/70">
                                    {row.pending}
                                </div>
                            ) : null}
                        </BeatItem>
                    );
                })}
            </Beat>

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
        </Instrument>
    );
}

/**
 * Chain — a sequence where each link consumes the previous link's output. The
 * arrows are the argument: they say these roles are not three audiences, they are
 * one pipeline, so a weakness upstream lands on someone downstream.
 */
export function Chain({ model }: { model: ChainModel }) {
    return (
        <Instrument prompt={model.prompt} note={model.note}>
            <Beat className="px-5 sm:px-7 py-6 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-2">
                {model.steps.map((s, i) => (
                    <Fragment key={s.role}>
                        {i > 0 && (
                            <BeatItem className="hidden md:flex items-center justify-center text-accent/50 px-1">
                                <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden="true">
                                    <m.path variants={draw} d="M0 5h19M15 1l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
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
export function Matrix({ model }: { model: MatrixModel }) {
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
export function Swing({ model }: { model: SwingModel }) {
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
                                    <m.div variants={grow} custom={0.1} className="h-full rounded-full bg-ink/25 origin-left" style={{ width: `${p.from.pct}%` }} />
                                </div>
                                <div className="h-1.5 rounded-full bg-ink/8 overflow-hidden">
                                    <m.div variants={grow} custom={0.25} className="h-full rounded-full bg-accent origin-left" style={{ width: `${p.to.pct}%` }} />
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
