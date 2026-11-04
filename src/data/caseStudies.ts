// Full, immersive case studies — opened from a project node, rendered over the
// live map on the single frosted-glass window (CaseStudyOverlay). Only projects
// with real, verified substance live here; lighter nodes render their
// nodeContent on the SAME surface. Real facts only — no fabrication.

import type { ContentFact } from './nodeContent';
import type { StoryCaseBlock } from './storyModels';
import type { NespressoBlock } from './nespressoModels';
import type { MaturityBlock } from './maturityModels';
import type { AgentBlock } from './agentModels';
import type { SynthBlock } from './synthModels';
import type { KeyBlock } from './keyModels';
import type { ItpoBlock } from './itpoModels';
import { remoteGo } from './caseRemoteGo';
import { nespresso } from './caseNespresso';
import { designMaturity } from './caseMaturity';
import { syntheticUsers } from './caseSynthetic';

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
    | { kind: 'swing'; model: SwingModel }
    | StoryCaseBlock
    | NespressoBlock
    | MaturityBlock
    | AgentBlock
    | SynthBlock
    | KeyBlock
    | ItpoBlock;

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
    '#remote-go': remoteGo,
    '#nespresso': nespresso,
    '#design-maturity': designMaturity,
    '#synthetic-users': syntheticUsers,
    '#digital-agent': {
        href: '#digital-agent',
        kicker: 'Touchpoint · Nestlé IT · 2026',
        title: 'Digital Agent · usability testing',
        summary:
            'Testing one AI agent across three roles and three data sources, against a go/no-go bar set before anyone sat down. It turned each launch debate into a launch decision.',
        facts: [
            { value: '35', label: 'Test sessions across 4 rounds' },
            { value: '29', label: 'Participant seats across three roles' },
            { value: '3', label: 'Data sources: SharePoint, LeanIX, ServiceNow' },
            { value: 'Go / No-Go', label: 'Bar agreed with leadership' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'Nestlé IT built one AI agent for the three roles that run enterprise IT: Relationship Managers, who sit between the markets and global IT; Product and Programme Managers, who own delivery; and Architects, who govern design and standards. Each role reaches its work through a different system.',
                    },
                    {
                        kind: 'patch',
                        model: {
                            prompt: 'One agent, three roles, three systems. Follow the cables.',
                            roles: [
                                { key: 'rm', name: 'Relationship Managers' },
                                { key: 'pm', name: 'Product Managers' },
                                { key: 'arch', name: 'Architects' },
                            ],
                            systems: [
                                { key: 'sp', name: 'SharePoint', when: 'May–June 2026', tested: 'Curated knowledge retrieval', sessions: '13 sessions across nine use cases, plus 6 re-tests' },
                                { key: 'lx', name: 'LeanIX', when: 'June–July 2026', tested: 'Architecture and portfolio data, plus two new SharePoint sources', sessions: '6 moderated, 1 unmoderated' },
                                { key: 'sn', name: 'ServiceNow', when: 'Oct–Nov 2026', tested: 'Incident, service-level and project data, in pre-production', sessions: '5 moderated sessions' },
                            ],
                            links: [
                                { role: 'rm', system: 'sp', seats: '13 people, business and functional, in three zones' },
                                { role: 'rm', system: 'lx', seats: '4 people' },
                                { role: 'pm', system: 'lx', seats: '2 people' },
                                { role: 'arch', system: 'lx', seats: '1 person' },
                                { role: 'rm', system: 'sn', seats: '3 people' },
                                { role: 'pm', system: 'sn', seats: '2 people' },
                            ],
                            note: 'Plus four sessions before the soft launch, two of them re-tests, on LeanIX and SharePoint: 35 sessions and 29 participant seats in all.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Before each release, the CIO’s office needed a plain answer: is it ready to go live, fully or with conditions? That meant real people doing real tasks on the data they use, not a demo. Each round ended in a verdict against the bar. Use cases that cleared it moved forward; the rest came back with blockers for the team that could fix them.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The verdicts did not always set the launch date, and that is part of the story. In May the result was a conditional go: launch waited until named issues were fixed with the platform partner. Leadership also asked for a clearer reason to use the agent instead of the general-purpose assistant people already had. The answer was to connect LeanIX, and that became the next round.',
                    },
                    {
                        kind: 'gates',
                        model: {
                            prompt: 'Five gates on the road to launch. Drive to each one.',
                            gates: [
                                { when: 'May', title: 'First verdict', verdict: 'conditional', detail: 'Launch postponed until named fixes were made, and a clearer reason to use the agent' },
                                { when: 'July', title: 'Soft-launch verdict', verdict: 'go', detail: 'Go with monitoring, with one hard gate' },
                                { when: 'September', title: 'Soft launch', verdict: 'go', detail: 'About 120 users; 56 of them surveyed by October' },
                                { when: 'Oct–Nov', title: 'ServiceNow version', verdict: 'conditional', detail: 'Research said go with fixes first; proposed to leadership as a conditional go' },
                                { when: 'December', title: 'Full launch', verdict: 'planned', detail: 'Planned for 5,000 users' },
                            ],
                            note: 'Results so far are about readiness, use and trust. Value against a baseline is still to be shown.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'The agent is in soft launch, with a full launch planned for December, so this page covers results as well as decisions. It has not yet shown value against a baseline, and the next survey is built to measure that. The scores themselves stay inside Nestlé; the method, the reasoning and the decisions are what this page is about.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: 'Without a bar agreed before anyone sits down, agent testing turns into an argument about whether an answer was good enough, and the loudest person in the room wins.',
                    },
                    {
                        kind: 'bar',
                        model: {
                            prompt: 'Same use case, same answer. Who decides the verdict?',
                            zones: ['Wait', 'Conditional go', 'Go'],
                            voices: [
                                { name: 'The optimist', says: 'Good enough.' },
                                { name: 'The sceptic', says: 'Not yet.' },
                            ],
                            modes: { none: 'No bar agreed', set: 'Bar agreed first' },
                            captions: {
                                none: 'With no bar, the line sits wherever the loudest voice puts it.',
                                set: 'The bar was agreed with leadership before anyone sat down, so it does not move.',
                                verdictNone: ['Verdict: go, because someone said so.', 'Verdict: wait, because someone said so.'],
                                verdictSet: 'Verdict: conditional go, whoever is in the room.',
                            },
                            note: 'The scores behind the bar stay inside Nestlé.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'So I built the scoring engine first, and leadership agreed the approach. Every use case is scored out of 100: task completion weighs 70% and experience 30%, read across five indicators on a 1 to 7 scale (task completion, ease of use, cognitive load, expectations met and future perception). Seventy or above is a go, fifty to sixty-nine a conditional go, and below that it waits.',
                    },
                    {
                        kind: 'text',
                        text:
                            'During the May round, the model powering the agent changed and nothing else did, so the round became a controlled comparison. Use cases that failed before cleared after: when content was missing or stale, the new model said so instead of filling the gap.',
                    },
                    {
                        kind: 'chat',
                        model: {
                            prompt: 'Same test, one layer changed: the model underneath the agent.',
                            held: ['Nine use cases', 'The same script', 'The same participant profile'],
                            changed: 'Changed: the model',
                            situation: 'The source has no current figure, only an older one on an undated slide.',
                            question: 'What is the current figure for this?',
                            views: { person: 'What the person sees', real: 'What is really going on' },
                            models: [
                                {
                                    key: 'a',
                                    name: 'Model A',
                                    tag: 'Before',
                                    answer: 'The current figure is the one on the old slide.',
                                    sees: 'Sounds certain. Nothing suggests checking it.',
                                    really: 'Wrong. It treated the old, undated figure as current.',
                                    verdict: 'Confidently wrong answers: a pattern',
                                },
                                {
                                    key: 'b',
                                    name: 'Model B',
                                    tag: 'After',
                                    answer: 'I can’t find a current figure in the sources. The only one is undated, so I wouldn’t rely on it.',
                                    sees: 'Says it isn’t sure, so the person knows to check.',
                                    really: 'Right to hold back. The source has no current figure.',
                                    verdict: 'Confidently wrong answers: an exception',
                                },
                            ],
                            note: 'An illustration of the behaviour, not a transcript. Six of the thirteen participants re-tested, so the people were held constant too.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'That came from treating the model as a design decision with measurable consequences, and testing it like a journey or a screen: real people, a scoring rubric, and a bar set in advance. One use case still did better on the old model. And content owners got a lesson of their own: sources need structure and dates, because the agent took a figure from an undated hidden slide as current.',
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
                            'To a frustrated user, every failure looks the same: the agent did not help. Under a single accuracy score, it looks the same to leadership too. The most useful thing to come out of the testing was a way to tell the causes apart, because each one has a different owner and a different fix.',
                    },
                    {
                        kind: 'triage',
                        model: {
                            prompt: 'Three causes, one symptom. Telling them apart is most of the job.',
                            symptom: 'The agent did not help',
                            ask: 'Ask why',
                            causes: [
                                {
                                    key: 'knowledge',
                                    name: 'Knowledge gap',
                                    sees: 'The agent could not answer, or answered from the wrong source.',
                                    is: 'Missing, stale or poorly chosen content.',
                                    fix: 'Curate and refresh the knowledge base.',
                                    owner: 'Content and source owners',
                                },
                                {
                                    key: 'defect',
                                    name: 'AI defect',
                                    sees: 'A wrong, looping or badly structured answer.',
                                    is: 'The content was there and the agent still got it wrong.',
                                    fix: 'Prompt, guardrails and validation, then retest.',
                                    owner: 'Engineering and prompt design',
                                },
                                {
                                    key: 'capability',
                                    name: 'Capability gap',
                                    sees: 'The agent cannot reach the system or do the action.',
                                    is: 'No connector or capability for that system yet.',
                                    fix: 'Connectors and platform scope decisions.',
                                    owner: 'Platform and infrastructure',
                                },
                            ],
                            note: 'After the first round, every open finding was routed this way, to the team that owns it.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'A fourth failure appeared once the agent reached live systems. Connected to LeanIX, it sometimes could not retrieve an application by name, and the connector was suspected to be unstable. An agent that cannot reach a system may invent an answer, or return nothing at all. Before the soft launch I made the empty case a hard gate.',
                    },
                    {
                        kind: 'hardgate',
                        model: {
                            prompt: 'Three answers. Only one of them hides.',
                            answers: [
                                { mock: 'right', label: 'A right answer' },
                                { mock: 'wrong', label: 'A wrong answer' },
                                { mock: 'empty', label: 'An empty answer' },
                            ],
                            person: 'Can the person tell?',
                            gate: 'Hard gate',
                            outcomes: {
                                right: 'Arrives. Nothing went wrong.',
                                wrong: 'Caught. The person can check it.',
                                emptyOff: 'Arrives unseen. It looks as if nothing existed.',
                                emptyOn: 'Stopped at the gate, before it reached anyone.',
                            },
                            captions: {
                                off: 'Send the three answers through and see which one the person can catch.',
                                on: 'With the hard gate on, send them through again.',
                            },
                            note: 'A wrong answer can be caught. An empty one looks as if nothing existed, which is why it became a hard gate before the soft launch.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Findings stay on three layers that never merge: the model, the agent’s interface, and the system and process around it. That keeps the routing honest, and it is why the silent failure gets named plainly in executive updates: it will do the most damage to trust the first time a real user meets it.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Once the soft launch was live, I went back to the raw survey responses, because the first summary undersold the evidence. I removed repeat submissions, checked the conclusions held without non-users, and rebuilt the story as a funnel: understanding, ease, resolution, speed. The leak was resolution. Leadership heard one message: resolving more queries is the next value lever, starting with ServiceNow, the system respondents named without being asked.',
                    },
                    {
                        kind: 'funnel',
                        model: {
                            prompt: 'The survey funnel, and the stage where it leaked',
                            stages: [
                                { name: 'Understanding', line: 'The first stage of the funnel. Not where it leaked.' },
                                { name: 'Ease', line: 'The second stage. Not where it leaked.' },
                                { name: 'Resolution', line: 'This is where it leaked. Resolving more queries is the next value lever, starting with ServiceNow, the system respondents named without being asked.' },
                                { name: 'Speed', line: 'The last stage. Not where it leaked.' },
                            ],
                            leak: 2,
                            note: 'Rebuilt from the raw survey responses: repeat submissions removed, conclusions checked without non-users.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'The ServiceNow round tested incident and service-level data on pre-production, and added indicators: trust, better decisions, speed, which skill the agent used, and a pass rule per task. The gaps were not about usability. The agent confused where a ticket was raised with the market it affected, keyword matching pulled in off-topic tickets, and it did not ask a clarifying question when scope or acronyms were ambiguous.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Data quality set the ceiling: the test data was a month old, and impact fields were filled in inconsistently. Participants ran analyses they would not otherwise have had time for, such as ticket timelines and trends. The research verdict was go, with scope filtering and clarifying questions fixed first; five sessions are a weak signal, so these are patterns to validate on live data.',
                    },
                    {
                        kind: 'text',
                        text:
                            'No time or cost saving has been measured yet. Three things are built to measure it: the next survey, with a task baseline and time saved against it; a success scorecard, reviewed with change management, that measures task completion and net time saved per use case; and a scale-gate review in December.',
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
                            'The model underneath an agent is a design decision, not an implementation detail. I suspected that going in. The controlled comparison made it hard to argue with: when the verdict moves that far on the same use cases, most of what people experience as interface quality comes from somewhere else.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The second lesson is about reporting a failure. An accuracy percentage gives leadership nothing to act on. Saying the agent invents an answer when it cannot reach a system tells them what to fix and what it costs if they do not. Testing an agent means building the words to describe how it fails, as much as measuring whether it works.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The third is that one agent is not one product to test. Three roles reach it through three systems, so it has three sets of ways to fail, and a single test round on a single data source would have hidden most of them.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The fourth is that a conditional go only works if the conditions are concrete. In May the conditions had names, owners and a partner to fix them with, so a postponement became a plan. It is also why the agent now connects to LeanIX and ServiceNow.',
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
            { value: '71', label: 'Survey responses' },
            { value: '58%', label: 'Reported shadow initiatives' },
            { value: '6', label: 'Systemic challenges surfaced' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'Nestlé IT ran 315 IT products across 16 streams, but markets often couldn’t find them, didn’t trust them, and built their own instead. The catalog was incomplete and overly technical. Approval spanned five governance layers with no clear decision rights. And 58% of stakeholders reported shadow initiatives emerging whenever alignment broke down. The result was duplicated investment, eroding trust in central IT, and slower digital acceleration. The aim was speed, clarity and better decisions, without adding a single new gate.',
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
                            'By the close, the enterprise had one evidence-based view of the full offering journey: how a market raises a request, and how a solution is then found, funded and adopted. The map became an input for sizing AI and automation opportunities, and its insights went into the intake process for new solutions, so real friction now shapes how they enter. Journey Management became a model the organisation can reuse. In 2026 its method carried into the research on key IT roles, and in May IT leadership proposed it as the design base for catalogue enhancements. What it doesn’t have yet is a measured baseline: catalogue use, approval time and first-time-right are still to be re-measured.',
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
                        kind: 'gauges',
                        model: {
                            prompt: 'Four findings from the research. Press one.',
                            idle: 'Press a ring to read what it measured.',
                            stats: [
                                { key: 'shadow', value: 58, label: 'reported shadow initiatives', line: '58% of stakeholders reported shadow initiatives, built whenever alignment broke down.' },
                                { key: 'network', value: 54, label: 'relied on personal networks', line: '54% of people relied on personal networks and informal channels over the official catalog.' },
                                { key: 'approval', value: 66, label: 'found approval hard to navigate', line: '66% of people found the approval path hard to navigate.' },
                                { key: 'pace', value: 25, label: 'felt delivery pace met their needs', line: 'Only 25% felt delivery pace met business needs.' },
                            ],
                            note: 'Share of the people in the research who said so.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Markets weren’t rejecting IT solutions. They couldn’t see them, and when they could, they couldn’t get them fast enough. That reframed the brief from “improve the catalog” to “redesign the whole offering experience, discovery through governance to adoption.” Six systemic challenges surfaced with high confidence: discoverability relied on workarounds, urgent demand dominated intake, roadmap visibility was weak, delivery felt too slow, planning cycles were misaligned, and shadow initiatives filled the gaps.',
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
                        kind: 'trail',
                        model: {
                            prompt: 'From evidence to roadmap, six stations',
                            idle: 'Press a station to see what happened there.',
                            stations: [
                                { key: 'evidence', name: 'Evidence', line: 'Interviews across relationship managers, product owners, programme managers and market representatives in three zones, plus a survey. Most findings rest on the 48 relationship managers analysed.', facts: ['40+ interviews', '71 survey responses'] },
                                { key: 'insight', name: 'Insight', line: 'Distilled into six high-confidence insight cards, each linking cause, evidence and business impact.', facts: ['6 insight cards'] },
                                { key: 'diagnosis', name: 'Diagnosis', line: 'Twelve pain points, each with a how-might-we question and an impact rating.', facts: ['12 pain points'] },
                                { key: 'map', name: 'Mapping', line: 'The full journey, three Moments That Matter, a stakeholder map across the Business and IT layers, and four enterprise personas.', facts: ['3 moments that matter', '4 personas'] },
                                { key: 'cocreate', name: 'Co-creation', line: 'Ten sessions across three zones, from kick-off to roadmap, staggered so each zone’s ideas were stress-tested by the next. Invitees came from 12 countries in Asia-Pacific, Africa and the Americas, plus the Europe core team.', facts: ['10 sessions', '12 countries'] },
                                { key: 'roadmap', name: 'Roadmap', line: 'Six solution directions, three prioritised, each with an owner, a roadmap and a success metric. Then the roadmap was back-cast from the future state: the steps, sequencing and ownership needed to reach it.', facts: ['6 directions', '3 prioritised'] },
                            ],
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'I mapped the full end-to-end journey, from demand intake through qualification, decision-making, and request to deployment and roll-out. From that I named three Moments That Matter (Priority & Demand at Intake, Findability & Foresight at Discovery, and Decision Velocity & Value) and built a stakeholder map across the Business and IT layers.',
                    },
                    {
                        kind: 'offering',
                        model: {
                            prompt: 'The offering journey as one map. Press a step.',
                            idle: 'Press a step to light its column and read what each lane holds.',
                            stages: [
                                { name: 'Trigger', steps: [0, 1] },
                                { name: 'Understand', steps: [2, 3] },
                                { name: 'Initiate', steps: [4, 5] },
                                { name: 'Complete / Roll Out', steps: [6, 7] },
                            ],
                            lanes: [
                                { key: 'users', name: 'Business users' },
                                { key: 'front', name: 'Frontstage' },
                                { key: 'back', name: 'Backstage' },
                                { key: 'external', name: 'External' },
                            ],
                            touchpoints: 'Collaboration tools, email, spreadsheets, dashboards, a catalogue and request systems',
                            steps: [
                                {
                                    key: 'intake',
                                    name: 'Demand intake',
                                    moment: 'Priority & Demand at Intake',
                                    users: 'A market has a need and shares it informally, often with an urgent timeline.',
                                    front: 'Relationship managers confirm the business context and separate the need from the solution.',
                                    back: 'Global teams sometimes reach out to markets directly.',
                                    themes: ['Lack of cross-market demand visibility', 'Unclear requirements and solution-first requests', '“Urgent” requests and misaligned prioritisation', 'Limited local-global collaboration'],
                                },
                                {
                                    key: 'qualify',
                                    name: 'Qualification & prioritisation',
                                    front: 'Managers prioritise requests by market urgency and size.',
                                    themes: ['“Urgent” requests and misaligned prioritisation', 'Unclear requirements and solution-first requests', 'Role clarity and empowerment'],
                                },
                                {
                                    key: 'discover',
                                    name: 'Solution discovery',
                                    moment: 'Findability & Foresight at Discovery',
                                    front: 'Managers and product owners check whether a solution already exists.',
                                    back: 'Product owners share which products and solutions are available.',
                                    themes: ['Limited visibility of existing solutions', 'Lack of cross-market demand visibility'],
                                },
                                {
                                    key: 'decide',
                                    name: 'Decision making',
                                    users: 'Markets review the global solution against their local needs.',
                                    front: 'Managers weigh the global solution against local needs and integration feasibility.',
                                    external: 'Local vendors present their solution to the market.',
                                    themes: ['Global vs. local solution friction', 'Small-market funding and attention'],
                                },
                                {
                                    key: 'request',
                                    name: 'Request',
                                    moment: 'Decision Velocity & Value',
                                    users: 'Markets start the process with local vendors, through procurement.',
                                    front: 'Managers prepare the business case, sometimes with the market.',
                                    back: 'Product owners review the business case.',
                                    themes: ['Small-market funding and attention', 'Unclear criteria and roles in governance'],
                                },
                                {
                                    key: 'plan',
                                    name: 'Planning & development',
                                    moment: 'Decision Velocity & Value',
                                    users: 'Markets commit the funding and enable the resources.',
                                    front: 'Roles and responsibilities are defined across teams, and funding is agreed with finance.',
                                    back: 'Planning, compliance and integration checks.',
                                    themes: ['Complex and fragmented approval path', 'Unclear criteria and roles in governance', 'Role clarity and empowerment'],
                                },
                                {
                                    key: 'deploy',
                                    name: 'Deployment & adoption',
                                    front: 'Managers share the implementation plan with market stakeholders and confirm local readiness.',
                                    back: 'Product owners lead development with operations, and the solution is deployed.',
                                    external: 'Local vendors start deploying the product in the market.',
                                    themes: ['Slow global deployment and rollout timing', 'Role clarity and empowerment'],
                                },
                                {
                                    key: 'support',
                                    name: 'Post-launch support',
                                    front: 'Managers, markets and product owners track how the product is used.',
                                    external: 'The local application goes live.',
                                    themes: ['Limited local-global collaboration', 'Post-deployment support and ownership gaps'],
                                },
                            ],
                            note: 'A representation of the journey map, with its structure and pain-point themes and none of its detail. No system, vendor or person is named.',
                        },
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
                            'I then ran the co-creation: a kick-off, a research-sharing session, three rounds of ideation staggered across the zones, and a roadmap wrap-up. It produced prioritised solutions with clear ownership, success metrics, and roadmaps. Together the core team defined the future-state vision, as five shifts. AI and automation readiness was a stakeholder non-negotiable, so it went in as a design requirement from the start.',
                    },
                    {
                        kind: 'shifts',
                        model: {
                            prompt: 'The future state, as five shifts. Press one.',
                            idle: 'Press a shift to move its bead from the problem to the principle.',
                            shifts: [
                                { key: 'find', from: 'Complexity', to: 'Discoverability', line: 'Solutions people can find, described in words they use.' },
                                { key: 'clear', from: 'Ambiguity', to: 'Clarity', line: 'Decision rights and approval criteria that are written down.' },
                                { key: 'efficient', from: 'Redundancy', to: 'Efficiency', line: 'One investment, not the same thing built twice.' },
                                { key: 'transparent', from: 'Opacity', to: 'Transparency', line: 'A roadmap people can actually see.' },
                                { key: 'seamless', from: 'Fragmentation', to: 'Seamless experience', line: 'One journey, not a hand-off at every stage.' },
                            ],
                            note: 'Discoverability over complexity, clarity over ambiguity, efficiency over redundancy, transparency over opacity, and seamless experience over fragmentation.',
                        },
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
                            'Finally, I connected directly with the owner of each prioritised solution to test feasibility, define dependencies, and validate scope. Then I built the roadmap by back-casting from the future state, working backwards to the concrete steps, sequencing, and ownership needed to reach it. I also scored the relationship managers’ journey atlas on reach, impact, effort and frequency, so the next priorities rest on evidence.',
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
                            'It also showed how far evidence travels when it’s framed as a system. The same journey map that diagnosed the problem became the input for AI-use-case sizing and for redesigning the intake process. One well-mapped journey turned out to be enough to align product, process, and automation teams around a single shared reality. What it still lacks is measurement: catalogue use, approval time and first-time-right were never re-measured, and the 2024 catalogue baseline is where that starts.',
                    },
                ],
            },
        ],
    },
    '#it-key-roles': {
        href: '#it-key-roles',
        kicker: 'Organisation · Nestlé IT · 2026',
        title: 'IT Key Roles Journey Atlas',
        summary:
            'Mapping what the roles that run enterprise IT do all day, then reading their problems against each other to find where one AI agent could help all of them.',
        facts: [
            { value: '6 of 41', label: 'Opportunities selected to build' },
            { value: 'All 6', label: 'Selected opportunities with a business case' },
            { value: '4', label: 'Roles mapped as one chain' },
            { value: '9', label: 'IT streams across 3 zones' },
        ],
        sections: [
            {
                n: '01',
                heading: 'Scenario & result',
                blocks: [
                    {
                        kind: 'text',
                        text:
                            'In December 2025, Nestlé IT’s leadership decided that transforming IT would start with the people inside it, and that the first move would be digital assistants for key IT roles. The CIO’s office commissioned the research, across three zones and nine IT streams.',
                    },
                    {
                        kind: 'text',
                        text:
                            'It covered three roles: Relationship Managers, business, functional and zone, who sit between the markets and global IT; Product and Programme Managers, who own delivery; and Architects across enterprise, solution and specialist roles, who govern design and standards. Research had to establish what they do, where their work breaks, and which breaks an agent can fix.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The obvious plan was three studies. We ran one, because the three roles are links in the same chain. Studied separately, they produce three tool wishlists. Studied together, they show where their problems are the same problem wearing different clothes.',
                    },
                    {
                        kind: 'ripple',
                        model: {
                            prompt: 'What does each role hand to the next? Weaken one link.',
                            idle: 'Press a role to make it the weak link and see what lands on the others.',
                            links: [
                                { key: 'rm', role: 'Relationship Manager', hands: 'Consolidates what the markets are asking for into one zone-level demand.', bad: 'Demand arrives un-consolidated.' },
                                { key: 'pm', role: 'Product Manager', hands: 'Turns that demand into a roadmap and a prioritisation call.', bad: 'Prioritisation gets noisy.' },
                                { key: 'arch', role: 'Architect', hands: 'Inherits both as a design and governance constraint.', bad: 'Rework surfaces late and costs the most to undo.' },
                            ],
                            note: 'A weakness in one link lands on the next.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'By September 2026 each role had a validated journey atlas and a signed-off backlog. Of 41 opportunities scored, seven were signed off; one was later dropped, leaving six, and all six now have a business case. Business Analysts joined as a fourth role in September. Delivery sits in the 2027 roadmap, and none has shipped, so this is a record of decisions, not results.',
                    },
                ],
            },
            {
                n: '02',
                heading: 'Why it matters',
                blocks: [
                    {
                        kind: 'quote',
                        text: 'Not every friction point is something an agent can fix. Some of it is a missing rule, and no amount of AI makes up for a rule that nobody has written yet.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Three capability gaps turned up in all three roles, in a different form each time. Read across a row and it is one problem.',
                    },
                    {
                        kind: 'gaps',
                        model: {
                            prompt: 'The same three gaps, seen from three desks. Pick one.',
                            roles: ['Relationship Manager', 'Product Manager', 'Architect'],
                            gaps: [
                                {
                                    key: 'find',
                                    name: 'Find what exists',
                                    cells: [
                                        'Has another market already solved this, or already tried and dropped it?',
                                        'How is this product actually doing, and where does it land locally?',
                                        'Is there a building block to reuse instead of designing this again?',
                                    ],
                                },
                                {
                                    key: 'frame',
                                    name: 'Frame the request',
                                    cells: [
                                        'Consolidate scattered regional requirements into one credible ask.',
                                        'Shape demand into something estimable and fundable.',
                                        'Author an architecture document that will survive review.',
                                    ],
                                },
                                {
                                    key: 'navigate',
                                    name: 'Navigate the process',
                                    cells: [
                                        'Grey-zone ownership, and when to escalate.',
                                        'Compliance, contracts and procurement.',
                                        'Governance forums, approvals and chasing approvers.',
                                    ],
                                },
                            ],
                            note: 'This is the correlation the programme was run to find. It is also the reason the answer is one agent experience rather than three role tools.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'That changed the product. Three roles asking for three tools became one agent experience with shared capabilities: a different investment case and a different design problem. The six selections now read as one chain: discover, assess, reuse, structure, guide and automate. The “find what exists” gap appears in it once per role, and the opportunity that scored highest for Relationship Managers is one of them.',
                    },
                    {
                        kind: 'sixchain',
                        model: {
                            prompt: 'The six selections, read as one chain',
                            roles: [
                                { key: 'rm', name: 'Relationship Managers' },
                                { key: 'pm', name: 'Product Managers' },
                                { key: 'arch', name: 'Architects' },
                            ],
                            steps: [
                                { key: 'discover', name: 'Discover', role: 'rm', opportunity: 'Solution discovery', line: 'Finding out whether something already exists elsewhere in the organisation. It scored highest in the Relationship Manager backlog.' },
                                { key: 'assess', name: 'Assess', role: 'rm', opportunity: 'Portfolio visibility', line: 'Seeing how the portfolio is doing, for relationship managers, portfolio managers and leadership.' },
                                { key: 'reuse', name: 'Reuse', role: 'arch', opportunity: 'See and reuse what is already built', line: 'A building block to reuse, instead of designing it again.' },
                                { key: 'structure', name: 'Structure', role: 'arch', opportunity: 'A first architecture document, drafted for you', line: 'Drafted from approved content, with gaps flagged before review. A human stays in the loop.' },
                                { key: 'guide', name: 'Guide', role: 'pm', opportunity: 'AI-guided standards execution', line: 'The anchor for product managers. It sits where delivery work already happens, not in a new tool.' },
                                { key: 'automate', name: 'Automate', role: 'pm', opportunity: 'AI-automated project setup', line: 'Added in September, beside the anchor.' },
                            ],
                            idle: 'Press a step to see whose it is.',
                            note: 'The “find what exists” gap appears in the chain once per role.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Underneath all three sat the same root cause, and it was not technology. Knowledge lives in people, so the answer depends on who you ask, and the pieces of any answer sit in half a dozen platforms, from the product catalogue to LeanIX, ServiceNow and SharePoint, that cannot be searched together. An agent grounded in that inherits all of it.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The Relationship Manager and Product Manager sign-offs reached the same verdict independently: no quick wins. Every strong opportunity is a bet, high in impact and medium in feasibility, and data quality, governance and process standardisation are bigger constraints than the technology.',
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
                            'As lead design researcher and service designer, I owned the research across all three roles, from the first journey hypotheses to the cross-role reading that tied three backlogs into one story. Each role went through the same arc: a journey hypothesis from job profiles and desk research (for Architects, a synthetic user), validation with practitioners, then interviews and co-creation at task level.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Each role got a journey atlas at three levels of detail, with its own personas. Every pain point carries its stage, its job to be done, a severity and a verbatim quote, so a claim can be traced to its source. Stages were prioritised on reach, effort and frequency, and opportunities scored on desirability, viability and feasibility with the Value team, who built the business cases on the same frame.',
                    },
                    {
                        kind: 'atlas',
                        model: {
                            prompt: 'What a journey atlas is made of. Zoom in one level at a time.',
                            levels: [
                                {
                                    short: 'Lifecycle',
                                    name: 'Level 0: the lifecycle',
                                    nng: 'NN/g L0 · lifecycle',
                                    purpose: 'The role’s top objective, from start to finish. One map that holds every other map.',
                                    answers: 'What is this role ultimately trying to achieve?',
                                },
                                {
                                    short: 'Stages',
                                    name: 'The stage band',
                                    nng: 'NN/g domain',
                                    purpose: 'Groups related journeys into a stretch of the lifecycle. It is the natural level to assign ownership if the atlas grows to several roles.',
                                    answers: 'Which stretch of the lifecycle is this, and who owns it?',
                                },
                                {
                                    short: 'Journeys',
                                    name: 'Level 1: journey maps',
                                    nng: 'NN/g L1 · macro journey',
                                    purpose: 'Each journey is a milestone in the lifecycle: something the role is trying to achieve before moving on. Most traditional journey maps live here, and it is where a pilot starts and metrics attach.',
                                    answers: 'What is the role trying to get done at this milestone?',
                                    extra: 'The narrow bars between journeys are gates: governance checks that must pass before the next journey begins.',
                                },
                                {
                                    short: 'Jobs to be done',
                                    name: 'Job to be done',
                                    nng: 'Names each L1',
                                    purpose: 'One sentence per journey: as this role, I need to do this, so that this happens. It names the journey from the person’s goal, not from a system or a team, and it is the test for whether a journey belongs in the atlas.',
                                    answers: 'Why does this journey exist, and for whom?',
                                },
                                {
                                    short: 'Tasks',
                                    name: 'Task level: mini journey maps',
                                    nng: 'NN/g L2 or L3',
                                    purpose: 'The tasks inside each journey, each tagged with how the role takes part. This is where pain points attach, with their stage, severity and a verbatim quote, and where the interviews and co-creation happen.',
                                    answers: 'What does the role actually do, and who owns each task?',
                                },
                            ],
                            tags: [
                                { key: 'autonomous', name: 'Autonomous', line: 'I take the full ownership.' },
                                { key: 'joint', name: 'Joint', line: 'I share the ownership with someone.' },
                                { key: 'accountable', name: 'Accountable', line: 'I have the accountability instead of the responsibility.' },
                                { key: 'supporting', name: 'Supporting', line: 'I mainly support, without holding accountability or responsibility.' },
                            ],
                            note: 'An illustration of the structure, drawn with placeholders. It is not a real atlas. Based on the Nielsen Norman Group’s approach to journey atlases.',
                        },
                    },
                    {
                        kind: 'clocks',
                        model: {
                            prompt: 'Same programme, four different clocks',
                            stages: ['Journey atlas', 'Pain points', 'Opportunity scoring', 'Signed off', 'Business case', 'Build'],
                            idle: 'Press a dial to see where that role stands and how it got there.',
                            roles: [
                                {
                                    key: 'rm',
                                    name: 'Relationship Managers',
                                    stage: 4,
                                    status: 'Signed off in July 2026. Pain points clustered into five opportunity areas, nine opportunities scored and three signed off: discovering existing solutions, portfolio visibility and application adoption. Adoption was later dropped, so two go forward, both with a business case, built to expand around one anchor and reuse shared components.',
                                    facts: ['~92 pain points in the first draft journey', '5 opportunity areas', '9 scored', '2 in the business case'],
                                },
                                {
                                    key: 'pm',
                                    name: 'Product & Programme Managers',
                                    stage: 4,
                                    status: 'Signed off in July and September 2026. Journey validated across eight interviews. A February workshop named Plan & Envision the critical phase; the longlist was refined to twenty-four opportunities and scored. The anchor, AI-guided standards execution, sits where delivery work already happens rather than in a new tool, with AI-automated project setup added beside it in September.',
                                    facts: ['8 validation interviews', '6 opportunity areas', '24 scored', '2 selected'],
                                },
                                {
                                    key: 'arch',
                                    name: 'Architects',
                                    stage: 4,
                                    status: 'Signed off in September 2026. Journey validated with the Principal Enterprise Architect in June, then a stage-prioritisation survey, interviews with six architects, three co-creation sessions and five opportunity-detailing sessions. Two of eight opportunities selected: seeing and reusing what is already built, and a first architecture document drafted for you. The other six stay in the backlog.',
                                    facts: ['6 architects interviewed', '40 pain points validated', '8 opportunities in 3 areas', '2 selected'],
                                },
                                {
                                    key: 'ba',
                                    name: 'Business Analysts',
                                    stage: 0,
                                    status: 'Added in September at the request of Americas IT, for an estimated 300 Business Analysts. Journey and persona hypothesis built from the Business Analyst and Business Systems Analyst role profiles. The workshop is confirmed for January 2027.',
                                    facts: ['2 role profiles in scope', '~300 Business Analysts (estimate)'],
                                },
                            ],
                            note: 'Where each role stands today, not where a roadmap slide says it does. Build is in the 2027 roadmap.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Relationship Managers need to tell one credible story about what their zone needs, and their most common ask was to know whether another market had already solved the problem. The opportunities selected for them were not the three highest scores: discovery ranked first, portfolio visibility fourth and adoption ninth. They were chosen together, to cover the journey end to end and help portfolio managers and leadership too.',
                    },
                    {
                        kind: 'text',
                        text:
                            'Architects are a bottleneck by design: work queues behind them while their time goes on reading long documents late in the process. Around a quarter of their forty validated pain points sit in the architecture review, and half are gaps, not faults: the structure exists, but nobody has written the reusable content, so every architect starts from scratch.',
                    },
                    {
                        kind: 'text',
                        text:
                            'The architects set one guardrail: full automation of the review is out of bounds, and a human stays in the loop for compliance-critical steps. So the opportunity is to restructure authoring, not to auto-approve: find reusable designs, then draft the document from approved content and flag gaps before review.',
                    },
                    {
                        kind: 'guardrail',
                        model: {
                            prompt: 'The architects’ guardrail on a review',
                            labels: { agent: 'The agent helps', human: 'A human stays' },
                            idle: 'Press a step to see what the agent does and where a human stays.',
                            steps: [
                                { key: 'find', name: 'Find reusable designs', by: 'agent', line: 'Search what is already built, so no architect starts from scratch.' },
                                { key: 'draft', name: 'Draft from approved content', by: 'agent', line: 'Write the document from content that is already approved.' },
                                { key: 'flag', name: 'Flag gaps', by: 'agent', line: 'Show what is missing before a human reads it.' },
                                { key: 'review', name: 'Review and approve', by: 'human', line: 'Compliance-critical steps keep a human in the loop.' },
                            ],
                            blocked: { name: 'Auto-approve', line: 'Full automation of the review is out of bounds. The opportunity is to restructure authoring, not to auto-approve.' },
                            note: 'The architects set this guardrail themselves.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'Four alignment sessions, with security, enterprise architecture and the teams running its platform and its review redesign, then changed the strategy. Make existing specifications searchable before building AI drafting; join the security automation already under way; treat approvals as an accountability problem, because the workflow already exists. Curated data is the real deliverable, and the agent is how people reach it.',
                    },
                    {
                        kind: 'field',
                        model: {
                            prompt: 'Every scored opportunity, and what became of it',
                            roles: [
                                { key: 'rm', name: 'Relationship Managers', total: 9, case: 2, dropped: 1 },
                                { key: 'pm', name: 'Product Managers', total: 24, case: 2, dropped: 0 },
                                { key: 'arch', name: 'Architects', total: 8, case: 2, dropped: 0 },
                            ],
                            discovery: { name: 'Business Analysts', line: 'Business Analysts join as a fourth role: a journey and persona hypothesis now, a workshop in January 2027.' },
                            steps: [
                                { key: 'scored', label: '1 · Scored', headline: '41 scored', line: 'Nine Relationship Manager, 24 Product Manager and eight Architect opportunities, scored on desirability, viability and feasibility.' },
                                { key: 'signed', label: '2 · Signed off', headline: '7 signed off', line: 'Seven were signed off across the three sign-offs: two for Product Managers, two for Architects and three for Relationship Managers.' },
                                { key: 'dropped', label: '3 · One dropped', headline: '7 − 1 dropped = 6', line: 'Application adoption was dropped after sign-off, which left six.' },
                                { key: 'case', label: '4 · Business case', headline: '6 in the business case, 34 in the backlog', line: 'All six now carry a business case, with the build in the 2027 roadmap. The other 34 stay scored in the backlog for later waves, across all three roles.' },
                            ],
                            note: 'The release testing on the Digital Agent page decides what the agent can do today. This pipeline decides what it learns next.',
                        },
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
                            'People made the point in the interviews: an agent is only as good as the curated knowledge behind it. So the most useful move was typing every opportunity by what it needs.',
                    },
                    {
                        kind: 'fixes',
                        model: {
                            prompt: 'Four kinds of fix. Only one is an AI capability.',
                            idle: 'Press a kind to see what it needs.',
                            types: [
                                { key: 'ai', name: 'AI capability', needs: 'Something an agent can actually do.', then: 'Build it into the agent.' },
                                { key: 'process', name: 'Process fix', needs: 'A change to how the work runs.', then: 'Leadership can fund it as a process fix, not as an automation.' },
                                { key: 'governance', name: 'Governance decision', needs: 'A rule that somebody has to write.', then: 'No amount of AI makes up for a rule nobody has written. On the architect backlog, approval was an accountability problem, not a tooling one.' },
                                { key: 'data', name: 'Data standard', needs: 'Curated, structured knowledge to draw on.', then: 'Curated data is the real deliverable, and the agent is how people reach it.' },
                            ],
                            note: 'Every opportunity was typed this way, so the backlog doesn’t fill with automation ideas that need a rule nobody has written.',
                        },
                    },
                    {
                        kind: 'text',
                        text:
                            'The architect sign-off proved it. Two of three opportunity areas were set aside, not because AI could not help, but because the security work was already under way elsewhere and approval was an accountability problem, not a tooling one. The same line held the scope: people management came up as real friction and became a seventh stage of the Product Manager atlas, but stayed out of the agent backlog.',
                    },
                    {
                        kind: 'text',
                        text:
                            'What is still missing is the last link, and I would rather say so. None of the selected opportunities has been measured after deployment. Estimated value is not demonstrated value. The next step is to agree a baseline now, per use case, while the business cases are fresh, so the 2027 build can be judged against something real.',
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
                            'By the close, the organisation could see the full meeting journey in one connected view for the first time, with telemetry, sentiment and pain points together. Two changes shipped in Canada, and one of them lifted detection of faulty room technology by 10%. Experience-Level Agreements (XLAs) moved from theory into practice, IT leadership endorsed the method to scale, and the work defined how the new Journey Management team operates.',
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
                            'Two insights went all the way to delivery, both launched first in Canada. A room-tagging system in Outlook let employees filter meeting rooms by setup and equipment, a direct fix for one of the most common frictions in finding the right room. A short post-meeting survey, triggered in the room itself, created a new stream of experience data, and with it, detection of faulty room technology rose by 10%.',
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
                            'The change that mattered most was the organisation seeing its meetings as one connected system, instead of a set of tools each owned by a separate team.',
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
