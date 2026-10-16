# Content plan: portfolio and CV, aligned

Date: 2026-10-16. Scope: `src/data/nodeContent.ts`, `src/data/caseStudies.ts`,
`src/data/scenes.ts`, and the CV at
`C:\Users\PcCom\Documents\Dani Professional Plan\Daniel.Irala_Resume2026_WIP.txt`.
Code and motion work are out of scope. `docs/CONTENT-STANDARDS.md` still governs every
sentence; this plan says what to change, in which order, and what not to publish.

Source for every figure in this plan: Dani's impact roadmap (pasted 2026-10-16,
compiled from SharePoint, OneDrive, Azure DevOps and email records) and the files
already in the repo. Nothing here is reconstructed from memory.

## 1. What this session decided (the record)

These are settled. Do not reopen them in later sessions; apply them.

| Decision | Detail | Where it already applies |
|---|---|---|
| Role progression is shown, with real dates | Learning Experience Designer 2022 → Design Researcher 2023 → Senior Design Researcher 2025 | `#about` facts + paragraph 1; CV experience header |
| 2025 is the Senior date, not 2024 | Dani's real promotion was 2025. He considered showing 2024; the recommendation taken was the true date, because titles and dates are what background checks verify and the project scope already reads as senior | Site and CV both say 2025. If Dani overrides, change both, never one |
| NesIT & Digital Agent is two parallel projects | (1) use-case discovery across three roles (Relationship Managers, Product & Programme Managers, Architects) = `#it-key-roles`; (2) usability testing of the agent on the use cases being built = `#digital-agent` | Each window links to the other via `related`; CV has one entry with two bullets |
| Internal programme data never leaves Nestlé | GO rate, readiness scores, pilot satisfaction, budget changes, hours or productivity targets, participant names, quotes tied to a role or region | All removed from `#digital-agent`; role-attributed quotes removed from `#it-key-roles` |
| A rounded or relative figure is still the figure | "More than doubled" tells the reader the same thing as 33% → 73%. Direction can be described in words; the number cannot be approximated | The one direction sentence left is flagged in §7 for Dani's call |
| Show the decision, not the number | Every case study must answer: what did my evidence let someone decide? | `#digital-agent` headline facts and the new `chain` block |
| The NDA line is a feature | "The scores stay inside Nestlé. I'm happy to walk through the method and the decision in conversation." It signals seniority and invites the call | Present in `#digital-agent` (both tiers) |

## 2. Who the content is for

Two readers (confirmed 2026-08-12, restated here). Every window has to pass all three
tests for both.

| Reader | Reads for | The test |
|---|---|---|
| Hiring manager or design lead shortlisting for a senior role | Scope, judgement, evidence, what Dani decided and what he refused | *Could they repeat the decision Dani made from what's on the page?* |
| Senior stakeholder (head of IT, product, transformation) who might sponsor the work | Business outcome, risk reduced, what it cost them not to do it | *Is the outcome in the first two paragraphs, before any method?* |
| Both | Nothing they could not say out loud in an interview | *Would Dani be comfortable if this sentence were read back to him by a Nestlé colleague?* |

Three things a senior reader looks for that research portfolios usually hide:

1. **The call.** Which option was chosen, which were parked, and why. Scope refusals
   count (people management parked with HR in `#it-key-roles` is the model).
2. **The hand-off.** Who acted on the evidence and what they did with it. The `chain`
   instrument exists for this.
3. **The gap.** What is not yet proven. "Estimated value is not demonstrated value" in
   `#it-key-roles` is the tone. A senior reader trusts a page that names its own gap.

## 3. What stays out (the publishing rule, made concrete)

`CONTENT-STANDARDS.md` §"What never leaves the internal source" still applies. The
roadmap added these specific items. Strip from any portfolio or CV draft:

