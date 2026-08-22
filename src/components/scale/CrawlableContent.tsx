import { scenes, overviewScene, type Scene } from '@/data/scenes';
import { nodeContent, contentOrder } from '@/data/nodeContent';

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
 */

function headlineOf(s: Scene) {
    return `${s.headline.lead}${s.headline.accent}`.replace(/\s+/g, ' ').trim();
}

function hrefsOf(s: Scene) {
    const out = (s.links ?? []).map((l) => l.href);
    if (s.cta) out.push(s.cta.href);
    return out;
}

function WindowContent({ id, heading }: { id: string; heading: 'h2' | 'h3' }) {
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
