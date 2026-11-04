// Models for the interactive instruments in the Digital Agent case study
// (agentInstruments.tsx, agentTriage.tsx). Content lives in caseStudies.ts; these types only
// describe its shape. No score, weight or threshold is drawn: the bar is a line with no
// numbers on it, the funnel has equal pipes, and the chat is an illustration of a
// behaviour, not a transcript. Any figure on the page lives in the prose and the notes.

import type { Verdict } from './storyModels';

/** Three roles, three systems, and the cables that show who was in the room on which. */
export interface PatchModel {
    prompt: string;
    roles: { key: string; name: string }[];
    systems: { key: string; name: string; when: string; tested: string; sessions: string }[];
    links: { role: string; system: string; seats: string }[];
    note?: string;
}

/** Milestones as gates on a road; each barrier opens as far as its verdict allows. */
export interface GatesModel {
    prompt: string;
    gates: { when: string; title: string; verdict: Verdict; detail: string }[];
    note?: string;
}

/** The same test with one layer swapped, both answers side by side, read two ways: as the person sees them, and as they really are. */
export interface ChatModel {
    prompt: string;
    held: string[];
    changed: string;
    situation: string;
    question: string;
    views: { person: string; real: string };
    models: { key: 'a' | 'b'; name: string; tag: string; answer: string; sees: string; really: string; verdict: string }[];
    note?: string;
}

/** A line between go and wait, with and without a bar agreed beforehand. */
export interface BarModel {
    prompt: string;
    zones: [string, string, string];
    voices: { name: string; says: string }[];
    modes: { none: string; set: string };
    captions: { none: string; set: string; verdictNone: [string, string]; verdictSet: string };
    note?: string;
}

/** One symptom that splits into causes, each with its own fix and owner. */
export interface TriageModel {
    prompt: string;
    symptom: string;
    ask: string;
    causes: { key: string; name: string; sees: string; is: string; fix: string; owner: string }[];
    note?: string;
}

/** Three answers sent past a person and past a gate; only the empty one slips through unseen. */
export interface HardGateModel {
    prompt: string;
    answers: { mock: 'right' | 'wrong' | 'empty'; label: string }[];
    person: string;
    gate: string;
    outcomes: {
        right: string;
        wrong: string;
        emptyOff: string;
        emptyOn: string;
    };
    captions: { off: string; on: string };
    note?: string;
}

/** A funnel of equal pipes: one stage is where it leaked. No sizes, so no number can be read off it. */
export interface FunnelModel {
    prompt: string;
    stages: { name: string; line: string }[];
    leak: number;
    note?: string;
}

export type AgentBlock =
    | { kind: 'patch'; model: PatchModel }
    | { kind: 'gates'; model: GatesModel }
    | { kind: 'chat'; model: ChatModel }
    | { kind: 'bar'; model: BarModel }
    | { kind: 'triage'; model: TriageModel }
    | { kind: 'hardgate'; model: HardGateModel }
    | { kind: 'funnel'; model: FunnelModel };

const AGENT_KINDS: readonly string[] = ['patch', 'gates', 'chat', 'bar', 'triage', 'hardgate', 'funnel'];
export const isAgentBlock = (b: { kind: string }): b is AgentBlock => AGENT_KINDS.includes(b.kind);
