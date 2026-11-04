// Models for the interactive instruments in the E2E IT Product Offering case study
// (itpoInstruments.tsx, itpoMap.tsx). Content lives in caseStudies.ts; these types only
// describe its shape. The journey map is a representation: it keeps the shape of the real
// map (stages, lanes, pain-point themes) and none of its content. No system, vendor,
// person or card text from the original is reproduced. The percentages are the ones the
// page already states.

/** Four findings from the research, each a share of people, drawn as a ring. */
export interface GaugesModel {
    prompt: string;
    stats: { key: string; value: number; label: string; line: string }[];
    idle: string;
    note?: string;
}

/** The offering journey as one map: stages across, lanes down, pain-point themes under each step. */
export interface OfferingModel {
    prompt: string;
    stages: { name: string; steps: [number, number] }[];
    lanes: { key: 'users' | 'front' | 'back' | 'external'; name: string }[];
    steps: {
        key: string;
        name: string;
        users?: string;
        front?: string;
        back?: string;
        external?: string;
        themes: string[];
        moment?: string;
    }[];
    touchpoints: string;
    idle: string;
    note?: string;
}

/** From evidence to roadmap in six stations, each narrower than the last. */
export interface TrailModel {
    prompt: string;
    stations: { key: string; name: string; line: string; facts: string[] }[];
    idle: string;
    note?: string;
}

/** Five shifts from a problem to a principle. Each can be pressed to move its bead across. */
export interface ShiftsModel {
    prompt: string;
    shifts: { key: string; from: string; to: string; line: string }[];
    idle: string;
    note?: string;
}

export type ItpoBlock =
    | { kind: 'gauges'; model: GaugesModel }
    | { kind: 'offering'; model: OfferingModel }
    | { kind: 'trail'; model: TrailModel }
    | { kind: 'shifts'; model: ShiftsModel };

const ITPO_KINDS: readonly string[] = ['gauges', 'offering', 'trail', 'shifts'];
export const isItpoBlock = (b: { kind: string }): b is ItpoBlock => ITPO_KINDS.includes(b.kind);
