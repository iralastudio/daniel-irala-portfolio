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

### Who this is written for

Two readers, both of whom must get what they need from the same copy (confirmed by Dani,
2026-08-12):

1. **Hiring managers and design leads** deciding whether to shortlist him. They read for
   scope, judgement and evidence. Design literacy assumed, Nestlé context not.
2. **Senior stakeholders and clients** (heads of IT, product, transformation) who might
   sponsor the work. They read for business outcome and risk reduced, and will not sit
   through method detail.

Where the two pull apart, lead with the outcome (serves both) and put the method one
layer down (serves the first without taxing the second). Assume neither reader knows
internal Nestlé framing. If a sentence only parses for someone inside NesIT, rewrite it.

**Editing depth:** voice plus restructure. Reorder so each window leads with outcome and
evidence rather than activity. **Do not invent, inflate or soften a single fact, number
or claim** while restructuring; if a reordering seems to need a number that does not
exist, leave the gap and flag it rather than filling it.

### Human-written, not machine-cadenced

This is Dani's own voice on his own site. Copy that reads as machine-drafted
undermines the one thing a research portfolio is selling, so treat these as hard rules,
not preferences.

- **No em dashes (—).** Use a comma, a full stop, a colon, or brackets. If a sentence
  only holds together with a dash, it is two sentences. This is the single loudest tell
  and there are currently ~100 of them across the content files.
- **Vary sentence length deliberately.** The machine default is a run of medium-length
  sentences of near-identical shape. Put a four-word sentence next to a twenty-word one.
- **Cut the scaffolding.** No "it's not just X, it's Y", no "think of it as", no
  "in today's landscape", no rule-of-three lists where two items would do.
- **Never open consecutive paragraphs with the same move** (a participle, a rhetorical
  question, "By doing X...").
- **Say the specific thing.** "270,000+ employees across Nestlé IT" survives; "at scale"
  does not. Concreteness is what actually reads as human.
- **Keep contractions and the occasional short fragment.** Dani writes like a person
  talking, not like a report.

The `natural-voice` skill covers this ground and can be invoked when editing copy.
Note there is no hidden marker or watermark in generated text to remove; the tells are
stylistic only, so the fix is always editing, never stripping.

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

## Two crafts, not one

This is a **design research AND service design** portfolio. Copy drifts toward research on
its own, because research produces countable things (interviews, pain points, scores) and
service design produces judgement calls, which are harder to write down. Left unchecked,
every case study reads as "I ran a rigorous study" and the design contribution disappears.

Check both are visible in every case study:

| Research is showing when you see | Service design is showing when you see |
|---|---|
| Sample sizes, method, how evidence was gathered | The journey atlas and personas as artefacts the organisation goes on operating |
| Pain points traced to root causes, with provenance | Facilitation: co-creation, opportunity shaping, workshops |
| Scoring, confidence, what the evidence does not support | The selection call, and why this set rather than the top-ranked items |
| What was found | What was designed, what was deliberately not designed, and who owns the rest |

The tell that the balance is off: the case study explains how something was learned but
never what was decided or built as a result. On `#it-key-roles` the fix was to name the
ownership across both crafts, frame the atlas as an operated artefact, and say plainly
that the three selected opportunities were ranks 1, 4 and 7 by score, chosen for journey
coverage rather than for ranking. That last one is a design decision, not a finding.

**Scope discipline counts as design work.** Where the programme refused something (people
management sat with HR, so it was mapped and then parked), say so. Knowing what not to
design is a senior signal, and hiding it makes the scope look accidental.

## Visual storytelling: the instruments

A case study is read at the reader's own pace, so the unit of storytelling is a **scroll
step, not a second of playback**. The reel principle that transfers is one idea per beat,
revealed as you arrive at it, with the picture making the claim and the prose adding only
what the picture cannot carry. The principle that does NOT transfer is autoplay pacing:
never take the scroll away from the reader.

Every instrument shares one shell (`Instrument`), one reveal (`Beat` / `BeatItem`,
`whileInView`, `once: true`, staggered children) and one palette, so they read as a family
rather than a collection of widgets. Reduced motion renders them static, never a
fade-with-movement.

| Block | Use it when | Do not use it for |
|---|---|---|
| `chain` | The argument IS the sequence: each link consumes the previous one's output | Any list of steps that has no hand-off |
| `matrix` | The SAME thing looks different per audience, and reading across a row is the insight | A general table of values |
| `swing` | A controlled before/after where one variable changed | Two unrelated numbers put side by side |
| `iceberg` | A visible symptom sitting on structural causes | A cause list with no surface symptom |
| `roletrack` | Parallel workstreams genuinely at different stages | A roadmap |
| `gallery` | Real project artefacts exist and are safe to publish | Decoration |

**The rule that keeps this honest:** when you add an instrument, delete the paragraph it
replaced. Both is worse than either. On `#it-key-roles` the matrix replaced a dense
paragraph listing all nine cells in prose; on `#digital-agent` the failure matrix replaced
two paragraphs. If the prose still reads fine with the visual removed, the visual is
decoration and should go.

`swing` carries `better: 'higher' | 'lower'` because "down 86%" and "up 40 points" are
both wins, and the reader should never have to work that out. Bars are `aria-hidden`; the
`sr-only` sentence is what a screen reader gets.

## What never leaves the internal source

Source briefs carry material that is fine internally and wrong on a public portfolio.
The site can describe the work without any of it. Strip before publishing:

| Never publish | Publish instead |
|---|---|
| Colleague and sponsor names | The role ("the Product Owner", "a graduate designer") |
| Internal targets and projections (productivity %, adoption %, annualised hours unlocked, multi-year value ranges) | What the research itself measured or estimated |
| Named internal platforms (portfolio, demand, architecture and process systems) | "half a dozen systems that cannot be queried together" |
| Delivery partners and vendors, and which one recommended what | The decision, without whose recommendation it was |
| Model or vendor comparisons that reveal a procurement position | "the model underneath the agent was changed" |
| Participant IDs from trackers | The role alone, or no attribution |
| Participant verbatims as `quote` blocks (a quote tied to a role or region is internal data) | Paraphrase the verbatim into prose. `quote` blocks are Dani's own reframes and learnings, drawn from the sessions; that is what every pull-quote on the site already is (decided 2026-10-16) |
| Full prioritisation score tables | The method, the range, and the outcome |
| Exact internal governance dates | The month |
| Community headcounts and org structure detail | "the architecture community" |

Rule of thumb: if it would embarrass a stakeholder to see it on a public URL, or if a
competitor could read a roadmap or a cost base off it, it does not go on the site. The
method, the friction, the reasoning and the outcome are the portfolio. The internal
numbers behind them are not.

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
