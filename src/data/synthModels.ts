// Models for the interactive instruments in the Synthetic Users case study
// (synthInstruments.tsx, synthStack.tsx). Content lives in caseSynthetic.ts; these types
// only describe its shape. Nothing here is sized by a number: the ladder, the rings and the
// map are explorable diagrams of how the practice is built, not data.

/** A short ladder of evidence strength with one wall across it: what a synthetic user can reach, and what only real research can. */
export interface EvidenceModel {
    prompt: string;
    /** Bottom to top. `real` marks the rungs that sit above the wall. */
    rungs: { key: string; name: string; line: string; real?: boolean; use: string }[];
    labels: { synthetic: [string, string]; real: [string, string]; wall: string };
    idle: string;
    note?: string;
}

/** Two sources feeding one answer, and a setting that is meant to close one of them. */
export interface GroundingModel {
    prompt: string;
    sources: { key: 'ours' | 'general'; name: string; line: string }[];
    answer: string;
    setting: { label: string; off: string; on: string };
    outcomes: { off: string; on: string };
    note?: string;
}

/** A hub of rules that already exist, and a second cluster of what was missing and proposed. */
export interface GovMapModel {
    prompt: string;
    centre: string;
    groups: { have: string; missing: string };
    nodes: { key: string; name: string; group: 'have' | 'missing'; line: string }[];
    idle: string;
    note?: string;
}

/** Concentric layers of what a persona is built from, the persona at the middle. */
export interface RingsModel {
    prompt: string;
    centre: string;
    rings: { key: string; name: string; line: string }[];
    idle: string;
    note?: string;
}

/** A set of documents, one open at a time, each with what it contains. */
export interface DocsModel {
    prompt: string;
    docs: { key: string; name: string; when: string; line: string; contains: string[] }[];
    note?: string;
}

export type SynthBlock =
    | { kind: 'evidence'; model: EvidenceModel }
    | { kind: 'grounding'; model: GroundingModel }
    | { kind: 'govmap'; model: GovMapModel }
    | { kind: 'rings'; model: RingsModel }
    | { kind: 'docs'; model: DocsModel };

const SYNTH_KINDS: readonly string[] = ['evidence', 'grounding', 'govmap', 'rings', 'docs'];
export const isSynthBlock = (b: { kind: string }): b is SynthBlock => SYNTH_KINDS.includes(b.kind);
