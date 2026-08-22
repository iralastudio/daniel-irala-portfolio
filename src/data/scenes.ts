// Scale spine. A nested system you zoom OUT of, like concentric circles.
// You start fully zoomed IN at the pixel (the individual) and pull back, each
// level revealing the larger system that contains the previous one:
//   pixel ⊂ touchpoint ⊂ team ⊂ organisation ⊂ beyond
// Content here is the source of truth for the scenes; the crawlable detail
// lives in CrawlableContent.tsx (fed by nodeContent.ts).

export type SceneId = 'overview' | 'profile' | 'touchpoint' | 'team' | 'organisation' | 'beyond';

export interface SceneLink {
    label: string;
    meta?: string;   // year / qualifier
    href: string;    // anchor to the in-page detail area
}

export interface Scene {
    id: SceneId;
    index: string;
    kicker: string;
    scale: string;        // power-of-ten, evocative not literal
    scaleLabel: string;
    headline: { lead: string; accent: string; sub?: string };
    body: string;
    chip?: string;            // small contextual label
    cta?: SceneLink;          // single prominent button (the entry)
    links?: SceneLink[];      // project / section links at this level
    tags: string[];
}

// Shown only at the full zoom-out (the whole map visible, nothing in particular
// zoomed into). Distinct from the 'profile' scene below, which is what you see
// once you've zoomed into the "About me" cluster specifically.
export const overviewScene: Scene = {
    id: 'overview',
    index: '00',
    kicker: 'Overview · the whole system',
    scale: '10⁰',
    scaleLabel: 'overview',
    headline: {
        lead: 'Making meaning out of ',
        accent: 'chaos.',
        sub: 'because clarity is a form of kindness.',
    },
    body:
        'Five scales of work, from a single screen to the wider field, held together by one ' +
        'throughline. Zoom into a cluster to see how the parts connect, or click any node to ' +
        'open it.',
    tags: ['Barcelona', 'Nestlé IT', 'Design Research'],
};

export const scenes: Scene[] = [
    {
        id: 'profile',
        index: '00',
        kicker: 'Pixel · the individual',
        scale: '10⁰',
        scaleLabel: 'pixel',
        headline: {
            lead: 'One practitioner, ',
            accent: 'many systems.',
        },
        body:
            'I design the systems behind the experience. That means mapping how an organisation ' +
            'actually serves people, finding where it breaks, then getting teams to agree on a fix ' +
            'that holds. Based in Barcelona. I work across qualitative and quantitative research, ' +
            'service design and systems thinking, inside large enterprises.',
        cta: { label: 'Contact me', href: '#contact' },
        links: [{ label: 'About me', href: '#about' }],
        tags: ['Barcelona', 'Nestlé IT', 'Design Research'],
    },
    {
        id: 'touchpoint',
        index: '01',
        kicker: 'Touchpoint · one screen',
        scale: '10¹',
        scaleLabel: 'touchpoint',
        headline: { lead: 'One screen, ', accent: 'tested.' },
        body:
            'The smallest scale: one interface, one decision, one reaction. A controlled ' +
            'experiment leaves nowhere to hide. Two studies sit here. An A/B test on the ' +
            'Nespresso mobile minibag, and usability testing for Nestlé IT’s Digital Agent.',
        chip: 'Touchpoint · 2026',
        links: [
            { label: 'Nespresso · minibag A/B test', meta: 'mobile', href: '#nespresso' },
            { label: 'Digital Agent · usability testing', meta: 'Nestlé IT', href: '#digital-agent' },
        ],
        tags: ['UX Research', 'A/B Testing', 'Usability Testing', 'Mobile', 'Experimentation'],
    },
    {
        id: 'team',
        index: '02',
        kicker: 'Team · a workflow',
        scale: '10²',
        scaleLabel: 'team',
        headline: { lead: 'A team, ', accent: 'augmented.' },
        body:
            'Here the work stops being one researcher’s output and becomes shared ' +
            'infrastructure. Pressure-testing research with synthetic users, writing the ' +
            'Experience Requirements that shape how AI agents get built, and raising design ' +
            'maturity through hands-on internal workshops.',
        chip: 'Team · 2026',
        links: [
            { label: 'Synthetic users & agent requirements', meta: '2026', href: '#synthetic-users' },
            { label: 'Design Maturity Workshops', meta: '2022–2024', href: '#design-maturity' },
        ],
        tags: ['Synthetic Users', 'Service Design', 'AI Agents', 'Design Maturity'],
    },
    {
        id: 'organisation',
        index: '03',
        kicker: 'Organisation · an enterprise',
        scale: '10⁵',
        scaleLabel: 'organisation',
        headline: { lead: 'An organisation, ', accent: 'as one.' },
        body:
            'Research, services and governance that align 270,000+ people. Three programmes of ' +
            'work across Nestlé IT, recognised with a CIO Award for data-informed design.',
        chip: 'Organisation',
        links: [
            { label: 'E2E IT Product Offering', meta: '2025', href: '#it-product' },
            { label: 'IT Key Roles Journey Atlas', meta: '2026', href: '#it-key-roles' },
            { label: 'Seamless Conferencing', meta: '2024–2025', href: '#seamless' },
        ],
        tags: ['Systems Innovation', 'DEX Framework', 'Enterprise Contexts'],
    },
    {
        id: 'beyond',
        index: '04',
        kicker: 'Beyond · the wider field',
        scale: '10⁷',
        scaleLabel: 'beyond',
        headline: { lead: 'And what does this ', accent: 'mean?' },
        body:
            'The thinking that holds it together. Writing, talks, a podcast, and the books and ' +
            'ideas that shape the practice when it stops asking small questions.',
        cta: { label: 'Explore thinking', href: '#thinking' },
        links: [{ label: 'Talks & Workshops', meta: '2026', href: '#talks' }],
        tags: ['Writing', 'Podcast', 'Talks', 'Reading'],
    },
];
