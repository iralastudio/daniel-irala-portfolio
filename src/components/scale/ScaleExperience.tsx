'use client';

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { scenes, overviewScene } from '@/data/scenes';
import { useAccessibility } from '@/hooks/useAccessibility';
import { nodeContent } from '@/data/nodeContent';
import { SystemMap, type FlyTo } from './SystemMap';
import { GROUP } from '@/lib/systemMap';
import { SystemMapBackdrop } from './SystemMapBackdrop';
import { SectionPanel } from './SectionPanel';
import { BrandMark } from './BrandMark';
import { ScaleRail } from './ScaleRail';
import { MobileNav } from './MobileNav';
import { DisplayMenu } from './DisplayMenu';

// The window (and the case-study text it carries) is only needed after the first
// click, so it stays out of the initial bundle. It is prefetched once the browser
// is idle, so by the time anyone clicks the chunk is normally already there.
const loadOverlay = () => import('./CaseStudyOverlay');
const CaseStudyOverlay = dynamic(() => loadOverlay().then((mod) => mod.CaseStudyOverlay), { ssr: false });

// Every openable href has a nodeContent entry: full case studies keep one too, as
// their compact summary. CrawlableContent fails the build if that ever stops being
// true, which is what lets this check skip importing caseStudies.
const hasWindow = (href: string) => Boolean(nodeContent[href]);

// href → which scale/scene it belongs to (for rail + panel context).
const HREF_SCENE: Record<string, number> = {
    '#about': 0,
    '#compass': 0,
    '#contact': 0,
    '#touchpoint': 1,
    '#nespresso': 1,
    '#digital-agent': 1,
    '#team': 2,
    '#synthetic-users': 2,
    '#design-maturity': 2,
    '#organisation': 3,
    '#it-product': 3,
    '#it-key-roles': 3,
    '#seamless': 3,
    '#thinking': 4,
    '#podcast': 4,
    '#talks': 4,
};

// active === -1 means "whole system / overview"; copy falls back to the tagline.
const OVERVIEW = -1;

// The overview body rewritten for stacked mode — same facts and voice, but the
// interaction instructions match a scrolled page instead of a zoomable map.
const STACKED_OVERVIEW_BODY =
    'This is the practice itself, mapped — five scales of work, from a single screen to the ' +
    'wider field, orbiting one throughline. Scroll through the levels to see how the parts connect.';

// Subscriptions for useSyncExternalStore: `mounted` flips false→true across
// hydration (server snapshot vs client snapshot), `isMobile` tracks the media
// query — no setState-in-effect, no cascading first render.
// Touch-only devices (tablets included) get stacked mode too: the free-zoom
// map is tuned for a pointer (hover cues, wheel zoom, small rail targets).
const MOBILE_QUERY = '(max-width: 767px), (hover: none) and (pointer: coarse)';
const subscribeMobile = (onChange: () => void) => {
    const mq = window.matchMedia(MOBILE_QUERY);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
};
const subscribeNever = () => () => {};

