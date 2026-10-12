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
                            <dd>{item.text}</dd>
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
                <a href="mailto:hello.daniel@irala.studio">hello.daniel@irala.studio</a>
            </address>
        </div>
    );
}
