# Motion design plan — irala.studio

Date: 2026-10-12, revised the same day after the direction was chosen. Scope: the live
surface only (`src/components/scale/`, `src/app/globals.css`, `src/data/`). Dead
directories stay dead.

## The direction (chosen 2026-10-12)

The map stays 2D and stays the hero. It gains **depth** (a field you look into, not a flat
diagram), one **signature moment** (the word *chaos.* dissolves into the nodes of the
system and the map assembles from it), and a **window model** where opening content is
a dolly into the system rather than a modal on top of it.

Reference point: Corebook Studio's hero. Inspected 2026-10-12: it is not 3D. A 9.7 MB
Lottie of pre-rendered frames (165 frames, 30 fps) scrubbed by scroll, plus floating
role chips. The lesson is "one dimensional object, scroll-driven, annotated", not
"use a 3D engine". Three.js stays dropped (decision of 2026-06-13); no Lottie either,
because here the object *is* the live system.

What the research said and what transfers is kept in §6 at the end.

## Handoff (for the sessions that run the phases)

- **Branch:** `feat/zoom-scale`, everything uncommitted as of 2026-10-12. Commit the
  prototype first, as one commit, before starting a phase.
- **Shipped in the prototype:** Phase 0 is *not* done (the three `EXPO` copies still
  exist); Phase 1 depth field is done except occlusion sorting; Phase 3 signature is
  done; Phase 4 has its tempo and the receding map, nothing else. Phase 2 is untouched.
- **Review flags:** `?slow` stretches the signature 4×. The signature plays on every
  full page load; there is no session gate any more.
- **Run order:** decide the window model (Phase 4, A / B / C) → Phase 0 → Phase 2 →
  Phase 4 → 5 → 6 → 7 → 8. Phase 2 before 4 because the dolly reuses the tween loop.
- **Gates per phase:** `npx tsc --noEmit` clean; `npx eslint src/components/scale src/lib`
  clean; browser check at 1440 and 375; OS reduce-motion and the DisplayMenu toggle;
  `/site-review` on the touched surface. Measure frame time on anything that touches
  the paint loop (the prototype measured ≈59 fps during heavy pointer movement).
- **Rules that bit during the prototype** (all in the log below): overlay above the
  frosted panel; graph hidden from frame zero when a sequence will run; every paint
  path through `offsetOf`; never feed a mix helper its own rgb output; no per-node
  blur; no keyline on beads; no accent blue on links.

## Known issues to fix

1. **"The word does not show up on load" (Dani, 2026-10-12).** Two causes found and
   fixed the same day: the once-per-session gate skipped the sequence on any reload in
   the same tab, which is exactly what a reviewer does; and the computed `font`
   shorthand is empty in Firefox, so the word rasterised at the canvas default and the
   sequence aborted for having too few points. The gate is removed (a full load is a
   fresh arrival; in-page returns never replay because the mount effect runs once);
   the font is now built from its parts. **Still to verify** on Dani's own machine and
   browser at his real viewport. Every bail-out now logs `[signature] skipped: <reason>`
   at debug level, so the first step is to open the console with "Verbose" on and
   reload: no line means it ran; a line names the cause. Then check that the accent
   span's rect has width (the panel entrance must have mounted the span) and that the
   750 ms start timer fires before the first interaction.
2. ~~Phase 0 not done.~~ Done 2026-10-12; see the Phase 0 note for what was left.
3. **Occlusion order.** Nodes are not yet painted far-to-near.

---

## 1. Motion principles (write into CLAUDE.md rule 13 once agreed)

1. **The map is the hero.** Every signature motion happens on, or grows out of, the
   graph. Chrome (rail, brand mark, menu) stays almost still.
2. **Depth is continuous, not an effect.** Near things are larger, sharper, move more;
   far things are smaller, fainter, move less. This holds on load, on pan, on zoom, and
   behind an open window.
3. **Motion answers the visitor.** First load, hover, click, focus, scroll. Nothing loops
   on its own except while a cluster is held in focus.
