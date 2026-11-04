import { scenes, type Scene } from '@/data/scenes';

// Graph data for an Obsidian-style force-directed "system map".
// d3-force runs LIVE inside react-force-graph (see SystemMap.tsx). Here we describe
// the nodes, the (dense) links, and a CIRCULAR target layout: Daniel Irala at the
// centre, the four scales spread as sectors of one disc so the whole reads as a
// circle (not a diamond). Each node carries a target position (tx, ty) the live
// simulation settles toward.

export interface MapNode {
    id: string;
    cluster: number;
    r: number;
    kind: 'hub' | 'project' | 'satellite';
    color: string;        // concrete hex (canvas can't resolve CSS vars)
    label?: string;
    href?: string;        // anchor key into nodeContent → opens a window
    tx: number;           // target position in the disc (held by forceX/forceY)
    ty: number;
    // Depth in the field, 0 = far, 1 = near. Drives size, alpha, keyline and
    // parallax in paint only — never the physics (docs/MOTION-PLAN, Phase 1).
    z: number;
    // d3-force fills x/y/vx/vy at runtime
    x?: number;
    y?: number;
}
// No href = a bubble that is not openable yet; clicking it focuses its cluster.
interface NamedNode { label: string; href?: string; small?: boolean }
export interface MapLink { source: string; target: string }
export interface ClusterMeta { i: number; cx: number; cy: number; radius: number; label: string; href?: string }
export interface SystemMapData {
    nodes: MapNode[];
    links: MapLink[];
    clusters: ClusterMeta[];
}

// Light-legible group colours, one per scale. Exported for the colour field that
// tints the page toward the active cluster.
export const GROUP = ['#003ED7', '#D9824D', '#C28A00', '#2E8B6F', '#7C5CBF'];

/** Size, alpha and keyline a node earns from its depth. */
export const depthScale = (z: number) => 0.6 + 0.6 * z;
/** Depth as colour: the cluster hue washed toward the field as it recedes. Used by
 *  the static backdrop; the live map caches the same mix per shade. */
export const depthPigment = (hex: string, z: number, bg = '#EBEAE8') => {
    const h = (s: string) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
    const A = h(hex);
    const B = h(bg);
    const k = (1 - Math.min(1, Math.max(0, z))) * 0.62;
    return `rgb(${Math.round(A[0] + (B[0] - A[0]) * k)},${Math.round(A[1] + (B[1] - A[1]) * k)},${Math.round(A[2] + (B[2] - A[2]) * k)})`;
};
// Colour carries most of the distance now (far = hue washed toward the field), so
// alpha only needs a gentle fall.
export const depthAlpha = (z: number, actionable: boolean) => (actionable ? 0.8 + 0.2 * z : 0.45 + 0.4 * z);
// Balanced outer counts so the four sectors weigh evenly → a round disc.
const NODE_COUNT = [8, 58, 62, 66, 70];
const RING = 720; // outer reach of the disc

const r2 = (v: number) => Math.round(v * 100) / 100;

