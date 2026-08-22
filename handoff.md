# Handoff: irala.studio

_Last updated: 2026-08-14. **Nothing in this session is committed.** `HEAD` is
`349ce44 Baseline before agent work`; everything below sits in the working tree._

**This is the canonical handoff**, and it lives at `handoff.md`. It replaced the
2026-07-11 version of this same file in place, because macOS is case-insensitive and
there is no separate `HANDOFF.md`. The old text is still recoverable with
`git show HEAD:handoff.md`. It also supersedes `handoff2.md` (force-graph engine
decisions), which is worth reading only for the original graph-engine reasoning.

**Always update this file at the end of a working session.** Sections 4, 5 and 6 are
durable practice, not session notes: extend them, don't rewrite them.

---

## 1. Where the project stands

Stack, architecture, invariants and the nav model are in `CLAUDE.md`. Content rules are
in `docs/CONTENT-STANDARDS.md`. Neither is duplicated here.

### Delivered and verified this session

| Item | Evidence |
|---|---|
| Phone card spacing | 6 cards at 660px, 5 gaps at 152px, zero spread, no section overflow |
| Hub IA rework | Hub/satellite/empty-space clicks focus a cluster instead of opening duplicate prose |
| Faded hub legibility | Hub names stay readable when their cluster is unfocused |
| Rail/panel sync | `focusCluster` now calls `onAreaChange`; map, rail and panel agree |
| Overview label repetition | "OVERVIEW" no longer paired with "THE WHOLE SYSTEM" |
| Wordmark tap target | 44px on touch (`tap inline-flex items-center`) |
| Canvas hit targets | 24px floor at any zoom via `MIN_HIT_R / scale` |
| Openable vs decorative dots | 8px vs 2 to 5px, visually separable |
| Single `<h1>` | Was two; `SectionPanel` now always renders `h2` |
| AI-readable mirror | `CrawlableContent` rebuilt: scales as `h2`, work nested as `h3` |
| Copy voice | `scenes.ts`, `nodeContent.ts` and `caseStudies.ts` at 0 em dashes in copy, no fact drift |

`tsc --noEmit` clean, lint clean (one pre-existing warning in legacy `experiments.ts`),
zero console errors.

### Withdrawn (were my measurement errors, not defects)

- "Focus is never restored when a window closes." It is restored correctly.
- "The rail takes 789ms to reflect a click." It takes **8ms**.

The 79/100 score from the first heuristic review is **void**: two of five top findings
were instrument artifacts and a third understated the real problem by half.

### Open

1. **`caseStudies.ts` copy pass: done, awaiting Dani's read.** 37 em dashes removed from
   copy across `#it-product` and `#seamless` (`#it-key-roles` was already in voice).
   Five remain in the file's code comments, which are not published. `tsc` clean, zero
   number or proper-noun drift against `HEAD`. The rewrites are mine, so the wording
   still needs Dani's approval before it counts as settled.
2. **IT Key Roles split and rebuilt: done, awaiting Dani's read.** The UAT findings that
   were sitting inside `#it-key-roles` moved to `#digital-agent` as a full case study
   (Touchpoint), and `#it-key-roles` was rebuilt from Dani's Journey Atlas brief as the
   three-role programme it actually is. Both exist in `caseStudies.ts` and `nodeContent.ts`
   so the AI-readable mirror matches. `#digital-agent` is off `IN_PREP`. The site is now at
   **zero em dashes in rendered output**, including the Open Graph alt text. See the new
   "What never leaves the internal source" table in `docs/CONTENT-STANDARDS.md` for what
   was stripped out of the brief and why.
3. **Metrics rebalance: `#it-key-roles` done, two deferred by Dani.** Facts chips there now
   lead with outcome (`4 of 33` selected to build, `1` agent not three tools) instead of
   effort. Confirmed with Dani: **the agent has not gone live**; the four selected use cases
   are queued to be embedded into the Digital Agent. No copy claims a launch. Still to do,
   in his stated order: `#seamless` (its two content tiers disagree, and the compact tier
   uses labels like "Lead / Design Researcher" in metric slots), then the CIO Award, which
   currently sits in `#about` facts and one line of `scenes.ts` without being attached to
   the project that earned it. `#it-product` also has zero outcome metrics.
4. **Visual storytelling: done for the two 2026 case studies.** Three new block types
   (`chain`, `matrix`, `swing`) plus a shared `Instrument` shell and a `Beat` /`BeatItem`
   scroll reveal, all in `CaseStudyOverlay.tsx`. `#it-key-roles` gained the hand-off chain
   and the three-gaps matrix; `#digital-agent` gained the before/after swing and a
   three-failure-modes matrix. Each one **replaced** the paragraph that was doing its job,
   so nothing is said twice. Verified: reveal fires on entering view and holds, arrows hide
   below `md`, no horizontal overflow at 375px, `sr-only` text carries the bars. See the
   "Visual storytelling: the instruments" table in `docs/CONTENT-STANDARDS.md`.
   **Still text-only:** `#it-product` and `#seamless` (they have real image galleries
   instead, but no instruments).
