// Models for the interactive instruments in the UX maturity case study
// (maturityInstruments.tsx, maturityWorkshop.tsx). Content lives in caseMaturity.ts;
// these types only describe its shape. Nothing here is sized by a number, so no score or
// percentage can be read off a drawing: the stairs, rings and tracks are illustrations.

/** A staircase of maturity stages; a bead rides it from the baseline to the next step. */
export interface LadderModel {
    prompt: string;
    stages: { name: string; line: string }[];
    baseline: number;
    next: number;
    labels: { baseline: string; next: string };
    note?: string;
}

/** A champion linked to teams; the viewer removes them to see whether UX survives. */
export interface ChampionModel {
    prompt: string;
    champion: string;
    teams: string[];
    shared: string;
    states: {
        emergent: { label: string; here: string; gone: string };
        structured: { label: string; here: string; gone: string };
    };
    note?: string;
}

/** A ring of assessed factors; selecting one opens what it covered, saw and advised. */
export interface RingModel {
    prompt: string;
    factors: { factor: string; looked: string[]; saw: string; advised: string }[];
    note?: string;
}

/** A day scrubbed session by session; each session belongs to one of the day's movements. */
export interface DayModel {
    prompt: string;
    groups: string[];
    sessions: { time: string; title: string; group: number; detail?: string }[];
    note?: string;
}

/** Two ways of gathering evidence, switched on and off to see what each gives alone and together. */
export interface MethodModel {
    prompt: string;
    parts: { key: 'quiz' | 'interviews'; title: string; line: string; duration: string }[];
    states: { none: string; quiz: string; interviews: string; both: string };
    note?: string;
}

/** The same team read twice: on the same scale, or on one with different levels. */
export interface RulerModel {
    prompt: string;
    now: string[];
    later: string[];
    baseline: number;
    heads: { then: string; later: string };
    modes: { same: string; different: string };
    captions: { same: string; different: string };
    note?: string;
}

export type MaturityBlock =
    | { kind: 'ladder'; model: LadderModel }
    | { kind: 'champion'; model: ChampionModel }
    | { kind: 'ring'; model: RingModel }
    | { kind: 'day'; model: DayModel }
    | { kind: 'method'; model: MethodModel }
    | { kind: 'ruler'; model: RulerModel };

const MATURITY_KINDS: readonly string[] = ['ladder', 'champion', 'ring', 'day', 'method', 'ruler'];
export const isMaturityBlock = (b: { kind: string }): b is MaturityBlock => MATURITY_KINDS.includes(b.kind);
