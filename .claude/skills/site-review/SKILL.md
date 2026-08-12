---
name: site-review
description: Heuristic UX review of a page, screen, or component of irala.studio. Scores Nielsen's 10 usability heuristics 1-5 with a concrete finding each, plus dedicated Fitts's Law (tap targets) and Doherty Threshold (perceived latency) checks on the site's navigation, then returns a ranked top-5 findings list and a 0-100 score. Use when asked to review, critique, QA, audit, or "give feedback on" any page or component, or when asked about tap target sizing, touch usability, or how slow/laggy something feels. Findings only — never edits code.
allowed-tools: Read, Grep, Glob, Bash, mcp__Claude_Browser__preview_start, mcp__Claude_Browser__preview_stop, mcp__Claude_Browser__preview_logs, mcp__Claude_Browser__navigate, mcp__Claude_Browser__read_page, mcp__Claude_Browser__computer, mcp__Claude_Browser__find, mcp__Claude_Browser__javascript_tool, mcp__Claude_Browser__read_console_messages, mcp__Claude_Browser__read_network_requests, mcp__Claude_Browser__resize_window
---

# Site review

Read-only heuristic review of irala.studio.

## Rule zero: never edit code

Report findings; do not fix them. No `Edit`, no `Write`, no `git` mutations, no
`sed -i`. `Bash` is for reading only (`grep`, `git diff`, `git log`, `wc`). If a fix is
obvious, put it in the finding's one-line **Fix** field — the user decides whether to
apply it. Reviewing and fixing in the same pass is how a review turns into an
unreviewed change.

## 1. Establish the target

Ask which page or component only if genuinely ambiguous. Default target is the live
experience: `src/app/page.tsx` → `CrawlableContent` + `ScaleExperience`.

Read `CLAUDE.md` first. It carries the deliberate decisions, and violating one is a
finding while *conforming* to one is not.

Then get it on screen:

```
preview_start {name: "dev"}      # from .claude/launch.json, port 3000
```

Review at three widths via `resize_window` — a finding at one width is not a finding at
all three, and say which:

| Width | Mode | What's live |
|---|---|---|
| 1440 | desktop | `SystemMap` canvas + `SectionPanel` (left) + `ScaleRail` (right) |
| 768 | boundary | stacked mode engages below this — check the handoff |
| 375 | stacked | snap-scroll sections + `MobileNav`; the map is a muted backdrop |

## 2. Known-by-design — do not file these

These are settled decisions. Filing them wastes the review's credibility:

- **The canvas is `aria-hidden` and pointer-only.** The keyboard path is deliberately
  `ScaleRail` + `SectionPanel` links + windows. "The graph isn't keyboard reachable" is
  not a finding. "The rail doesn't reach node X that only exists on the canvas" *is*.
- **`<main>` measures 0 height** — the experience is `fixed`/`absolute`.
- **The dev-only React 19 StrictMode warning** from `react-force-graph-2d` /
  `react-kapsule` ("Cannot update a component while rendering") is library-internal.
- **`npm run lint` is not green** — ~14 errors, all in dead dirs (`metro/`, `modal/`,
  `experiments/`, `content/`, `layout/`). Those directories are not live; do not review
  them. A *new* error in `scale/`, `app/`, `lib/`, or `data/` is a real finding.
- **Window exit is intentionally asymmetric** (circle-reveal in, fade + drift out).
- **Page background is `#EBEAE8`.** If a screenshot is black, that's a preview glitch —
  re-check before writing it up.

## 3. Nielsen's 10 — score 1-5 each

