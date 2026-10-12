// Full, immersive case studies — opened from a project node, rendered over the
// live map on the single frosted-glass window (CaseStudyOverlay). Only projects
// with real, verified substance live here; lighter nodes render their
// nodeContent on the SAME surface. Real facts only — no fabrication.

import type { ContentFact } from './nodeContent';

export interface CaseFigure {
    src: string;
    alt: string;
    caption?: string;
    w: number;
    h: number;
}

export interface IcebergModel {
    prompt: string;                                   // the framing question
    above: { title: string; note: string };           // the visible symptom
    below: { n: string; title: string; note: string }[]; // the hidden causes
    outOfScope?: string[];                             // deliberately parked
}

// A shared maturity axis with one row per workstream — for programmes running
// several tracks at once, at genuinely different speeds. Real numbers where a
// track has them (`metrics`); an honest, visible placeholder where it doesn't
// (`pending`) — never both, and never a metric invented to fill the gap.
export interface RoleTrackModel {
    prompt: string;
    stages: string[];
    rows: {
        role: string;
        stageIndex: number;
        status: string;
        metrics?: { value: string; label: string }[];
        pending?: string;
    }[];
}

// A hand-off chain: each link consumes what the previous one produced. Used only
// where the argument IS the sequence, so the picture carries the claim faster
// than the paragraph can.
export interface ChainModel {
    prompt: string;
    steps: { role: string; hands: string }[];
    note?: string;
}

// One shared problem seen from several vantage points. Rows are the shared thing,
// columns are the populations it surfaces in. Earns its place only when the point
// is that the SAME gap wears different clothes per role; otherwise it is a table.
export interface MatrixModel {
    prompt: string;
    columns: string[];
    rows: { n: string; gap: string; cells: string[] }[];
    note?: string;
}

// Paired before/after numbers from a controlled change. `better` states which
// direction is good, so the bar and the arrow agree with the story instead of
// leaving the reader to work out whether down is a win. `pct` drives bar width
// only; it is presentation, never a claim.
export interface SwingModel {
    prompt: string;
    pairs: {
        label: string;
        from: { value: string; pct: number };
        to: { value: string; pct: number };
        better: 'higher' | 'lower';
        note?: string;
    }[];
    note?: string;
}

// Ordered content blocks let each section interleave copy, pull-quotes,
// imagery, and diagrams exactly where they belong — editorial, not a rigid
// template.
export type CaseBlock =
    | { kind: 'text'; text: string }
    | { kind: 'quote'; text: string }
    | { kind: 'gallery'; items: CaseFigure[] }
    | { kind: 'iceberg'; model: IcebergModel }
    | { kind: 'roletrack'; model: RoleTrackModel }
    | { kind: 'chain'; model: ChainModel }
    | { kind: 'matrix'; model: MatrixModel }
    | { kind: 'swing'; model: SwingModel };

export interface CaseSection {
    n: string;          // "01"
    heading: string;
    blocks: CaseBlock[];
}

export interface CaseStudy {
    href: string;       // matches the node href
    kicker: string;     // "Organisation · Nestlé IT · 2024"
    positioning?: string;// the one-line framing (e.g. first project of a new team)
    title: string;
    summary: string;
    facts: ContentFact[];
    sections: CaseSection[];
}

const SEAMLESS_IMG = '/images/Project Images/Seamless Conferencing';
const ITPO_IMG = '/images/Project Images/IT Product Offering';