5. **Corrections Dani caught in `#it-key-roles` section 03 (fixed).** Three things:
   - **Factual error, mine.** I wrote that people management "came out as the
     highest-friction phase of the lot". The source brief's stage-priority table actually
     ranks it **mid-table, not top**, and the "highest" figure I leaned on was a single
     practitioner's individual rating rather than the average. Removed. (Figures
     deliberately not repeated here: this repo is public. They are in Dani's source brief.)
   - **Scope framing was wrong.** People management was not a research triumph that
     reshaped the model. It was surfaced and mapped, then **deliberately parked as out of
     scope**: the remit was IT for IT, and capability building and people management sit
     with HR. The same line was held for Architects and RMs. **Open question for Dani:**
     the source brief still describes it as having been added to the PM atlas, which sits
     awkwardly next to "out of scope". Mapped-then-parked is how the copy now reads.
   - **Relationship Managers had no prose beat at all**, despite being the furthest along
     and the source of the selected opportunities. Added, including the point that the
     three selected were **not** the three top-scoring ones, because the set was chosen for
     journey coverage and reuse rather than for score.
   Also rebalanced toward **service design**, not just research: an ownership line naming
   both crafts, the atlas and personas framed as artefacts the organisation operates, and
   the selection framed as a design call. **Standing note: this portfolio is research AND
   service design. Check the balance on every case study.**
6. **Missing content**, which is several different jobs and should not be treated as one:
   - `IN_PREP` placeholders now on `#nespresso` and `#synthetic-users` only.
     `#digital-agent` was resolved: it was never empty, its substance was filed under the
     wrong node. These two do need real facts from Dani. For `#nespresso`: what the
     variant changed, the metric, and whether it has closed. For `#synthetic-users`: one
     concrete thing a synthetic user caught or missed, and where the limit sits.
   - `#thinking` says essays and reading list "are still being prepared". A writing task.
   - `roletrack` blocks with `pending` chips. Honest by design; may be fine as-is.
7. **Commit.** Fifteen modified files plus untracked `.claude/agents/`. Suggest two commits:
   interaction/UI separate from copy, so either half can be reverted independently.
8. **One physical check only Dani can do:** open the site on a real phone and tap a small
   dot on the map. The 24px target is proven by arithmetic and the library's call
   signature, but the browser pane cannot probe canvas hit areas.

---

## 2. Subagents in this repo

Defined in `.claude/agents/`. Use them; a focused agent on a cheaper model is usually
better value than doing it inline.

| Agent | Use for | Do not use for |
|---|---|---|
| `site-scout` | "Where does X live?", "what does this render?" Returns file:line. | Judging or fixing code |
| `site-critic` | Taste-level review, IA and strategy calls, "is this good enough?" Read-only. | Anything that needs edits |
| `site-builder` | A change that is already decided: component fix, spacing, tokens. | Open design questions |
| `site-copy` | Copy rewrites in Dani's voice, the em-dash and cadence work. | Structural code changes |

**Proven pattern:** the `site-critic` consult on the hub-dot question cost about 3% of
this session's tokens and produced the sharpest analysis in it. It found that two of five
hubs were already correct, which reframed the whole task from "remove a feature" to "make
three match the two that work". Give it: the confirmed facts, file:line grounding, the
audiences, and one clear question. Do not make it re-derive what is already known.

**Next obvious use:** `site-copy` for the `caseStudies.ts` pass, and `site-critic` on the
hub-focus implementation before committing it.

## 3. Skills worth reaching for

- **`site-review`** (`.claude/skills/site-review/`). The project's own heuristic review.
  Read its **Measurement traps** section before any browser measuring.
- **`natural-voice`.** Em-dash and machine-cadence cleanup. Pairs with
  `docs/CONTENT-STANDARDS.md`.
- **`agent-debate`.** Dani asked for this explicitly: consult a second model before
  committing to strategic or IA decisions, not routine fixes.
- **`seo-aeo-best-practices`.** For the "accessible for AI" work: structured data,
  answer-engine readiness, heading hierarchy.
- **`frontend-design`.** Aesthetic direction when reshaping UI.
- **`explain-usage`.** Token accounting for a session.

---

## 4. Token strategy (measured, not guessed)

Measured on this session: **~61M effective tokens across 759 turns.** Weighting used:
cache reads 0.1x, cache writes 2x, output 5x.

```
Browser pane (screenshots + page checks)  ███████████████████████  47%
Claude writing (replies, code, reasoning) █████████               19%
Instructions + tool list (every turn)     ██████                  14%
Shell commands                            ███                      7%
File operations                           ██                       5%
Subagent (design critique)                █                        3%
Dani's messages                           ▌                        1%
```

