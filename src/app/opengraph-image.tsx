import { ImageResponse } from 'next/og';

// Social/link-preview card (LinkedIn, Slack, iMessage, …), generated from the
// same palette as the site so it never drifts from the brand tokens.
export const alt = 'Daniel Irala: Design Researcher & Service Designer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#EBEAE8';
const INK = '#2B2A29';
const INK_SOFT = '#63615E';
const ACCENT = '#003ED7';

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: BG,
                    padding: '72px 84px',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        fontSize: 26,
                        letterSpacing: '0.22em',
                        color: INK,
                        fontWeight: 600,
                    }}
                >
                    <div style={{ width: 14, height: 14, borderRadius: 999, background: ACCENT, display: 'flex' }} />
                    IRALA.STUDIO
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 84, fontWeight: 700, color: INK, lineHeight: 1.04, display: 'flex', flexDirection: 'column' }}>
                        <span>Making meaning</span>
                        <span style={{ display: 'flex' }}>
                            out of&nbsp;<span style={{ color: ACCENT, fontStyle: 'italic' }}>chaos.</span>
                        </span>
                    </div>
                    <div style={{ fontSize: 30, color: INK_SOFT, marginTop: 28, display: 'flex' }}>
                        because clarity is a form of kindness.
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, color: INK_SOFT }}>
                    <span>Daniel Irala: Design Researcher &amp; Service Designer</span>
                    <span>Barcelona</span>
                </div>
            </div>
        ),
        size
    );
}