export const caseStudies: Record<string, CaseStudy> = {
    '#digital-agent': {
        href: '#digital-agent',
        kicker: 'Touchpoint · Nestlé IT · 2026',
        title: 'Digital Agent · usability testing',
        summary:
            "Moderated testing of an internal AI agent against a real go or no-go bar, which found that the model underneath it was a design decision, not an implementation detail.",
        facts: [
            { value: '12', label: 'Moderated sessions' },
            { value: '5/9', label: 'Use cases cleared' },
            { value: '73%', label: 'Go rate, from 33%' },
            { value: '86%', label: 'Fewer wrong answers' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "Nestlé IT built a Digital Agent for Relationship Managers, the people who sit between the markets and global IT. Before it went anywhere near a wider rollout, someone had to answer a plain question for the CIO's office: is this ready to go live, fully or conditionally? Not whether the demo works. Whether it holds up with real people doing real tasks.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The answer was a conditional go. Five of the nine tested use cases cleared the bar. The rest came back with a specific list rather than a vague verdict: 39 open content items to fold into the knowledge base, and six integration gaps to close first. A conditional go with a named list of blockers is a more useful result than a yes, because it tells the build team exactly what to do on Monday.",
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: "Same use cases, same script, same kind of people, different model underneath. The result doubled. The interface was never the whole story.",
                    },
                    {
                        kind: 'swing',
                        model: {
                            prompt: 'One variable changed between rounds. This is what moved.',
                            pairs: [
                                {
                                    label: 'Go rate',
                                    from: { value: '33%', pct: 33 },
                                    to: { value: '73%', pct: 73 },
                                    better: 'higher',
                                    note: 'Share of tested use cases clearing the readiness bar.',
                                },
                                {
                                    label: 'Confidently wrong sessions',
                                    from: { value: '7', pct: 100 },
                                    to: { value: '1', pct: 14 },
                                    better: 'lower',
                                    note: 'Sessions where the agent gave a wrong answer without flagging any doubt.',
                                },
                            ],
                            note: 'Same nine use cases, same task script, same participant profile. Only the model underneath the agent was different.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "Between the first and second rounds of testing, the model powering the agent was swapped and nothing else moved. Beyond the two numbers above, ease of use scored a perfect 7 out of 7, and people hit roughly four times as many moments of value per session as they had with the earlier version.",
                    },
                    {
                        kind: 'text',
                        text:
                            "None of that came from a cleverer prompt. It came from treating the model underneath the agent as a design decision with measurable consequences, and testing it the way you would test a journey or a screen: real people, a scoring rubric, and a bar agreed in advance.",
                    },
                ],
            },
            {
                n: '03',
                heading: 'How we did it',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "Twelve moderated one-to-one sessions with Relationship Managers across three zones, each running real tasks against the nine use cases in scope. Scoring used a Go/No-Go rubric built to weight readiness rather than collect impressions. The rubric is the part that matters. Without a bar agreed before anyone sits down, agent testing collapses into an argument about whether an answer was good enough, and the loudest person in the room wins it.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The most useful thing to come out of the round was a way to tell three failures apart that a frustrated user experiences as one and the same.",
                    },
                    {
                        kind: 'matrix',
                        model: {
                            prompt: 'Three failures, one symptom. Telling them apart is most of the job.',
                            columns: ['What the user sees', 'What it actually is', 'What fixes it'],
                            rows: [
                                {
                                    n: '01',
                                    gap: 'Content gap',
                                    cells: [
                                        'The agent could not answer.',
                                        'The knowledge base never held that answer.',
                                        'Add the content. A librarian problem.',
                                    ],
                                },
                                {
                                    n: '02',
                                    gap: 'Accuracy failure',
                                    cells: [
                                        'The agent could not answer.',
                                        'It held the content and still got it wrong.',
                                        'Reground and retest. A trust problem.',
                                    ],
                                },
                                {
                                    n: '03',
                                    gap: 'Fabrication on tool failure',
                                    cells: [
                                        'A confident, plausible answer.',
                                        'It could not reach the system and answered anyway.',
                                        'Make it say it could not check. A safety problem.',
                                    ],
                                },
                            ],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "Reported under a single accuracy score, all three look the same, and they need completely different fixes and completely different messaging to leadership. The third deserves naming plainly in executive updates rather than being folded into a number. It is the failure mode most likely to destroy trust the first time it happens in front of a real user rather than a moderator.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The round left two reusable assets behind as well, one for synthesis and one for reporting, so the next wave of testing does not start from a blank page.",
                    },
                ],
            },
            {
                n: '04',
                heading: 'What I learnt',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "The model underneath an agent is a design decision, not an implementation detail. I suspected that going in and now have a number for it. A go rate that doubles on the same use cases, the same script and the same participants, with only the model changed, means most of what people experience as interface quality was coming from somewhere else entirely.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The other lesson is about how you report a failure. Telling leadership the agent is 78% accurate gives them nothing they can act on. Telling them it invents an answer when it cannot reach a system tells them what to fix and what it costs if they do not. Testing an agent is as much about building the vocabulary to describe how it fails as it is about measuring whether it works.",
                    },
                ],
            },
        ],
    },
    '#it-product': {
        href: '#it-product',
        kicker: 'Organisation · Nestlé IT · 2025',
        title: 'E2E IT Product Offering',
        summary:
            'Redesigning how a 270,000-person enterprise discovers, evaluates, and adopts its own IT, from a catalog no one trusted to a governed, end-to-end offering.',
        facts: [
            { value: '40+', label: 'In-depth interviews' },
            { value: '70+', label: 'Survey responses' },
            { value: '58%', label: 'Reported shadow initiatives' },
            { value: '6', label: 'Challenges prioritised' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'Nestlé IT ran hundreds of IT products globally, but markets often couldn’t find them, didn’t trust them, and built their own instead. The catalog was incomplete and overly technical. Approval spanned five governance layers with no clear decision rights. And 58% of stakeholders reported shadow initiatives emerging whenever alignment broke down. The result was duplicated investment, eroding trust in central IT, and slower digital acceleration.',
                    },
                    {
                        kind: 'iceberg',
                        model: {
                            prompt: 'If nothing changes beneath the surface, what patterns keep showing up above it?',
                            above: { title: 'IT Solutions Adoption', note: 'Low adoption and trust in the IT offering' },
                            below: [
                                { n: '01', title: 'Alternative Technology Solutions', note: 'Markets bypass standard IT channels. Slow governance and unclear ownership push them toward faster, local alternatives.' },
                                { n: '02', title: 'Product Catalog & Information Discovery', note: 'IT service information is fragmented, overly technical, and hard to find, which erodes adoption and trust.' },
                                { n: '03', title: 'Unclear Funding / Ownership', note: 'Blurred boundaries between IT and business funding responsibilities delay innovation and create confusion.' },
                                { n: '04', title: 'Governance Process Efficiency', note: 'Governance is layered and slow, with unclear decision rights.' },
                            ],
                            outOfScope: ['BRM / FRM role clarity & implementation consistency', 'Market representation & voice'],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'By the close, the enterprise had a single, evidence-based view of the full offering journey: how a market raises a request, and how a solution is then found, funded, and adopted. That map became a strategic input for sizing AI and automation opportunities across IT workflows, and its insights went straight into the APM intake process, so real user friction now shapes how new solutions enter the ecosystem. Journey Management was established as a repeatable model the organisation could reuse.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: 'The problem was never the products. It was that the system had no shared way to find, evaluate, or fund them.',
                    },
                    {
                        kind: 'text',
                        text:
                            '54% of people relied on personal networks and informal channels over the official catalog. Only 25% felt delivery pace met business needs. 66% found the approval path hard to navigate. Markets weren’t rejecting IT solutions. They couldn’t see them, and when they could, they couldn’t get them fast enough.',
                    },
                    {
                        kind: 'text',
                        text:
                            'That reframed the brief from “improve the catalog” to “redesign the whole offering experience, discovery through governance to adoption.” Six systemic challenges surfaced with high confidence: discoverability relied on workarounds, urgent demand dominated intake, roadmap visibility was weak, delivery felt too slow, planning cycles were misaligned, and shadow initiatives filled the gaps.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Problems-Identified.jpg`, alt: 'Matrix of selected pain points paired with solution directions across three themes (catalog and information discovery, governance process efficiency, and alternative technology solutions), with prioritised items highlighted', caption: 'Selected pain points paired with solution directions; bordered items were prioritised in the workshop', w: 1280, h: 720 },
                        ],
                    },
                ],
            },
            {
                n: '03',
                heading: 'How we did it',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'As Lead Design Researcher and Service Designer, I owned research strategy, synthesis, journey mapping, and facilitation end to end. That meant designing the instruments, running statistical sample sizing at 95% confidence, and mentoring a graduate researcher while aligning with the Product Owner.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The evidence base: 40+ interviews across Business Relationship Managers, Functional Relationship Managers, Product Owners, and market stakeholders, plus a 70+ response survey. I distilled it into six high-confidence insight cards linking cause, evidence, and business impact, then diagnosed twelve pain points and prioritised six for intervention.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I mapped the full end-to-end journey, from demand intake through qualification, decision-making, and request to deployment and roll-out. From that I named three Moments That Matter (Decision Velocity, Priority at Intake, and Findability at Discovery) and built a stakeholder map across the Business and IT layers.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Journey-Pain-Points-Light.png`, alt: 'End-to-end IT product offering journey across four stages (Trigger, Understand, Initiate, and Complete or Roll Out), with a full grid of pain points mapped beneath each stage', caption: 'The end-to-end offering journey, demand intake to roll-out, with pain points mapped across every stage', w: 4233, h: 4751 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'Four enterprise personas grounded the work in real behaviour: The Market Intermediary, The Business Requestor, The Global Product Steward, and The Governance Gatekeeper. Each has its own pains, needs, and mental models.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Personas-E2E.png`, alt: 'Four enterprise personas (the Market Intermediary, the Business Requestor, the Global Product Steward, and the Governance Gatekeeper), each with background, core responsibilities, behaviours and mental models, pains, and needs', caption: 'Four enterprise personas, from Market Intermediary to Governance Gatekeeper', w: 2056, h: 1436 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'I then facilitated a three-session stakeholder workshop, research sharing then ideation then planning, which produced prioritised solutions with clear ownership, success metrics, and roadmaps. Together the core team defined the future-state vision: Discoverability over Complexity, Clarity over Ambiguity, Efficiency over Redundancy, Transparency over Opacity, and Seamless Experience over Fragmentation. AI and automation readiness was a stakeholder non-negotiable, so it went in as a design requirement from the start.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Solution-03.png`, alt: 'Co-created solution workspace for a trusted, complete, and connected IT Product Catalog, with how-might-we framing, minimum-change experiments, success metrics, a roadmap, and a RACI matrix', caption: 'Solution board: a trusted, complete, connected IT Product Catalog (discoverability)', w: 8170, h: 4003 },
                            { src: `${ITPO_IMG}/Solution-01.png`, alt: 'Co-created solution workspace for clearer governance, covering defined roles, simple gates, and one visible investment path, with an experiment card and RACI matrix', caption: 'Solution board: clear roles, simple gates, one visible path in governance', w: 9204, h: 7764 },
                            { src: `${ITPO_IMG}/Solution-02.png`, alt: 'Co-created solution workspace for shared standards and formal problem framing, with minimum-change experiments, success metrics, and a roadmap', caption: 'Solution board: clarity first, shared standards and formal problem framing', w: 8149, h: 3993 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'Finally, I connected directly with the owner of each prioritised solution to test feasibility, define dependencies, and validate scope. Then I built the roadmap by back-casting from the future state, working backwards to the concrete steps, sequencing, and ownership needed to reach it.',
                    },
                ],
            },
            {
                n: '04',
                heading: 'What I learnt',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'Governance isn’t a constraint to design around. It is the design challenge itself. When people bypass the system, the answer isn’t more control, it’s making the right path the easiest path.',
                    },
                    {
                        kind: 'text',
                        text:
                            'It also showed how far evidence travels when it’s framed as a system. The same journey map that diagnosed the problem became the input for AI-use-case sizing and for redesigning the intake process. One well-mapped journey turned out to be enough to align product, process, and automation teams around a single shared reality.',
                    },
                ],
            },
        ],
    },
    '#it-key-roles': {
        href: '#it-key-roles',
        kicker: 'Organisation · Nestlé IT · 2026',
        positioning: 'Three roles studied as one chain, not three separate populations',
        title: 'IT Key Roles Journey Atlas',
        summary:
            "Mapping what the three roles that run enterprise IT actually do all day, then reading their problems against each other to find out where a single AI agent could genuinely help all three.",
        facts: [
            { value: '4 of 33', label: 'Opportunities selected to build' },
            { value: '1', label: 'Agent, not three role tools' },
            { value: '3', label: 'Roles mapped as one chain' },
            { value: '20+', label: 'Interviews and sessions' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "Leadership decided that transforming Nestlé IT would start with the experience of the people inside it, and that the first move would be an AI assistant built for three roles. Relationship Managers, who sit between the markets and global IT. Product and Programme Managers, who own delivery across the product lifecycle. Architects, who govern design and standards. The brief that reached research was not to go and find some AI use cases. It was to establish what these roles actually do, where the work breaks, and which of those breaks an agent can honestly fix.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The obvious way to run that is three studies. We ran one. The three roles are consecutive links in the same chain. Run them separately and you get three tool wishlists. Run them as a system and you find out where their problems are the same problem wearing different clothes.",
                    },
                    {
                        kind: 'chain',
                        model: {
                            prompt: 'What does each role hand to the next?',
                            steps: [
                                { role: 'Relationship Manager', hands: 'Consolidates what the markets are asking for into one zone-level demand.' },
                                { role: 'Product Manager', hands: 'Turns that demand into a roadmap and a prioritisation call.' },
                                { role: 'Architect', hands: 'Inherits both as a design and governance constraint.' },
                            ],
                            note: 'A weakness in one link lands on the next. Demand that arrives un-consolidated becomes noisy prioritisation, which becomes architectural rework that surfaces late and costs the most to undo.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "By August 2026 the programme had three validated journey atlases, three pain-point libraries traceable back to source, and a scored opportunity backlog for each role. Thirty-three opportunities were scored across the Relationship Manager and Product Manager tracks, and four came out of that selected to build, now queued to go into the Digital Agent itself. Nothing has shipped yet and the architect track is still in detailing, so this is a decision record rather than a results record. The finding that shaped the product direction did not come from any single role, though. It came from reading the three backlogs against each other.",
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: "Not every friction point is something an agent can fix. Some of it is a missing rule, and no amount of AI makes up for a rule that nobody has written yet.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Three capability gaps turned up in all three roles, wearing different clothes each time. Read across a row and it is one problem, not three.",
                    },
                    {
                        kind: 'matrix',
                        model: {
                            prompt: 'The same three gaps, seen from three desks.',
                            columns: ['Relationship Manager', 'Product Manager', 'Architect'],
                            rows: [
                                {
                                    n: '01',
                                    gap: 'Find what exists',
                                    cells: [
                                        'Has another market already solved this, or already tried and dropped it?',
                                        'How is this product actually doing, and where does it land locally?',
                                        'Is there a building block to reuse instead of designing this again?',
                                    ],
                                },
                                {
                                    n: '02',
                                    gap: 'Frame the request',
                                    cells: [
                                        'Consolidate scattered regional requirements into one credible ask.',
                                        'Shape demand into something estimable and fundable.',
                                        'Author an architecture document that will survive review.',
                                    ],
                                },
                                {
                                    n: '03',
                                    gap: 'Navigate the process',
                                    cells: [
                                        'Grey-zone ownership, and when to escalate.',
                                        'Compliance, contracts and procurement.',
                                        'Governance forums, approvals and chasing approvers.',
                                    ],
                                },
                            ],
                            note: 'This is the correlation the programme was run to find. It is also the reason the answer is one agent rather than three role tools.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "That reframed the product. Three roles asking for three tools becomes one agent with three shared capabilities, which is a different investment case and a different design problem. It also gave leadership a value narrative rather than a complaint list, which is usually the difference between research that gets funded and research that gets filed. The gap that scored highest of all, discovering whether something already exists somewhere in the organisation, is now one of the four opportunities selected to build.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Underneath all three sat the same root cause, and it was not a technology gap. Knowledge lives in people rather than in systems, so the answer you get depends on who you happen to ask. Fragmented tooling makes it worse: the pieces of any given answer sit in half a dozen platforms that cannot be queried together. An agent grounded in that inherits all of it, which is why data quality kept surfacing as the prerequisite rather than the nice-to-have.",
                    },
                ],
            },
            {
                n: '03',
                heading: 'How we did it',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "As lead design researcher and service designer I owned the arc end to end across all three roles: the journey atlas hypotheses and the personas, the interviews, the co-creation and opportunity-shaping sessions, the pain-point libraries and their provenance, the translation from pain into scored opportunity, and the cross-role correlation that tied the three backlogs into one story.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Every role went through the same arc, which is what makes the three comparable at the end. Build a journey hypothesis from job profiles and desk research, validate it with practitioners, rate each stage on reach, effort and frequency to decide where to dig, then interview and co-create at task level to surface pain points and trace each one back to a root cause. What comes out is not a findings deck. Each role got a journey atlas drawn across three levels of detail with a persona beside it, and that is the artefact the organisation goes on operating: teams point at it, argue with it, and reuse it long after the study closes.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Every pain point carries its stage, its job to be done, a severity and a verbatim quote, so a claim can be walked back to its source when a steering committee pushes on it. Opportunities were then clustered into areas and scored on desirability, viability and feasibility, five-point scales with defined sub-criteria. Missing evidence lowers a score rather than being waved through, which is the part that keeps the exercise honest. Thirty-three opportunities were scored this way across the Relationship Manager and Product Manager tracks.",
                    },
                    {
                        kind: 'roletrack',
                        model: {
                            prompt: "Same programme, three different clocks. Where each role actually stands, not where a roadmap slide says it stands.",
                            stages: ['Journey atlas', 'Pain points', 'Opportunity scoring', 'Signed off'],
                            rows: [
                                {
                                    role: 'Relationship Managers',
                                    stageIndex: 3,
                                    status: 'Atlas validated, pain points clustered into five opportunity areas, nine opportunities scored and three selected to build. Signed off in July 2026, with a deliberate strategy of expanding around one anchor and reusing shared components.',
                                    metrics: [
                                        { value: '5', label: 'opportunity areas' },
                                        { value: '9', label: 'opportunities scored' },
                                        { value: '3', label: 'selected to build' },
                                    ],
                                },
                                {
                                    role: 'Product & Programme Managers',
                                    stageIndex: 3,
                                    status: 'Journey validated across eight interviews, then a workshop that clustered six opportunity areas and twenty-four opportunities. One anchor opportunity selected in July 2026, sited where delivery work already happens rather than in a new tool.',
                                    metrics: [
                                        { value: '6', label: 'opportunity areas' },
                                        { value: '24', label: 'opportunities scored' },
                                        { value: '1', label: 'anchor selected' },
                                    ],
                                },
                                {
                                    role: 'Architects',
                                    stageIndex: 2,
                                    status: 'Survey, interviews and two rounds of co-creation across the architecture community. Forty pain points validated, with the backlog concentrating on the architecture review process.',
                                    pending: 'Scored results: not yet, opportunity detailing is still running',
                                },
                            ],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "One boundary is worth recording, because it shows where the programme drew its line. People management surfaced in the Product Manager work as real, repeated friction, and it was mapped rather than quietly dropped. It was then deliberately left out of the opportunity set: the remit here was IT for IT, and capability building and people management sit within HR's own transformation work, so the same line was held for Architects and Relationship Managers too. Knowing what not to design is part of the job.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Relationship Managers sit between the markets and global IT, so their real job is to tell one credible story about what a zone needs. They could not. Requirements, market data and roadmap decisions lived in different systems, so shared demand stayed invisible and kept breaking back apart into isolated market requests. Five opportunity areas came out of that work, with nine scored opportunities under them.",
                    },
                    {
                        kind: 'quote',
                        text: "To know what exists, what we have and what we don't, in order not to reinvent the wheel. A market has already done that analysis.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The three selected were not the three highest scores. They were chosen because together they cover the journey end to end and pay off past the role itself, reaching business relationship managers, portfolio managers and leadership. That is a service design call rather than a ranking exercise: what matters is what the set does as a system, not which card wins on its own. The portfolio read that came with it was blunt, and worth repeating to anyone hoping for a fast win. There are no pure quick wins in the set, and data quality, governance and process standardisation are all bigger constraints than the technology.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Architects are a bottleneck by design, which is the polite way of saying work queues behind them while their time goes on late, document-heavy reviews. Of forty validated pain points, around a quarter concentrate on the architecture review process and the forums around it. Half of the forty are gaps rather than faults: the structure exists, but nobody has filled in the reusable content, so every architect rebuilds from scratch.",
                    },
                    {
                        kind: 'quote',
                        text: "The review takes so much time. If they have to read a two-hundred-page document every time, they are not spending that time on design itself.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The guardrail the architects set stayed in the write-up: no full automation of the architecture review, because compliance-critical steps need a human on them. The opportunity is to restructure how the document gets authored, holding it as fields to answer instead of a blank page, and to pre-check a draft against standards before it reaches review. It does not approve anything.",
                    },
                ],
            },
            {
                n: '04',
                heading: 'What I learnt',
                blocks: [
                    {
                        kind: 'quote',
                        text: "A security agent is only ever as good as the security standard behind it. If that standard does not exist yet, the problem is not an AI problem. It is a policy problem wearing an AI costume.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The most useful move in the whole programme was not a research technique, it was a naming convention: tagging every opportunity as either an AI opportunity or a policy opportunity. It stops a backlog quietly filling with automation ideas that cannot ship because the rule they depend on does not exist. It also gives leadership a fair way to fund process fixes without dressing them up as AI work to get the budget released.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Studying the roles as a chain rather than a set is what produced the finding worth having. Three separate studies would have delivered three credible backlogs and missed the point, which is that the same three gaps run through all of them. The correlation was the deliverable. The individual atlases were the raw material.",
                    },
                    {
                        kind: 'text',
                        text:
                            "What is still missing is the last link, and I would rather say so than round it up. None of this has been measured after deployment. Estimated value is not demonstrated value, and until the prioritised use cases ship and get measured against a baseline, that stays an open item rather than a result.",
                    },
                ],
            },
        ],
    },
    '#seamless': {
        href: '#seamless',
        kicker: 'Organisation · Nestlé IT · 2024–2025',
        title: 'E2E Seamless Conferencing Experience',
        summary:
            'Designing the connective tissue of how 270,000+ people meet, and standing up a new discipline to own it.',
        facts: [
            { value: '270k+', label: 'Employees reached' },
            { value: '+10%', label: 'Tech faults detected' },
            { value: '~45', label: 'Meeting rooms impacted' },
            { value: 'Canada', label: 'First launch market' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "Nestlé's 270,000+ employees ran on meetings, yet the experience was fragmented and no single team owned it end to end. Technical performance, employee sentiment, and operational signals each lived in their own silo, so leadership couldn't see what people actually experienced from scheduling to follow-up, let alone where to invest.",
                    },
                    {
                        kind: 'text',
                        text:
                            'By the close, the organisation could see the full meeting journey in one connected view for the first time, with telemetry, sentiment, and pain points together. Two interventions shipped in the Canada market: a meeting-room tagging system and a new in-room post-meeting survey. The survey opened a feedback loop that lifted detection of malfunctioning room technology by 10%. Experience-Level Agreements (XLAs) moved from theory into practice, the OCIO endorsed the method to scale, and the work defined how the new Journey Management team operates.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: "The problem wasn't meetings. It was that no one owned the experience across them.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Four teams each optimised their own piece: collaboration tools, conference rooms, IT support, facilities. But employees lived meetings as one continuous journey, and the friction sat at the seams between touchpoints, not inside any single tool. The booking system didn't speak to the room equipment, IT support had no meeting context, and post-meeting content scattered with no source of truth.",
                    },
                    {
                        kind: 'text',
                        text:
                            "That reframe shifted the work from “fix the tools” to “design the connective tissue between them.” As the Journey Management team's first project, it had to prove the discipline itself: that connected data leads to trusted decisions, that experience-driven measurement beats raw technical KPIs, and that one journey, mapped well, becomes a repeatable model for every journey after it.",
                    },
                ],
            },
            {
                n: '03',
                heading: 'How we did it',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'As Lead Design Researcher and Service Designer, I owned the research strategy end to end: synthesising prior studies, running 25 in-depth interviews across 5 global zones, and validating pain points with a 322-response survey, for a 347-participant evidence base leadership could trust.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I mapped the current-state journey across four personas, from a marketing manager running hybrid workshops to a factory operator who relies on auto-subtitles for accessibility, plus an IT and Facilities backstage layer. For the first time, the structural disconnects were visible in a single picture.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${SEAMLESS_IMG}/Journey 1.PNG`, alt: 'Front-stage current-state journey map showing personas, touchpoints, and pain points across the meeting lifecycle', caption: 'As-is journey, front-stage: personas across the meeting lifecycle', w: 976, h: 485 },
                            { src: `${SEAMLESS_IMG}/Journey 2.PNG`, alt: 'Continuation of the current-state journey map with further personas and cross-cutting friction points', caption: 'As-is journey, continued: cross-cutting friction at the seams', w: 797, h: 447 },
                            { src: `${SEAMLESS_IMG}/Journey Back end.PNG`, alt: 'Backstage journey map of IT and Facilities operations supporting the meeting experience', caption: 'Backstage layer: the IT & Facilities operations behind every meeting', w: 796, h: 446 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'Using a backcasting model, I facilitated envisioning workshops where stakeholders agreed a shared vision and co-created a future-state journey organised around three phases: before, during, and after the meeting. We then prioritised it into a roadmap scored on feasibility, ownership, and tool dependencies.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${SEAMLESS_IMG}/Approach.PNG`, alt: 'Backcasting model diagram: moving from current challenges through strategic decisions to the future vision', caption: 'Backcasting: designing from the future state backward', w: 794, h: 447 },
                            { src: `${SEAMLESS_IMG}/Envision Journey.PNG`, alt: 'Future-state journey map organised into before, during, and after the meeting with integrated touchpoints', caption: 'Future-state journey: before, during, after, with integrated touchpoints', w: 798, h: 449 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'The DEX (Digital Employee Experience) Framework, applied here for the first time, integrated technical, operational, and experiential data into a single view, naming the moments that matter and the indicators that track them.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Two insights went all the way to delivery, both launched first in the Canada market. A room-tagging system built into Outlook let employees search and filter meeting rooms by setup and equipment, a direct fix for one of the most common points of friction in finding the right room. And a short post-meeting survey, triggered in the room itself, created an entirely new stream of experience data. Inside that loop, detection of malfunctioning meeting-room technology rose by 10%.',
                    },
                ],
            },
            {
                n: '04',
                heading: 'What I learnt',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'The most impactful intervention wasn’t a new feature. It was helping the organisation see its own experience as one connected system rather than a collection of tools owned by separate teams.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I also learnt that standing up a new discipline is as much facilitation as research. The value came from getting teams that had never shared a data model to align around a single journey, then leaving them with a way of working they could repeat long after the project closed.',
                    },
                ],
            },
        ],
    },
};
