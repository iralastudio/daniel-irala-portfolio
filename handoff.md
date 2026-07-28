# Handoff — irala.studio portfolio

_Last updated: 2026-07-11 (session end). **Nothing since 2026-07-04 is committed** — see §6._

**Session chain:** `handoff2.md` (force-graph built) → `handoff.md` @2026-07-04 (Seamless
case study) → **this doc @2026-07-11 (window system unified + IT Product case study +
content standards).** Read `handoff2.md` for the original graph-engine decisions.

## 1. The goal

Dani's portfolio (`irala.studio`, Next.js 16 / React 19 / Tailwind v4 / Framer Motion 12,
Vercel). The site is an **Obsidian-style live force-directed graph "system map"**: Daniel
Irala at the centre, four scales orbiting as clusters (Touchpoint / Team / Organisation /
Beyond). Free zoom + pan; clicking a node opens content on a frosted-glass surface over
the live map; a left panel shows copy for wherever you're looking.

**These sessions' goals (all delivered):**
1. Polish the Seamless hero (real 3rd stat `~45 Meeting rooms impacted`, year 2024–2025;
   removed the "first project of the Journey Management team" line).
2. Promote **E2E IT Product Offering** (2025 only) to a full immersive case study,
   including the **iceberg model** visual and fuller website copy.
3. **Unify the window system** — one window style for every node click (Dani: _"when you
   click it must open the same window style as the others"_), with (a) easy reading +
   images + large context, (b) an aesthetic, experimental open — the **"zoom into the
   circle"** reveal, (c) accessible for humans and AI.
4. Standardise content into reusable structures + add the Si Design Hub talk in Beyond.

Content rule throughout: **real facts only, no fabrication.** Only E2E Seamless
Conferencing (2024–2025) and E2E IT Product Offering (2025) have verified substance;
everything else is honestly "in preparation" (framed as an invitation, not an apology).

## 2. Current state of the code

Type-clean (`npx tsc --noEmit` passes), axe **0 violations**, verified live desktop + 375px
mobile. Done across these sessions:

- **ONE window system.** `NodeWindow.tsx` (the old 440px side panel) is **deleted**.
  `CaseStudyOverlay.tsx` is now THE single content window: it accepts both `study?`
  (rich case study) and `node?` (compact content) and renders both on the same
  frosted-glass `<article>`. Case studies read at `max-w-880px`, compact content at
  `max-w-720px` — same surface, sized to content.
- **"Zoom into the circle" reveal.** Every window opens as a **clip-path circle growing
  out of the exact clicked node's screen position** (`origin` prop = click x/y).
  Reduced-motion falls back to a plain fade. Container-transform / circular-reveal pattern.
- **E2E IT Product Offering = full case study** (`#it-product`, `Organisation · Nestlé IT ·
  2025`). 4 facts (40+ / 70+ / 58% / 6), 4 sections, the **iceberg model** block (symptom
  above the waterline, numbered root causes below, out-of-scope pills), back-casting text
  in §03, 6 real images.
- **Seamless hero polished** — 3rd stat now `~45 Meeting rooms impacted`, kicker
  `2024–2025`; "first project of the Journey Management team" line removed.
- **Content filled in:** #about, #compass (6 one-liners Vision/Mission/Values/Direction/
  Future/Past — **drafted, awaiting Dani's review**), #contact (email + Google booking +
  LinkedIn), #talks (Si Design Hub talk — **recording URL still pending**), area windows.
- **#compass is now an interactive instrument** (`Compass.tsx`, 2026-07-11): the six
  directions sit around a dial and the needle swings to whichever you point at
  (click / hover / arrow keys / focus), revealing that line. Rendered when
  `nodeContent['#compass'].compass === true`; the plain `<dl>` path still serves every
  other `list` window and `CrawlableContent` keeps the six lines server-rendered for SEO/sr.
