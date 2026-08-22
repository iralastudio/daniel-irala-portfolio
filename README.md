# irala.studio

Portfolio of Daniel Irala — Senior Design Researcher and Service Designer at Nestlé IT, based in Barcelona.

The site is not a page stack. It is an **Obsidian-style force-directed "system map"**: Daniel at the centre, four scales orbiting as clusters — Touchpoint, Team, Organisation, Beyond. You zoom and pan freely; clicking a node opens its content on a frosted-glass surface while the map stays visible behind it.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 — tokens in `globals.css` via `@theme` |
| Animation | Framer Motion 12, `LazyMotion` strict |
| Graph | `react-force-graph-2d` on canvas + `d3-force` |
| Deploy | Vercel |

## Getting started

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at http://localhost:3000.

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check |

## How it fits together

Everything a visitor sees lives in `src/components/scale/` and `src/data/`.

- **`ScaleExperience.tsx`** — the orchestrator. Desktop gets a full-bleed map, a frosted left panel and a right rail. Below 768px, or when reduce-motion is set, it switches to **stacked mode**: snap-scrolling sections with a thumb-bar nav, and the map drops back to a muted backdrop. It also owns the URL contract, so windows are deep-linkable and the browser Back button behaves.
- **`SystemMap.tsx`** — the canvas graph. Deliberately `aria-hidden` and pointer-only; keyboard users reach the same content through the rail and panel links.
- **`CaseStudyOverlay.tsx`** — the single content window for every node click, whether that is a full case study or a short node entry. It opens with a clip-path circle reveal growing from the point you clicked.
- **`CrawlableContent.tsx`** — a server-rendered, screen-reader-only mirror of every window, so the content is indexable and available before hydration.
- **`src/lib/systemMap.ts`** — builds the graph with a seeded layout, so the map is deterministic across reloads and SSR.

Content lives in three files: `scenes.ts` (panel copy per scale), `nodeContent.ts` (short windows) and `caseStudies.ts` (full case studies).

## Contributing to this repo

Read **`CLAUDE.md`** first. It records the decisions that are settled and the invariants that hold the design together — always import `m` rather than `motion`, use `ActionPill` for every pill control, keep `CrawlableContent` in sync when content changes. Violating one of those is a regression even when the result looks fine.

`docs/CONTENT-STANDARDS.md` covers voice and structure for anything that adds copy.

Several directories are **dead code kept only for reference** — `metro/`, `modal/`, `content/`, `experiments/`, `layout/`. None is reachable from `src/app/page.tsx`. Do not extend them or cite them as precedent.

## Licence

No open licence. The code and the written content are Daniel Irala's; project work shown in the case studies is published with the relevant permissions. Please ask before reusing.