export function ScaleExperience() {
    const { settings } = useAccessibility();
    const [active, setActive] = useState(OVERVIEW);
    const [selected, setSelected] = useState<string | null>(null);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
    const [flyTo, setFlyTo] = useState<FlyTo | null>(null);
    const [releasePinned, setReleasePinned] = useState(0);
    // The "scroll to zoom · drag · click" hint has done its job once the visitor has
    // touched the map; it then fades out and leaves (Phase 2d).
    const [hintGone, setHintGone] = useState(false);
    const dismissHint = useCallback(() => setHintGone(true), []);

    // Signature sequence (Phase 3 of docs/MOTION-PLAN-2026-10-12.md): the overview's
    // accent word is drawn as points on the canvas, which then fly out to become the
    // nodes of the system. The DOM word hides while the canvas owns it.
    const accentRef = useRef<HTMLSpanElement>(null);
    const [hideAccent, setHideAccent] = useState(false);
    const getWordRect = useCallback(() => {
        const el = accentRef.current;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        // Build the canvas font from parts: Firefox returns '' for the `font` shorthand,
        // which rasterised the word at the canvas default and aborted the sequence.
        const font = cs.font || `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        return { rect: r, text: el.textContent ?? '', font, color: cs.color };
    }, []);
    const onSignatureStart = useCallback(() => setHideAccent(true), []);
    const onSignatureEnd = useCallback(() => setHideAccent(false), []);

    const mounted = useSyncExternalStore(subscribeNever, () => true, () => false);
    const isMobile = useSyncExternalStore(
        subscribeMobile,
        () => window.matchMedia(MOBILE_QUERY).matches,
        () => false
    );

    const reduced = mounted && settings.reduceMotion;
    // On phones (or reduce-motion) use an accessible, scrollable stacked layout
    // instead of the free-zoom canvas, which needs a pointer.
    const stacked = mounted && (reduced || isMobile);
    // The whole-system overview has its own copy, distinct from "About me"
    // (which is what shows once you've zoomed into that cluster specifically).
    const panelScene = active === OVERVIEW ? overviewScene : scenes[active];

    useEffect(() => {
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
        idle(() => void loadOverlay());
    }, []);

    // Every content window is addressable. Without this the back button does
    // nothing and a case study can't be sent to anyone — fatal for a portfolio.
    // Reflect a URL hash into open-window state. Returns false when the hash
    // names nothing openable, which the caller treats as "close".
    const showFromHash = useCallback((hash: string) => {
        if (!hash || !hasWindow(hash)) return false;
        setSelected(hash);
        setOrigin(null); // no click to grow from — a deep link just fades in
        const i = HREF_SCENE[hash];
        if (typeof i === 'number') setActive(i);
        return true;
    }, []);

    // Open on arrival if the URL already names a window, and keep the window in
    // step with back/forward from then on.
    useEffect(() => {
        // Deferred so the first URL read doesn't setState inside the effect body
        // (the same guard used for area changes below).
        queueMicrotask(() => showFromHash(window.location.hash));
        const onPop = () => {
            if (!showFromHash(window.location.hash)) setSelected(null);
        };
        window.addEventListener('popstate', onPop);
        return () => window.removeEventListener('popstate', onPop);
    }, [showFromHash]);

    // Open the window; keep the rail/panel context in sync with what was opened.
    // `o` is the click's screen position — the window's circle-reveal grows from it.
    const onSelect = useCallback((href: string, o?: { x: number; y: number }) => {
        setSelected(href);
        setOrigin(o ?? null);
        const i = HREF_SCENE[href];
        if (typeof i === 'number') setActive(i);
        // Mark the entry as ours so closing knows whether going back is safe.
        // Spread the existing state so the Next.js router's own entry data survives.
        if (hasWindow(href) && window.location.hash !== href) {
            window.history.pushState({ ...window.history.state, window: href }, '', href);
        }
    }, []);

    // Closing should undo the click that opened it. If this history entry is one
    // we pushed, go back (so forward re-opens); if the visitor landed straight on
    // the deep link there is nothing of ours behind, so just drop the hash.
    const onClose = useCallback(() => {
        if (window.history.state?.window) {
            window.history.back();
            return;
        }
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setSelected(null);
    }, []);

    // Manual zoom/pan settled on an area → follow it. Deferred so we never setState
    // while the graph component is mid-render.
    const onAreaChange = useCallback((i: number) => {
        queueMicrotask(() => setActive((prev) => (prev === i ? prev : i)));
    }, []);

    const jumpTo = useCallback(
        (i: number) => {
            setActive(i);
            if (stacked) {
                document.getElementById(`scene-${scenes[i].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
            }
            setFlyTo({ index: i, key: Date.now() });
        },
        [stacked]
    );

    // Scroll-spy for stacked mode: the bottom nav follows where you actually
    // are, the same way the desktop rail follows the camera. A narrow band at
    // the viewport centre means exactly one section is "current" at a time.
    useEffect(() => {
        if (!stacked) return;
        const spy = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const id = entry.target.id;
                    if (id === 'scene-overview') setActive(OVERVIEW);
                    else {
                        const i = scenes.findIndex((s) => `scene-${s.id}` === id);
                        if (i >= 0) setActive(i);
                    }
                }
            },
            { rootMargin: '-45% 0px -45% 0px' }
        );
        document.querySelectorAll('section[id^="scene-"]').forEach((el) => spy.observe(el));
        return () => spy.disconnect();
    }, [stacked]);

    const goHome = useCallback(() => {
        setActive(OVERVIEW);
        if (stacked) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setReleasePinned((n) => n + 1); // "the whole system" also means an un-rearranged one
        setFlyTo({ index: OVERVIEW, key: Date.now() });
    }, [stacked]);

    return (
        <>
            <BrandMark onHome={goHome} />
            <DisplayMenu />
            {!stacked && <ScaleRail activeIndex={active} onJump={jumpTo} />}

            {stacked ? (
                /* Phones / reduce-motion: the live map is a calm backdrop; the substance
                   is readable, scrollable sections with a thumb-reachable bottom nav. */
                <>
                    <div className="fixed inset-0 -z-10" aria-hidden="true">
                        {/* Decorative backdrop only — covered by the sections, never clickable.
                            A static drawing, not the live graph: behind an 82% veil nobody can
                            see the physics, and phones shouldn't pay for them. */}
                        <SystemMapBackdrop />
                        <div
                            className="absolute inset-0"
                            style={{ background: 'color-mix(in srgb, var(--color-background) 82%, transparent)' }}
                        />
                    </div>

                    <div className="snap-y snap-mandatory">
                        {/* The overview leads here too (desktop shows it at full zoom-out);
                            its body swaps the zoom/click instructions for scroll ones. */}
                        {[{ ...overviewScene, body: STACKED_OVERVIEW_BODY }, ...scenes].map((s, i) => (
                            <section
                                key={s.id}
                                id={`scene-${s.id}`}
                                className="min-h-[100svh] snap-start flex items-stretch px-4 pt-18 pb-20"
                            >
                                {/* Cards stretch to fill the screen rather than floating at their
                                    content height: every section then has identical proportions and
                                    the gap between cards becomes constant (padding top + bottom)
                                    instead of varying with how much copy a scale happens to have.
                                    SectionPanel's own `m-auto` centres the copy inside. */}
                                <div className="w-full flex rounded-3xl border border-ink/10 bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] backdrop-blur-xl shadow-[0_10px_50px_rgba(43,42,41,0.08)]">
                                    <SectionPanel scene={s} isH1={i === 0} onSelect={onSelect} />
                                </div>
                            </section>
                        ))}
                    </div>

                    <MobileNav activeIndex={active} onJump={jumpTo} />
                </>
            ) : (
                /* Desktop: full-bleed circular map; the copy rides a frosted glass panel
                   so it stays fully readable over the live graph (no hard "square"). */
                <div className="fixed inset-0 overflow-hidden">
                    {/* Colour field (Phase 1d): the page tints faintly toward the active
                        cluster's colour, centred on the map, so the field has a "where"
                        before any node is read. Colour transitions; the mask is static. */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundColor: active === OVERVIEW ? GROUP[0] : GROUP[active] ?? GROUP[0],
                            opacity: 0.07,
                            maskImage: 'radial-gradient(ellipse 55% 60% at 56% 50%, #000 0%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 55% 60% at 56% 50%, #000 0%, transparent 100%)',
                            transition: 'background-color 700ms var(--ease-out-expo)',
                        }}
                    />
                    {/* The window is a near layer in the same field (Phase 4): while one is
                        open the whole map recedes — one blur and a slight scale on this
                        container, never per node — and comes forward again on close. */}
                    <div
                        className="absolute inset-0"
                        style={{
                            filter: selected ? 'blur(2.5px)' : 'blur(0px)',
                            transform: selected ? 'scale(0.965)' : 'scale(1)',
                            transition: 'filter var(--dur-window) var(--ease-out-expo), transform var(--dur-window) var(--ease-out-expo)',
                            willChange: selected ? 'filter, transform' : undefined,
                        }}
                        onWheelCapture={hintGone ? undefined : dismissHint}
                        onPointerDownCapture={hintGone ? undefined : dismissHint}
                    >
                        {/* Gated on `mounted`: during hydration `stacked` is still false on
                            every device, so an ungated map would start importing the graph
                            engine on phones too, only to be swapped for the backdrop a frame
                            later. The canvas draws nothing before mount anyway. */}
                        {mounted && <SystemMap
                            flyTo={flyTo}
                            reduced={false}
                            onSelect={onSelect}
                            onAreaChange={onAreaChange}
                            releasePinned={releasePinned}
                            signature={{ getWordRect, onStart: onSignatureStart, onEnd: onSignatureEnd }}
                        />}
                    </div>

                    {/* pointer-events-none here + on SectionPanel's own wrapper: the box is
                        544px (34rem) but the real text column is ~80-160px narrower (padding),
                        so without this the padding gutter would swallow clicks meant for the
                        canvas underneath. Real content opts back in with pointer-events-auto
                        per element (see SectionPanel.tsx). */}
                    <div className="absolute inset-y-0 left-0 w-full sm:w-[48%] md:w-[42%] lg:w-[38%] z-10 pointer-events-none">
                        {/* Backing layer only: frosted tint + right-edge fade live here, behind
                            the copy, so the mask never touches the glyphs (masking text directly
                            dropped the arrow/meta glyphs under AA at the fade edge). */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                                background: 'color-mix(in srgb, var(--color-background) 88%, transparent)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                maskImage: 'linear-gradient(90deg, #000 74%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(90deg, #000 74%, transparent 100%)',
                            }}
                        />
                        <div className="relative h-full flex overflow-y-auto overscroll-contain no-scrollbar py-16">
                            <SectionPanel
                                key={active === OVERVIEW ? 'overview' : panelScene.id}
                                scene={panelScene}
                                isH1={active === OVERVIEW}
                                onSelect={onSelect}
                                accentRef={active === OVERVIEW ? accentRef : undefined}
                                hideAccent={active === OVERVIEW && hideAccent}
                            />
                        </div>
                    </div>

                    {/* Hidden, never dimmed: at rest it is full contrast or gone (CLAUDE.md
                        rule 4); the fade is only the way out. */}
                    <div
                        className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-2 pointer-events-none"
                        style={{
                            opacity: hintGone ? 0 : 1,
                            visibility: hintGone ? 'hidden' : 'visible',
                            transition: 'opacity 600ms var(--ease-out-expo), visibility 0s linear 600ms',
                        }}
                        aria-hidden={hintGone || undefined}
                    >
                        <span className="label-mono text-ink-soft">scroll to zoom · drag to move · click to open</span>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {selected && hasWindow(selected) && (
                    <CaseStudyOverlay
                        key={selected}
                        href={selected}
                        origin={origin}
                        onClose={onClose}
                        onSelect={onSelect}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
