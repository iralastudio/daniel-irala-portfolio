// Content shown in the click-to-open windows (and mirrored, server-rendered, in
// CrawlableContent for SEO / screen readers). Keyed by the node href.
// Real facts only; live work leads with the research question and carries an
// honest "running now" note. An invitation, not an apology.

export interface ContentFact { value: string; label: string }

export interface ContentAction { label: string; href: string; external?: boolean }

// Term + one-liner pairs (compass entries, talk listings), rendered as a styled
// definition list. Keeps personal statements and listings scannable, never walls.
export interface ContentListItem { term: string; text: string }

// A podcast, presented the way Spotify presents it: cover art, description,
// and (via the embed) its own episode list, instead of a plain outbound link.
export interface ContentPodcast {
    tagline: string;
    description: string;
    showId: string;
    episodeId?: string; // opens on this episode; the show's full list is one tap away
}

export interface NodeContent {
    kicker: string;
    title: string;
    facts?: ContentFact[];
    paragraphs: string[];
    list?: ContentListItem[];
    // When true, `list` renders as the interactive Compass instrument (needle
    // swings to the chosen direction) instead of the plain definition list.
    compass?: boolean;
    podcast?: ContentPodcast;
    note?: string;
    actions?: ContentAction[];
}

export const IN_PREP =
    'This work is live right now. The full write-up (method, artefacts, outcomes) lands here once it closes. If this space matters to you, I’d rather talk than wait.';

