# irala.studio — Content Standards

**Any agent writing content for this site MUST follow these structures.** They exist so
every window reads the same way, stays short, and never dead-ends. Deviate only when
Dani explicitly asks.

## The one law

**Real facts only.** No invented metrics, outcomes, quotes, or opinions. Work that isn't
finished says so — as an invitation, not an apology (see `IN_PREP` in `nodeContent.ts`).
Personal statements (positions, mission, values) may be *drafted* from Dani's documented
material but must be flagged for his review before deploy.

## Voice (from Dani's brand instructions)

- Warm but precise. Active voice. No fluff — every sentence earns its place.
- Specificity over generality; impact over activity.
- Say **employees / people / organisations / systems / touchpoints** — avoid "users" in
  non-digital contexts, buzzwords, credentials-dropping.
- **This site names Nestlé IT openly** (Dani's confirmed override of the older
  anonymize-by-default rule; 270,000+ employees is approved for public use).
- Transition arc every piece should quietly reinforce: research → service design →
  systems leadership. An evolution, not a pivot.

## Reading rules (why windows feel enjoyable)

- No paragraph over ~3 sentences. No window over ~150 words of body copy.
- Lead with the research question or the tension, never the deliverable.
- Every window ends somewhere: a node to open, an action button, or an invitation.
- Scannable: facts grids for numbers, `list` entries for term–one-liner pairs.

---

## Structure A — Projects

### Tier 1: Immersive case study (`caseStudies.ts` → `CaseStudyOverlay`)
Only for projects with verified substance (real metrics, real artefacts).

```
kicker      "Organisation · Nestlé IT · <year>"   (year must match everywhere — scenes.ts,
                                                    nodeContent.ts, caseStudies.ts)
title       Project name
summary     One italic sentence: what changed, at what scale
facts       Exactly 4: outcome-led numbers, never process-only
sections    01 Scenario & result   – situation in ≤2 paras, then what shipped/changed
            02 Why it matters      – open with a pull-quote reframe; the systemic insight
            03 How we did it       – role → evidence → mapping → co-creation → delivery,
                                     galleries interleaved where the artefact proves the text
            04 What I learnt       – 2 paras max, the transferable lesson
blocks      text | quote | gallery | iceberg  (interleave; images carry real alt + caption
                                               written after actually viewing the image)
```

### Tier 2: Compact project window (`nodeContent.ts` → the same `CaseStudyOverlay` surface)
For live/early work and smaller completed pieces. **One window system**: every click
opens the same frosted article (circle reveal from the clicked node); compact content
just reads shorter (max-w 720px vs 880px).

```
kicker      "<Scale> · <year> · case study"  (or "· workshops" etc.)
title       Project name
paragraphs  1: the research question + what the study is, in ≤2 sentences
            2 (optional): the method / the intellectual move being made
facts       (optional, completed work only) up to 4 real numbers
note        IN_PREP for live work — never a bare apology
```

### Area windows (one per cluster hub)
Hub clicks NEVER land in a lone project. Structure: 1 sentence framing what the scale
means → 1 sentence naming what lives here → "Open a node to go deeper."

---

## Structure B — Daniel Irala (personal content)

### `#about` — the person
```
facts       4 credentials max (award, degrees, tenure)
paragraphs  1: who/where/since-when   2: how he works (research as design material)
            3: formal grounding + toolkit   4: outside the day job
actions     [Contact me → #contact]
```

### `#compass` — Vision · Mission · Values · Direction · Future · Past
One window, six one-liners via `list` — never six separate thin windows, never
paragraph-length statements. Each entry ≤ 1 sentence, grounded in documented material.

### `#contact` — always reachable
2 short paragraphs + actions: Email (hello.daniel@irala.studio) · Book a call
(calendar.app.google/UqWLuy9k3Ete57Gd8) · LinkedIn (/in/danirala).

### `#thinking` / `#talks` — Beyond
Positions and talks lead with the tension, not the medium. Talk entries via `list`:
term = talk title, text = venue · date — one-line description. Recording links as
`actions` once published.

---

## Checklist before ending any content session

1. `npx tsc --noEmit` clean; lint the touched files.
2. Facts reconciled across the three sources (`scenes.ts`, `nodeContent.ts`,
   `caseStudies.ts`) — years, labels, numbers.
3. `CrawlableContent` inherits automatically via `contentOrder` — add new hrefs there
   AND to `HREF_SCENE` in `ScaleExperience.tsx`.
4. Verify live via rail buttons (never synthetic wheel-zoom), desktop + 375px.
5. axe scan the new state: 0 violations is the bar. Contrast: only full-opacity
   `text-ink-soft` (#63615E) for meaningful text.
6. Anything drafted in Dani's voice → flag for his review in the final report.

## Model playbook (how Dani gets the best out of Fable 5 / Opus)

- **Fable 5 / Opus** for: content architecture decisions, writing in Dani's voice,
  case-study narrative, anything touching the standards above. Use the `agent-debate`
  skill (Pattern A) for genuinely open structural questions — not routine edits.
- **Smaller/faster models** for: mechanical refactors, running checks, file plumbing.
- **Session shape (ADHD-friendly):** one goal per session → investigate before proposing
  → A/B/C choices with a recommendation first → implement → verify → ONE next step.
- Every session ends with the standing question: is it committed? (Work lives in the
  tree until Dani says deploy.)
