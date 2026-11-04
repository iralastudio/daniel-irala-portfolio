// Content shown in the click-to-open windows (and mirrored, server-rendered, in
// CrawlableContent for SEO / screen readers). Keyed by the node href.
// Real facts only; live work leads with the research question and carries an
// honest "running now" note. An invitation, not an apology.

export interface ContentFact { value: string; label: string }

export interface ContentAction { label: string; href: string; external?: boolean }

// Term + one-liner pairs (compass entries, talk listings), rendered as a styled
// definition list. Keeps personal statements and listings scannable, never walls.
// `from` / `to` / `ask` are only used by the Tensions instrument (the #thinking window):
// how the problem is usually framed, how Dani frames it, and the question he carries.
export interface ContentListItem { term: string; text: string; from?: string; to?: string; ask?: string }

// A podcast, presented the way Spotify presents it: cover art, description,
// and (via the embed) its own episode list, instead of a plain outbound link.
export interface ContentPodcast {
    tagline: string;
    description: string;
    showId: string;
    episodeId?: string; // opens on this episode; the show's full list is one tap away
}

import type { CaseFigure } from './caseStudies';

export interface NodeContent {
    kicker: string;
    title: string;
    facts?: ContentFact[];
    paragraphs: string[];
    list?: ContentListItem[];
    // When true, `list` renders as the interactive Compass instrument (needle
    // swings to the chosen direction) instead of the plain definition list.
    compass?: boolean;
    // When true, `list` renders as the Tensions instrument (a reframing slider per
    // entry, from the usual framing to Dani's) instead of the plain definition list.
    tensions?: boolean;
    podcast?: ContentPodcast;
    // Images for a compact project window; same Figure + lightbox as the case studies.
    gallery?: CaseFigure[];
    note?: string;
    actions?: ContentAction[];
    // Hand-curated connections to other windows (hrefs), shown as "Connected" at the
    // end of the window. A connection is a claim, so it is written, never inferred;
    // without it the window lists the other windows at its own scale instead.
    related?: string[];
    // The line above the "Book a call" button that closes every PROJECT window
    // (PROJECT_HREFS). Without it the default line applies. Personal windows never get
    // the button: they already end with their own action (Contact me, Let's talk).
    close?: string;
}

/** The one booking link: #contact, and the close of every project window (BookCall). */
export const BOOKING_URL = 'https://calendar.app.google/UqWLuy9k3Ete57Gd8';
export const DEFAULT_CLOSE = 'Want the full story, or to compare notes on something similar?';

// Visible stand-in for a fact Dani has not supplied yet. Must not reach the live site:
// `grep -rn "TODO(" src/data` must list only this line and the definition before merging to main.
export const TODO = (what: string) => `[Placeholder: ${what}]`;

export const IN_PREP =
    'This work is live right now. The full write-up (method, artefacts, outcomes) lands here once it closes.';