export const nodeContent: Record<string, NodeContent> = {
    '#about': {
        kicker: 'Pixel · about',
        title: 'The person behind the systems',
        facts: [
            { value: 'CIO Award', label: 'Nestlé · data-informed design' },
            { value: 'M.Des', label: 'Service Design · IED Madrid' },
            { value: 'MSc', label: 'Psychology & Consumer Behaviour' },
            { value: '2022', label: 'At Nestlé IT · Senior since 2024' },
        ],
        paragraphs: [
            "I'm a Senior Design Researcher and Service Designer at Nestlé IT, based in Barcelona. I joined in 2022 and was promoted to Senior in 2024. My work spans qualitative and quantitative research, service design, systems thinking, and journey management inside large enterprise environments.",
            "I treat research as a design material, not an upfront phase. It is an ongoing practice that shapes decisions throughout. I'm equally at home with contextual interviews, facilitation, statistical analysis, and the synthesis work that connects insight to organisational action. My methods include diary studies, survey design, thematic analysis, service blueprinting, journey mapping, and facilitated co-design workshops.",
            'The formal grounding: an M.Des in Service Design (IED Madrid), an MSc in Psychology & Consumer Behaviour (Universidad Nebrija), and a BA in Industrial Design (Universidad Europea de Madrid). Kept sharp through the Service Design Network’s Leadership Lab, Hyper Island’s Human-Centric Innovation, and behaviour design training. The toolkit runs from TheyDo, Cemantica, Figma and Miro to Qualtrics and usability-testing platforms.',
            'Outside the day job: Design for Good (South Africa), co-creating a service design programme to strengthen alumni employability, from needs discovery and journey mapping to a pilot model with impact indicators.',
        ],
        actions: [
            { label: 'Contact me', href: '#contact' },
            { label: 'The compass', href: '#compass' },
        ],
    },
    '#compass': {
        kicker: 'Pixel · the compass',
        title: 'What steers the work',
        paragraphs: [],
        compass: true,
        list: [
            { term: 'Vision', text: 'Organisations that can see themselves clearly. The way they serve people made legible, shared, and improvable. Clarity is a form of kindness.' },
            { term: 'Mission', text: 'Map how large organisations serve people, find where the experience breaks, and make the right path the easiest one to take.' },
            { term: 'Values', text: 'Research as a design material, not a phase to finish. Close to the evidence, honest about the gaps, useful to whoever has to act on it.' },
            { term: 'Direction', text: 'From design researcher, through service design, toward systems leadership. Each step widens the frame, from a single screen to the whole enterprise.' },
            { term: 'Future', text: 'Reading the early signals in AI agents and enterprise journeys, before they set the next scale of the work.' },
            { term: 'Past', text: 'Industrial design taught me to make; psychology, to understand why; service design, to connect the two. Three lenses, one practice.' },
        ],
        actions: [
            { label: 'About me', href: '#about' },
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
            { label: 'Email me', href: 'mailto:hello.daniel@irala.studio' },
            { label: 'Book a call', href: 'https://calendar.app.google/UqWLuy9k3Ete57Gd8', external: true },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/danirala', external: true },
        ],
    },
    '#nespresso': {
        kicker: 'Touchpoint · 2026 · case study',
        title: 'Nespresso · minibag A/B test',
        paragraphs: [
            'When does one small interaction change a purchase decision? I’m running a controlled A/B test on the minibag interaction in the Nespresso mobile experience. One screen, one moment, measured properly.',
            'The test isolates a single touchpoint variant and follows how it shifts behaviour. That is the kind of controlled experimentation that keeps design decisions honest at the smallest scale.',
        ],
        note: IN_PREP,
    },
    '#digital-agent': {
        kicker: 'Touchpoint · 2026 · case study',
        title: 'Digital Agent · usability testing',
        facts: [
            { value: '12', label: 'Moderated sessions' },
            { value: '5/9', label: 'Use cases cleared' },
            { value: '73%', label: 'Go rate, from 33%' },
            { value: '86%', label: 'Fewer wrong answers' },
        ],
        paragraphs: [
            'Moderated usability testing of Nestlé IT’s internal Digital Agent with Relationship Managers, run to answer a go or no-go question rather than to collect impressions. Twelve one-to-one sessions across three zones, scored against a readiness rubric agreed before anyone sat down.',
            'The result was a conditional go: five of nine use cases cleared, plus a named list of what had to close first. Swapping the model underneath the agent, with everything else held constant, took the go rate from 33% to 73% and cut confidently-wrong answers by 86%.',
        ],
    },
    '#synthetic-users': {
        kicker: 'Team · 2026 · case study',
        title: 'Synthetic users & Experience Requirements for agents',
        paragraphs: [
            'What can a synthetic user tell you that a real one can’t, and where is the line? I’m using synthetic users to pressure-test research at speed, and writing the Experience Requirements that define how AI agents should behave with people.',
            'It’s service design applied to agent development: before an agent ships, someone has to specify the experience it owes the person on the other side, not just the functions it performs.',
        ],
        note: IN_PREP,
    },
    '#design-maturity': {
        kicker: 'Team · 2022–2024',
        title: 'Design Maturity Workshops',
        paragraphs: [
            'Early in my time at Nestlé, first as a Learning Experience Designer and then as a researcher, I designed and led two-day internal workshops to raise design maturity across key stakeholders.',
            'They pair theory with hands-on activities so design thinking becomes part of how cross-functional teams work day to day, not a service you request from another team. That same facilitation muscle now underpins the envisioning and co-creation workshops in my enterprise projects.',
        ],
    },
    '#it-product': {
        kicker: 'Organisation · 2025 · case study',
        title: 'E2E IT Product Offering',
        facts: [
            { value: '40+', label: 'Interviews' },
            { value: '70+', label: 'Survey responses' },
            { value: '4', label: 'Personas' },
            { value: '12', label: 'Pain points' },
        ],
        paragraphs: [
            'Research into how Nestlé employees discover, evaluate, and adopt IT products and services. It surfaced significant friction in the end-to-end experience of finding and onboarding enterprise tools. Synthesis produced four employee personas and twelve documented pain points.',
            'A three-session co-design workshop series led the core team to a shared future-state vision. Role: Lead Design Researcher & Service Designer.',
        ],
    },
    '#it-key-roles': {
        kicker: 'Organisation · 2026 · case study',
        title: 'IT Key Roles Journey Atlas',
        facts: [
            { value: '4 of 33', label: 'Opportunities selected to build' },
            { value: '1', label: 'Agent, not three role tools' },
            { value: '3', label: 'Roles mapped as one chain' },
            { value: '20+', label: 'Interviews and sessions' },
        ],
        paragraphs: [
            "A journey atlas across the three roles that run enterprise IT day to day: Relationship Managers, Product and Programme Managers, and Architects. Studied as one chain rather than three separate populations, because a Relationship Manager's consolidated demand becomes a Product Manager's roadmap input and then an Architect's design constraint.",
            'The finding that changed the product direction came from reading the three opportunity backlogs against each other. The same three capability gaps run through every role: find what exists, frame the request, navigate the process. Three roles asking for three tools became one agent with three shared capabilities.',
            'Of thirty-three opportunities scored, four were selected to build and are queued to go into the Digital Agent. Nothing has shipped yet, so this is a record of decisions the research changed rather than of outcomes it has proven.',
        ],
    },
    '#seamless': {
        kicker: 'Organisation · 2024–2025 · case study',
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
        title: 'Thinking · three tensions I’m tracking',
        paragraphs: [
            'Experience data is replacing purely technical KPIs. XLAs turn service quality into a design material, and most organisations are only starting to notice what that changes about how decisions get made.',
            'AI agents need experience requirements, not just functional ones. Someone has to design the moment a person decides whether to trust an agent. That is service design work, and right now it mostly isn’t being done.',
            'Systems break at the seams. People experience journeys end-to-end while organisations manage them in silos, so most experience debt lives between touchpoints, not inside them.',
            'These threads also get talked through out loud on Behave & Design, my podcast. The written essays and reading list are still being prepared for this space.',
        ],
        note: 'If you’re thinking about any of these, I’d rather compare notes than wait for the essay. Say hello.',
        actions: [
            { label: 'Contact me', href: '#contact' },
            { label: 'Listen: Behave & Design', href: '#podcast' },
        ],
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
        actions: [
            { label: 'Thinking · three tensions', href: '#thinking' },
        ],
    },
};

export const contentOrder = [
    '#about', '#compass', '#contact',
    '#nespresso', '#digital-agent',
    '#synthetic-users', '#design-maturity',
    '#it-product', '#it-key-roles', '#seamless',
    '#thinking', '#podcast', '#talks',
];