| Never | Publish instead |
|---|---|
| Colleague and sponsor names from the roadmap (line manager, skip-level, sponsor, initiative lead, change lead, scorecard co-author, KPI partner) | The role only, or nothing |
| GPT, Opus, any model or vendor name | "the model underneath the agent was changed" |
| GO rate, readiness 63.4 → 75.0, NO-GO 7 → 1, Ease of Use 7/7, pilot 7.07 / 8.67 / 75% / 71.7% | The verdict and what it enabled |
| 800,000 hours, 20% productivity, 70% adoption, 3,500 MAU, €60k | Nothing. These are targets or team figures, not Dani's results |
| 72 findings / 27 / 39 / 6 defect split, 14 closed by upgrade | "a named list of blockers, each routed to the team that owns it" |
| OMP, ST-19.217, LeanIX, MCP, VI-DQ, VI-SP, OCIO as internal code | Plain English, or the function it serves |
| Nestlé × Microsoft study, until published or cleared by legal | Nothing |
| Pilot launch date 10 Aug 2026, sign-off dates | The month, if needed at all |
| Participant quotes tied to a role or region | Paraphrase in the surrounding prose, no quotation marks |

Rule of thumb from the standards still holds: if a competitor could read a roadmap or a
cost base off it, or a stakeholder would wince at it on a public URL, it stays internal.

## 4. Portfolio ↔ CV split

| Project | Portfolio | CV | Reason |
|---|---|---|---|
| NesIT & Digital Agent: usability testing | **Tier 1** `#digital-agent` (done this session) | Tier 1, bullet 2 | Strongest decision-influence story; where the positioning is heading |
| NesIT & Digital Agent: use-case discovery (Key Roles atlas) | **Tier 1** `#it-key-roles` (live) | Tier 1, bullet 1 | The discovery half of the same arc; shows service design judgement |
| E2E IT Product Offering | **Tier 1** `#it-product` (live) | Tier 1 | Complete, artefacts published, iceberg model |
| E2E Seamless Conferencing | **Tier 1** `#seamless` (live) | Tier 1 | The only project with something shipped and a measured loop (+10%) |
| Synthetic Users framework | **Tier 2** `#synthetic-users`, upgrade from IN_PREP once §5 items are confirmed | Tier 2 | Distinctive, says "systems innovator"; substance now exists (guideline v3.5, 4+ agents) |
| Design Maturity Workshops | Tier 2 `#design-maturity` (live, no change) | Tier 2 | Facilitation credential; low cost to keep |
| IBO 2.0 Global Repository | **Not a node.** Would need a new href across four files for a taxonomy study | Tier 2 | Good numbers (14 interviews, 6 countries) but a weaker signal than anything above |
| Learning Experience Design 2022–23 (Our Nest, IT Service Portal, Receiver Centricity) | **No** | Tier 2, one line | Shows measurement from day one; off the current positioning as a case study |
| Journey Management Ways of Working v0.4 | Later, if adopted | No | Still a draft |
| Value Framework 2027, BA journey, Wave 3, AI Absorption KPI | No | No | No outcome yet; Value Framework ownership not agreed |
| Forrester programme, NIVA, Partner Scorecard, Evergreen chapter, LeanIX assessment, UX Explorers | No | No, except UserZoom certification → Certifications | Team work, internal artefacts, or folded into bigger stories |
| Nespresso minibag A/B test | Tier 2 `#nespresso` IN_PREP (live, no change) | No, until it closes | Live work |
| Design for Good (South Africa) | In `#about` paragraph 4 (live) | Selected external project | Keep as is |

## 5. Window-by-window instructions

Status as of this session. "Done" means edited in the working tree, not committed.

