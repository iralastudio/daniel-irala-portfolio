# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

irala.studio — Daniel Irala's portfolio. The live experience is an **Obsidian-style
force-directed graph "system map"**: Daniel at the centre, four scales orbiting as
clusters (Touchpoint / Team / Organisation / Beyond). Free zoom/pan; clicking a node or
cluster opens content; a frosted-glass left panel shows copy for wherever you're looking.

- **Animation**: LazyMotion strict is on: **always import `m`, never `motion`** (Framer Motion 12)

## Architecture (live surface)

- `ScaleExperience.tsx` — orchestrator. Phones (<768px) or reduce-motion: **stacked mode**
  (snap-scroll sections + `MobileNav` bottom bar; the map becomes a muted backdrop).
  `active === -1` = overview. Also owns the URL contract (below).
- `SystemMap.tsx` — the canvas graph. `aria-hidden` (pointer-only by design; keyboard
  users reach everything through the rail + panel links instead).
- `CaseStudyOverlay.tsx` — THE single content window for every node click: one
  frosted-glass article surface for both full case studies (`caseStudies.ts`) and
  compact node content (`nodeContent.ts`), with lightbox. Opens via a clip-path
  **circle reveal from the clicked node's screen position** (`origin` prop);
  reduced motion falls back to a fade. Do not reintroduce a second window style.
  Loaded lazily via `next/dynamic` (prefetched on idle) and resolves its own content
  from `href`, so the case-study text stays out of the initial bundle. The visual
  instruments live in `instruments.tsx`; figures + lightbox in `CaseFigure.tsx`.
- `SystemMapBackdrop.tsx` — stacked mode's backdrop. Stacked mode never loads the graph engine.
- `DisplayMenu.tsx` — top-right glyph opening the accessibility controls (contrast,
  reduce motion, dyslexia type, text size). This is the **only** way to reach
  `AccessibilityContext` from the UI; without it, only the OS motion preference applies.
  Dismissal contract matches the window: Esc or outside click, focus returns to trigger.
- `CrawlableContent.tsx` — server-rendered sr-only mirror of all window content for
  SEO/screen readers. Mirrors the full case study where one exists, else the
  nodeContent entry. It fails the build if a case study has no nodeContent entry
  (ScaleExperience decides "openable" from nodeContent alone).
- `src/lib/systemMap.ts` — graph data builder (seeded, circular wedge layout).
- `src/data/scenes.ts` — panel copy per scale; `nodeContent.ts` — window content;
  `caseStudies.ts` — full case studies. Block model:
  `text | quote | gallery | iceberg | roletrack`.

**Dead code — do not extend, do not cite as precedent:** `src/components/metro/`,
`modal/`, `content/`, `experiments/`, `layout/`, `MetroContext`, and
`accessibility/AccessibilityPanel.tsx` (superseded by `DisplayMenu`). None of it is
reachable from `src/app/page.tsx`, which renders only `CrawlableContent` +
`ScaleExperience`.

## The URL contract

Every content window is addressable — a case study you cannot send to anyone is
useless for a portfolio. `ScaleExperience` owns this and it is easy to break:

- Opening a window `pushState`s the node's `#href` and tags the entry
  `{ ...history.state, window: href }`. **Spread the existing state** — clobbering it
  breaks the Next.js router's own entry data.
- `popstate` re-derives the open window from the hash; a hash naming nothing openable
  means "close".
- Closing checks `history.state?.window`: if the entry is ours, `history.back()` (so
  Forward re-opens); if the visitor deep-linked straight in, there is nothing of ours
  behind, so `replaceState` drops the hash instead. Do not simplify this to
  `setSelected(null)`.
- A deep-linked window sets `origin = null` and fades in — there was no click to grow
  from.

## Hard rules (learned the expensive way)

1. **Camera**: `g.zoomToFit(ms, padding, nodeFilter)` exclusively. `centerAt()` + `zoom()`
   together snap back — do not reintroduce.
