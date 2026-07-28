'use client';

import type { ContentPodcast } from '@/data/nodeContent';
import { ActionPill } from './ActionPill';

/**
 * PodcastEmbed — presents the podcast the way Spotify itself does: cover art,
 * title, and (inside the embed) the full episode list to browse and preview —
 * not just a text link out. Opens on the given episode when provided; the
 * "Open in Spotify" pill is the accessible/no-JS fallback for the same show.
 */
export function PodcastEmbed({ tagline, description, showId, episodeId }: ContentPodcast) {
    const src = episodeId
        ? `https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`
        : `https://open.spotify.com/embed/show/${showId}?utm_source=generator&theme=0`;
    const showUrl = `https://open.spotify.com/show/${showId}`;

    return (
        // Bleeds past the article's own side padding below `sm` only — Spotify's
        // widget has a fixed internal layout width and just clips text rather than
        // reflowing, so the card needs the article's full mobile width to work with.
        <div className="mx-[-24px] sm:mx-0 rounded-none sm:rounded-2xl border-0 sm:border sm:border-ink/10 overflow-hidden bg-background/40">
            <div className="px-6 sm:px-7 py-5 border-b border-ink/10">
                <div className="label-mono mb-2">{tagline}</div>
                <p className="text-ink-soft" style={{ fontSize: 'var(--step--1)', lineHeight: 1.6 }}>
                    {description}
                </p>
            </div>

            {/* Minimal padding on mobile — Spotify's own widget needs the width to lay
                out its text without truncating; the card's rounded corners still clip it
                via the parent's overflow-hidden. */}
            <div className="p-1.5 sm:p-4">
                <iframe
                    src={src}
                    width="100%"
                    height={episodeId ? 152 : 352}
                    style={{ borderRadius: 8, border: 0, display: 'block' }}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Behave & Design — podcast on Spotify"
                />
            </div>

            <div className="px-6 sm:px-7 pb-5 flex justify-end">
                <ActionPill label="Open in Spotify" href={showUrl} external />
            </div>
        </div>
    );
}