One score **and one concrete finding per heuristic**, ten of ten, no exceptions. A
finding must quote a string, name a file:line, or cite a measured number. Ban vague
praise: "good visual hierarchy" scores nothing. If a heuristic is genuinely clean, say
what you checked and why it passed ("Esc, outside-click, and Close all dismiss
`CaseStudyOverlay`; focus returns to trigger — `useDialogFocus`").

Scale: **1** broken · **2** poor · **3** works with friction · **4** solid · **5** exemplary.

1. **Visibility of system status** — does the visitor know where they are in the map?
   Check `ScaleRail` `aria-current`, the `MobileNav` scroll-spy, panel/viewport sync
   after a manual zoom.
2. **Match to the real world** — do "Touchpoint / Team / Organisation / Beyond" read as
   scales to someone who has never seen the site? Check the `ScaleRail` hint copy.
3. **User control and freedom** — the URL contract in `ScaleExperience`. Does Back close
   a window, does Forward re-open it, does a deep link close cleanly, does home
   (`BrandMark`) unpin dragged nodes (`releasePinned`)? Exercise it, don't assume.
4. **Consistency and standards** — is every action control an `ActionPill`? Any stray
   `rounded-full` on a control (the ramp caps at 12px)? Border alphas `ink/10` for
   surfaces, `ink/15` for interactive? Any `transition-colors` at the default 150ms
   instead of `duration-300`?
5. **Error prevention** — dead ends. A rearranged map with no way back, a window with no
   visible close, a deep link to content that no longer exists.
6. **Recognition over recall** — must the visitor remember what a node meant after the
   window covers it? Are satellite dots distinguishable from openable `project` nodes?
7. **Flexibility and efficiency** — keyboard path completeness, `DisplayMenu` reachable,
   deep links shareable.
8. **Aesthetic and minimalist design** — measure, don't emote. Content that overflows,
   competes, or truncates.
9. **Help users recognise and recover from errors** — what happens on an unopenable hash,
   a failed image, an empty content block?
10. **Help and documentation** — the affordance hint ("scroll to zoom · drag to move ·
    click to open"). Is it visible when needed, and present in stacked mode?

## 4. Fitts's Law — tap targets

The convention here: controls are visually compact on a pointer but must still meet
**44px on touch**, via the `.tap` class (`min-height: 44px` under
`@media (pointer: coarse)` only). A control that is small *and* missing `.tap` is a
real defect; a small control *with* `.tap` is by design.

Measure — never eyeball:

```js
[...document.querySelectorAll('button, a, [role="switch"], input')]
  .map(el => { const r = el.getBoundingClientRect(); return {
    el: el.getAttribute('aria-label') || el.textContent.trim().slice(0, 32),
    w: Math.round(r.width), h: Math.round(r.height),
    tap: el.classList.contains('tap'),
    cls: el.className.slice(0, 60) };
  }).filter(x => x.h < 44 || x.w < 44)
```

Run it at 375 **with a coarse pointer emulated** — under a fine pointer the `.tap` rule
does not apply and every result is a false positive. State which pointer type you
measured under.

Check specifically:

- **`ScaleRail`** — buttons carry no `.tap` and no min-height, and the rail is
  `hidden sm:flex`, so it renders from 640px. Confirm whether a touch device in the
  640-767px band gets the rail, and if so whether its targets clear 44px.
- **`MobileNav`** — `min-h-[48px]`, horizontally scrolling. Verify the active item
  auto-scrolls into view and that no item is unreachable behind the edge fades.
- **`DisplayMenu`** — 40px trigger with `.tap`; the switches and size buttons too.
- **Canvas nodes** — `systemMap.ts` radii: hub 19, sector hub 14, project 10.5, small
  project 6, satellite 2.4-5.4 *graph units*, which scale with zoom. At the default
  overview zoom, work out the effective px radius of an openable `project` node. If a
  clickable node is under ~24px effective diameter it is a Fitts finding, and on touch
  it's severe — a finger is ~9mm.
- Spacing between adjacent targets, not just their size.

Score **0-20**.

## 5. Doherty Threshold — perceived latency

Budget: **400ms** to acknowledge an action. Distinguish *acknowledgement* (must be
<400ms) from *completion* (may take longer if progress is visible). Deliberate
choreography is not latency: the 1100ms `flyToView` and 0.6-0.7s EXPO entrances are
intentional pacing — judge whether they *feel* responsive, i.e. whether something moves
within 400ms of the input.

Measure:

- **First meaningful paint of real content.** `CrawlableContent` is server-rendered, so
  substance should exist pre-hydration. Verify with `read_network_requests` that the
  canvas bundle (`react-force-graph-2d` + `d3-force`) is not blocking it.
- **Cost of the graph.** Note the transferred bytes for the force-graph chunk and the
  time from load to first stable simulation frame. This is the single biggest risk on a
  slow connection.
- **Input → first visual change**, timed, for: node click → circle reveal starts; rail
  button → camera begins moving; `MobileNav` tap → scroll starts; `DisplayMenu` trigger →
  popover appears.
- **Simulation cost while panning/zooming** — a live d3-force sim under interaction.
  Check for dropped frames; `read_console_messages` for violation warnings.
- **Is there any indication during the 1100ms camera flight** that the input registered?

Report real numbers. "Feels fast" is not a measurement.

Score **0-20**.

## 6. Ranking and score

Rank the **top 5** findings strictly by severity, ties broken by how many visitors hit it:

1. **P1 — blocks navigation.** Cannot reach content, cannot get back, dead end, target
   unhittable on touch, keyboard path broken.
2. **P2 — adds friction.** Reachable but costly: mis-sized target, missing status, >400ms
   unacknowledged input, inconsistent control.
3. **P3 — reduces polish.** Visual or rhythmic inconsistency with no task cost.

Every P1 outranks every P2, which outranks every P3. Never pad to five — if only three
survive scrutiny, report three and say so.

Score out of 100:

```
(sum of 10 heuristic scores / 50) × 60   →  0-60
+ Fitts's Law score                      →  0-20
+ Doherty score                          →  0-20
```

Show the arithmetic. Cap the total at **59 if any P1 is open** — a site you can't
navigate doesn't score a passing grade on polish.

## 7. Output format

```markdown
## Site review — <target> @ <widths reviewed>
**Score: NN/100** (heuristics NN/60 · Fitts NN/20 · Doherty NN/20)

### Top 5 findings
1. **[P1] <finding>** — `file:line` or measured value
   *Impact:* one line. *Fix:* one line.
2. …

### Nielsen's 10
| # | Heuristic | Score | Finding |
|---|---|---|---|
| 1 | Visibility of system status | 4/5 | <specific, cited> |
… all ten …

### Fitts's Law — NN/20
Pointer type measured, per-control table, verdict.

### Doherty Threshold — NN/20
Measured timings, bundle cost, verdict.

### Checked and clean
Briefly, what you verified that passed — so the user knows coverage.
```

Close the preview when done (`preview_stop`), and state plainly that no files were
modified.
