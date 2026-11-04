import { scenes, overviewScene, type Scene } from '@/data/scenes';
import { nodeContent, contentOrder } from '@/data/nodeContent';
import { caseStudies, type CaseBlock, type CaseStudy } from '@/data/caseStudies';

/**
 * CrawlableContent — server-rendered, visually hidden (sr-only) copy of everything the
 * interactive map holds, so search engines, answer engines and screen readers get the
 * full substance without running the canvas.
 *
 * Structured as the site's actual hierarchy rather than a flat dump: the five scales are
 * h2 sections carrying their own copy (from scenes.ts, the same text the visible panel
 * shows), and each piece of work sits as an h3 *inside* the scale it belongs to. That
 * nesting is the part a machine reads as meaning — "Seamless Conferencing is work at the
 * organisation scale" is only inferable if the markup says so.
 *
 * The scale-level copy comes from scenes.ts deliberately. It used to come from three
 * nodeContent entries that duplicated it; those were removed when hub clicks stopped
 * opening windows, and pointing here at scenes.ts is what keeps the text in the mirror.
 *
 * Where a full case study exists, the mirror carries the case study (every section,
 * and the text inside each instrument) rather than its compact nodeContent summary.
 * The case studies are the richest content on the site; mirroring only the summary
 * left them invisible to anything that doesn't click.
 */

// ScaleExperience decides "is this href openable?" from nodeContent alone, so it
// never has to import the case-study text. That only holds if every case study
// keeps a nodeContent entry. This file renders at build time, so the build fails
// here instead of a case study silently becoming unopenable.
const orphaned = Object.keys(caseStudies).filter((h) => !nodeContent[h]);
if (orphaned.length) {
    throw new Error(`Case studies without a nodeContent entry (unopenable): ${orphaned.join(', ')}`);
}

function headlineOf(s: Scene) {
    return `${s.headline.lead}${s.headline.accent}`.replace(/\s+/g, ' ').trim();
}

function hrefsOf(s: Scene) {
    const out = (s.links ?? []).map((l) => l.href);
    if (s.cta) out.push(s.cta.href);
    return out;
}

