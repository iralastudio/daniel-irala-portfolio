// Nespresso Loyalty Program, the full case study. Own file because caseStudies.ts is
// past the 500-line limit; merged into `caseStudies` there. Facts from Dani's own brief
// (2026-11-04: one unmoderated test, five tasks in lifecycle order) plus the Nestlé
// performance record v2.1 (A2.6: pilot with two participants) and his account of the
// outcome (2026-11-04: the suggestions were implemented and adapted). No findings or
// metrics exist on file; the result is told as the decision it fed. Kept off until
// Nespresso/Nestlé clear them: the machine named in the redemption task, the colleague, the prototype tool, ticket ids, exact dates.
// Interactive visuals, one per idea: relay, corridor, walk, surfaces (nespressoInstruments.tsx,
// nespressoSurfaces.tsx).

import type { CaseStudy } from './caseStudies';

export const nespresso: CaseStudy = {
    href: '#nespresso',
    kicker: 'Touchpoint · Nespresso · 2026',
    title: 'Nespresso Loyalty Program',
    summary:
        'Testing the Loyalty Program prototype from joining to leaving, and giving the product team suggestions it went on to implement and adapt.',
    facts: [
        { value: '5', label: 'Tasks in a fixed order, from joining to leaving' },
        { value: '3', label: 'Moments tested: join, spend, leave' },
        { value: '2', label: 'Ways in tested: website banner and newsletter' },
        { value: 'Beyond IT', label: 'Agile assignment with Nespresso' },
    ],
    sections: [
        {
            n: '01',
            heading: 'Scenario & result',
            blocks: [
                {
                    kind: 'text',
                    text: 'Nespresso was launching a points-based loyalty programme: members earn points and spend them on rewards from a catalogue. The official deadlines had already passed when I joined, on an agile assignment outside Nestlé IT, to validate the prototype. The product owner, the business and the design lead had agreed to test first and keep developing in parallel, so fixes could follow.',
                },
                {
                    kind: 'text',
                    text: 'The test produced suggestions for the programme. The product team implemented them, and adapted them.',
                },
                {
                    kind: 'relay',
                    model: {
                        prompt: 'From test to product: hand the result on',
                        stations: [
                            { title: 'Test', line: 'Five tasks, from joining to leaving, on the prototype.' },
                            { title: 'Suggestions', line: 'Sorted by who can act on them: what Nespresso can change, and what a partner controls.' },
                            { title: 'Product team', line: 'Implemented, then adapted.' },
                        ],
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
                    text: 'The moments where a member’s trust is most at stake are joining and leaving. Redeeming is where the programme has to keep its promise.',
                },
                {
                    kind: 'text',
                    text: 'If the message or the flow shifts between those moments, people have to learn the programme again at every step. The benefit it promises gets harder to see, and the way out is the part a team rushing to launch is most likely to leave underdesigned.',
                },
                {
                    kind: 'corridor',
                    model: {
                        prompt: 'Three constraints shaped the work. Switch them on.',
                        idle: 'Switch a constraint on to see what it asked of the research.',
                        constraints: [
                            { key: 'view', title: 'Limited visibility', effect: 'I was an external party, so I didn’t have full access to internal requirements.' },
                            { key: 'catalogue', title: 'Third-party catalogue', effect: 'A third party manages the catalogue, which limited how much the interface could change. Even the internal team found redeeming complex.' },
                            { key: 'time', title: 'Deadlines passed', effect: 'The official deadlines had gone, so the research had to be fast and produce findings the team could act on while development continued.' },
                        ],
                        all: 'All three at once, and the test still had to give the team something to act on.',
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
                    text: 'One unmoderated test, on the prototype, with five tasks in a fixed order. The order follows the life of a member: join, spend, come back to a reward, use it, leave.',
                },
                {
                    kind: 'walk',
                    model: {
                        prompt: 'Walk the five tasks, in the order a member lives them',
                        phases: ['Join', 'Spend', 'Leave'],
                        tasks: [
                            { phase: 0, task: 'Opt in to the programme', tells: 'Whether the entry points are visible and the commitment is clear.' },
                            { phase: 1, task: 'Redeem a reward', tells: 'Whether people understand the redeem steps and the catalogue.' },
                            { phase: 1, task: 'Find and reuse a redeemed code', tells: 'Whether a reward can be found again after the moment has passed.' },
                            { phase: 1, task: 'Apply several codes at checkout', tells: 'Whether the redemption logic holds up in a real purchase.' },
                            {
                                phase: 2,
                                task: 'Opt out',
                                tells: 'Whether people can find My Profile and leave without help.',
                                extra: 'Last on purpose, and it starts on the catalogue screen: it tests whether someone who has just used the programme can still find the way out on their own.',
                            },
                        ],
                    },
                },
                {
                    kind: 'text',
                    text: 'Order matters in an unmoderated test, because people learn as they go. I set the task order so one task couldn’t teach the next, and ran the first session as a pilot with two participants to check the flow and the questions.',
                },
                {
                    kind: 'surfaces',
                    model: {
                        prompt: 'The surfaces we tested, and who can change them',
                        centre: 'Loyalty Program',
                        sides: { own: 'Nespresso’s side', partner: 'A partner’s side' },
                        idle: 'Press a surface to see what was tested there and who can change it.',
                        nodes: [
                            {
                                key: 'banner',
                                name: 'Homepage banner',
                                kind: 'Entry point',
                                side: 'own',
                                tested: 'Task 1: opt in to the programme.',
                                detail: 'Tests whether the entry point is visible and the commitment is clear. Once someone opts out, the banner does not come back.',
                            },
                            {
                                key: 'newsletter',
                                name: 'Newsletter',
                                kind: 'Entry point',
                                side: 'own',
                                tested: 'Task 1: opt in to the programme.',
                                detail: 'Confirmed ready for the test. After an opt-out it is the one way back in, if the email is still available.',
                            },
                            {
                                key: 'profile',
                                name: 'My Profile',
                                kind: 'Exit',
                                side: 'own',
                                tested: 'Task 5: opt out.',
                                detail: 'Opt-out lives here, not on the catalogue screen. The test starts on the catalogue, so it measures whether people find the way here on their own.',
                            },
                            {
                                key: 'catalogue',
                                name: 'Catalogue',
                                kind: 'Spend',
                                side: 'partner',
                                tested: 'Tasks 2 to 4: redeem a reward, find and reuse a code, apply several codes at checkout.',
                                detail: 'A third party manages it, which limited how much the interface could change. Even the internal team found redeeming complex, so findings here are kept apart from what Nespresso can change.',
                            },
                        ],
                        note: 'Every finding is sorted by this line before it goes to anyone.',
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
                    text: 'A test built on the whole member lifecycle, exit included, tells you things a test of the happy path can’t. And a constraint you can’t change, like a third-party catalogue, still leaves plenty to improve on your own side, as long as the findings are sorted by who can act on them.',
                },
                {
                    kind: 'text',
                    text: '“Validate first, fix in parallel” only works if the research is quick and the findings arrive ready to use. A short pilot is cheap insurance for that: two people can show whether the flow hangs together and whether a question means what you think it means.',
                },
            ],
        },
    ],
};
