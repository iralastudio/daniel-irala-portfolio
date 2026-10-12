# Interaction standards (scale components)

Loaded when working under `src/components/scale/`. Keep every surface on these patterns.

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