4. **One easing family.** EXPO `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and camera-
   paired tweens; `cubic-bezier(0.77, 0, 0.175, 1)` only for clip-path image reveals;
   300 ms `ease-out` for hover. Exits shorter than entries. No bounce.
5. **Honest numbers only animate.** A count-up on a `pending` chip is a lie in motion.
6. **Reduced motion is the stacked experience** plus static instruments. Both the OS
   preference and `settings.reduceMotion` skip every new tween, as `CaseStudyOverlay`
   already does.
7. **Budget:** no new dependencies, 60 fps during assemble and camera flights on a
   mid-range laptop, interaction never blocked (hit areas live from frame zero).
8. **One tempo for the whole site** (Dani, 2026-10-12: "so humans can see the effects
   and don't feel rushed"). Every surface takes its durations from this table; a new
   animation that needs a number not on it is probably the wrong animation.

| Moment | Duration | Status |
|---|---|---|
| Signature: hold / flight / stagger cap / node fade | 650 / 1700 / 650 / 320 ms (≈3.3 s) | shipped in prototype |
| Pointer parallax settle | ≈400 ms (0.055 per frame) | shipped in prototype |
| Hover: node grows / links lift / release | 450 / 450 / 600 ms | Phase 2 |
| Focus: other clusters fade / camera flight | 800 / 1200 ms | Phase 2 |
| Click ripple | 650 ms | Phase 2 |
| Window: circle reveal / dim / map recedes | 1100 / 800 / 1100 ms | shipped in prototype |
| Window: copy blocks / stagger / first delay | 900 / 90 / 250 ms | shipped in prototype |
| Window: close / map comes forward | 500 / 1100 ms | shipped in prototype |
| Lateral move between windows: exit / enter / camera pan | 300 / 600 / 1000 ms | Phase 4 |
| Chrome hover (pills, rail, close) | 300 ms, unchanged | existing |
| Exits | never longer than their entrance | rule |

---

## 2. The plan, by phase

Order is by dependency first, then perceived-quality gain per hour. Each phase is one
PR, one Claude Code session, with `/impeccable animate` loaded and the file scope in
the prompt. Phases 1–4 are the new direction; 5–8 carry over from the first draft.

### Phase 0 — Motion tokens (small) — DONE 2026-10-12

Shipped: `src/lib/motion.ts` (`EXPO`, `REVEAL`, `stagger()`, `rise()`, `useMotionOK()`)
and CSS tokens in `globals.css` aligned with the tempo table rather than the numbers
below (`--dur-window: 1100ms` for the reveal, `--dur-fly: 1200ms`; no `--dur-reveal`).
Each component keeps its own durations; only the curve and variant shapes are shared.
One intended behaviour change: the instruments now honour the site's reduce-motion
toggle, not only the OS setting. Left for later: six inline copies of the curve in
`BrandMark`, `Compass` (×2), `DisplayMenu`, `ScaleExperience` (×2), and the window's
copy stagger still plays under reduce-motion (one-line fix in `CaseStudyOverlay`).

Original spec:

Files: `globals.css`, new `src/lib/motion.ts`, the three files that declare their own
`EXPO` (`CaseStudyOverlay.tsx`, `SectionPanel.tsx`, `instruments.tsx`).

- CSS tokens: `--ease-out-expo`, `--ease-reveal`, `--dur-hover: 300ms`,
  `--dur-enter: 600ms`, `--dur-reveal: 700ms`, `--dur-fly: 1100ms`.
- `motion.ts` exports `EXPO`, `REVEAL`, the shared `container`/`block` variants, and
  `useMotionOK()` = `!useReducedMotion() && !settings.reduceMotion`.
- Replace the three local `EXPO` copies. No visual change.

Acceptance: `npx tsc --noEmit` clean; screenshots identical at 1440 and 375.

### Phase 1 — Depth field: nodes and links (medium, the foundation)

Files: `src/lib/systemMap.ts` (data), `SystemMap.tsx` (render), `ScaleExperience.tsx`
(colour field div).

**Depth cues, and which ones this map uses.** Designmodo's "depth perception in web
design" round-up (read 2026-10-12) lists the cues designers reach for: overlapping
layers, size variation, blur/focus, parallax, perspective, lighting and shading,
focal points, layered collage. Perception research names the same set as monocular
cues: relative size, occlusion, texture gradient, aerial perspective, linear
perspective, motion parallax. For a live node graph on a light field the ones that
work without costing legibility or frame rate are:

| Cue | How the map does it | Status |
|---|---|---|
| Relative size | drawn radius × `0.6 + 0.6z` | prototyped |
| Aerial perspective, as colour | each node paints in its cluster hue washed toward the field by distance (a degradé per cluster, up to 62 % at the back); alpha only falls gently. Dani's call 2026-10-12: colour, not grey | prototyped |
| Shading (the "3D dots") | a bead: one broad soft highlight up-left, pigment through the body, a gentle fall-off to an inked rim, via one radial gradient per node; skipped under 3.5 px where it cannot register. **No keyline**: the white ring read as a sticker edge and made the sphere feel fake (Dani, 2026-10-12) | prototyped |
| Motion parallax (pointer) | near layer leads the cursor, far layer lags, eased per frame | prototyped |
| Motion parallax (camera) | paint positions spread from the camera centre by depth (`K_PERSP`), so pans and zooms shift layers at different rates | prototyped |
| Occlusion | near nodes paint last (sort by `z` once at build time) | planned |
| Texture gradient | satellites are denser in the far half (power-curve `z`), finer up close | prototyped |
| Blur / focus pull | **not per node** (too slow); one whole-map blur only while a window is open (Phase 4) | planned |
| Cast shadow | none; the bead's own shading is the only lighting. Drop shadows under dots read as clip art | rejected |

Restraint, as the article warns: depth must not cost readability. The hit model is
unchanged; only paint moves, and every paint path (nodes, links, hit areas, the
signature's landing spots) goes through one `offsetOf` helper so they cannot drift
apart.

**1a Depth per node.** Add `z: number` (0 = far, 1 = near) to `MapNode`, seeded in
`buildSystemMap` so the backdrop and the live map agree: hubs 0.85–1, project nodes
0.6–0.9, satellites spread 0.05–0.7 with more mass in the far half. Depth modulates
draw only, never physics:

| Property | far (z = 0) | near (z = 1) |
|---|---|---|
| drawn radius | × 0.7 | × 1.2 |
| fill alpha (satellite) | 0.25 | 0.7 |
| fill alpha (actionable) | 0.75 | 1 |
| keyline | none | 1.4 px |
| labels | project labels only at z ≥ 0.6 | always eligible |

**1b Parallax.** Pointer position normalised to the viewport (`px, py` in −1..1) offsets
each node's *drawn* position by `(px, py) × (z − 0.5) × 18 px / scale`. Near nodes
lead the cursor, far nodes lag. The same offset is applied in `nodePointerAreaPaint`
so hit-testing never drifts from the pixels. Offsets lerp toward target over ~120 ms so
the field settles rather than jitters. Camera pans and zooms get the same treatment
through the existing `onZoom` transform: zoom in feels like a dolly because the near
layer scales faster than the far one (apply `1 + (z − 0.5) × 0.08` to the radius per
zoom step above 1).

**1c Links carry depth (the interconnection).** Replace the default link paint with a
`linkCanvasObject` that draws between the *offset* endpoints, so links stay attached to
parallaxed nodes. Link alpha and width come from the mean depth of its two ends:
far–far 0.05 / 0.6 px, near–near 0.18 / 1 px, mixed in between. Links from a near node
to a far node fade along their length (a linear gradient from the near end's alpha to
the far end's), which is what makes the web read as receding instead of flat. Links
touching the hovered node (Phase 2a) override to the accent colour at 0.5.

**1d Colour field.** A DOM layer under the canvas: radial gradient tinted with the
active cluster's colour at 6 % over `--color-background`, centred on the cluster's
screen position, `transition: background 700ms var(--ease-out-expo)`. Overview = the
accent blue, centred. CSS only. Measured AA on the panel copy must still hold.

**1e Backdrop parity.** `SystemMapBackdrop.tsx` reads the same `z` so stacked mode
draws the same depth (radius and alpha; no parallax).

Acceptance: no per-node `ctx.filter` (blur per node is too slow; depth is size, alpha,
keyline and motion); profile shows the frame under 8 ms at 1440 px with the pointer
moving; `reduced` disables parallax only (depth drawing stays, it is static).

### Phase 2 — Map feel: hover neighbourhood, focus tween, click ripple (medium)

File: `SystemMap.tsx`. Adds one tween registry (`Map<id, {from, to, start, dur}>`) and a
`rAF` loop that calls `fg.refresh()` only while a tween is live.

**Tempo (Dani, 2026-10-12): interaction motion on the map is slow and soft, never
rushed.** Nothing on the map answers the pointer faster than 400 ms, everything eases
with EXPO, and no treatment uses the accent blue on links (the hard blue was rejected).

- **2a Hover neighbourhood.** Hovering an actionable node eases its radius × 1.25 over
  450 ms and lifts its one-hop links to the node's *own hue* at 0.3 alpha over the same
  450 ms (snap-in today in the prototype; the tween is this phase). Its neighbours get
  `z` eased toward 1, so hovering *brings that part of the system forward*. Leaving
  eases back over 600 ms. Project labels fade in on hover at any zoom (300 ms).
- **2b Focus tween.** `focused` fades the other clusters over 800 ms EXPO alongside the
  camera flight (lengthen the flight to 1200 ms to match), instead of snapping. The
  unfocused clusters also ease their `z` down by 0.3, so focus pushes the rest of the
  system back into the field.
- **2c Click ripple.** On a node with an `href`, one ring expands from the node
  (r → r + 28 px screen, alpha 0.5 → 0, 650 ms), timed with the window reveal (Phase 4).
- **2e Parallax tempo.** The pointer parallax eases at 0.055 per frame (≈400 ms settle),
  already in the prototype; keep it there or slower.
- **2d Hint line.** `scroll to zoom · drag to move · click to open` hides after the
  first wheel, drag or click. Hidden, never dimmed (contrast rule 4).

Acceptance: a click mid-tween opens the right window; `reduced` skips 2a–2c.

### Phase 3 — Signature: *chaos.* becomes the system (medium–high)

Files: `SystemMap.tsx`, `SectionPanel.tsx` (exposes the accent word's rect and a
`hidden` flag), `ScaleExperience.tsx` (orchestration, once per session).

The overview headline reads "Making meaning out of *chaos.*" The sequence makes that
sentence happen on screen, once, on first visit.

1. **t = 0.** The panel and headline enter as today, except the accent word renders at
   opacity 0. `SectionPanel` reports the word's `getBoundingClientRect()`.
2. **t = 0–350 ms.** The canvas draws the word itself as points: the word is rasterised
   once into an offscreen canvas at the same font, size and position, sampled on a 4 px
   grid (roughly 700–1100 points), each point a 1.6 px accent dot. The word is
   visibly "made of nodes".
3. **t = 350–1500 ms.** Each point is assigned a target node (nearest by angle from the
   word's centre, hubs and projects claimed first, leftovers to satellites; surplus
   points fade out at 60 %). Points fly to the target's graph position converted to
   screen space, EXPO, delay 0.5 ms per px of distance capped at 300 ms. Near nodes
   (high `z`) arrive first; far ones trail, which reads as depth. Links ramp alpha
   0 → designed, trailing their target node by 80 ms.
4. **t = 1500–1800 ms.** The DOM word fades back to opacity 1 as the last points land.
   Meaning restored; the map is complete and live.

Rules: hit areas are live from frame zero (the live graph is already placed beneath;
the points are an overlay). Once per `sessionStorage` session. Home click does not
replay it. Reduced motion and stacked mode skip it entirely. Total ≤ 1.8 s.

Acceptance: 60 fps on the fly phase at 1440 px; LCP unchanged (headline is SSR text;
only the accent word is briefly transparent); Lighthouse CLS 0.

### Phase 4 — The window model: a dolly into the system (medium–high)

Files: `ScaleExperience.tsx`, `SystemMap.tsx`, `CaseStudyOverlay.tsx`, `nodeContent.ts`
(adds `related`), `src/data/caseStudies.ts` (no copy changes).

How people interact with a window is part of the design. Today the window is a modal
over a dimmed map. In the new direction the window is a **near layer in the same
field**, and the map is pushed back into the depth behind it.

**Status 2026-10-12.** The tempo half of this is in the prototype: the circle reveal
now takes 1.1 s, the copy settles over 0.9 s per block, the map recedes behind the
window (one blur + a 0.965 scale on the map container, 1.1 s) and comes forward on
close. The dolly, the anchor hairline, the cluster dot and "Connected" are still to
build. Dani also asked whether the interaction itself should change, not only its
speed. Three candidates, for him to choose:

- **A. Dolly-in (the plan below).** Keep the centred reading surface; add the camera
  dolly toward the node, the anchor hairline, Connected. Least change, already half
  built.
- **B. The bead becomes the window.** Same as A, but the first 250 ms of the reveal
  is the node's own colour, which then crossfades to the glass, so the window is
  visibly the bead opened up rather than a sheet appearing behind a circle. Small
  addition to A; strongest continuity.
- **C. Docked reading pane.** No modal. The article docks to the right (≈56 % wide),
  the map stays live and clickable on the left and pans the chosen node into view
  beside the pane with its neighbourhood lifted. Reading and navigating the system
  happen at once; lateral moves are simply clicking another node. Biggest change,
  most "the system is the point", and it needs a rethink of focus management
  (`aria-modal` would go) and of the phone layout (which keeps the sheet).

Recommendation: ship A + B now (B costs one gradient stop), and prototype C on a
branch before deciding, because it changes what the site *is* for a reader.

**Open (click a node, or an ActionPill row).**
1. Click ripple on the node (Phase 2c).
2. The camera dollies 1.4× toward the clicked node over 500 ms EXPO (`zoomToFit` on the
   node's one-hop neighbourhood, padding 240 px) and its neighbourhood is boosted to
   the near layer, so the exact part of the system you chose comes forward.
3. The map container (a DOM element, not per node) takes `filter: blur(2px)`,
   `transform: scale(0.97)` and the existing 16 % dim, 500 ms EXPO. The field recedes.
4. The window circle-reveals from the node (existing), timed to start 60 ms after the
   ripple begins. Keyboard and deep links keep the upper-centre bloom and skip the dolly.

**While reading.** The window stays in front; the map stays visible around it, now
soft and receding, so a reader never loses where they are in the system.
- The sticky header gains the cluster's colour dot before the kicker ("● Organisation ·
  Nestlé IT · 2025"), the same colour the node has on the map.
- The clicked node stays rendered at full alpha and near depth beneath the window as
  the anchor; a 1 px hairline at 20 % runs from it to the nearest edge of the article
  (DOM overlay, positioned from the node's screen coords; hidden below 1024 px).
- **Connected.** Every window ends with a "Connected" index: the nodes this one links
  to, as `ActionPill` rows with their cluster colour dot. Source of truth: an explicit
  `related: string[]` on `nodeContent` entries, curated by hand (honest, not inferred);
  if absent, fall back to the same cluster's other named nodes. Opening one is a
  **lateral move**: the window crossfades (exit 200 ms, enter 400 ms, no circle), the
  camera pans to the new node behind it (700 ms EXPO), the anchor hairline re-attaches.
  History gets a new entry so Back returns to the previous window.
- Scrolling the window scrubs nothing on the map (reading pace must not drive the
  camera); the Phase 5 journey-map travel is the only scroll-linked motion.

**Close (Esc, ×, gutter click).**
- Window exits as today (fade + small downward drift; keep the asymmetry).
- The map pulls forward: blur 2 → 0, scale 0.97 → 1, dim off, 400 ms EXPO.
- The camera **stays on the cluster** with that cluster held in focus (not the overview),
  so closing returns you to where you were, and the rail and panel agree. Only
  BrandMark → home releases to the whole system.
- Focus returns to the trigger (`useDialogFocus` contract unchanged).

**Stacked mode (phones, reduce motion).** The window is a full-height sheet; the
backdrop camera (Phase 7) pans to the cluster; "Connected" works the same; no dolly,
no blur. The sheet's header carries the cluster dot too.

**What this changes in the URL contract.** Nothing. Lateral moves push a new
`{ ...state, window: href }` entry; Back closes or returns exactly as today.

Acceptance: `role="dialog" aria-modal` and `useDialogFocus` untouched; backdrop blur
is one element (never per node); Esc from a lateral window goes back one window, not
to the map; deep link into a window renders the receded map correctly on first paint.

### Phase 5 — Reading surface: images and instruments (medium)

Files: `CaseFigure.tsx`, `instruments.tsx`, `CaseStudyOverlay.tsx`, `caseStudies.ts`
(metadata only).

- **5a Figure reveal.** `clip-path: inset(0 0 100% 0) → inset(0)` 1 s `--ease-reveal`,
  image scale 1.04 → 1, `whileInView` once; caption fades after. Reduced: static.
- **5b Shared-element lightbox.** `layoutId = fig.src` on `Figure` and `Lightbox`, so
  the image grows from its place and shrinks back. Focus management unchanged.
- **5c Journey-map travel.** Optional `travel: true` on `CaseFigure` for the wide
  Seamless Conferencing journey maps: a pinned 100 svh stage, `useScroll` on the
  overlay viewport + `useTransform` driving `x`, so the reader moves along the journey.
  Accent hairline shows position. At most two figures site-wide. Stacked: plain figure.
- **5d Gentle parallax** on other figures: `y` ±12 px inside the scroll viewport.
- **5e Instruments.** Iceberg: waterline `scaleX` 0 → 1 (500 ms), below-cards rise with
  `blur(6px) → 0` staggered 90 ms. Swing: bars grow 0 → `pct` (600 ms), `to` bar 120 ms
  after `from`. RoleTrack: travelled line grows, current dot scales 0.6 → 1 last.
  Chain: arrows draw via `stroke-dashoffset`. Matrix, Compass: unchanged.
- **5f Facts count up.** Only values with a leading number; suffix static; 600 ms EXPO
  once. `CIO Award`, `M.Des` and every `pending` chip never animate.
- **5g Reading aids.** 2 px accent progress hairline in the sticky header; kicker
  crossfades (200 ms) to the current section heading via scroll-spy.

Acceptance: every `Beat` fires once; figures carry correct `w`/`h`; CLS 0.

### Phase 6 — Chrome: rail indicator and headline wipe (small)

Files: `ScaleRail.tsx`, `SectionPanel.tsx`.

- One `m.span layoutId="rail-indicator"` travels between rail items (300 ms EXPO).
- On scene change the italic accent word reveals `clip-path: inset(0 100% 0 0) →
  inset(0)` 500 ms EXPO, 120 ms after the lead text. (On the overview's first visit
  Phase 3 owns the word instead.)

### Phase 7 — Stacked mode gets its map back (medium)

Files: `SystemMapBackdrop.tsx`, `ScaleExperience.tsx`.

- Backdrop `<g>` transform targets the active cluster (`cx, cy, radius`), 700 ms EXPO,
  driven by the existing scroll-spy. Active cluster at full depth alpha, others × 0.25;
  veil 82 % → 70 %, re-measured for AA.
- Reduced motion: the global rule collapses the transition; the backdrop jumps.

### Phase 8 — Images as assets (small, optional delight)

- `daniel-profile.png` (unused today) in the `#about` window as a circular portrait
  revealed with `clip-path: circle()`, grayscale → colour on hover.
