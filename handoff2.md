# Session Handoff — irala.studio portfolio

## 1. Goal

Build a premium, fully interactive personal portfolio for Daniel (Dani) Irala at **irala.studio**. The concept: an **Obsidian-style live force-directed node graph** ("system map") that fills the full screen. Daniel Irala sits at the centre; four scales orbit as clusters (Touchpoint → Team → Organisation → Beyond). The user freely zooms/pans; zooming into a cluster changes the left text panel and right rail highlight; clicking a node or cluster area opens a right-side detail window (`NodeWindow`). The map reads as a true circle, not a diamond.

Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, `react-force-graph-2d` (canvas), `d3-force`, hosted on Vercel at irala.studio.

---

## 2. Current State of the Code

**Not committed.** All changes are in the working tree at `C:\Users\PcCom\daniel-irala-portfolio`. The repo is `iralastudio/daniel-irala-portfolio` on GitHub; `main` has an older build (metro map); the portfolio graph work has never been pushed.

### Built and verified working (as of this session end)

- **Full-screen live graph** — `react-force-graph-2d` canvas, `fixed inset-0`, free zoom/pan (Obsidian-style). No scroll-driven camera.
- **Circular disc layout** — `systemMap.ts` wedge-tiles four outer clusters across 360°, `sqrt(rand)` radial fill for density, forces hold each node to target `(tx, ty)` positions via `forceX`/`forceY` strength 0.18. Reads as a circle, not a rhombus.
- **Zoom-aware area detection** — `onZoomEnd` in `SystemMap.tsx` now checks zoom level FIRST: if the whole system fits the viewport (visible half-extent ≥ 85% of `overallRadius`), it reports OVERVIEW (−1) regardless of which cluster the viewport centre is nearest. Only below that threshold does it find the nearest cluster. **This was the bug fixed this session** — full manual zoom-out used to mis-report a stray area (e.g. "Beyond").
- **Distinct copy for Overview vs About Me** — `overviewScene` (exported from `scenes.ts`, id `'overview'`) holds "Making meaning out of chaos." + map-framing body. `scenes[0]` (profile / About me cluster) has its own headline "One practitioner, *many systems.*" + the bio paragraph Dani approved. `ScaleExperience.tsx` uses `panelScene = active === OVERVIEW ? overviewScene : scenes[active]`.
- **Frosted glass left panel** — `backdrop-blur(18px)` + semi-opaque bg + `mask-image` right-edge fade. No hard "square" edge; graph bleeds through seamlessly.
- **Right rail** (`ScaleRail.tsx`) — meaningful labels (About me / Touchpoint / Team / Organisation / Beyond), no power-of-ten numbers. Hidden below `sm`.
- **BrandMark** — top-left wordmark; clicking it → `zoomToFit` on the whole system (OVERVIEW). No top menu.
- **Mobile stacked mode** — `stacked = mounted && (reduceMotion || viewport<768px)`. Phones get snap-scroll sections (one per scale), a frosted card per `SectionPanel`, the live map as a muted backdrop, and `MobileNav` thumb bar (fixed bottom, 5 buttons, ≥48px targets, safe-area inset).
- **NodeWindow** — right-side detail panel, `w-[min(440px,92vw)]`, opens on node/cluster click, closes with Esc/×/backdrop.
- **Camera** — `flyToView(index, ms)` uses `zoomToFit` exclusively. Rail/logo clicks → `zoomToFit` fly-to. `flyingUntil` ref suppresses area-detection during flights; `userZoomed` ref ensures detection only fires after a real wheel event.
- **tsc clean.** No type errors.

### Known issues / not yet done
- **Not committed or pushed** — everything is working-tree only.
- Pre-existing ESLint warning in `ScaleExperience.tsx`: `useEffect(() => setMounted(true))` mount-guard triggers `react-hooks/set-state-in-effect`. Not a runtime issue; may want to silence before `next build`.
- Dev-only console warning from `react-force-graph-2d`/`react-kapsule`: "Cannot update a component while rendering" under React 19 StrictMode — fires at mount with zero interaction, library-internal, absent in production.
- No portfolio URL in the resume yet (confirm once deployed).

### Note on the "empty space at bottom" report
Earlier this session Dani sent screenshots showing a large empty grey/black block below the map. **This was NOT a site bug** — it was a leftover `preview_resize` override (a short 988×536 custom viewport from earlier mobile testing) still active in the preview tool. The page rendered correctly within that resized area, but the visible preview surface was physically larger, showing dead chrome below. Confirmed by resetting to native size (fills edge-to-edge) and by the fact the page bg is `#EBEAE8` (never black). **Lesson: when a layout gap is reported via screenshot, check for an active `preview_resize` override before assuming a CSS bug.**

---

## 3. Files Actively Edited (working tree, uncommitted)