export const nodeContent: Record<string, NodeContent> = {
    '#about': {
        kicker: 'Pixel · about',
        title: 'The person behind the systems',
        facts: [
            { value: 'CIO Award', label: 'Nestlé · 2023 · data-informed design' },
            { value: 'M.Des', label: 'Service Design · IED Madrid' },
            { value: 'MSc', label: 'Psychology & Consumer Behaviour' },
            { value: '2022', label: 'At Nestlé IT · Senior since 2025' },
        ],
        paragraphs: [
            "I'm a Senior Design Researcher and Service Designer at Nestlé IT, based in Barcelona. I joined in 2022 as a Learning Experience Designer, moved into design research in 2023, and became Senior Design Researcher in 2025. My work spans qualitative and quantitative research, service design, systems thinking, and journey management inside large enterprise environments.",
            "I treat research as a design material, not an upfront phase. It is an ongoing practice that shapes decisions throughout. I'm equally at home with contextual interviews, facilitation, statistical analysis, and the synthesis work that connects insight to organisational action. My methods include diary studies, survey design, thematic analysis, service blueprinting, journey mapping, and facilitated co-design workshops.",
            'The formal grounding: an M.Des in Service Design (IED Madrid), an MSc in Psychology & Consumer Behaviour (Universidad Nebrija), and a BA in Industrial Design (Universidad Europea de Madrid). Kept sharp through the Service Design Network’s Leadership Lab, Hyper Island’s Human-Centric Innovation, and behaviour design training. The toolkit runs from TheyDo, Cemantica, Figma and Miro to Qualtrics and usability-testing platforms.',
            'Outside the day job: Design for Good (South Africa), co-creating a service design programme to strengthen alumni employability, from needs discovery and journey mapping to a pilot model with impact indicators.',
        ],
        actions: [
            { label: 'Contact me', href: '#contact' },
        ],
    },
    '#compass': {
        kicker: 'Pixel · the compass',
        title: 'What steers the work',
        paragraphs: [],
        compass: true,
        list: [
            { term: 'Vision', text: 'A working world that makes sense: organisations designed on purpose instead of left to happen, where anyone can see the whole and no one pays for a gap they did not create.' },
            { term: 'Mission', text: 'I map how organisations really work, show where the design fails the people in it, and help teams make the right path the easiest one to take.' },
            { term: 'Values', text: 'Close to the evidence, honest about the gaps, useful to whoever has to act on it. I start from the people, because when a process fails it is usually the design, not the person.' },
            { term: 'Direction', text: 'From design researcher, through service design, toward systems leadership. Each step widens the frame, from a single screen to the whole enterprise.' },
            { term: 'Past', text: 'Industrial design taught me to make; psychology, to understand why; service design, to connect the two. Three lenses, one practice.' },
        ],
    },
    '#contact': {
        kicker: 'Say hello',
        title: 'Let’s talk',
        paragraphs: [
            'Whether it’s a role, a collaboration, or comparing notes on journey management, service design, or AI agents, the fastest way is a direct line.',
            'Based in Barcelona (CET), working with global teams.',
        ],
        actions: [
            { label: 'Email me', href: 'mailto:daniel.irala.v@gmail.com' },
            { label: 'Book a call', href: BOOKING_URL, external: true },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/danirala', external: true },
        ],
    },
    '#remote-go': {
        kicker: 'Touchpoint · IED Madrid · 2022',
        title: 'Remote GO',
        facts: [
            { value: '25+', label: 'Remote workers & HR executives tested it' },
            { value: '9', label: 'Prototypes' },
            { value: '40+', label: 'App screens' },
            { value: '1', label: 'Physical device, built' },
        ],
        paragraphs: [
            'A human-centred way to make remote teams feel like a team from day one, tested with 25+ remote workers and HR executives.',
            'A team start-up from my master’s at IED Madrid. I was the product and service designer: the GO Switch, a walkie-talkie for break time, and the platform that helps HR build connection from a new hire’s first week.',
        ],
    },
    '#nespresso': {
        close: 'Curious how the rounds were set up? I’m happy to walk you through it.',
        kicker: 'Touchpoint · Nespresso · 2026',
        title: 'Nespresso Loyalty Program',
        facts: [
            { value: '5', label: 'Tasks in a fixed order, from joining to leaving' },
            { value: '3', label: 'Moments tested: join, spend, leave' },
            { value: '2', label: 'Ways in tested: website banner and newsletter' },
            { value: 'Beyond IT', label: 'Agile assignment with Nespresso' },
        ],
        paragraphs: [
            'Testing the Loyalty Program prototype from joining to leaving, and giving the product team suggestions it went on to implement and adapt.',
            'An agile assignment outside Nestlé IT. One unmoderated test, five tasks in the order a member lives them, covering opt-in, points redemption and opt-out. The suggestions it produced were implemented and adapted by the product team.',
        ],
    },
    '#digital-agent': {
        close: 'I’m happy to walk through the method and the decision in conversation.',
        kicker: 'Touchpoint · Nestlé IT · 2026',
        title: 'Digital Agent · usability testing',
        facts: [
            { value: '35', label: 'Test sessions across 4 rounds' },
            { value: '29', label: 'Participant seats across three roles' },
            { value: '3', label: 'Data sources: SharePoint, LeanIX, ServiceNow' },
            { value: 'Go / No-Go', label: 'Bar agreed with leadership' },
        ],
        paragraphs: [
            'Testing one AI agent across three roles and three data sources, against a go/no-go bar set before anyone sat down. It turned each launch debate into a launch decision.',
            'A conditional go in May, a soft-launch verdict with one hard gate in July, a soft launch with about 120 users in September, and a full launch planned for 5,000 users in December. A controlled model change showed that the model underneath an agent is a design decision. Programme figures stay inside Nestlé.',
        ],
        related: ['#it-key-roles'],
    },
    '#synthetic-users': {
        close: 'Drawing the same line for AI personas in your own organisation? Let’s compare notes.',
        kicker: 'Team · Nestlé IT · 2026',
        title: 'Synthetic users & Experience Requirements for agents',
        facts: [
            { value: '2', label: 'Synthetic users built and piloted' },
            { value: '6', label: 'Approved uses in the operating guideline' },
            { value: '4', label: 'Go/stop questions before using one' },
            { value: '5', label: 'Gaps in existing governance identified and proposed' },
        ],
        paragraphs: [
            'Testing whether AI personas can make research sharper without pretending to be research, then writing the rules that keep them honest.',
            'I built and piloted two role-based synthetic users, wrote the framework and operating guideline anchored in the governance Nestlé already has, and handed the documents on. A synthetic user can produce assumptions and hypotheses, never findings.',
        ],
    },
    '#design-maturity': {
        kicker: 'Team · Nestlé IT · 2022–2025',
        title: 'Growing UX maturity at Nestlé IT',
        facts: [
            { value: '6', label: 'Stages on the NN/g maturity scale' },
            { value: '4', label: 'Factors assessed: strategy, culture, process, outcomes' },
            { value: '2', label: 'Cities for two-day workshops: Barcelona and Milan' },
            { value: '13', label: 'Questions in the 2025 self-assessment' },
        ],
        paragraphs: [
            'Measuring how well product teams work with UX, then building the skills, the community and the next assessment to move them up the scale.',
            'A baseline put one stream at the Emergent stage of the NN/g scale. From 2024 I helped build training and two-day workshops, then designed a 2025 assessment to scale to other streams.',
        ],
    },
    '#it-product': {
        kicker: 'Organisation · Nestlé IT · 2025',
        title: 'E2E IT Product Offering',
        facts: [
            { value: '40+', label: 'In-depth interviews' },
            { value: '71', label: 'Survey responses' },
            { value: '58%', label: 'Reported shadow initiatives' },
            { value: '6', label: 'Systemic challenges surfaced' },
        ],
        paragraphs: [
            'Research into how Nestlé employees discover, evaluate and adopt IT products and services. It surfaced significant friction in the end-to-end experience, from a catalogue few trusted to an approval path spanning five governance layers. Synthesis produced four personas and twelve documented pain points.',
            'Ten co-creation sessions across three zones led the core team to a shared future-state vision and three prioritised directions, each with an owner, a roadmap and a success metric. Role: Lead Design Researcher & Service Designer.',
        ],
    },
    '#it-key-roles': {
        kicker: 'Organisation · Nestlé IT · 2026',
        title: 'IT Key Roles Journey Atlas',
        facts: [
            { value: '6 of 41', label: 'Opportunities selected to build' },
            { value: 'All 6', label: 'Selected opportunities with a business case' },
            { value: '4', label: 'Roles mapped as one chain' },
            { value: '9', label: 'IT streams across 3 zones' },
        ],
        paragraphs: [
            'Mapping what the roles that run enterprise IT do all day, then reading their problems against each other to find where one AI agent could help all of them.',
            'The same three gaps run through every role: find what exists, frame the request, navigate the process. Of 41 opportunities scored, six now have a business case and are in the 2027 build; none has shipped, so this is a record of decisions, not results.',
        ],
        related: ['#digital-agent'],
    },
    '#seamless': {
        kicker: 'Organisation · Nestlé IT · 2024–2025',
        title: 'E2E Seamless Conferencing Experience',
        facts: [
            { value: '270k+', label: 'Employees reached' },
            { value: 'Lead', label: 'Design Researcher' },
            { value: 'DEX', label: 'Framework built' },
            { value: 'Nestlé IT', label: 'Client' },
        ],
        paragraphs: [
            'A research and service-design engagement on how employees across the organisation experience meeting and collaboration tools. It was the first time the company examined this experience at this depth. I led research planning and execution, as-is journey mapping, and the envisioning workshops.',
            'Deliverables included a multi-persona research framework, as-is and future-state journey maps, a Digital Employee Experience (DEX) Framework, and a practical Outlook room-tagging system that was subsequently implemented.',
        ],
    },
    '#talks': {
        kicker: 'Beyond · speaking & teaching',
        title: 'Talks & Workshops',
        paragraphs: [
            'I share what I learn: the real, messy, constraint-filled version of applying design and systems approaches inside large organisations.',
        ],
        list: [
            {
                term: 'Systems Thinking in Practice: Real Constraints, No Fluff',
                text: 'Si Design Hub · March 2026. Walking through the E2E IT Product Offering case: systems thinking inside a global organisation: messy constraints, political realities, and frameworks adapted to context.',
            },
        ],
        note:
            'Why I share: systems thinking is not a superpower. It’s a practice, and it starts imperfectly. The gap between theory and real organisational constraints is where the hardest learning happens. The recording will be linked here once published.',
        actions: [
            { label: 'Contact me', href: '#contact' },
        ],
    },
    '#thinking': {
        kicker: 'Beyond · the wider field',
        title: 'Thinking · six tensions I’m exploring',
        paragraphs: [
            'Six tensions I keep running into at work. Each one starts with how the problem is usually described. Drag it towards how I see it now, and read the question I’m still asking.',
        ],
        tensions: true,
        list: [
            {
                term: 'The line and the system',
                from: 'A team missed its date.',
                to: 'A delay travelled and landed on the last team.',
                text: 'We plan projects as a line, team after team, and then judge each team alone. Work is more connected than that, so delays and errors travel and show up later with a different team’s name on them. I don’t think anyone in that chain was careless.',
                ask: 'What arrived late before this?',
            },
            {
                term: 'Journeys and silos',
                from: 'A problem in one touchpoint.',
                to: 'A gap between two of them.',
                text: 'People live a journey from start to finish, while organisations manage it in pieces. That is why most experience debt sits between touchpoints, not inside them. Mapping the journey end to end is how I make those seams visible.',
                ask: 'Who looks after the space between two teams?',
            },
            {
                term: 'Designed or happened',
                from: 'A process that is broken.',
                to: 'A system nobody designed.',
                text: 'Many of the systems we work in were never designed. They just happened, and people learned to work around them. Mapping one shows what was never decided, which is where deciding it on purpose can start.',
                ask: 'What would this look like if someone had designed it?',
            },
            {
                term: 'Speed and care',
                from: 'We need this faster.',
                to: 'Fast for whom, and at what cost to the system?',
                text: 'I don’t think people do their best at high speed. Fast cultures tend to produce solutions that serve the people who made them more than the wider system. Working smarter helps, and some work still takes effort, care and attention to what matters to whoever asked for it.',
                ask: 'Who pays for this speed?',
            },
            {
                term: 'Experience and the dashboard',
                from: 'The technical KPIs look healthy.',
                to: 'Experience data says how the service feels.',
                text: 'Experience data is starting to replace purely technical KPIs. Experience level agreements (XLAs) turn service quality into a design material. Most organisations are only beginning to notice what that changes about how decisions get made.',
                ask: 'Which decision would change if we measured how it feels?',
            },
            {
                term: 'Agents and trust',
                from: 'The agent has a bug.',
                to: 'A person had to decide whether to trust it.',
                text: 'When an AI agent disappoints people, we usually call it a bug or a capability gap. I think it is more often about behaviour and trust. Someone has to design the moment a person decides whether to rely on an agent, and few people are talking about how agents should behave.',
                ask: 'What should an agent do when it does not know?',
            },
        ],
        note: 'These threads also get talked through out loud on Behave & Design, my podcast, and the written essays and reading list are still being prepared. If you’re thinking about any of these, I’d rather compare notes than wait for the essay. Say hello.',
    },
    '#podcast': {
        kicker: 'Beyond · the podcast',
        title: 'Behave & Design',
        paragraphs: [],
        podcast: {
            tagline: 'Audio · Behavioural science · Enterprise design',
            description:
                'Behave & Design decodes why organisations struggle with consistency, governance, and transformation despite having smart people and good intentions. Through frameworks like journey management, service blueprinting, and systems thinking, each episode turns organisational friction into design material.',
            showId: '2JJRpWJXJzyMMB7if0ZAh7',
            episodeId: '3IOh7jIDKZf6DRxZPSdjH8',
        },
    },
};

