'use client';

import { ExternalLink } from 'lucide-react';
import { useLineTheme } from '@/hooks/useLineTheme';

const SPOTIFY_SHOW_ID = '2JJRpWJXJzyMMB7if0ZAh7';

export function Podcast() {
    const { color } = useLineTheme();

    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/50 mb-2">
                    Audio · Behavioral Science · Enterprise Design
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Behave &amp; Design</h2>
                <div className="h-1 w-16 md:w-20 rounded-full" style={{ backgroundColor: color }} />
            </div>

            <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
                Where behavioral science meets enterprise complexity.{' '}
                <span className="text-white font-medium">Behave &amp; Design</span> decodes why
                organizations struggle with consistency, governance, and transformation — despite
                having smart people and good intentions. Through frameworks like journey management,
                service blueprinting, and systems thinking, each episode transforms organizational
                friction into design opportunities.
            </p>

            {/* Spotify Embed */}
            <div className="rounded-xl overflow-hidden">
                <iframe
                    src={`https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}?utm_source=generator&theme=0`}
                    width="100%"
                    height="232"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Behave & Design — Podcast on Spotify"
                />
            </div>

            {/* CTA */}
            <a
                href={`https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-lg glass-frontstage text-sm font-medium text-white transition-all duration-300 group"
                style={{
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: `${color}33`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}80`)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = `${color}33`)}
            >
                <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Listen on Spotify
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
        </div>
    );
}