**The finding that matters:** 28 screenshot calls produced **278k tokens** of results,
while 107 shell commands produced 31k and 39 file reads produced 24k. A screenshot is
roughly 10k tokens, and once taken it stays in context and is re-read on every later
turn. One screenshot early in a long session is charged many times over.

### Rules

1. **Read the DOM, don't photograph it.** `javascript_tool` returning measured values
   cost 13k across 82 calls. Screenshots cost 278k across 28. For "is the layout right",
   measure `getBoundingClientRect()`; numbers are also better evidence than a picture.
2. **Screenshot only when a human needs to see it**, or when the question is genuinely
   visual (does this composition work). Not to confirm a value you can measure.
3. **Batch independent tool calls** into one block. Round trips carry the full
   instructions-and-tools overhead each time, which is 14% of this session on its own.
4. **Delegate wide reads.** `site-scout` exploring in a subagent keeps hundreds of
   file-read tokens out of the main context; only its conclusion comes back.
5. **Don't re-verify what a tool already confirmed.** `Edit` errors if it fails; re-reading
   the file to check costs tokens and proves nothing.
6. **Long sessions get expensive per turn regardless of content**, because the fixed
   prefix is re-read every turn. Compact when the visual work is finished, and expect
   compaction to reclaim most of the screenshot cost.
7. **Prefer a targeted `grep`/`sed` range over reading a whole file** when the file is
   large and the question is narrow.

---

## 5. Learnings that must not be relearned

### Never delete the session's working directory

Moving `Danirala Site` to Trash while the session was running inside it eventually killed
`npm`, `tsc`, `eslint`, `git`, the dev server, and `python3` with imports, all with
`EPERM: operation not permitted, uv_cwd`. `cd`, `env -C` and `(cd … && exec …)` do not
fix it. Only restarting the session from a directory that exists does. Treat "delete the
cwd" as a blocked action: flag it, let the user do it from outside the session.

### The instrument is usually the bug

Three "defects" this session were measurement errors. All had the same shape: **the probe
shared a resource with the thing it measured.**

| Wrong conclusion | Actual cause |
|---|---|
| "Focus is never restored on close" | `AnimatePresence` exit cannot progress while a `javascript_tool` call is in flight, so the dialog never unmounted and cleanup never ran |
| "Rail lags 789ms" | Sampled with `requestAnimationFrame`, which the camera animation starves. Real value 8ms via `MutationObserver` |
| "Esc doesn't close the window" | `document.dispatchEvent(new KeyboardEvent(...))` never reaches a handler bound to the dialog |

**Rule:** before trusting a number, ask what the probe competes with. Use
`MutationObserver` for DOM changes, `setTimeout` for coarse polling, and reserve
`requestAnimationFrame` for canvas pixels once the scene is at rest.

**Corollary:** when a finding implies a documented invariant is broken, treat that as
evidence the measurement is wrong, not the code.

### Other confirmed traps

- Screenshot pixels are not CSS pixels (a 1280x800 viewport captured at 800x500). Clicks
  from `getBoundingClientRect()` land elsewhere. Confirm with `document.elementFromPoint`.
- The preview pane draws its own dark badge bottom-left. It is not part of the page.
- A black screenshot or a large empty band is almost always a stale capture or a dead
  server. Page background is `#EBEAE8`, never black. Check `innerHeight` and the server
  before diagnosing the page.
- `.sr-only` content still has geometry (65x19), so it looks like undersized tap targets.
  Filter it out of control audits.
- `read_page` omits content-derived accessible names. Confirm from the DOM.
- Canvas hit areas cannot be probed: cursor is `pointer` across the whole container and
  the shadow canvas is never appended. Verify by arithmetic and say a device test is the
  confirming step.
- Node measurements must state which zoom they came from. The same node measured 14.7px
  zoomed in and 7.9px at the landing overview.

### Verify before asserting

Quote the `file:line` before describing or changing code. Two failures this session:
a CLAUDE.md draft describing a `Navbar.tsx` that did not exist in the target repo, and a
proposed fix to `jumpTo` that already did the thing being proposed. A confidently wrong
fix is worse than none, because it gets applied.

### Fact-drift guard for copy work

After any copy restructure, diff the set of numbers and proper nouns against the original
(`git show HEAD:<file>`). Anything lost or gained that is not a sentence-initial capital
means a claim changed. On `nodeContent.ts` this returned zero drift across 38 edits.

---

## 6. Working preferences (Dani)

- **No em dashes**, in site copy and in replies. No machine cadence. See
  `docs/CONTENT-STANDARDS.md`.
- **Audiences:** hiring managers / design leads, and senior stakeholders / clients. Lead
  with outcome, method one layer down.
- **Bar:** the standard big corporates set (Apple, Google). Consistent rhythm across a
  sequence of screens beats any single screen. Prefer fixes that make proportions uniform
  over fixes that reduce a number.
- **Consult a second model** before strategic or IA decisions.
- **Content is his voice.** Draft and flag for review; never present as settled.
- **Tell him when tasks are complete**, and keep this handoff current.