- Above zoom 6×, the centre hub crossfades from a dot to the portrait on the canvas.
- Blur placeholders for every figure. Experiment images stay unused (dead code).
- A `clip-path` before/after slider only if a verified pair exists. None does today.

---

## 3. Workflow per phase

1. **References first.** Clip 2–4 screenshots or recordings per surface into
   `docs/motion-refs/<phase>/` (never the repo root).
2. **Prompt shape.** Load the skill, state file scope, paste the phase bullets as
   acceptance criteria, ask for clarifying questions before code. Example:

   ```
   /impeccable animate src/components/scale/SystemMap.tsx
   Implement Phase 1 of docs/MOTION-PLAN-2026-10-12.md (1a–1e). Scope: systemMap.ts,
   SystemMap.tsx, SystemMapBackdrop.tsx, ScaleExperience.tsx (colour field only).
   Constraints: CLAUDE.md rules 1, 4, 5, 8; no per-node ctx.filter; hit areas use the
   same parallax offset as paint; `reduced` disables parallax only; no new dependencies.
   Ask me anything ambiguous before writing code.
   ```

3. **Verify in the browser.** Rail buttons for camera moves, 1440 and 375, DevTools
   performance trace on Phases 1, 3 and 4, OS reduce-motion emulated, then the
   `DisplayMenu` toggle.
