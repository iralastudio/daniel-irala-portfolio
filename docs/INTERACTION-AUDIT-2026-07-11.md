# Interaction & Navigation Audit — irala.studio

_Date: 2026-07-11 · Scope: every live surface (`src/components/scale/*`, `globals.css`, data files) ·
Method: static source audit against `CLAUDE.md`, `docs/CONTENT-STANDARDS.md`, and `handoff.md`.
The site is a single-page experience, so "every page" = overview + 5 areas (desktop map mode),
the 5 stacked sections (mobile / reduce-motion mode), the unified content window (case study +
compact variants), and the lightbox._

Findings are ranked by severity. File references point at the current uncommitted working tree
on `feat/zoom-scale`.

---

## What is consistent (the baseline that makes the flags visible)

- **One easing signature.** `cubic-bezier(0.16, 1, 0.3, 1)` (EXPO) drives the panel stagger,
  the window block stagger, the circle reveal, and the BrandMark entrance. Entrance durations
  cluster at 0.6–0.7s. This is a genuinely coherent motion identity.
- **One window.** `CaseStudyOverlay` is the only content surface; header, close, backdrop-close,
  Esc handling, scroll-lock, and focus trap are identical for case studies and compact windows.
- **Navigation data is reconciled.** All 15 hrefs in `nodeContent.ts` + `caseStudies.ts` are
  mapped in `HREF_SCENE` (ScaleExperience.tsx:17–33), so every window opening syncs the rail and
  panel context. No orphan routes.
- **Layered Esc.** Esc closes the lightbox first, then the window (CaseStudyOverlay.tsx:208–213).
- **Aligned page gutters.** BrandMark (`px-6 md:px-12 lg:px-20`) and SectionPanel share the same
  horizontal rhythm; button rows consistently use `gap-2.5`.

---

## HIGH

### H1 — Desktop + reduce-motion has no area navigation at all
`ScaleExperience.tsx:66` puts the site into stacked mode whenever `reduceMotion` is on,
at any viewport width. In stacked mode the `ScaleRail` is not rendered (`:110`) and the only nav
is `MobileNav` (`:138`) — which is `md:hidden` (MobileNav.tsx:16). So a desktop user (≥768px) who
enables reduce motion gets the stacked sections with **no visible navigation**: no rail, no bottom
bar, only raw scrolling and the BrandMark home button. The accessibility mode that should be the
"fully accessible equivalent experience" (CLAUDE.md) is the one configuration with zero wayfinding.
**Fix:** drop `md:hidden` from MobileNav (render it whenever stacked), or render the rail in
stacked mode wired to `scrollIntoView`.

### H2 — Keyboard-opened windows can reveal from the wrong origin
The circle reveal falls back to "upper centre" only when `origin` is `undefined`
(CaseStudyOverlay.tsx:179–180). But every CTA passes `{ x: e.clientX, y: e.clientY }`
unconditionally (SectionPanel.tsx:84, :95; CaseStudyOverlay.tsx:467). Keyboard activation
(Enter/Space on a focused button) dispatches a click whose coordinates are `(0,0)` in several
browsers — a defined origin — so the window blooms from the top-left screen corner instead of the
designed fallback. `SystemMap.tsx:238` handles this correctly (`undefined` when no event).
**Fix:** treat `e.detail === 0` (keyboard-initiated click) — or `(0,0)` coords — as "no origin".

### H3 — The same action pill behaves differently in the panel vs. the window
The pill buttons are visually one component family, but:
- **SectionPanel** (SectionPanel.tsx:85, :96): hover = color change **+ 2px lift
  (`hover:-translate-y-0.5`) + arrow slide (`group-hover:translate-x-1`)**, explicit **300ms**
  ease-out. Primary is `px-6 py-3` with `font-medium`.
- **CaseStudyOverlay actions** (CaseStudyOverlay.tsx:461–462): hover = color change only —
  **no lift, no arrow motion**, default **150ms** `transition-colors`. Primary is `px-5 py-2.5`
  without `font-medium`.

Same-looking buttons, two hover behaviours, two sizes, two timings. Given the "one window system"
rule these should be one shared style (or one extracted component).

---

## MEDIUM

### M1 — Two focus-indicator systems, three offset variants, and a white halo
- `globals.css:115–119` defines a global `:focus-visible` **outline** (2px accent, 3px offset,
  3px radius). Every component then opts out with `focus-visible:outline-none` and re-implements
  focus as a Tailwind **ring** — two visual languages for the same state.
