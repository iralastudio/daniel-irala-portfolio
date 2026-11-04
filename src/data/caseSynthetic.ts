// Synthetic users & Experience Requirements for agents, the full case study. Own file
// because caseStudies.ts is past the 500-line limit; merged into `caseStudies` there.
// Source: Dani's Synthetic Users portfolio story (Downloads\Synthetic_Users_Portfolio_Story_2026.md,
// 2026-11-04), adapted under docs/CONTENT-STANDARDS.md. Kept off on purpose: colleague and
// sponsor names, internal standard and system codes, the agent-builder and platform names
// (a vendor recommendation), the AI programme's name, the other team's risk analysis by
// name, and exact dates. It replaces the earlier compact copy, which said four agents were
// built and that no new policy was needed; the story says two were built and piloted, and
// that missing pieces were proposed. No time saved or interviews avoided is on file, so
// none is claimed. Interactive visuals: evidence, grounding, govmap, rings, docs
// (synthInstruments.tsx, synthStack.tsx).

import type { CaseStudy } from './caseStudies';

export const syntheticUsers: CaseStudy = {
    href: '#synthetic-users',
    kicker: 'Team · Nestlé IT · 2026',
    title: 'Synthetic users & Experience Requirements for agents',
    summary:
        'Testing whether AI personas can make research sharper without pretending to be research, then writing the rules that keep them honest.',
    facts: [
        { value: '2', label: 'Synthetic users built and piloted' },
        { value: '6', label: 'Approved uses in the operating guideline' },
        { value: '4', label: 'Go/stop questions before using one' },
        { value: '5', label: 'Gaps in existing governance identified and proposed' },
    ],
    sections: [
        {
            n: '01',
            heading: 'Scenario & result',
            blocks: [
                {
                    kind: 'text',
                    text: 'Our research cycles started from a blank page. Before every study we spent a lot of time on open-ended discovery, so we walked into stakeholder interviews with broad questions, not sharp hypotheses. Their time went on exploration instead of validation.',
                },
                {
                    kind: 'text',
                    text: 'Meanwhile the industry was excited about synthetic users: AI personas that answer like real people. A risk analysis from another team in the company showed what the hype leaves out. No one has established a minimum sample, and the scientific grounding is still weak.',
                },
                {
                    kind: 'text',
                    text: 'The result is a boundary. My team now has a working definition of what synthetic users are for: preparation, hypotheses and testing interview guides. Never conclusions.',
                },
                {
                    kind: 'evidence',
                    model: {
                        prompt: 'The evidence ladder: how far a synthetic user can climb',
                        rungs: [
                            {
                                key: 'assumption',
                                name: 'Assumption',
                                line: 'A starting belief, written down so it can be tested.',
                                use: 'A synthetic user can produce these to prepare a study.',
                            },
                            {
                                key: 'hypothesis',
                                name: 'Hypothesis',
                                line: 'A sharper question to take into the real interviews.',
                                use: 'A synthetic user can produce these, and help test an interview guide.',
                            },
                            {
                                key: 'finding',
                                name: 'Finding',
                                line: 'Evidence from real people.',
                                real: true,
                                use: 'A synthetic user never produces one. Only research does.',
                            },
                        ],
                        labels: {
                            synthetic: ['A synthetic user', 'can get this far'],
                            real: ['Only real', 'research'],
                            wall: 'Never crossed by a persona',
                        },
                        idle: 'Press a rung to see what it is and who can produce it.',
                        note: 'The rule the whole practice rests on: a synthetic user can produce assumptions and hypotheses, never findings.',
                    },
                },
                {
                    kind: 'text',
                    text: 'The first applied use supported opportunity prioritisation for a journey-management team, and a stakeholder agreed with its output. I haven’t yet measured the time saved or the interviews avoided. That number is the next step.',
                },
            ],
        },
        {
            n: '02',
            heading: 'Why it matters',
            blocks: [
                {
                    kind: 'quote',
                    text: 'Can we use AI personas to make research sharper, without letting them pretend to be research?',
                },
                {
                    kind: 'text',
                    text: 'A conversation invites belief in a way a persona on a slide doesn’t. So I wrote the guardrails before anyone scaled the tool, and I tested the limits first. They showed up fast.',
                },
                {
                    kind: 'grounding',
                    model: {
                        prompt: 'Where does an answer come from? One tool, one setting',
                        sources: [
                            { key: 'ours', name: 'Our research', line: 'The journey-management research the personas were built on.' },
                            { key: 'general', name: 'General AI knowledge', line: 'What the model already knows, from everywhere else.' },
                        ],
                        answer: 'The answer',
                        setting: { label: '“Only use specified sources”', off: 'Off', on: 'On' },
                        outcomes: {
                            off: 'Both sources feed the answer, so general knowledge can pass for our research.',
                            on: 'Switched on, general AI knowledge still got into the answers.',
                        },
                        note: 'I raised this as a research-validity risk. It became the case for a fuller agent platform and a curated data foundation.',
                    },
                },
                {
                    kind: 'text',
                    text: 'Nestlé already had most of the rules. What was missing was the connection between them, plus lifecycle and validity. So I anchored synthetic users in governance that already existed and proposed only what was not there.',
                },
                {
                    kind: 'govmap',
                    model: {
                        prompt: 'The rules that already existed, and what was missing',
                        centre: 'Synthetic users',
                        groups: { have: 'Already in place', missing: 'Proposed' },
                        nodes: [
                            { key: 'ai-standard', name: 'AI solutions standard', group: 'have', line: 'Synthetic users are AI solutions, so the existing standard applies.' },
                            { key: 'registration', name: 'Registration', group: 'have', line: 'Each one is registered like any other application.' },
                            { key: 'impact', name: 'Impact assessments', group: 'have', line: 'Business and privacy questions are mapped before anyone scales.' },
                            { key: 'architecture', name: 'Architecture review', group: 'have', line: 'They go through the existing architecture review.' },
                            { key: 'platforms', name: 'Approved platforms', group: 'have', line: 'They are built only on approved platforms.' },
                            { key: 'labels', name: 'AI-generated labels', group: 'have', line: 'Anything a synthetic user produces is labelled as AI-generated.' },
                            { key: 'lifecycle', name: 'Lifecycle standard', group: 'missing', line: 'What happens to a synthetic user from creation to retirement.' },
                            { key: 'registry', name: 'Registry', group: 'missing', line: 'One place that lists every synthetic user.' },
                            { key: 'drift', name: 'Drift checks', group: 'missing', line: 'Checks that a persona still answers as it should.' },
                            { key: 'backtest', name: 'Backtest', group: 'missing', line: 'Does the persona predict what real participants said in a real study?' },
                            { key: 'recert', name: 'Recertification', group: 'missing', line: 'Each synthetic user is re-approved every year.' },
                        ],
                        idle: 'Press a node to see what it is.',
                        note: 'Governance and privacy questions were mapped to existing standards before anyone scaled the tool, not after.',
                    },
                },
            ],
        },
        {
            n: '03',
            heading: 'How we did it',
            blocks: [
                {
                    kind: 'text',
                    text: 'I didn’t write a policy for something we hadn’t tried. From April to June I built two role-based synthetic users, grounded in our own journey-management research.',
                },
                {
                    kind: 'rings',
                    model: {
                        prompt: 'What a persona is built from',
                        centre: 'PM persona',
                        rings: [
                            { key: 'archetypes', name: 'Archetypes', line: 'Who the persona represents, and how people in that role work.' },
                            { key: 'pains', name: 'Pain points', line: 'What gets in their way.' },
                            { key: 'frictions', name: 'Tool frictions', line: 'Where the tools they use slow them down.' },
                            { key: 'context', name: 'Organisational context', line: 'The organisation around them, which shapes every choice they make.' },
                        ],
                        idle: 'Press a layer to see what it holds.',
                        note: 'I designed this knowledge structure for the product-manager persona.',
                    },
                },
                {
                    kind: 'text',
                    text: 'The architect persona was for generating hypotheses for the next study of IT key roles. I put it on hold after a few days to focus on a more immediate need. The product-manager persona gave a first view of which opportunities from a workshop should move to development, and the first output held up.',
                },
                {
                    kind: 'text',
                    text: 'In June I sent my lead a one-pager and was honest about the status. Rather than overclaim, I proposed a measurable pilot: interview fewer people, and check whether the insights are just as good. The tool supports research. It doesn’t replace it.',
                },
                {
                    kind: 'docs',
                    model: {
                        prompt: 'The documents behind the practice, July to November',
                        docs: [
                            {
                                key: 'framework',
                                name: 'Consolidated framework',
                                when: 'July to September',
                                line: 'Anchors synthetic users in the governance Nestlé already has, and proposes what is missing.',
                                contains: [
                                    'What already applies: the AI solutions standard, registration, impact assessments, architecture review, approved platforms and labelling.',
                                    'What is proposed: a lifecycle standard, a registry, drift checks, a backtest against real studies and annual recertification.',
                                ],
                            },
                            {
                                key: 'guideline',
                                name: 'Operating guideline',
                                when: 'July to September',
                                line: 'The practical how.',
                                contains: [
                                    'Four go/stop questions before anyone uses a synthetic user.',
                                    'Six approved uses.',
                                    'An evidence ladder: a synthetic user can produce assumptions and hypotheses, never findings.',
                                ],
                            },
                            {
                                key: 'data',
                                name: 'Data governance deck',
                                when: 'October',
                                line: 'How to set up a persona once.',
                                contains: ['Scope', 'Purpose', 'Owner', 'Registration'],
                            },
                            {
                                key: 'scorecard',
                                name: 'Validation scorecard',
                                when: 'October to November',
                                line: 'Built on an existing template of conversational experience requirements, which I proposed reusing.',
                                contains: [
                                    'The experience an agent owes the person on the other side, not only the functions it performs.',
                                    'Approving it is a 2027 item.',
                                ],
                            },
                        ],
                        note: 'The policy and the data governance work were tracked and closed as requirements stories in August and October.',
                    },
                },
                {
                    kind: 'text',
                    text: 'In October I handed ownership of the documents to a colleague, who restructured them into a governance framework and operational guidelines. I stayed on as reviewer and guide. I steered the persona scope towards evidence-based archetypes tied to a research question, not a fixed list of roles.',
                },
                {
                    kind: 'text',
                    text: 'I also challenged the “one agent with many skills” pattern. Skills weren’t performing well in our own agent, so I asked the team to understand why before copying it, and shared research on when single agents with skills work and when they fail. That is where experience requirements come in: before an agent ships, someone writes down the experience it owes the person on the other side.',
                },
            ],
        },
        {
            n: '04',
            heading: 'What I learnt',
            blocks: [
                {
                    kind: 'text',
                    text: 'Credibility comes from saying what the tool can’t do. The evidence ladder did more to build trust than any demo. And platform choices are research-validity choices: a grounding gap in a tool becomes a methodological problem.',
                },
                {
                    kind: 'text',
                    text: 'Start small with the data, because curated research beats connecting every system at once. Govern by reusing what exists. And hand over early. Coaching someone else to own the work scaled it further than holding on to it.',
                },
                {
                    kind: 'text',
                    text: 'Next, in 2027: a controlled test of a persona built as a skill against one built as a standalone agent, both compared with a real study. A number for the value of the PM pilot. And the governance open items closed, including the validation scorecard.',
                },
            ],
        },
    ],
};