4. **Batch the bugs.** One scroll-through, one message.
5. **Gate.** `npx tsc --noEmit`; no new lint errors in `scale/`; `/site-review` on the
   touched surface; `/impeccable audit` for motion fatigue.
6. **Record.** One line in the log below when a phase lands or is cut; `capture-learning`
   for anything found the hard way.

---

## 4. Verification matrix

| Check | How | Pass |
|---|---|---|
| Types | `npx tsc --noEmit` | clean |
| Lint | `npm run lint` | no new errors outside the dead directories |
| Frame budget | DevTools performance: pointer moving, assemble, dolly, fly-to | no frame > 16 ms sustained; Phase 1 idle frame < 8 ms |
| Reduced motion (OS) | emulate `prefers-reduced-motion` | stacked mode; static depth; no tweens |
| Reduced motion (site) | DisplayMenu → reduce motion | same |
| Contrast | panel copy over the colour field and the Phase 7 backdrop | AA, measured |
| Keyboard | Tab rail → panel → window → Connected → lightbox | focus never lost; Esc contract intact |
| URL contract | open, lateral move, back, forward, deep link | unchanged |
| Hit-test parity | hover a parallaxed far node at the viewport edge | cursor and ring agree |
| Layout shift | figure reveals, Phase 3 word swap | CLS 0 |