export const contentOrder = [
    '#about', '#compass', '#contact',
    '#remote-go', '#nespresso', '#digital-agent',
    '#synthetic-users', '#design-maturity',
    '#it-product', '#it-key-roles', '#seamless',
    '#thinking', '#podcast', '#talks',
];

// The windows that end with "Book a call". Projects only: a project has no action of
// its own, so the call is its one close. Add a new project's href here.
export const PROJECT_HREFS = [
    '#remote-go', '#nespresso', '#digital-agent',
    '#synthetic-users', '#design-maturity',
    '#it-product', '#it-key-roles', '#seamless',
];

// href → which scale/scene it belongs to (rail + panel context, the window's colour,
// and its "More at this scale" list). Index matches `scenes` and the map's GROUP.
export const HREF_SCENE: Record<string, number> = {
    '#about': 0,
    '#compass': 0,
    '#contact': 0,
    '#touchpoint': 1,
    '#remote-go': 1,
    '#nespresso': 1,
    '#digital-agent': 1,
    '#team': 2,
    '#synthetic-users': 2,
    '#design-maturity': 2,
    '#organisation': 3,
    '#it-product': 3,
    '#it-key-roles': 3,
    '#seamless': 3,
    '#thinking': 4,
    '#podcast': 4,
    '#talks': 4,
};
