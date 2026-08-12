# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

irala.studio — Daniel Irala's portfolio. The live experience is an **Obsidian-style
force-directed graph "system map"**: Daniel at the centre, four scales orbiting as
clusters (Touchpoint / Team / Organisation / Beyond). Free zoom/pan; clicking a node or
cluster opens content; a frosted-glass left panel shows copy for wherever you're looking.

- **Framework**: Next.js 16.1.4 (App Router), React 19.2.3, TypeScript
- **Styling**: Tailwind CSS v4 (tokens in `globals.css` via `@theme`)
- **Animation**: Framer Motion 12 — LazyMotion strict is on: **always import `m`, never `motion`**
- **Graph**: `react-force-graph-2d` 1.29 (canvas) + `d3-force`
- **Deploy**: Vercel

## Development Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- Type-check: `npx tsc --noEmit`

## Architecture (live surface)

Everything the visitor sees lives in `src/components/scale/` + `src/data/`:

- `ScaleExperience.tsx` — orchestrator. Desktop: full-bleed map + frosted left panel +
  right rail. Phones (<768px) or reduce-motion: **stacked mode** (snap-scroll sections +
  `MobileNav` bottom bar; the map becomes a muted backdrop). `active === -1` = overview.
  Also owns the URL contract (below).
- `SystemMap.tsx` — the canvas graph. `aria-hidden` (pointer-only by design; keyboard
  users reach everything through the rail + panel links instead).
- `SectionPanel.tsx` — the readable copy per area; the panel column scrolls
  (`overflow-y-auto`) because tall scenes overflow short viewports.
  `ScaleRail.tsx` (desktop right edge) and `MobileNav.tsx` (thumb bar) are the two nav
  patterns.
- `CaseStudyOverlay.tsx` — THE single content window for every node click: one
  frosted-glass article surface for both full case studies (`caseStudies.ts`) and
  compact node content (`nodeContent.ts`), with lightbox. Opens via a clip-path
  **circle reveal from the clicked node's screen position** (`origin` prop);
  reduced motion falls back to a fade. Do not reintroduce a second window style.
- `DisplayMenu.tsx` — top-right glyph opening the accessibility controls (contrast,
  reduce motion, dyslexia type, text size). This is the **only** way to reach
  `AccessibilityContext` from the UI; without it, only the OS motion preference applies.
  Dismissal contract matches the window: Esc or outside click, focus returns to trigger.
- `CrawlableContent.tsx` — server-rendered sr-only mirror of all window content for
  SEO/screen readers. Keep it in sync when content changes.
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
10. **Interaction standards** (from `docs/INTERACTION-AUDIT-2026-07-11.md` — keep every
    surface on the same patterns):
    - **Action controls**: always `ActionPill` (`src/components/scale/ActionPill.tsx`) —
      never restyle one locally. Three variants: `primary` (solid accent,
      `px-4 py-2`, the one real CTA in a panel), `row` (full-width index row —
      label · meta · arrow — for project lists whose labels would wrap inside a box),
      and default (compact bordered, `px-3 py-1.5`). Hover = colour + arrow slide, 300ms.
    - **Touch targets**: shrinking a control must not shrink its target. Add `.tap`,
      which applies `min-height: 44px` under `@media (pointer: coarse)` only.
    - **Focus**: `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-background`
      (white ring on dark layers). The global CSS outline is only a fallback.
    - **Hover/state timing**: 300ms (`duration-300`); entrances stay 0.6–0.7s EXPO
      (`cubic-bezier(0.16,1,0.3,1)`). No bare `transition-colors` (that's 150ms).
    - **Borders**: two alphas only — `border-ink/10` for surfaces/cards/dividers,
      `border-ink/15` for interactive controls.
    - **Compact-window rhythm**: first content block `mt-8` (same as case studies).
    - **Circle-reveal origin**: pass click positions through `clickOrigin()`
      (`src/lib/clickOrigin.ts`) so keyboard activation falls back to the upper-centre
      bloom instead of the screen corner.
    - **Close buttons**: 44px (`w-11 h-11`), 14px icon, stroke 1.7, `duration-300`.
    - **Window exit is intentionally asymmetric**: opens as a circle reveal from the node,
      closes as a fade + small downward drift (a reverse reveal would fight the scrolled
      position). Do not "fix" this.
    - **Stacked mode** (phones, touch-only tablets, reduce-motion): `MobileNav` renders at
      every width (it is the only nav there — never hide it behind a breakpoint), a
      scroll-spy keeps it in sync, and the overview scene leads the section stack. Its
      five labels cannot fit 375px at a legible size, so the bar scrolls horizontally
      with edge fades and auto-scrolls the active item into view — never shrink the
      type to make them fit.
11. **Cascade gotcha**: `.label-mono` lives inside `@layer components` so a utility
    (e.g. `text-accent` on the active nav item) still wins. Unlayered CSS beats every
    layered Tailwind utility — moving it out will silently re-break active states.

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
