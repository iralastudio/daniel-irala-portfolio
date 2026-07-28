import { nodeContent, contentOrder } from '@/data/nodeContent';

/**
 * CrawlableContent — server-rendered, visually hidden (sr-only) copy of every
 * window's content, so search engines and screen readers get the full substance
 * even though the visible experience lives in the interactive map + windows.
 */
export function CrawlableContent() {
    return (
        <div className="sr-only">
            <h1>Daniel Irala — Design Researcher &amp; Service Designer</h1>
            <p>
                Making meaning out of chaos because clarity is a form of kindness. Senior Design Researcher and
                Service Designer at Nestlé IT, based in Barcelona — working across qualitative and quantitative
                research, service design, systems thinking, and journey management in large enterprise environments.
            </p>
            {contentOrder.map((key) => {
                const c = nodeContent[key];
                if (!c) return null;
                return (
                    <section key={key} aria-label={c.title}>
                        <h2>{c.title}</h2>
                        <p>{c.kicker}</p>
                        {c.facts && (
                            <ul>
                                {c.facts.map((f) => (
                                    <li key={f.label}>
                                        {f.value} — {f.label}
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
            })}
            <address>
                <a href="mailto:hello.daniel@irala.studio">hello.daniel@irala.studio</a>
            </address>
        </div>
    );
}
