// Models for the interactive instruments in the IT Key Roles Journey Atlas case study
// (keyInstruments.tsx, keyField.tsx). Content lives in caseStudies.ts; these types only
// describe its shape. Nothing here is sized by a score or a value: the only counts are the
// opportunity counts the page already states, and no business-case figure is drawn.

/** A chain of hand-offs. Weaken one link and the weakness lands on every link after it. */
export interface RippleModel {
    prompt: string;
    idle: string;
    links: { key: string; role: string; hands: string; bad: string }[];
    note?: string;
}

/** One shared problem read from three desks; pick the gap and the three desks converge on it. */
export interface GapsModel {
    prompt: string;
    roles: [string, string, string];
    gaps: { key: string; name: string; cells: [string, string, string] }[];
    note?: string;
}

/** The selected opportunities read as one chain, each step owned by one of the roles. */
export interface SixChainModel {
    prompt: string;
    roles: { key: string; name: string }[];
    steps: { key: string; name: string; role: string; opportunity: string; line: string }[];
    idle: string;
    note?: string;
}

/** The field of scored opportunities, by role, followed through four steps: scored, signed off, one dropped, a business case for the rest. */
export interface FieldModel {
    prompt: string;
    roles: { key: string; name: string; total: number; case: number; dropped: number }[];
    discovery: { name: string; line: string };
    steps: { key: 'scored' | 'signed' | 'dropped' | 'case'; label: string; headline: string; line: string }[];
    note?: string;
}

/** One dial per role, six stages round each, a bead filled up to where the role stands. */
export interface ClocksModel {
    prompt: string;
    stages: string[];
    roles: { key: string; name: string; stage: number; status: string; facts: string[] }[];
    idle: string;
    note?: string;
}

/** What the agent may do on a review, where a human stays, and what is out of bounds. */
export interface GuardrailModel {
    prompt: string;
    steps: { key: string; name: string; by: 'agent' | 'human'; line: string }[];
    blocked: { name: string; line: string };
    labels: { agent: string; human: string };
    idle: string;
    note?: string;
}

/** Four kinds of fix a friction point can need. Only one of them is an AI capability. */
export interface FixesModel {
    prompt: string;
    types: { key: string; name: string; needs: string; then: string }[];
    idle: string;
    note?: string;
}

/** A journey atlas drawn with placeholders: each zoom level adds a row, and says what that level is for. */
export interface AtlasModel {
    prompt: string;
    levels: { short: string; name: string; nng: string; purpose: string; answers: string; extra?: string }[];
    tags: { key: string; name: string; line: string }[];
    note?: string;
}

export type KeyBlock =
    | { kind: 'atlas'; model: AtlasModel }
    | { kind: 'ripple'; model: RippleModel }
    | { kind: 'gaps'; model: GapsModel }
    | { kind: 'sixchain'; model: SixChainModel }
    | { kind: 'field'; model: FieldModel }
    | { kind: 'clocks'; model: ClocksModel }
    | { kind: 'guardrail'; model: GuardrailModel }
    | { kind: 'fixes'; model: FixesModel };

const KEY_KINDS: readonly string[] = ['atlas', 'ripple', 'gaps', 'sixchain', 'field', 'clocks', 'guardrail', 'fixes'];
export const isKeyBlock = (b: { kind: string }): b is KeyBlock => KEY_KINDS.includes(b.kind);