---

## 5. Decisions

- A. **No GSAP, no Lenis, no Three.js, no Lottie.** Framer Motion 12 + canvas 2D only.
  (Confirmed 2026-10-12.)
- B. **Depth before signature.** Phase 1 ships before Phase 3 because the signature
  lands points *into* the depth field; without it the flight reads flat.
- C. **Depth is size, alpha, keyline and parallax. Never per-node blur.** One CSS blur on
  the whole map container, only while a window is open.
- D. **Windows dolly in and stay in the field.** Closing returns to the cluster, not the
  overview. Lateral moves between connected windows are first-class.
- E. **`related` is curated by hand.** Connections shown in a window are claims; they are
  written, not inferred from the seeded graph.
- F. **The signature plays on every full page load, never on in-page returns.**
  Revised 2026-10-12: the once-per-session gate read as "broken" to anyone who reloads
  while reviewing. A home click still never replays it; that is the tic to avoid.
- G. **Journey-map travel is the only scroll-scrubbed motion.** Reading pace never drives
  the camera.
- H. **Skills:** keep `impeccable`; admit the Emil Kowalski skill only if Phase 1's
  parallax lerp needs spring tuning.

---

## 6. Research notes (kept for traceability)

| Source | What it gave us |
|---|---|
| Corebook Studio hero (inspected in-browser 2026-10-12) | No Three.js, no WebGL, no GSAP. One `data-animation-type="lottie"` element (`data_2.json`, 9.7 MB, 165 frames) scrubbed from `scrollTop` in `visuals.js`; Webflow interactions for the chips. |
| mcpmarket "web-animation-design" skill (Emil Kowalski-based) | Easing and duration rules; transform/opacity; reduced-motion branch for every animation; springs for pointer-driven motion. |
| Anthropic `frontend-design` skill (raw SKILL.md) | One orchestrated load moment; hover answers action; scattered fade-ups read as AI-made. |
| Local `impeccable` (`animate.md`, `motion-design.md`, `brand.md`) | Brand register permissions; 100/300/500 rule; exits ≈ 75 % of enter; no bounce; clip-path, blur, masks as bounded premium materials. |
| Emil Kowalski, clip-path and good-vs-great articles | Image reveal curve `cubic-bezier(0.77, 0, 0.175, 1)`; origin-aware transforms; `useSpring`. |
| 2026 round-ups (utsubo.com, hontran.dev, mdx.so, creativedevjobs.com) | Named examples: Resend (one shader on simple geometry), Shopify Editions (type dispersing into particles), Stripe (noise gradient field), Basement (2D content given depth), Huly (Spline embed). None used a node graph. "Pick one hard idea" was the shared advice. |
| theaiadventurer.com, note.com Claude Code walkthroughs | Workflow: skill first, reference folder, clarifying questions, batched bugs, written critique. |
| Medium "High-End Animated Website in 10 Minutes" | Could not be opened (403). Search excerpt only; `[unverified]`. |
| Awwwards transitions collection (read 2026-10-12) | Twenty-five sites; the recurring moves are mask reveals (amaterasu.ai), project-to-project transitions where the next piece grows out of the current one (we-go-again.com, cielrose.tv, federicopian.com), and a scroll-triggered hand-off (monogrid.com). Nothing snaps; every winner lets the reader see the change happen. |
| Awwwards "interactive graph explorer" search (read 2026-10-12) | Google's Language Explorer (Site of the Day, 2026-01-16) is the one node-graph winner: "Drag to explore", a pin opens a detail panel, filters on the side. Same model as ours; confirms the direction, not a style to copy. |
| snaperdigital.com top interactive sites 2026 (read 2026-10-12) | Active Theory: "cinematic project previews, fluid page transitions". Lusion: cursor-reactive, deliberate pacing. neal.fun's *The Deep Sea* and *Size of Space*: depth and scale as the mechanic itself, the closest conceptual kin to our pixel → beyond spine. Stripe: scroll-driven reveals that explain. |
| Designmodo, depth perception in web design (read 2026-10-12) | Overlap, size, blur/focus, parallax, perspective, lighting, focal points, layering; restraint so decoration never beats readability. Mapped to the map in Phase 1's cue table. |
| Not reachable | Medium "Awwward-winning animation techniques" (403); Lusion and Language Explorer pages fetch as text only, so their motion was not observed first-hand. Open them in a browser before Phase 4 to study pacing. |