| Window | Status | Instruction |
|---|---|---|
| `#about` | Done | Progression added. Dani reads paragraph 1 aloud; if it sounds like a form, shorten to one sentence with the three titles |
| `#compass` | No change | — |
| `#contact` | No change | — |
| `#digital-agent` (both tiers) | Done, pending §7 items 1 and 2 | Keep the four headline boxes as they are (bar, verdict, failure types, sessions). The `chain` block replaced the `swing` block; do not reintroduce a before/after bar for this project while the figures are internal. Section 03 still says "Twelve moderated one-to-one sessions": reconcile with §7 item 1 |
| `#it-key-roles` (both tiers) | Done, pending §7 item 4 | Two role-attributed verbatims removed and paraphrased. Two pull-quotes remain in sections 02 and 04 ("Not every friction point…", "A security agent is only ever as good as…"): if they are Dani's own words, keep; if a participant's, paraphrase |
| `#it-product` | No change | Complete. On the CV, line now matches it |
| `#seamless` | No change | Complete. CV line now carries both shipped items and the +10% |
| `#synthetic-users` | **Next content job** | Upgrade from IN_PREP to a completed Tier 2 window. Allowed facts from the roadmap: operating guideline written (Sep 2026); synthetic users shown to sit within existing AI policy, so no new policy was needed; 4+ synthetic-user agents built (EA, PM, JM, blended Architect); hypotheses now come before interviews so stakeholder time goes on validation. Not allowed: the policy reference number, version numbers, any time saved figure (none was measured). Lead with the question the window already asks ("where is the line?") and answer it with the policy finding. Keep `note` only if Dani says the guideline is not yet adopted |
| `#design-maturity` | No change | Kicker says 2022–2024; CV entry has no date. Add "2022 – 2024" to the CV line |
| `#nespresso` | No change | IN_PREP stays |
| `#thinking`, `#podcast`, `#talks` | No change | — |
| `scenes.ts` hub copy | Check only | Touchpoint hub mentions the Digital Agent; wording is fine. No figures live there |

Gate for every content session (from the standards): `npx tsc --noEmit` clean, lint the
touched files, facts reconciled across `scenes.ts` / `nodeContent.ts` / `caseStudies.ts`,
verify live on desktop and 375px, axe 0 violations, anything in Dani's voice flagged.

## 6. CV assessment

Read against the two readers in §2 and the 1-page target in the file's own open items.

### What works now
- Header title matches the site (`Senior Design Researcher · Service Designer`).
- Progression line shows three titles with real dates; the arc from learning design to
  AI decisions is visible without a sentence of explanation.
- Tier 1 is three projects, each with scope, method, and what changed. The Digital
  Agent entry shows both streams without a single internal figure.
- Nothing on the page breaches §3.

### What to change

