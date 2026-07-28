# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

irala.studio — Daniel Irala's portfolio. The live experience is an **Obsidian-style
force-directed graph "system map"**: Daniel at the centre, four scales orbiting as
clusters (Touchpoint / Team / Organisation / Beyond). Free zoom/pan; clicking a node or
cluster opens content; a frosted-glass left panel shows copy for wherever you're looking.

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (tokens in `globals.css` via `@theme`)
- **Animation**: Framer Motion 12 — LazyMotion strict is on: **always import `m`, never `motion`**
- **Graph**: `react-force-graph-2d` (canvas) + `d3-force`
- **Deploy**: Vercel

## Development Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- Type-check: `npx tsc --noEmit`

## Architecture (live surface)

Everything the visitor sees lives in `src/components/scale/` + `src/data/`:

- `ScaleExperience.tsx` — orchestrator. Desktop: full-bleed map + frosted left panel +
  right rail. Phones (<768px) or reduce-motion: **stacked mode** (snap-scroll sections +
  `MobileNav` bottom bar; the map becomes a muted backdrop). `active === -1` = overview.
- `SystemMap.tsx` — the canvas graph. `aria-hidden` (pointer-only by design; keyboard
  users reach everything through the rail + panel links instead).
- `SectionPanel.tsx` — the readable copy per area. `ScaleRail.tsx` (desktop right edge)
  and `MobileNav.tsx` (thumb bar) are the two nav patterns.
- `CaseStudyOverlay.tsx` — THE single content window for every node click: one
  frosted-glass article surface for both full case studies (`caseStudies.ts`) and
  compact node content (`nodeContent.ts`), with lightbox. Opens via a clip-path
  **circle reveal from the clicked node's screen position** (`origin` prop);
  reduced motion falls back to a fade. Do not reintroduce a second window style.
- `CrawlableContent.tsx` — server-rendered sr-only mirror of all window content for
  SEO/screen readers. Keep it in sync when content changes.
- `src/lib/systemMap.ts` — graph data builder (seeded, circular wedge layout).
- `src/data/scenes.ts` — panel copy per scale; `nodeContent.ts` — window content;
  `caseStudies.ts` — full case studies (block model: text | quote | gallery).

Legacy metro-map era code (`src/components/metro/`, `content/`, `experiments/`,
`MetroContext`, …) is **not wired into the live page** — reference only.

## Hard rules (learned the expensive way)

1. **Camera**: `g.zoomToFit(ms, padding, nodeFilter)` exclusively. `centerAt()` + `zoom()`
   together snap back — do not reintroduce.
2. **Content**: real facts only, no fabrication. Work without verified substance carries
   an honest "in preparation" note (`IN_PREP` in `nodeContent.ts`). Facts live in three
   places — `scenes.ts`, `nodeContent.ts`, `caseStudies.ts` — keep them reconciled.
   **All content MUST follow the standardized structures in `docs/CONTENT-STANDARDS.md`**
   (project template, personal template, voice, reading rules, session checklist).
3. **Dialogs**: `NodeWindow` and `CaseStudyOverlay` are `role="dialog" aria-modal` and
   must keep the `useDialogFocus` hook (focus in on open, Tab trapped, restored on
   close). Backdrop-close uses the `e.target === e.currentTarget` pattern.
4. **Contrast**: `--color-text-secondary` is #63615E (5.1:1 on bg — AA). Do not use
   opacity-reduced text (`text-ink-soft/70` etc.) for meaningful copy; the old #6E6C6A
   token measured 4.35:1 and failed AA.
5. **Motion**: import `m` from framer-motion, never `motion` (LazyMotion strict throws).
6. Known dev-only React 19 StrictMode warning from `react-force-graph-2d`/`react-kapsule`
   ("Cannot update a component while rendering") — library-internal, absent in
   production. Ignore.
7. `<main>` measures 0 height because the experience is `fixed`/`absolute` — expected.
8. **Interaction standards** (from the 2026-07-11 interaction audit — keep every surface
   on the same patterns):
   - **Pill CTAs**: always `ActionPill` (`src/components/scale/ActionPill.tsx`) — never
     restyle a pill locally. Primary `px-6 py-3`, secondary `px-4 py-2.5`, hover = colour
     + 2px lift + arrow slide.
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
     scroll-spy keeps it in sync, and the overview scene leads the section stack.

## Verifying changes

`npx tsc --noEmit`, then check the live preview. Drive the camera with the rail buttons
(`nav[aria-label="Areas"] button`) — synthetic wheel-zoom is imprecise. Test desktop
(~1440px) and mobile (375px). If a layout gap appears in a screenshot, check for an
active `preview_resize` override before touching code (page bg is #EBEAE8, never black).

## Accessibility model

- Desktop map is pointer-only but `aria-hidden`; the rail + panel links + windows form
  the complete keyboard path.
- Stacked mode (phones / reduce-motion) is the fully accessible equivalent experience.
- `AccessibilityContext` (dyslexia font, contrast, text scale, reduce motion) toggles
  classes on `<html>`; tokens react in `globals.css`. The canvas intentionally keeps
  concrete hex values (canvas can't resolve CSS vars).