## Log

- 2026-10-12 — Plan written. Site surveyed at 1440 and 375 on the local dev server
  (overview, Organisation focus, `#it-product` window, stacked mode).
- 2026-10-12 — Direction chosen: A (chaos → meaning) + B (depth field, links included) +
  dolly-in window model. Corebook hero inspected and found to be scroll-scrubbed Lottie,
  not 3D. Plan rewritten; Phases 1–4 replaced.
- 2026-10-12 — Phase 3 prototyped ahead of Phase 1 as a quick test (uncommitted, on
  `feat/zoom-scale`): `SystemMap.tsx` (overlay canvas + sequence), `SectionPanel.tsx`
  (`accentRef`, `hideAccent`), `ScaleExperience.tsx` (wiring). Review flags: `?sig`
  forces a replay, `?sig&slow` stretches it 4×. Found the hard way: the overlay must
  sit above the frosted panel (`fixed z-20`) or the word reads as a smudge through the
  glass; the graph must be hidden from its first frame (`pending` phase) or it shows,
  vanishes and rebuilds; landmarks (hubs) should land first, not last.
- 2026-10-12 — Review: "felt rushed" and "feels flat". Signature slowed (hold 650 ms,
  flight 1700 ms, stagger cap 650 ms, node fade 320 ms; ≈3.3 s total). Phase 1 depth
  prototyped the same day: `z` per node in `systemMap.ts`, size/alpha/keyline by depth,
  pointer parallax (34 px amplitude) + camera-centred perspective (`K_PERSP` 0.14),
  custom link paint with depth alpha, gradient on near→far links, accent on hovered
  links, colour field under the map, backdrop parity. Measured ≈59 fps average, 33 ms
  worst frame, during heavy pointer movement at 800 px wide.