- **"More about me" → "Contact me"** with email `hello.daniel@irala.studio`, booking
  `calendar.app.google/UqWLuy9k3Ete57Gd8`, LinkedIn `/in/danirala`.
- **Docs:** `docs/CONTENT-STANDARDS.md` (NEW) holds the two reusable structures + voice +
  reading rules + session checklist + model playbook; `CLAUDE.md` rewritten for the
  force-graph era and the single-window rule; `src/app/opengraph-image.tsx` NEW brand card.

Architecture notes worth knowing:
- Camera moves use `g.zoomToFit(ms, padding, nodeFilter)` **exclusively**. `centerAt()` +
  `zoom()` together snap back — do not reintroduce.
- Content lives in three data files that must stay reconciled: `scenes.ts` (panel copy),
  `nodeContent.ts` (compact windows), `caseStudies.ts` (full case studies).
  `CrawlableContent.tsx` is the server-rendered sr-only mirror — new hrefs must be added
  there AND to `HREF_SCENE` in `ScaleExperience.tsx`.
- Use `m` from `framer-motion` (LazyMotion strict) — never `motion`.
- Known dev-only React 19 StrictMode warning from `react-force-graph-2d`/`react-kapsule`
  ("Cannot update a component while rendering") — library-internal, absent in production.

## 3. Files actively edited (these sessions)

- `src/components/scale/CaseStudyOverlay.tsx` — **THE unified window.** Now takes
  `study? / node? / origin? / onClose / onSelect`; native CSS clip-path circle-reveal via
  `vpRef` + useEffect (see §4); branches `study` (4 sections) vs `node` (facts grid /
  paragraphs / `list` as `<dl>` / note / actions); contains the light-theme `Iceberg`
  component; block switch renders `text | quote | iceberg | gallery`.
- `src/components/scale/NodeWindow.tsx` — **DELETED** (retired; do not recreate).
- `src/data/caseStudies.ts` — added `#it-product` (+ `IcebergModel` interface, `iceberg`
  in the `CaseBlock` union); Seamless kicker → `2024–2025`, 3rd stat `~45 Meeting rooms`.
- `src/data/nodeContent.ts` — added `ContentAction` / `ContentListItem` / `list?`; windows
  for #about, #compass, #contact, #talks, area hubs, #it-product (compact), etc.;
  `IN_PREP` reframed as an invitation; `contentOrder` includes all.
