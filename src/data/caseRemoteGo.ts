// Remote GO, the full case study. Kept in its own file because caseStudies.ts is
// past the 500-line limit; it is merged into `caseStudies` there. Facts from Dani's
// project page and write-up (2026-11-02); the unsourced "30%" stat is left out.

import type { CaseStudy } from './caseStudies';

const RGO_IMG = '/images/Project Images/Remote GO';

export const remoteGo: CaseStudy = {
    href: '#remote-go',
    kicker: 'Touchpoint · IED Madrid · 2022',
    title: 'Remote GO',
    summary:
        'A human-centred way to make remote teams feel like a team from day one, tested with 25+ remote workers and HR executives.',
    facts: [
        { value: '25+', label: 'Remote workers & HR executives tested it' },
        { value: '9', label: 'Prototypes' },
        { value: '40+', label: 'App screens' },
        { value: '1', label: 'Physical device, built' },
    ],
    sections: [
        {
            n: '01',
            heading: 'Scenario & result',
            blocks: [
                {
                    kind: 'text',
                    text: 'Picture starting a new job from your kitchen table. Your colleagues are faces in a grid. Nobody stops by your desk to ask how it’s going. After COVID moved work home, that was onboarding for many people, and it was where isolation and miscommunication showed up most.',
                },
                {
                    kind: 'text',
                    text: 'Over a year, our team turned that problem into a start-up. We built a working device, the GO Switch, and the service around it, and tested both with more than 25 remote workers and HR executives, who responded well. Then we pitched it against small companies, and lost.',
                },
                {
                    kind: 'gallery',
                    items: [
                        { src: `${RGO_IMG}/RemoteGO-Hero.png`, alt: 'Remote GO landing page on a dark background, headline “A Whole New Interface”, beside a translucent ring-shaped device glowing purple', caption: 'The pitch: Remote GO and the GO Switch', w: 579, h: 320 },
                    ],
                },
            ],
        },
        {
            n: '02',
            heading: 'Why it matters',
            blocks: [
                {
                    kind: 'quote',
                    text: 'How might we help HR build peer-to-peer engagement between remote professionals in small organisations?',
                },
                {
                    kind: 'text',
                    text: 'The idea comes from the office. You never plan who you’ll bump into at the coffee machine, and those small, unplanned chats are often where working relationships start. Remote work took them away, and another video call doesn’t bring them back. It only adds screen time.',
                },
            ],
        },
        {
            n: '03',
            heading: 'How we did it',
            blocks: [
                {
                    kind: 'text',
                    text: 'I was the product and service designer. I helped steer the project and organise the team, and I led the design and validation of a phygital solution: a physical device and a digital service that work as one.',
                },
                {
                    kind: 'text',
                    text: 'The GO Switch is a small squeezable device that works like a walkie-talkie for break time. When its light is purple, you’re in focus. When it turns blue, it’s connecting you at random with a colleague who is on a break too. You talk by voice, away from the screen.',
                },
                {
                    kind: 'gallery',
                    items: [
                        { src: `${RGO_IMG}/GO-Switch-Anatomy.png`, alt: 'Render of the GO Switch, a white ring-shaped device on a dark base, annotated: squeezable material with a pressure sensor, powerful and efficient chip, 360 sound and Bluetooth, microphone and speakers, designed to fit any environment', caption: 'The GO Switch: a walkie-talkie for break time', w: 580, h: 389 },
                        { src: `${RGO_IMG}/GO-Switch-Prototype.png`, alt: 'The built GO Switch prototype on a dark plinth, its ring glowing blue to pink, labelled “Is communicating!”', caption: 'The working prototype: purple for focus, blue while it connects you with a colleague on a break', w: 535, h: 369 },
                    ],
                },
                {
                    kind: 'text',
                    text: 'Around the device, a community platform helps HR build that connection from a new hire’s first week. It took nine prototypes and more than 40 app screens to get right, designed in Figma, Miro and Notion for the service, and Rhino 3D and KeyShot for the device.',
                },
            ],
        },
        {
            n: '04',
            heading: 'What I learnt',
            blocks: [
                {
                    kind: 'text',
                    text: 'We pitched it against small companies and lost. That loss taught me the most. Pitching as a team, I learnt to speak the language of business and value, not only the language of design. And I learnt to be more precise, and to make the case compelling enough that people want to back it.',
                },
                {
                    kind: 'text',
                    text: 'The research taught me the rest. A structured approach is what makes a fuzzy engagement problem workable, and the solutions that land come from empathy and active listening, not from the idea you started with.',
                },
            ],
        },
    ],
};