function mulberry32(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hubLabel(s: Scene) {
    return s.id === 'profile' ? 'Daniel Irala' : s.kicker.split('·')[0].trim();
}
// Only the two hubs that hold material found nowhere else stay openable. Touchpoint,
// Team and Organisation are aggregators: their windows restated the panel almost
// verbatim and ended with no action, so clicking them now focuses the cluster instead
// (see SystemMap.onNodeClick). Returning undefined is what marks that difference.
function hubHref(s: Scene): string | undefined {
    const m: Record<string, string> = { profile: '#about', beyond: '#thinking' };
    return m[s.id];
}
function namedNodes(s: Scene): NamedNode[] {
    if (s.id === 'profile')
        return [
            { label: 'About me', href: '#about' },
            { label: 'Contact', href: '#contact' },
            // One bubble for the whole compass (Vision · Mission · Values · Direction ·
            // Past), named for what it answers rather than for the instrument.
            { label: 'What drives me', href: '#compass' },
        ];
    if (s.id === 'beyond')
        return [
            // No 'Thinking' bubble: its window opens from the Beyond hub itself.
            { label: 'Talks', href: '#talks' },
            { label: 'Podcast', href: '#podcast' },
            { label: 'Articles · coming soon' },
            { label: 'Reading · coming soon' },
        ];
    if (s.id === 'organisation')
        return [
            { label: 'E2E IT Product Offering', href: '#it-product' },
            { label: 'IT Key Roles', href: '#it-key-roles' },
            { label: 'Seamless Conferencing', href: '#seamless' },
        ];
    if (s.links) return s.links.map((l) => ({ label: l.label, href: l.href }));
    if (s.cta) return [{ label: s.cta.label, href: s.cta.href }];
    return [];
}

export function buildSystemMap(): SystemMapData {
    const rand = mulberry32(20260613);
    const nodes: MapNode[] = [];
    const links: MapLink[] = [];
    const clusters: ClusterMeta[] = [];
    const idsByCluster: string[][] = [];
    const targets: { x: number; y: number }[][] = [];
    const outer = scenes.length - 1; // four sectors around the centre

    scenes.forEach((s, i) => {
        idsByCluster.push([]);
        targets.push([]);

        const total = NODE_COUNT[i] ?? 16;
        const color = GROUP[i % GROUP.length];
        const named = namedNodes(s);

        // Each outer scale owns a wedge of the disc; nodes fill that wedge from near
        // the centre out to the rim, so the four sectors together make a full circle.
        const angle = i === 0 ? 0 : -Math.PI / 2 + (i - 1) * ((Math.PI * 2) / outer);
        const wedge = Math.PI / outer; // half-span; the four arcs tile the full 360° → a disc

        const placeHub = () =>
            i === 0
                ? { x: 0, y: 0 }
                : { x: r2(Math.cos(angle) * RING * 0.6), y: r2(Math.sin(angle) * RING * 0.6) };
        const placeNode = (n: number) => {
            if (i === 0) {
                // the centre dots ring Daniel Irala
                const a = (n / Math.max(total - 1, 1)) * Math.PI * 2;
                const r = 70 + rand() * 48;
                return { x: r2(Math.cos(a) * r), y: r2(Math.sin(a) * r) };
            }
            // Spread evenly across the full arc (no diagonal gaps) and fill centre→rim.
            const a = angle + (rand() * 2 - 1) * wedge;
            const rr = RING * (0.16 + Math.sqrt(rand()) * 0.94); // sqrt → even area fill of the disc
            return { x: r2(Math.cos(a) * rr), y: r2(Math.sin(a) * rr) };
        };

        const hubId = `${s.id}-hub`;
        const hp = placeHub();
        nodes.push({
            id: hubId, cluster: i, r: i === 0 ? 19 : 14, kind: 'hub',
            color, label: hubLabel(s), href: hubHref(s),
            tx: hp.x, ty: hp.y, x: hp.x, y: hp.y,
            z: i === 0 ? 1 : 0.9, // landmarks sit nearest
        });
        idsByCluster[i].push(hubId);
        targets[i].push(hp);

        for (let n = 0; n < total - 1; n++) {
            const entry = named[n];
            const isProj = n < named.length;
            const id = `${s.id}-n${n}`;
            const p = placeNode(n + 1);
            // Projects float in the near half; satellites fill the field with more
            // mass far back (the power curve biases toward 0), so the web recedes.
            const z = isProj ? r2(0.6 + rand() * 0.3) : r2(Math.pow(rand(), 1.6) * 0.7);
            nodes.push({
                id, cluster: i,
                r: isProj ? (entry?.small ? 6 : 10.5) : r2(2.4 + rand() * 3),
                kind: isProj ? 'project' : 'satellite',
                color, label: isProj ? entry?.label : undefined,
                href: isProj ? entry?.href : undefined,
                tx: p.x, ty: p.y, x: p.x, y: p.y,
                z,
            });
            targets[i].push(p);
            const peers = idsByCluster[i];
            // denser web: link to hub + 2–4 peers (Obsidian-like interconnection)
            links.push({ source: id, target: hubId });
            const extra = 2 + Math.floor(rand() * 3);
            for (let e = 0; e < extra && peers.length > 1; e++) {
                const other = peers[Math.floor(rand() * peers.length)];
                if (other && other !== id) links.push({ source: id, target: other });
            }
            peers.push(id);
        }

        // Cluster centroid + radius (from the targets) — used to detect which area the
        // viewport is centred on and to frame a sector when flying to it.
        const pts = targets[i];
        const cx = r2(pts.reduce((a, p) => a + p.x, 0) / pts.length);
        const cy = r2(pts.reduce((a, p) => a + p.y, 0) / pts.length);
        let rad = 0;
        for (const p of pts) rad = Math.max(rad, Math.hypot(p.x - cx, p.y - cy));
        clusters.push({ i, cx, cy, radius: r2(Math.max(rad, 70)), label: hubLabel(s), href: hubHref(s) });
    });

    // Centre connects to everything: a spoke to every sector hub + deep into each
    // sector, plus a closed ring between neighbouring sectors → one whole circle.
    const centreHub = `${scenes[0].id}-hub`;
    for (let i = 1; i < scenes.length; i++) {
        links.push({ source: centreHub, target: `${scenes[i].id}-hub` });
        const next = i === scenes.length - 1 ? 1 : i + 1;
        links.push({ source: `${scenes[i].id}-hub`, target: `${scenes[next].id}-hub` });

        const members = idsByCluster[i];
        for (let m = 0; m < 6; m++) {
            const t = members[Math.floor(rand() * members.length)];
            if (t && t !== centreHub) links.push({ source: centreHub, target: t });
        }

        const a = idsByCluster[i];
        const b = idsByCluster[next];
        for (let s = 0; s < 7; s++) {
            const na = a[Math.floor(rand() * a.length)];
            const nb = b[Math.floor(rand() * b.length)];
            if (na && nb) links.push({ source: na, target: nb });
        }
    }

    // A handful of long strands across the whole web — organic, interlinked feel.
    const allIds = nodes.map((n) => n.id);
    for (let k = 0; k < 20; k++) {
        const a = allIds[Math.floor(rand() * allIds.length)];
        const b = allIds[Math.floor(rand() * allIds.length)];
        if (a && b && a !== b) links.push({ source: a, target: b });
    }

    // Occlusion (Phase 1): paint order is array order, both on the canvas and in the
    // stacked-mode SVG, so far nodes go first and near beads overlap them. Sorted
    // last, after every seeded draw, so the layout itself is unchanged. Links refer
    // to nodes by id, so nothing depends on the old order.
    nodes.sort((a, b) => a.z - b.z);

    return { nodes, links, clusters };
}