| # | Issue | Change | Priority |
|---|---|---|---|
| 1 | **Summary contradicts the header.** It says "Service Designer and Senior UX Researcher"; the header says "Senior Design Researcher". It also leads with method ("I map end-to-end systems") rather than the decision-influence positioning the rest of the page now carries | Rewrite in ≤3 lines: who (Senior Design Researcher and Service Designer, Nestlé IT), what (research that decides what gets built and whether it ships, for 270,000+ employees), direction (journeys → enterprise AI). Draft in §6.1 | High |
| 2 | **Length.** 3 Tier 1 + 4 Tier 2 + external project + two-column left rail will not fit one page at a readable size | Decide: (A) keep one page, cut Learning Experience Design to the progression line only and drop Design for Good to a single line under Certifications & Awards; (B) accept two pages and keep everything. Recommendation: A. Senior hiring managers read page 1; a second page of 2022 learning NPS weakens the page-1 story | High |
| 3 | **Core Skills miss the 2026 work.** Nothing says AI agent evaluation, go/no-go frameworks, or synthetic users, which are the three things the Tier 1 entry is about | Replace "AI-assisted knowledge systems" with "AI agent evaluation (usability testing, go/no-go frameworks)" and add "Synthetic users for research". Drop "Futures thinking & scenario planning" unless a project on the page shows it (none does) | High |
| 4 | **Mentoring is invisible.** The site says Dani mentored a graduate researcher and aligned with the Product Owner on two projects. Senior roles are screened for this | Add one clause to the IT Product Offering or Seamless entry: "mentoring a graduate researcher" | Medium |
| 5 | **Tools.** UserZoom certification (2024, from the roadmap) is a real credential and is not listed; "Usability testing platforms" is vague. Azure DevOps is used daily | "UserZoom (certified) · Azure DevOps"; drop the vague line | Medium |
| 6 | **Certifications.** Add "UserZoom · UX Explorers programme, 2024". CIO Award: add the year if Dani has it (not in this session's sources, mark [unverified] until he confirms) | Add | Medium |
| 7 | **Design Maturity Workshops has no date.** Site says 2022–2024 | Add "2022 – 2024" | Low |
| 8 | **"Nestlé IT" vs "Nestlé".** Header line now says Nestlé IT; CIO Award says "Nestlé". Fine, but keep "Nestlé IT" everywhere a role is named | Check | Low |
| 9 | **Email case.** "Daniel.irala.v@gmail.com" has a capital D; the site and LinkedIn use lower case | Lower-case it | Low |
| 10 | **Portfolio URL** still a placeholder | irala.studio (the site's own name in `layout.tsx`) once it is deployed | Blocked on deploy |

### 6.1 Summary draft (Dani's voice, for his review)

> Senior Design Researcher and Service Designer at Nestlé IT. I run the research that
> decides what gets built and whether it is ready to ship, for an organisation of
> 270,000+ people. Four years from learning design to enterprise AI: journey atlases
> that set investment priorities, and usability evidence that set the terms of a pilot
> launch.

Three sentences, 56 words, no figure that is not already public on the site.

### 6.2 Things to consult before the CV is final

Ordered by how much they change the page.

1. One page or two (item 2 above). Changes the whole bottom half.
2. The 2024 vs 2025 Senior date. The page says 2025, matching the site. If Dani still
   wants 2024, both change together, and the site's `#about` facts chip too.
3. Whether the learning NPS figures (+54, +43, 60% completion) are cleared for public
   use. Only "Nestlé" and "270,000+" have been cleared so far.
4. Session count for the usability testing (12 on the site, 15 BRMs in the roadmap).
5. Whether "Synthetic Users framework" can say "adopted" or only "written".

## 7. Open questions for Dani (the whole list, one place)

| # | Question | If yes | If no |
|---|---|---|---|
| 1 | ~~12 or 15 sessions?~~ **Answered 2026-10-16: 15.** Applied to both site tiers and the CV | — | — |
| 2 | ~~Direction sentence in `#digital-agent`~~ **Answered 2026-10-16: keep.** | — | — |
| 3 | Are NPS +54 / +43 / 60% completion public-safe? | Keep on CV | Reduce to "learning programmes across 50+ markets" |
| 4 | ~~Pull-quotes in `#it-key-roles`~~ **Answered 2026-10-16: Dani's own learnings from the interviews and the usability testing. Keep.** Rule added to `CONTENT-STANDARDS.md` | — | — |
| 5 | Does Dani want the `#about` progression in one sentence or three? | — | — |
| 6 | Is the Synthetic Users guideline officially adopted? | Say "adopted" on CV and site | Say "written", keep IN_PREP note on site |
| 7 | CIO Award year? | Add | Leave undated |

## 8. Run order

Each step ends with a gate. Do not start the next until the previous is confirmed.

| Step | Work | Gate |
|---|---|---|
| 0 | Dani answers §7 (can be partial; items 1, 2, 4 unblock the commit) | Answers logged in this file under §1 |
| 1 | Apply answers to `#digital-agent`, `#it-key-roles`, `#about`. Commit the content change alone, separate from the uncommitted motion work (`src/data/` only, message `content: remove internal programme figures, show decisions`) | tsc + lint clean; `git diff --stat` touches only `src/data/` |
| 2 | CV: apply §6 items 1, 3, 5, 6, 7, 9; Dani decides item 2 | Dani reads the summary aloud |
| 3 | `#synthetic-users` upgrade per §5 | Standards checklist; Dani voice review |
| 4 | Trim CV to one page (if A) and export; confirm Portfolio URL when deployed | Word count; fits page 1 at 10.5pt or larger |
| 5 | Update `MEMORY.md` Resume 2026 section: status, open items closed | — |

**One next step:** items 1, 2 and 4 answered 2026-10-16. Step 1 (the content commit) is unblocked.

## 9. Sources read this session

- Dani's impact roadmap, pasted 2026-10-16 (its own §8 lists the SharePoint, OneDrive
  and Azure DevOps records it was compiled from)
- `src/data/caseStudies.ts`, `src/data/nodeContent.ts`, `src/data/scenes.ts`
- `docs/CONTENT-STANDARDS.md`
- `C:\Users\PcCom\Documents\Dani Professional Plan\Daniel.Irala_Resume2026_WIP.txt`
- Memory: `MEMORY.md` (Resume 2026, portfolio direction, project notes)