- `src/components/scale/ScaleExperience.tsx` — deleted NodeWindow import; `origin` state;
  single `CaseStudyOverlay` when `caseStudies[selected] || nodeContent[selected]`;
  `HREF_SCENE` extended (#compass, #contact, #touchpoint, #talks, …).
- `src/components/scale/SystemMap.tsx` / `SectionPanel.tsx` — `onSelect(href, origin?)`
  signature; pass `{x: e.clientX, y: e.clientY}` as the reveal origin.
- `src/components/scale/CrawlableContent.tsx` — renders `list` as `<dl>`; email updated.
- `src/hooks/useDialogFocus.ts` — comment now references CaseStudyOverlay only (behaviour
  unchanged: focus in on open, Tab trapped, restored on close).
- `src/lib/systemMap.ts` — satellite nodes → `#compass`; profile hub → `#touchpoint`;
  Talks node added to Beyond.
- `src/app/opengraph-image.tsx` — **NEW** 1200×630 brand card.
- `src/app/layout.tsx` / `globals.css` — email + LinkedIn `sameAs`; secondary text token
  `#63615E` (5.1:1 AA).
- `docs/CONTENT-STANDARDS.md` + `CLAUDE.md` — **NEW / rewritten** (see §2).

Real images: `public/images/Project Images/IT Product Offering/` — Problems-Identified.jpg
(1280×720), Journey-Pain-Points-Light.png (4233×4751), Personas-E2E.png (2056×1436),
Solution-01/02/03. **Corrupt / unusable:** Journey Map.PNG + Workshop-Catalog/Clarity/
Governance.png are 0 KB; Workshop-01/02/03 are byte-identical dupes of Solution-03/02/01 —
routed around with text.

## 4. What was tried and failed (so the next dev doesn't repeat it)

- **framer-motion 12 CANNOT animate `clip-path: circle(r at x y)`.** Its parser
  re-serialises the position to `0% 0%`, so the reveal stuck at `circle(14px at 0% 0%)`
  (a dot in the corner). **Working fix:** drive the reveal with a **native CSS transition**
  in a useEffect — set `clipPath = circle(14px at ox oy)`, `transition = 'clip-path 0.7s
  cubic-bezier(0.16,1,0.3,1)'`, then double-`rAF` → `circle(<coverR>px at ox oy)`, and
  clear to `none` after 760ms. framer only animates opacity on that element. Verified radii
  interpolate 433→791→892px from the click point.
- **Stale JSX parse errors in the dev console** ("Expected '</', got 'm'" at
  CaseStudyOverlay.tsx:364, ×8) are artifacts from an intermediate broken bundle during
  the study/node branch wrapping. `tsc` passes clean and every live flow renders — a
  dev-server restart clears them. Not a real error in the current tree.
- **AskUserQuestion "Other" free-text didn't transmit** (room count, talk URL) twice —
  worked around by Dani typing the value into chat.
- **`centerAt()` + `zoom()` for camera** — unreliable, snaps back. `zoomToFit` only.
- **Synthetic wheel-zoom in preview is imprecise** — verify camera with the rail buttons
  (`nav[aria-label="Areas"] button`), not dispatched WheelEvents.

## 5. Content system (for the next agent writing copy)

All content MUST follow `docs/CONTENT-STANDARDS.md`. In short:
- **Structure A — Projects.** Tier 1 = immersive case study (kicker / title / 1-line
  summary / exactly 4 outcome-led facts / 4 sections: Scenario & result · Why it matters ·
  How we did it · What I learnt / blocks `text|quote|gallery|iceberg`). Tier 2 = compact
  window on the same surface (question-first, ≤2 short paras, optional 4 facts, `IN_PREP`
  for live work). Area hubs never dead-end in a lone project.
- **Structure B — Daniel Irala.** #about (4 credentials + 4 paras + Contact action);
  #compass (six one-liners via `list`, never six thin windows); #contact (2 paras +
  Email/Book/LinkedIn); #talks (lead with the tension, talk via `list`).
- **Voice:** warm but precise, active, no fluff; name Nestlé IT openly; every window ends
  somewhere (a node, an action, or an invitation); no paragraph over ~3 sentences, no
  window over ~150 words.

## 6. Next step

**The standing next step is: commit + deploy.** Roughly **five sessions of verified work
are uncommitted** on `feat/zoom-scale` at `C:\Users\PcCom\daniel-irala-portfolio` (repo
`iralastudio/daniel-irala-portfolio`; `main` still has the old metro build). This is the
biggest risk — the work only lives in the working tree.

1. `git status` / `git diff`, then commit on `feat/zoom-scale`. Suggested message:
   _"feat: unified window system (circle reveal) + IT Product Offering case study +
   content standards; retire NodeWindow."_
2. Push; confirm Vercel deploys; spot-check irala.studio at desktop + 375px.
3. Fill the portfolio URL into the resume once the live URL is confirmed
   (`C:\Users\PcCom\Documents\Dani Professional Plan\Daniel.Irala_Resume2026_WIP.txt`).

**Awaiting Dani (do not deploy the drafts as final without his sign-off):**
- Review the **#compass** six one-liners and the **Beyond / #talks** positions (drafted in
  his voice).
- Provide the **Si Design Hub talk recording URL** (currently a pending note in #talks).

**Backlog (only if Dani asks):**
- HADO healthcare dual-perspective story — his strongest brand asset, still absent from the
  site.
- Favicon; depth-signalling rings on case-study nodes; first-load choreography.
- "Research Findings & Data Visualization" image for IT Product (Dani marked "coming soon").