- Ring offsets vary with no pattern: `ring-offset-2` (panel CTAs, rail, figure, overlay actions),
  `ring-offset-4` (BrandMark.tsx:19), and **no offset** (MobileNav.tsx:30, overlay close
  CaseStudyOverlay.tsx:283, lightbox close :527).
- `ring-offset` color defaults to **white**, so on the `#EBEAE8` page background focused CTAs get
  a white halo ring that matches nothing in the palette. Set `ring-offset-background` (or use
  outline everywhere).

### M2 — Two different close buttons
Window close (CaseStudyOverlay.tsx:281–288) vs lightbox close (:524–532): 36px vs 40px hit area,
13px vs 15px icon, 1.6 vs 1.8 stroke, offset ring vs no-offset ring. Both are **below the 44px
touch minimum** that MobileNav explicitly enforces ("Touch targets ≥ 48px", MobileNav.tsx:10) —
and the window close is the single most-used control on the site. Also the aria-label is
hardcoded `"Close case study"` (:282) even when the window holds compact node content
(#contact, #talks…), which mislabels it for screen-reader users.

### M3 — Micro-interaction timing splits 150ms vs 300ms
Explicit `duration-300` on panel CTAs and rail transitions; bare `transition-colors`
(= 150ms default) on BrandMark (:19), MobileNav (:28), the window close button (:283), overlay
action pills (:461–462), and the lightbox close (:527). The chrome answers hover at two different
speeds. Pick one (300ms matches the site's unhurried motion voice) and set it everywhere.

### M4 — Stacked mode has no scroll-spy; desktop nav follows you, mobile nav doesn't
On desktop the rail tracks manual zoom/pan via `onAreaChange` (SystemMap.tsx:201–229). In stacked
mode, `activeIndex` only updates when a nav button is **tapped** (ScaleExperience.tsx:86–96) —
scrolling through the snap sections never moves the active state, so the bottom bar routinely
disagrees with what's on screen. An `IntersectionObserver` on the `scene-*` sections would give
the two navs the same follow-me behaviour.

### M5 — The overview is desktop-only content
Stacked mode maps over `scenes` only (ScaleExperience.tsx:125); `overviewScene` — the whole-system
tagline copy — is never rendered on mobile or reduce-motion, and `goHome` there just scrolls to
the About section (:98–105). Mobile visitors never see the site's framing statement. Either
prepend an overview section in stacked mode or fold its copy into the first section.

### M6 — Clickable canvas gives no pointer affordance
Nodes and cluster whitespace are clickable (SystemMap.tsx:179–190, :233–242), but nothing changes
the cursor (`cursor: pointer`) or highlights a node on hover — the cursor-repel force is
atmosphere, not affordance. The only cue is the hint line "scroll to zoom · drag to move · click
to open", which is `hidden md:flex` (ScaleExperience.tsx:171) — fine for the desktop-only map, but
tablets ≥768px get this pointer-tuned experience with hover cues that don't exist on touch, plus
the rail's small (~30px) targets. Consider `onNodeHover` → cursor swap, and revisiting the 767px
breakpoint for touch tablets.

### M7 — The lightbox is not a focus layer
`useDialogFocus` traps Tab inside the whole dialog root, and the lightbox is a sibling overlay
inside it (CaseStudyOverlay.tsx:496). While the lightbox is open, focus stays on the triggering
figure and Tab walks the article content **behind** the dark surround (those elements still have
an `offsetParent`, so the trap's visibility filter doesn't exclude them). A keyboard user can
interact with content they can't see. Esc works; Tab should be scoped to the lightbox close
button while it's open.

---

## LOW

- **L1 — Vertical rhythm 7 vs 8.** Compact windows step content with `mt-7`
  (CaseStudyOverlay.tsx:401, :414, :431, :449); case studies use `mt-8` for the same first-block
  position (:324). Same surface, two rhythms — pick one.
- **L2 — Border-alpha scale is undocumented.** `border-ink/8`, `/10`, `/12`, `/15` all appear on
  card-like surfaces (header divider :272, fact cards :326, article :262, close/secondary
  buttons :283/:462). If the four steps are a deliberate hierarchy, name them in
  CONTENT-STANDARDS/CLAUDE.md; otherwise collapse to two.
- **L3 — `aria-current="true"`** on both navs (ScaleRail.tsx:30, MobileNav.tsx:26);
  `aria-current="location"` is the idiomatic value for a within-page nav. Consistent, just
  non-idiomatic.
- **L4 — Open/close asymmetry.** Windows open as a circle growing from the node but close as a
  generic fade + 16px downward drift (CaseStudyOverlay.tsx:253). If intentional (reverse reveal
  would fight the exiting scroll position), note it in CLAUDE.md so nobody "fixes" it; a shrink-
  to-origin exit would complete the container-transform metaphor.
- **L5 — Figure hover is the only 500ms transition** (CaseStudyOverlay.tsx:47) in a 150/300ms
  system. Harmless, but it's a third timing.
- **L6 — Two reduce-motion mechanisms govern one reveal.** The circle reveal is skipped via
  framer's `useReducedMotion()` (OS-level media query) but the site's own accessibility toggle
  works by class (`html.reduce-motion`), which merely collapses the CSS transition to 0.001s.
  Both paths end at "no animation", but through different mechanisms — if the global CSS override
  is ever narrowed, the site toggle silently stops covering the reveal. Read the
  AccessibilityContext setting in the overlay too.
- **L7 — Dead wiring.** The stacked-mode backdrop map receives `onSelect`
  (ScaleExperience.tsx:117) but sits at `-z-10` under an overlay and full-height sections —
  it can never be clicked. Pass a no-op (or nothing) to make intent explicit.

---

## Suggested fix order

1. **H1** (one-line class change: MobileNav visibility) — unblocks reduce-motion desktop users.
2. **M2** (close button: 44px, one style, dynamic aria-label) + **H3/M3** (extract one action-pill
   style with one duration) — one small PR unifies every button on the site.
3. **H2** (keyboard origin) + **M7** (lightbox focus scope) — keyboard correctness.
4. **M1** (pick ring OR outline, set `ring-offset-background`) — one decision, sweep mechanically.
5. **M4/M5** (scroll-spy + overview section in stacked mode).
6. L1–L7 opportunistically, and document the intentional ones in `CLAUDE.md`.

_Note: everything audited here is uncommitted work on `feat/zoom-scale` (see `handoff.md` §6 —
commit + deploy remains the standing next step)._

---

## Resolution — all 17 findings fixed (same day, 2026-07-11)

Verified: `npx tsc --noEmit` clean, dev server clean, zero console errors, live-checked at
desktop and 375px. The standards now live in `CLAUDE.md` hard rule 8.

- **H1** MobileNav renders at every width in stacked mode (`md:hidden` removed).
- **H2** New `src/lib/clickOrigin.ts` — keyboard clicks (`detail === 0` / `(0,0)`) fall back
  to the upper-centre reveal. Used by every pill.
- **H3 + M3** New `src/components/scale/ActionPill.tsx` — THE single pill CTA (one hover:
  colour + lift + arrow slide, one 300ms timing, one size per variant). SectionPanel and
  CaseStudyOverlay both use it; every remaining `transition-colors` got `duration-300`.
- **M1** Focus standard = ring + `ring-offset-2 ring-offset-background` everywhere
  (BrandMark offset-4 → 2; MobileNav/close buttons gained offsets; lightbox stays white on
  dark). Global CSS outline kept as documented fallback only.
- **M2** Both close buttons: 44px, 14px icon, stroke 1.7, 300ms; window close label is now
  dynamic (`Close case study` / `Close: <title>`).
- **M4** IntersectionObserver scroll-spy in stacked mode (centre band) keeps MobileNav in
  sync, incl. overview → `-1`.
- **M5** Overview scene now leads the stacked section stack (as the H1), with its body's
  zoom/click instructions swapped for scroll wording.
- **M6** Canvas shows `cursor: pointer` over nodes (`onNodeHover`) and cluster whitespace
  (`clusterAt` in pointermove); touch-only tablets (`hover: none and pointer: coarse`) now
  get stacked mode.
- **M7** Lightbox is a focus layer: focus moves to its close button on open, Tab is held
  there, focus returns to the triggering figure on close; `role="dialog"` + label added.
- **L1** Compact-window first blocks `mt-7` → `mt-8`. **L2** Border alphas collapsed to
  `/10` (surfaces) + `/15` (controls), documented. **L3** `aria-current="location"` on both
  navs. **L4** Open/close asymmetry documented as intentional in CLAUDE.md. **L5** Figure
  hover 500ms → 300ms. **L6** Overlay reads the site's reduce-motion toggle as well as the
  OS preference. **L7** Stacked backdrop map gets an explicit no-op `onSelect`.

_Known pre-existing issue spotted during verification (not from this audit): the floating
accessibility button (bottom-left) overlaps MobileNav's first item at 375px._
