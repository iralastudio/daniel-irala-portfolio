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

// Ordered content blocks let each section interleave copy, pull-quotes,
// imagery, and diagrams exactly where they belong — editorial, not a rigid
// template.
export type CaseBlock =
    | { kind: 'text'; text: string }
    | { kind: 'quote'; text: string }
    | { kind: 'gallery'; items: CaseFigure[] }
    | { kind: 'iceberg'; model: IcebergModel }
    | { kind: 'roletrack'; model: RoleTrackModel };

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
    '#it-product': {
        href: '#it-product',
        kicker: 'Organisation · Nestlé IT · 2025',
        title: 'E2E IT Product Offering',
        summary:
            'Redesigning how a 270,000-person enterprise discovers, evaluates, and adopts its own IT — from a catalog no one trusted to a governed, end-to-end offering.',
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
                            'Nestlé IT ran hundreds of IT products globally — but markets often couldn’t find them, didn’t trust them, and built their own instead. The product catalog was incomplete and overly technical, approval spanned five governance layers with no clear decision rights, and 58% of stakeholders reported shadow initiatives emerging whenever alignment broke down. The result: duplicated investment, eroding trust in central IT, and slower digital acceleration.',
                    },
                    {
                        kind: 'iceberg',
                        model: {
                            prompt: 'If nothing changes beneath the surface, what patterns keep showing up above it?',
                            above: { title: 'IT Solutions Adoption', note: 'Low adoption and trust in the IT offering' },
                            below: [
                                { n: '01', title: 'Alternative Technology Solutions', note: 'Markets bypass standard IT channels — slow governance and unclear ownership push them toward faster, local alternatives.' },
                                { n: '02', title: 'Product Catalog & Information Discovery', note: 'IT service information is fragmented, overly technical, and hard to find — eroding adoption and trust.' },
                                { n: '03', title: 'Unclear Funding / Ownership', note: 'Blurred boundaries between IT and business funding responsibilities delay innovation and create confusion.' },
                                { n: '04', title: 'Governance Process Efficiency', note: 'Governance is layered and slow, with unclear decision rights.' },
                            ],
                            outOfScope: ['BRM / FRM role clarity & implementation consistency', 'Market representation & voice'],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'By the close, the enterprise had a single, evidence-based view of the full offering journey — from how a market raises a request to how a solution is found, funded, and adopted. That map became a strategic input for sizing AI and automation opportunities across IT workflows, and its insights were embedded directly into the APM intake process so real user friction now shapes how new solutions enter the ecosystem. Journey Management was established as a repeatable model the organisation could reuse.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: 'The problem wasn’t the products — it was that the system had no shared way to find, evaluate, or fund them.',
                    },
                    {
                        kind: 'text',
                        text:
                            '54% of people relied on personal networks and informal channels over the official catalog. Only 25% felt delivery pace met business needs. 66% found the approval path hard to navigate. Markets weren’t rejecting IT solutions — they couldn’t see them, and when they could, they couldn’t get them fast enough.',
                    },
                    {
                        kind: 'text',
                        text:
                            'That reframed the brief from “improve the catalog” to “redesign the entire offering experience — discovery through governance to adoption.” Six systemic challenges surfaced with high confidence: discoverability relied on workarounds, urgent demand dominated intake, roadmap visibility was weak, delivery felt too slow, planning cycles were misaligned, and shadow initiatives filled the gaps.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Problems-Identified.jpg`, alt: 'Matrix of selected pain points paired with solution directions across three themes — catalog and information discovery, governance process efficiency, and alternative technology solutions — with prioritised items highlighted', caption: 'Selected pain points paired with solution directions; bordered items were prioritised in the workshop', w: 1280, h: 720 },
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
                            'As Lead Design Researcher and Service Designer, I owned research strategy, synthesis, journey mapping, and facilitation end to end — designing the instruments, running statistical sample sizing at 95% confidence, and mentoring a graduate researcher while aligning with the Product Owner.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The evidence base: 40+ interviews across Business Relationship Managers, Functional Relationship Managers, Product Owners, and market stakeholders, plus a 70+ response survey. I distilled it into six high-confidence insight cards linking cause, evidence, and business impact — and diagnosed twelve pain points, prioritising six for intervention.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I mapped the full end-to-end journey — from demand intake through qualification, decision-making, and request to deployment and roll-out — named three Moments That Matter (Decision Velocity, Priority at Intake, and Findability at Discovery), and built a stakeholder map across the Business and IT layers.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Journey-Pain-Points-Light.png`, alt: 'End-to-end IT product offering journey across four stages — Trigger, Understand, Initiate, and Complete or Roll Out — with a full grid of pain points mapped beneath each stage', caption: 'The end-to-end offering journey — demand intake to roll-out — with pain points mapped across every stage', w: 4233, h: 4751 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'Four enterprise personas grounded the work in real behaviour: The Market Intermediary, The Business Requestor, The Global Product Steward, and The Governance Gatekeeper — each with its own pains, needs, and mental models.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Personas-E2E.png`, alt: 'Four enterprise personas — the Market Intermediary, the Business Requestor, the Global Product Steward, and the Governance Gatekeeper — each with background, core responsibilities, behaviours and mental models, pains, and needs', caption: 'Four enterprise personas — from Market Intermediary to Governance Gatekeeper', w: 2056, h: 1436 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'I then facilitated a three-session stakeholder workshop — research sharing, ideation, then planning — that produced prioritised solutions with clear ownership, success metrics, and roadmaps. Together the core team defined the future-state vision: Discoverability over Complexity, Clarity over Ambiguity, Efficiency over Redundancy, Transparency over Opacity, and Seamless Experience over Fragmentation. AI and automation readiness — a stakeholder non-negotiable — was embedded as a design requirement from the start.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${ITPO_IMG}/Solution-03.png`, alt: 'Co-created solution workspace for a trusted, complete, and connected IT Product Catalog, with how-might-we framing, minimum-change experiments, success metrics, a roadmap, and a RACI matrix', caption: 'Solution board: a trusted, complete, connected IT Product Catalog (discoverability)', w: 8170, h: 4003 },
                            { src: `${ITPO_IMG}/Solution-01.png`, alt: 'Co-created solution workspace for clearer governance — defined roles, simple gates, and one visible investment path — with an experiment card and RACI matrix', caption: 'Solution board: clear roles, simple gates, one visible path in governance', w: 9204, h: 7764 },
                            { src: `${ITPO_IMG}/Solution-02.png`, alt: 'Co-created solution workspace for shared standards and formal problem framing, with minimum-change experiments, success metrics, and a roadmap', caption: 'Solution board: clarity first — shared standards and formal problem framing', w: 8149, h: 3993 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'Finally, I connected directly with the owner of each prioritised solution to test feasibility, define dependencies, and validate scope — then built the roadmap by back-casting from the future state, working backwards to the concrete steps, sequencing, and ownership needed to reach it.',
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
                            'Governance isn’t a constraint to design around — it’s the design challenge itself. When people bypass the system, the answer isn’t more control; it’s making the right path the easiest path.',
                    },
                    {
                        kind: 'text',
                        text:
                            'It also showed how far evidence travels when it’s framed as a system. The same journey map that diagnosed the problem became the input for AI-use-case sizing and for redesigning the intake process — proof that one well-mapped journey can align product, process, and automation teams around a single shared reality.',
                    },
                ],
            },
        ],
    },
    '#it-key-roles': {
        href: '#it-key-roles',
        kicker: 'Organisation · Nestlé IT · 2026',
        title: 'IT Key Roles',
        summary:
            "A shared, evidence-based map of where an AI agent can genuinely help the people who keep enterprise IT running: Relationship Managers, Product Managers, and Architects, each doing a different job and each needing a different reason to trust it.",
        facts: [
            { value: '3', label: 'IT roles mapped' },
            { value: '5/9', label: 'RM use cases cleared' },
            { value: '73%', label: 'Go rate, from 33%' },
            { value: '86%', label: 'Fewer confidently-wrong sessions' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            "Nestlé IT's Digital Agent has to work for the people who keep the organisation's IT running day to day, not just for someone browsing a catalogue once. That's three quite different jobs: Relationship Managers (the BRMs and FRMs who sit between IT and the business), Product and Programme Managers, and Architects across four specialisms, from Enterprise down to Specification. Each group has its own tools, its own workflow, and its own reason to trust, or not trust, a machine doing part of that job for them.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Requested by the OCIO and run in direct partnership with Journey Management, this has been end-to-end research across all three roles since February 2026. It started with Relationship Managers and Product Managers together; Architects joined toward the end of Q2. The brief was never just to “find some AI use cases.” It was to build one shared, validated map, a Journey Atlas, that roadmap decisions could start from instead of re-litigating the same assumptions every quarter.",
                    },
                    {
                        kind: 'text',
                        text:
                            "By mid-2026 that Atlas was doing three things nobody had explicitly asked it to do. It became the default starting point for roadmap decisions instead of everyone arguing from a blank page. It sharpened exactly which automation opportunities were worth building first, role by role, rather than wherever the loudest request came from. And it put a finding in front of leadership that product conversations alone hadn't surfaced: data quality across the underlying systems wasn't a nice-to-have, it was the prerequisite the whole strategy depended on.",
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: "Not every friction point is something an agent can fix. Some of it is a missing rule, and no amount of AI makes up for a rule that doesn't exist yet.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The clearest proof of that came from the Relationship Manager workstream, the one far enough along to have hard numbers behind it. In the second round of user testing, moving the agent from GPT to Opus 4.5 lifted the go rate from 33% to 73% and cut sessions where the agent gave a confidently wrong answer from seven down to one. Ease of use scored a perfect 7 out of 7, and people hit roughly four times as many “moments of value” per session as they had with the earlier version.",
                    },
                    {
                        kind: 'text',
                        text:
                            "None of that came from a cleverer prompt. It came from treating the model underneath the agent as a design decision with measurable consequences, and testing it the way you'd test a journey or a screen: with real people, a scoring rubric, and a clear go or no-go bar, not a demo.",
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
                            "The research ran on a structured funnel: a closed survey to prioritise which stages of work mattered most, co-discovery interviews to understand those stages properly, then task-level prioritisation to decide what to build first. To pressure-test findings before they reached real people, synthetic PM and Architect research participants were built in Copilot Studio, sitting on top of an earlier Dataverse-based research setup. It's the same instinct behind the synthetic-user work elsewhere in this practice: cheap rehearsal before spending an expensive person's time.",
                    },
                    {
                        kind: 'roletrack',
                        model: {
                            prompt: "Same programme, three different clocks. Here's where each role actually stands today, not where a roadmap slide says they stand.",
                            stages: ['Opportunity Mapping', 'Co-creation', 'Validation & UAT', 'Live'],
                            rows: [
                                {
                                    role: 'Relationship Managers',
                                    stageIndex: 2,
                                    status: 'A real agent, in real testing, with a conditional go-live behind it and a named list of what has to close before the next round.',
                                    metrics: [
                                        { value: '5/9', label: 'use cases cleared' },
                                        { value: '73%', label: 'go rate, from 33%' },
                                        { value: '86%', label: 'fewer wrong answers' },
                                    ],
                                },
                                {
                                    role: 'Architects',
                                    stageIndex: 1,
                                    status: 'Two rounds of workshop co-creation done across four specialisms, fifteen opportunities drafted with full traceability back to the source notes.',
                                    pending: 'Scored results: not yet, no UAT round has run',
                                },
                                {
                                    role: 'Product & Programme Managers',
                                    stageIndex: 0,
                                    status: 'Journey atlas and opportunity backlog mapped across fifteen-plus markets; a synergy check against the RM opportunities is underway now.',
                                    pending: 'Scored results: not yet, still at opportunity-mapping stage',
                                },
                            ],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            "Relationship Managers are the furthest along of the three roles: an actual agent in actual testing, not just a list of opportunities. The most recent round was 12 moderated one-to-one sessions with BRMs and FRMs across the AMS, AOA, and Europe zones, built to answer one question for the OCIO: is this ready to go live, fully or conditionally? The result was a conditional go, with five of the nine tested use cases clearing the bar, and a clear next list: 39 open content items to fold into the knowledge base and six integration gaps to close before a wider rollout.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Two findings from that round are worth keeping past this project. First, a content-coverage gap and an accuracy failure look the same to a frustrated user but need completely different fixes and completely different messaging to leadership: one is a librarian problem, the other is a trust problem. Second, the fabrication-on-tool-failure pattern, a confident answer where the honest response would have been “I couldn't check that,” needs to be named plainly in executive updates rather than folded into a generic accuracy score. It's the failure mode most likely to damage trust the moment it happens in front of a real user instead of a moderator.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Underneath the sessions sits a Go/No-Go scoring system built to weight readiness across use cases, plus two reusable Claude skills, one for synthesis and one for reporting, so the next wave doesn't start from a blank page either.",
                    },
                    {
                        kind: 'text',
                        text:
                            "A separate look at the RM opportunity backlog earlier in the year found an uncomfortable pattern: the strongest opportunity cards were structural fixes (compliance automation, financial approval, security lifecycle), while the things RMs actually said they needed help with had the weakest coverage. “Help me find what already exists,” the single most common pain point, had no opportunity addressing it at all. Neither did “help me frame my request properly.” A backlog can look busy and still be solving the wrong layer of the problem.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Product and Programme Managers got their own journey atlas, built alongside the Zone FRM atlas from qualitative research across 15-plus markets and distilled into one-page briefs leadership could actually read. Pain points are tracked on a Goal, Friction, Emotion, Impact framework; Emotion was added after an earlier version of the model turned out to be missing it. The same gap shows up here as with RMs: the opportunities on the table under-serve the basics PMs actually ask for, finding what exists, framing a request, understanding governance, more than they serve the bigger structural fixes. A synergy analysis between the PM and RM opportunity sets is underway now, complicated by the ordinary reality that opportunities keep getting edited in live sessions faster than the shared spreadsheet can catch up with them.",
                    },
                    {
                        kind: 'quote',
                        text: "A security agent is only ever as good as the security standard behind it. If that standard doesn't exist yet, the problem isn't an AI problem. It's a policy problem wearing an AI costume.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Architects joined most recently and are still in active synthesis rather than testing. Better to say that plainly than blur the three roles together. The backbone is a pain-point tracker spanning four architect specialisms, Enterprise, Strategic Portfolio, Solution, and Specification, each entry tied to a stage, a job-to-be-done, and a supporting quote. Three pain points reached co-creation first: security reviews delaying ARM approval, a missing architecture repository forcing rework, and manual ARM authoring slowing everything down. Getting there meant sorting 29 sticky notes from workshop boards by function, then working those into 15 target-state capabilities and 15 fully traceable opportunities, each one still linked back to the sticky note it came from.",
                    },
                    {
                        kind: 'text',
                        text:
                            "A second round of co-creation added three more pain points, mostly about chasing approvers and low attendance at governance sessions, and the two rounds now sit merged on one cross-referenced board, converging on three areas: approvals, security, and ARM.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Not every good idea out of that process is an agent opportunity, and the workstream is explicit about the difference: pre-ARM security alignment meetings, clearer rules on permitted data transfers, involving architects before a purchase instead of at go-live. These are process and policy fixes, tagged as such, and several of the AI opportunities can't ship until their matching policy opportunity exists. Measured against the RM deck, which is the standard this work is held to, the Architect opportunities are still missing business-value estimates, alignment to Nestlé's 2026 IT roadmap, and, most of all, quotes properly sourced back to a specific session. That's the honest state of it: real structure, real prioritisation, not yet at the evidence bar the RM work has reached.",
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
                            "The most useful move in this whole programme wasn't a research technique, it was a naming convention: tagging every opportunity as either an AI Opportunity or a Policy Opportunity. It stops a backlog from quietly filling up with automation ideas that can't ship because the rule they depend on doesn't exist, and it gives leadership a fair way to fund process fixes without dressing them up as AI work to get budget.",
                    },
                    {
                        kind: 'text',
                        text:
                            "The RM numbers taught me something I'd suspected but hadn't proven: the model underneath an agent is a design decision, not an implementation detail. A go rate that doubles on the same use cases, the same script, the same participants, with only the model changed, means the interface was never the whole story. What comes next is putting a number on that story: working with IBM to turn validated opportunities into an actual investment case, moving from “this would help” to “this is what it costs not to do it.”",
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
            'Designing the connective tissue of how 270,000+ people meet — and standing up a new discipline to own it.',
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
                            "Nestlé's 270,000+ employees ran on meetings — yet the experience was fragmented and no single team owned it end to end. Technical performance, employee sentiment, and operational signals each lived in their own silo, so leadership couldn't see what people actually experienced from scheduling to follow-up, let alone where to invest.",
                    },
                    {
                        kind: 'text',
                        text:
                            'By the close, the organisation could see the full meeting journey in one connected view for the first time — telemetry, sentiment, and pain points together. Two interventions shipped in the Canada market — a meeting-room tagging system and a new in-room post-meeting survey — and the survey opened a feedback loop that lifted detection of malfunctioning room technology by 10%. Experience-Level Agreements (XLAs) moved from theory into practice, the OCIO endorsed the method to scale, and the work defined how the new Journey Management team operates.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: "The problem wasn't meetings — it was that no one owned the experience across them.",
                    },
                    {
                        kind: 'text',
                        text:
                            "Each team — collaboration tools, conference rooms, IT support, facilities — optimised its own piece. But employees lived meetings as one continuous journey, and the friction sat at the seams between touchpoints, not inside any single tool. The booking system didn't speak to the room equipment; IT support had no meeting context; post-meeting content scattered with no source of truth.",
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
                            'As Lead Design Researcher and Service Designer, I owned the research strategy end to end — synthesising prior studies, running 25 in-depth interviews across 5 global zones, and validating pain points with a 322-response survey, for a 347-participant evidence base leadership could trust. I worked with Sun, a graduate designer, and aligned closely with Sandra, the Product Owner.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I mapped the current-state journey across four personas — from a marketing manager running hybrid workshops to a factory operator who relies on auto-subtitles for accessibility — plus an IT and Facilities backstage layer. For the first time, the structural disconnects were visible in a single picture.',
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
                            'Using a backcasting model, I facilitated envisioning workshops where stakeholders agreed a shared vision and co-created a future-state journey organised around three phases: before, during, and after the meeting — then prioritised it into a roadmap scored on feasibility, ownership, and tool dependencies.',
                    },
                    {
                        kind: 'gallery',
                        items: [
                            { src: `${SEAMLESS_IMG}/Approach.PNG`, alt: 'Backcasting model diagram: moving from current challenges through strategic decisions to the future vision', caption: 'Backcasting: designing from the future state backward', w: 794, h: 447 },
                            { src: `${SEAMLESS_IMG}/Envision Journey.PNG`, alt: 'Future-state journey map organised into before, during, and after the meeting with integrated touchpoints', caption: 'Future-state journey: before, during, after — integrated touchpoints', w: 798, h: 449 },
                        ],
                    },
                    {
                        kind: 'text',
                        text:
                            'The DEX (Digital Employee Experience) Framework — applied here for the first time — integrated technical, operational, and experiential data into a single view, naming the moments that matter and the indicators that track them.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Two insights went all the way to delivery, both launched first in the Canada market. A room-tagging system built into Outlook let employees search and filter meeting rooms by setup and equipment — a direct fix for one of the most common points of friction in finding the right room. And a short post-meeting survey, triggered in the room itself, created an entirely new stream of experience data; inside that loop, detection of malfunctioning meeting-room technology rose by 10%.',
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
                            'The most impactful intervention wasn’t a new feature — it was helping the organisation see its own experience as one connected system, not a collection of tools owned by separate teams.',
                    },
                    {
                        kind: 'text',
                        text:
                            'I also learnt that standing up a new discipline is as much facilitation as research. The value came from getting teams that had never shared a data model to align around a single journey — and leaving them with a way of working they could repeat long after the project closed.',
                    },
                ],
            },
        ],
    },
};