// Plain-text rendering of each block. Instruments carry real claims in their
// prompts, cells and notes, so they are mirrored as text; galleries are skipped
// (an sr-only <img> would still download).
function BlockText({ b }: { b: CaseBlock }) {
    switch (b.kind) {
        case 'text':
            return <p>{b.text}</p>;
        case 'quote':
            return <blockquote>{b.text}</blockquote>;
        case 'gallery':
            return null;
        case 'iceberg':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <p>{b.model.above.title}: {b.model.above.note}</p>
                    <ul>
                        {b.model.below.map((c) => (
                            <li key={c.n}>{c.title}: {c.note}</li>
                        ))}
                    </ul>
                    {b.model.outOfScope && <p>Out of scope: {b.model.outOfScope.join('; ')}</p>}
                </div>
            );
        case 'roletrack':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.rows.map((r) => (
                            <li key={r.role}>
                                {r.role} ({b.model.stages[r.stageIndex]}): {r.status}
                                {r.metrics && ` ${r.metrics.map((mt) => `${mt.value} ${mt.label}`).join(', ')}.`}
                                {r.pending && ` ${r.pending}.`}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        case 'chain':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.steps.map((st) => (
                            <li key={st.role}>{st.role}: {st.hands}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'matrix':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    {b.model.rows.map((r) => (
                        <dl key={r.n}>
                            <dt>{r.gap}</dt>
                            {r.cells.map((cell, i) => (
                                <dd key={i}>{b.model.columns[i]}: {cell}</dd>
                            ))}
                        </dl>
                    ))}
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'swing':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.pairs.map((pr) => (
                            <li key={pr.label}>
                                {pr.label}: {pr.from.value} before, {pr.to.value} after
                                ({pr.better} is better).{pr.note && ` ${pr.note}`}
                            </li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'journey':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.steps.map((st) => (
                            <li key={st.title}>{st.when}, {st.title} ({st.verdict}): {st.detail}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'waysin':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.spokes.map((sp) => (
                            <li key={sp.system}>{sp.system}, {sp.when}: {sp.tested}. {sp.roles}. {sp.sessions}.</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'swap':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <p>Held the same: {b.model.same.join(', ')}. Changed: {b.model.before.model} to {b.model.after.model}.</p>
                    <p>{b.model.before.verdict}; then {b.model.after.verdict}.</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'relay':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.stations.map((st) => (
                            <li key={st.title}>{st.title}: {st.line}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'corridor':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.constraints.map((c) => (
                            <li key={c.key}>{c.title}: {c.effect}</li>
                        ))}
                    </ul>
                    <p>{b.model.all}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'walk':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.tasks.map((t) => (
                            <li key={t.task}>
                                {b.model.phases[t.phase]}: {t.task}. {t.tells}{t.extra && ` ${t.extra}`}
                            </li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'surfaces':
            return (
                <div>
                    <p>{b.model.prompt} {b.model.centre}.</p>
                    <ul>
                        {b.model.nodes.map((nd) => (
                            <li key={nd.key}>
                                {nd.name} ({nd.kind}, {nd.side === 'own' ? b.model.sides.own : b.model.sides.partner}): {nd.tested} {nd.detail}
                            </li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'ladder':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.stages.map((st, i) => (
                            <li key={st.name}>
                                {st.name}: {st.line}{i === b.model.baseline && ' Baseline.'}{i === b.model.next && ' Next step.'}
                            </li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'champion':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <p>{b.model.states.emergent.label}: {b.model.states.emergent.here} {b.model.states.emergent.gone}</p>
                    <p>{b.model.states.structured.label}: {b.model.states.structured.here} {b.model.states.structured.gone}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'ring':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.factors.map((fc) => (
                            <li key={fc.factor}>
                                {fc.factor} ({fc.looked.join(', ')}). Saw: {fc.saw} Advised: {fc.advised}
                            </li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'day':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.sessions.map((se) => (
                            <li key={se.time}>
                                {se.time}, {b.model.groups[se.group]}: {se.title}.{se.detail && ` ${se.detail}`}
                            </li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'method':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.parts.map((pt) => (
                            <li key={pt.key}>{pt.title} ({pt.duration}): {pt.line}</li>
                        ))}
                    </ul>
                    <p>{b.model.states.both}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'ruler':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <p>{b.model.captions.same} {b.model.captions.different}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'patch':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.systems.map((sy) => (
                            <li key={sy.key}>
                                {sy.name}, {sy.when}: {sy.tested}. {sy.sessions}.{' '}
                                {b.model.links.filter((l) => l.system === sy.key).map((l) => `${b.model.roles.find((r) => r.key === l.role)?.name}: ${l.seats}.`).join(' ')}
                            </li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'gates':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.gates.map((g) => (
                            <li key={g.title}>{g.when}, {g.title} ({g.verdict}): {g.detail}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'chat':
            return (
                <div>
                    <p>{b.model.prompt} Held the same: {b.model.held.join(', ')}. {b.model.changed}. {b.model.situation} Question: {b.model.question}</p>
                    <ul>
                        {b.model.models.map((md) => (
                            <li key={md.key}>{md.name} ({md.tag}): {md.answer} {b.model.views.person}: {md.sees} {b.model.views.real}: {md.really} {md.verdict}.</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'bar':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <p>{b.model.captions.none} {b.model.captions.set}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'triage':
            return (
                <div>
                    <p>{b.model.prompt} {b.model.symptom}.</p>
                    <ul>
                        {b.model.causes.map((cs) => (
                            <li key={cs.key}>{cs.name}. The user sees: {cs.sees} It is: {cs.is} Fix: {cs.fix} Owner: {cs.owner}.</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'hardgate':
            return (
                <div>
                    <p>{b.model.prompt} {b.model.person}</p>
                    <ul>
                        <li>{b.model.answers[0].label}: {b.model.outcomes.right}</li>
                        <li>{b.model.answers[1].label}: {b.model.outcomes.wrong}</li>
                        <li>{b.model.answers[2].label}: {b.model.outcomes.emptyOff} With the {b.model.gate.toLowerCase()}: {b.model.outcomes.emptyOn}</li>
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'funnel':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.stages.map((st) => (
                            <li key={st.name}>{st.name}: {st.line}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'evidence':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.rungs.map((r) => (
                            <li key={r.key}>{r.name}: {r.line} {r.use}</li>
                        ))}
                    </ol>
                    <p>{b.model.labels.wall}.</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'grounding':
            return (
                <div>
                    <p>{b.model.prompt}. {b.model.setting.label}: {b.model.setting.off}, {b.model.outcomes.off} {b.model.setting.on}, {b.model.outcomes.on}</p>
                    <ul>
                        {b.model.sources.map((so) => (
                            <li key={so.key}>{so.name}: {so.line}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'govmap':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    {(['have', 'missing'] as const).map((g) => (
                        <div key={g}>
                            <p>{b.model.groups[g]}</p>
                            <ul>
                                {b.model.nodes.filter((nd) => nd.group === g).map((nd) => (
                                    <li key={nd.key}>{nd.name}: {nd.line}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'rings':
            return (
                <div>
                    <p>{b.model.prompt}: {b.model.centre}</p>
                    <ol>
                        {b.model.rings.map((r) => (
                            <li key={r.key}>{r.name}: {r.line}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'docs':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.docs.map((d) => (
                            <li key={d.key}>{d.name} ({d.when}): {d.line} {d.contains.join(' ')}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'atlas':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.levels.map((l) => (
                            <li key={l.name}>{l.name} ({l.nng}): {l.purpose} It answers: {l.answers}{l.extra && ` ${l.extra}`}</li>
                        ))}
                    </ol>
                    <ul>
                        {b.model.tags.map((t) => (
                            <li key={t.key}>{t.name}: {t.line}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'gauges':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.stats.map((st) => (
                            <li key={st.key}>{st.value}%: {st.line}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'offering':
            return (
                <div>
                    <p>{b.model.prompt} Touchpoints: {b.model.touchpoints}.</p>
                    <ol>
                        {b.model.steps.map((st) => (
                            <li key={st.key}>
                                {st.name}: {[st.users, st.front, st.back, st.external].filter(Boolean).join(' ')}
                                {st.moment && ` Moment that matters: ${st.moment}.`} Pain-point themes: {st.themes.join('; ')}.
                            </li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'trail':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.stations.map((st) => (
                            <li key={st.key}>{st.name}: {st.line} {st.facts.join(', ')}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'shifts':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.shifts.map((sh) => (
                            <li key={sh.key}>{sh.to} over {sh.from.toLowerCase()}: {sh.line}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'ripple':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.links.map((l) => (
                            <li key={l.key}>{l.role}: {l.hands} If weak: {l.bad}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'gaps':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    {b.model.gaps.map((g) => (
                        <dl key={g.key}>
                            <dt>{g.name}</dt>
                            {g.cells.map((c, i) => (
                                <dd key={i}>{b.model.roles[i]}: {c}</dd>
                            ))}
                        </dl>
                    ))}
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'sixchain':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.steps.map((st) => (
                            <li key={st.key}>{st.name} ({b.model.roles.find((r) => r.key === st.role)?.name}): {st.opportunity}. {st.line}</li>
                        ))}
                    </ol>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'field':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.steps.map((fl) => (
                            <li key={fl.key}>{fl.headline}: {fl.line}</li>
                        ))}
                        <li>{b.model.discovery.name}: {b.model.discovery.line}</li>
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'clocks':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.roles.map((r) => (
                            <li key={r.key}>{r.name} ({b.model.stages[r.stage]}): {r.status} {r.facts.join('; ')}.</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'guardrail':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ol>
                        {b.model.steps.map((st) => (
                            <li key={st.key}>{st.name} ({st.by === 'agent' ? b.model.labels.agent : b.model.labels.human}): {st.line}</li>
                        ))}
                    </ol>
                    <p>{b.model.blocked.name}: {b.model.blocked.line}</p>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'fixes':
            return (
                <div>
                    <p>{b.model.prompt}</p>
                    <ul>
                        {b.model.types.map((t) => (
                            <li key={t.key}>{t.name}: needs {t.needs} {t.then}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
        case 'silent':
            return (
                <div>
                    <p>{b.model.prompt} {b.model.question}</p>
                    <ul>
                        {b.model.cards.map((c) => (
                            <li key={c.answer}>{c.answer}: {c.tell}.{c.badge && ` ${c.badge}.`}</li>
                        ))}
                    </ul>
                    {b.model.note && <p>{b.model.note}</p>}
                </div>
            );
    }
}

function StudyContent({ study, heading }: { study: CaseStudy; heading: 'h2' | 'h3' }) {
    const H = heading;
    const Sub = heading === 'h2' ? 'h3' : 'h4';
    return (
        <article aria-label={study.title}>
            <H>{study.title}</H>
            <p>{study.kicker}</p>
            {study.positioning && <p>{study.positioning}</p>}
            <p>{study.summary}</p>
            <ul>
                {study.facts.map((f) => (
                    <li key={f.label}>
                        {f.value}: {f.label}
                    </li>
                ))}
            </ul>
            {study.sections.map((sec) => (
                <section key={sec.n} aria-label={sec.heading}>
                    <Sub>{sec.heading}</Sub>
                    {sec.blocks.map((b, i) => (
                        <BlockText key={i} b={b} />
                    ))}
                </section>
            ))}
        </article>
    );
}

function WindowContent({ id, heading }: { id: string; heading: 'h2' | 'h3' }) {
    const study = caseStudies[id];
    if (study) return <StudyContent study={study} heading={heading} />;
    const c = nodeContent[id];
    if (!c) return null;
    const H = heading;
    return (
        <section aria-label={c.title}>
            <H>{c.title}</H>
            <p>{c.kicker}</p>
            {c.facts && (
                <ul>
                    {c.facts.map((f) => (
                        <li key={f.label}>
                            {f.value}: {f.label}
                        </li>
                    ))}
                </ul>
            )}
            {c.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
            ))}
            {c.list && (
                <dl>
                    {c.list.map((item) => (
                        <div key={item.term}>
                            <dt>{item.term}</dt>
                            <dd>{item.text}{item.from && ` Usually framed as: ${item.from} How I see it: ${item.to} The question I carry: ${item.ask}`}</dd>
                        </div>
                    ))}
                </dl>
            )}
            {c.podcast && (
                <p>
                    {c.podcast.description}{' '}
                    <a href={`https://open.spotify.com/show/${c.podcast.showId}`}>Listen on Spotify</a>
                </p>
            )}
            {c.note && <p>{c.note}</p>}
            {c.actions && (
                <ul>
                    {c.actions
                        .filter((a) => !a.href.startsWith('#'))
                        .map((a) => (
                            <li key={a.href}>
                                <a href={a.href}>{a.label}</a>
                            </li>
                        ))}
                </ul>
            )}
        </section>
    );
}

export function CrawlableContent() {
    const spine = [overviewScene, ...scenes];
    const nested = new Set(spine.flatMap(hrefsOf));
    // Anything no scale links to still has to appear, or it silently leaves the mirror.
    const unattached = contentOrder.filter((h) => !nested.has(h) && nodeContent[h]);

    return (
        <div className="sr-only">
            <h1>Daniel Irala: Design Researcher and Service Designer</h1>
            <p>
                Making meaning out of chaos, because clarity is a form of kindness. Senior Design Researcher and
                Service Designer at Nestlé IT, based in Barcelona, working across qualitative and quantitative
                research, service design, systems thinking, and journey management in large enterprise environments.
            </p>

            {spine.map((s) => (
                <section key={s.id} aria-label={headlineOf(s)}>
                    <h2>{headlineOf(s)}</h2>
                    <p>{s.kicker}</p>
                    {s.headline.sub && <p>{s.headline.sub}</p>}
                    <p>{s.body}</p>
                    {hrefsOf(s)
                        .filter((h) => nodeContent[h])
                        .map((h) => (
                            <WindowContent key={h} id={h} heading="h3" />
                        ))}
                </section>
            ))}

            {unattached.map((h) => (
                <WindowContent key={h} id={h} heading="h2" />
            ))}

            <address>
                <a href="mailto:daniel.irala.v@gmail.com">daniel.irala.v@gmail.com</a>
            </address>
        </div>
    );
}