2. **Content**: real facts only, no fabrication. Work without verified substance carries
   an honest "in preparation" note (`IN_PREP` in `nodeContent.ts`). Facts live in three
   places — `scenes.ts`, `nodeContent.ts`, `caseStudies.ts` — keep them reconciled.
   **All content MUST follow the standardized structures in `docs/CONTENT-STANDARDS.md`**
   (project template, personal template, voice, reading rules, session checklist).
   `roletrack` exists to show workstreams at genuinely different maturities: real
   metrics where testing produced them, an explicit `pending` chip where it didn't.
   The gap is the honest part — never fill it with an invented number.
3. **Dialogs**: `CaseStudyOverlay` is `role="dialog" aria-modal` and must keep the
   `useDialogFocus` hook (focus in on open, Tab trapped, restored on close).
   Backdrop-close uses the `e.target === e.currentTarget` pattern.
4. **Contrast**: `--color-text-secondary` is #63615E (5.1:1 on bg — AA). Do not use
   opacity-reduced text (`text-ink-soft/70` etc.) for meaningful copy; the old #6E6C6A
   token measured 4.35:1 and failed AA. Same reason the `ScaleRail` hints are always
   fully opaque rather than hover-revealed — at 10px, dimming drops them under AA, and
   the descriptor is what explains the scale metaphor to a first-time visitor.
5. **Motion**: import `m` from framer-motion, never `motion` (LazyMotion strict throws).
6. Known dev-only React 19 StrictMode warning from `react-force-graph-2d`/`react-kapsule`
   ("Cannot update a component while rendering") — library-internal, absent in
   production. Ignore.
7. `<main>` measures 0 height because the experience is `fixed`/`absolute` — expected.
8. **Node pinning**: dragging a node drops it pinned (`fx`/`fy`) where you left it —
   that's the point, but it must be undoable. `BrandMark` → home bumps the
   `releasePinned` counter, which clears every `fx`/`fy` and reheats the simulation.
   "The whole system" must also mean an un-rearranged one.
9. **Shape language — squared, not soft.** The radius ramp in `globals.css` is
   deliberately compressed and tops out at 12px (`--radius-xs` 2px → `--radius-3xl`
   12px). The names match Tailwind's, so any stray `rounded-2xl`/`rounded-3xl` inherits
   the tighter value automatically. This is a Swiss/editorial surface — nothing should
   read as a pill-shaped blob. New `rounded-full` on a control is almost always wrong
   (dots and status ticks excepted).
10. **Interaction standards**: see `src/components/scale/CLAUDE.md` (loads when editing that folder).
11. **Cascade gotcha**: `.label-mono` lives inside `@layer components` so a utility
    (e.g. `text-accent` on the active nav item) still wins. Unlayered CSS beats every
    layered Tailwind utility — moving it out will silently re-break active states.
12. **File placement**: never leave working files, scratch output, or one-off tests
    in the repo root. Source goes in `src/`, docs in `docs/`, config in `config/`,
    scripts in `scripts/`. Temporary files belong in the session scratchpad, not
    the repo.

## Verifying changes

`npx tsc --noEmit` — currently clean, keep it that way.

`npm run lint` is **not** green: ~14 errors, all in the dead directories listed above
(mostly `react-hooks/rules-of-hooks` in `metro/`, `modal/`, `experiments/`). Don't chase
them; do not let a new one land in `scale/`, `app/`, `lib/`, or `data/`. The one live
exception is `AccessibilityContext.tsx:58` (`set-state-in-effect` on the hydration flag).

Then check the live preview. Drive the camera with the rail buttons
(`nav[aria-label="Areas"] button`) — synthetic wheel-zoom is imprecise. Test desktop
(~1440px) and mobile (375px). If a layout gap appears in a screenshot, check for an
active `preview_resize` override before touching code (page bg is #EBEAE8, never black).

## Accessibility model

- Desktop map is pointer-only but `aria-hidden`; the rail + panel links + windows form
  the complete keyboard path.
- Stacked mode (phones / reduce-motion) is the fully accessible equivalent experience.
- `AccessibilityContext` (dyslexia font, contrast, text scale, reduce motion) toggles
  classes on `<html>`; tokens react in `globals.css`. Reached via `DisplayMenu`.
  The canvas intentionally keeps concrete hex values (canvas can't resolve CSS vars).