- 2026-10-12 — Review: hard accent-blue hover links rejected; interaction motion must be
  slow and soft; depth should read through colour; "3D dots" requested. Done: hover
  links now the hovered node's own hue at 0.3; depth as a per-cluster colour degradé
  (`shadeOf` / `depthPigment`); bead shading per node (radial gradient, skipped under
  3.5 px); parallax ease 0.12 → 0.055. Phase 2 tempo rewritten (≥ 400 ms, EXPO).
  Found the hard way: a mix helper must never be fed its own rgb output as hex; it
  produced `rgb(NaN,…)` and `addColorStop` threw on every frame.
- 2026-10-12 — Dani: prototype approved, include it; window tempo must align with the
  map and be slower; the white keyline makes the 3D feel fake; interaction may need a
  different model. Done: keyline removed (live map and backdrop), bead gradient
  re-tuned (broader highlight, deeper rim), window reveal 0.7 → 1.1 s, blocks 0.6 →
  0.9 s with 90 ms stagger and 250 ms lead, dim 0.4 → 0.8 s, exit 0.3 → 0.5 s, map
  recedes behind an open window (blur 2.5 px + scale 0.965, 1.1 s). Tempo table added
  to the principles; window-model options A/B/C added to Phase 4; research notes
  extended. Still uncommitted on `feat/zoom-scale`.