| File | What changed |
|---|---|
| `src/lib/systemMap.ts` | Circular disc layout, wedge tiling, `sqrt(rand)` radial fill, `ClusterMeta` from target centroids, dense link gen |
| `src/components/scale/SystemMap.tsx` | `zoomToFit`-only camera, `flyingUntil`/`userZoomed` guards, `overallRadius` memo, zoom-level-aware `onZoomEnd`, cursor-repel force, `drawNode` label-by-zoom |
| `src/components/scale/ScaleExperience.tsx` | `OVERVIEW=-1` state model, `panelScene` using `overviewScene`, `stacked` mobile branch, `goHome` / `jumpTo`, frosted left panel, `MobileNav` |
| `src/components/scale/SectionPanel.tsx` | Editorial type, `EXPO` easing, staggered variants, eyebrow logic (`overview` / `profile` / scaleLabel), fluid `clamp()` headline, focus-visible rings |
| `src/components/scale/ScaleRail.tsx` | Meaningful labels, `hidden sm:flex`, focus-visible rings |
| `src/components/scale/BrandMark.tsx` | NEW — top-left wordmark, `onClick={onHome}`, focus ring |
| `src/components/scale/MobileNav.tsx` | NEW — fixed bottom bar, 5 labelled buttons, safe-area padding, focus rings |
| `src/data/scenes.ts` | Added `overviewScene` export (id `'overview'`), updated `SceneId` union, changed `scenes[0]` headline to "One practitioner, many systems.", renamed CTA to "More about me" |
| `src/app/globals.css` | Grain overlay, focus-ring token, frosted surface tokens |

**Deleted:** `src/components/scale/TopBar.tsx` (replaced by BrandMark).

---

## 4. Everything Tried That Failed

| Attempt | Why it failed |
|---|---|
| `centerAt(x, y)` + `zoom(k)` together for camera fly | Camera snapped back to the `zoomToFit` framing every time; the two calls fight the internal camera state. Replaced entirely with `zoomToFit(ms, padding, nodeFilter)`. |
| `AnimatePresence mode="wait"` on scene change | Panel would enter but never resolve out — stuck on a stale scene. Removed; now relies on `key={...}` remount to replay the enter animation. |
| Scroll-driven camera (original concept) | Replaced by free zoom/pan (Obsidian model) per Dani's explicit request. |
| Cluster layout as outward spiral | Produced a diamond/rhombus, not a circle. Replaced with wedge-tiling across full 360° + `sqrt(rand)` radial fill. |
| Area-detection on every `onZoomEnd` without guards | Programmatic fly-tos fired the detection callback and snapped `active` back (camera and state fighting). Fixed with `flyingUntil` timestamp guard + `userZoomed` boolean. |
| Area-detection checking only nearest-cluster-to-viewport-centre | Ignored zoom level — a full manual zoom-out could still report "Beyond." Fixed by checking `visibleHalfExtent >= overallRadius * 0.85` first. |
| `bg-background` class + vignette overlay div on `SystemMap` wrapper | Made the graph sit inside a visible grey rectangle ("the square"). Removed both; canvas is now `absolute inset-0` with transparent background. |
| Hard-split layout (left column offset, map pinned right) | Graph was hidden under the left copy. Replaced with frosted-glass overlay. |
| Synthetic wheel events to test "About me" zoom-in via `preview_eval` | Imprecise targeting zoomed past the cluster into empty canvas. The rail-click test (`querySelectorAll('nav[aria-label="Areas"] button')`) is the reliable test path. |
| Assuming the "empty bottom space" was a CSS/layout bug | It was a stale `preview_resize` override, not the site. See note in §2. |

---

## 5. Next Step

**The single next step: commit and deploy.** Everything works and is verified but lives only in the working tree.

1. `cd C:\Users\PcCom\daniel-irala-portfolio`, review `git status` / `git diff`, then commit. Suggested message: *"feat: live force-graph system map — circular layout, zoom-aware overview detection, overview/about-me copy split, mobile stacked mode, frosted glass panel."*
2. Push and confirm Vercel deploys; spot-check irala.studio live at desktop + mobile widths.
3. Fill the portfolio URL in the resume (`C:\Users\PcCom\Documents\Dani Professional Plan\Daniel.Irala_Resume2026_WIP.txt`) once the live URL is confirmed.

**Backlog (not started, only if Dani asks):**
- Mobile card typography/spacing pass.
- Keyboard nav on the graph (Enter/Space opens nearest cluster — currently mouse/touch only).
- Confirm `#about` NodeWindow content in `nodeContent.ts` has the full bio.
- Dark-mode palette (Obsidian-style; tokens wired but not prioritised).
- `IT Key Roles` (Organisation cluster) still placeholder — no real metrics yet.
- Silence the pre-existing `set-state-in-effect` lint before a production `next build`.
