// Growing UX maturity at Nestlé IT, the full case study. Own file because caseStudies.ts
// is past the 500-line limit; merged into `caseStudies` there. Source: Dani's UX
// Maturity programme brief (Downloads\UX_Maturity_Program.md, 2026-11-04), adapted under
// docs/CONTENT-STANDARDS.md. Kept off on purpose: every percentage and the per-factor
// scores of the baseline, colleague and sponsor names, the product stream's name, tool
// and vendor names (the two tools benchmarked, the experience-data and process-mapping
// platforms), exact dates, the 2025 score bands, and the budget figure. No outcome of the
// 2025 proposal is on file, so none is claimed. Interactive visuals, one per idea: ladder,
// champion, ring, day, method, ruler (maturityInstruments.tsx, maturityWorkshop.tsx).

import type { CaseStudy } from './caseStudies';

export const designMaturity: CaseStudy = {
    href: '#design-maturity',
    kicker: 'Team · Nestlé IT · 2022–2025',
    title: 'Growing UX maturity at Nestlé IT',
    summary:
        'Measuring how well product teams work with UX, then building the skills, the community and the next assessment to move them up the scale.',
    facts: [
        { value: '6', label: 'Stages on the NN/g maturity scale' },
        { value: '4', label: 'Factors assessed: strategy, culture, process, outcomes' },
        { value: '2', label: 'Cities for two-day workshops: Barcelona and Milan' },
        { value: '13', label: 'Questions in the 2025 self-assessment' },
    ],
    sections: [
        {
            n: '01',
            heading: 'Scenario & result',
            blocks: [
                {
                    kind: 'text',
                    text: 'Product teams at Nestlé IT knew little about UX and rarely used it on purpose. When they did, it wasn’t strategic or consistent, and that cost both the experience of the people receiving the service and the business outcome. The programme set out to change that, using the Nielsen Norman Group’s UX maturity framework.',
                },
                {
                    kind: 'text',
                    text: 'The baseline, run in 2022 by a colleague, put one product stream at the Emergent stage. UX work existed in more teams, but it depended on individual managers choosing to do it, not on how the organisation worked. From 2024 I helped build what could move it to Structured: training, two-day workshops, and a plan to assess other streams.',
                },
                {
                    kind: 'ladder',
                    model: {
                        prompt: 'Where did the baseline land, and where next?',
                        stages: [
                            { name: 'Absent', line: 'UX is ignored or doesn’t exist.' },
                            { name: 'Limited', line: 'UX work is rare, haphazard and treated as unimportant.' },
                            { name: 'Emergent', line: 'UX work is promising, but inconsistent and inefficient. It exists in more teams, but depends on individual managers.' },
                            { name: 'Structured', line: 'UX methods are semi-systematic and widespread, though results vary.' },
                            { name: 'Integrated', line: 'UX work is comprehensive, effective and everywhere.' },
                            { name: 'User-driven', line: 'Commitment to UX at every level produces deep insight and exceptional outcomes.' },
                        ],
                        baseline: 2,
                        next: 3,
                        labels: { baseline: 'Where we started', next: 'The next step' },
                        note: 'Press a stage to read it. Different teams sit at different stages, so the next step was set for the stream, not for everyone at once.',
                    },
                },
            ],
        },
        {
            n: '02',
            heading: 'Why it matters',
            blocks: [
                {
                    kind: 'quote',
                    text: 'Maturity isn’t how good your designers are. It’s whether good UX still happens when the manager who championed it moves on.',
                },
                {
                    kind: 'text',
                    text: 'I made the case in four parts: value (more engagement, faster cycles, less redesign), consistency across streams, better decisions, and a way for employees to find their way through end-to-end processes. UX maturity also became a signal of Nestlé IT’s commitment to employee-centric, end-to-end journeys.',
                },
                {
                    kind: 'champion',
                    model: {
                        prompt: 'What happens to UX when the person who champions it moves on?',
                        champion: 'A manager who champions UX',
                        teams: ['Team A', 'Team B', 'Team C', 'Team D'],
                        shared: 'Shared goals, roles and tools',
                        states: {
                            emergent: {
                                label: 'As the baseline found it',
                                here: 'UX happens where a manager chooses to make it happen.',
                                gone: 'The links break, and UX stops with them.',
                            },
                            structured: {
                                label: 'The next step: built into how we work',
                                here: 'Goals, roles and tools are shared, so teams don’t depend on one person.',
                                gone: 'The champion has moved on, and UX carries on.',
                            },
                        },
                        note: 'An illustration of the finding, not data.',
                    },
                },
                {
                    kind: 'ring',
                    model: {
                        prompt: 'What did the baseline look at, and what did it say?',
                        factors: [
                            {
                                factor: 'Strategy',
                                looked: ['Vision', 'Planning', 'Budget'],
                                saw: 'UX goals were loosely defined, and on some projects UX arrived late.',
                                advised: 'Structure the goals, share them, and prioritise with one method.',
                            },
                            {
                                factor: 'Culture',
                                looked: ['Awareness', 'Support', 'Competency', 'Adaptability'],
                                saw: 'The business often read UX as interface design, and UX roles were unclear.',
                                advised: 'Tell a user-centred story, then add job profiles, career paths and mentoring.',
                            },
                            {
                                factor: 'Process',
                                looked: ['Methods', 'Collaboration', 'Consistency'],
                                saw: 'Each team did its own thing. Design methods like prototyping and ideation rarely came up.',
                                advised: 'Shared tools and frameworks, varied methods, and discovery before delivery.',
                            },
                            {
                                factor: 'Outcomes',
                                looked: ['Impact', 'Measurement'],
                                saw: 'Impact felt weak to moderate, and measurement stopped at satisfaction scores.',
                                advised: 'Judge success by user needs, and report task-level measures to leadership.',
                            },
                        ],
                        note: 'Drawn from 20 interviews and a focus group with the UX and innovation team.',
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
                    text: 'In early 2024 a colleague and I ran two training modules: why UX-centricity matters and what maturity is, then UX versus UI, who owns the experience, and the UX roles. In November 2024 the work moved into the room, with two-day workshops for UX ambassadors in Barcelona and then Milan.',
                },
                {
                    kind: 'day',
                    model: {
                        prompt: 'One workshop day: drag from the first session to the last',
                        groups: ['Where we are', 'Where to go', 'How we get there'],
                        sessions: [
                            { time: '9:00', title: 'Introduction and expectations', group: 0 },
                            { time: '9:30', title: 'Our UX maturity', group: 0, detail: 'The baseline, shown to the people who live it.' },
                            { time: '9:50', title: 'Landscape of UX', group: 0, detail: 'How design is changing: AI and chatbots, designers as coaches and strategists.' },
                            { time: '10:40', title: 'Envision our path', group: 1, detail: 'Why, how and what, using the Golden Circle.' },
                            { time: '11:20', title: 'Vision and mission', group: 1, detail: 'An exercise to write both together.' },
                            { time: '13:15', title: 'Framing the problem', group: 2, detail: 'Real Nestlé cases: a problem statement, the outcomes, how-might-we questions.' },
                            { time: '14:00', title: 'Value proposition', group: 2 },
                            { time: '15:00', title: 'Experience principles', group: 2 },
                            { time: '15:30', title: 'How we measure success', group: 2, detail: 'The KPIs that show whether it is working.' },
                            { time: '16:00', title: 'Lego creation', group: 2, detail: 'A hands-on exercise to build the idea.' },
                            { time: '16:30', title: 'Wrap-up and team offering', group: 2 },
                        ],
                        note: 'Theory and practice in the same day, so design thinking became something teams do, not a service they request.',
                    },
                },
                {
                    kind: 'gallery',
                    items: [
                        { src: '/images/Project Images/Design Maturity/Dani-Presenting.png', alt: 'Daniel presenting at a large screen in a workshop room, a materials trolley beside him', caption: 'Opening a workshop session', w: 579, h: 336 },
                        { src: '/images/Project Images/Design Maturity/Workshop-Journey.png', alt: 'The workshop’s own journey map across planning, a two-day running session and follow-up, with photos of each step and rows of pain points, opportunities and what-if ideas beneath', caption: 'The workshop, mapped as a journey: planning, two days in the room, follow-up', w: 1160, h: 363 },
                        { src: '/images/Project Images/Design Maturity/Tasks-Concerns.png', alt: 'Board of sticky notes in two groups: tasks such as communicating the value of UX and including UX metrics in business KPIs, and concerns such as how to integrate UX in the strategy and how much time to budget', caption: 'What participants had to do, and what worried them about doing it', w: 483, h: 335 },
                        { src: '/images/Project Images/Design Maturity/Problem-KPIs.png', alt: 'Board framing the problem for leaders and practitioners, short- and long-term KPIs such as NPS and number of people who allocate budget, and think-feel-do columns', caption: 'Framing the problem for leaders and practitioners, with the KPIs to track it', w: 677, h: 335 },
                    ],
                },
                {
                    kind: 'text',
                    text: 'Afterwards, participants got the deck, a reading list, the UX repository and an anonymous feedback form. To make maturity concrete, we also published a small case: two collaboration tools benchmarked on the same UX measure. One came out more intuitive, the other more cost-effective for basic use. The result was a better spread of licences and a multi-vendor approach, with savings.',
                },
                {
                    kind: 'method',
                    model: {
                        prompt: 'The 2025 assessment: what does each source give you?',
                        parts: [
                            { key: 'quiz', title: 'Self-assessment quiz', line: 'Fifteen minutes, 13 questions adapted from NN/g.', duration: '1–2 weeks' },
                            { key: 'interviews', title: '1:1 interviews', line: 'Ten to fifteen people across roles.', duration: '2 weeks' },
                        ],
                        states: {
                            none: 'Switch a source on to see what it gives you.',
                            quiz: 'Quick to run, but nothing yet checks it against what people say.',
                            interviews: 'Deep and specific, but slower, and harder to put one stream beside another.',
                            both: 'The quiz is checked against the interviews. Analysis and a report follow, giving each stream a stage on the NN/g scale, a tailored roadmap and UX measures tied to business value.',
                        },
                        note: 'Designed in 2025 to scale across IT streams.',
                    },
                },
                {
                    kind: 'text',
                    text: 'I took it to IT leadership in 2025, asking one or two stream leads to pilot it and to fold the agreed actions into their goals. I also proposed adding people to enterprise architecture’s view: experience data, research and service design next to strategy, business and technology.',
                },
            ],
        },
        {
            n: '04',
            heading: 'What I learnt',
            blocks: [
                {
                    kind: 'text',
                    text: 'You don’t raise maturity by presenting a score. People change what they do when they practise it, in a room, on their own cases, with the KPIs on the wall. The same facilitation now runs the envisioning and co-creation workshops in my enterprise projects.',
                },
                {
                    kind: 'text',
                    text: 'A baseline only counts if you can measure the same way again. Building the 2025 scoring, I saw its five levels didn’t map one to one onto the six NN/g stages, so I flagged aligning them before anyone compared results over time.',
                },
                {
                    kind: 'ruler',
                    model: {
                        prompt: 'Measure the same team again: same ruler, or a different one?',
                        now: ['Absent', 'Limited', 'Emergent', 'Structured', 'Integrated', 'User-driven'],
                        later: ['Absent', 'Nascent', 'Emerging', 'Established', 'Leading'],
                        baseline: 2,
                        heads: { then: 'The baseline', later: 'Next time' },
                        modes: { same: 'The same scale', different: 'A scale with other levels' },
                        captions: {
                            same: 'Same levels, same reading. You can say what moved.',
                            different: 'The new reading falls between two old ones. Did the team move, or did the ruler?',
                        },
                        note: 'An illustration of the problem, not data.',
                    },
                },
            ],
        },
    ],
};
