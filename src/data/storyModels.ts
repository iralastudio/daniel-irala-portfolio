// Models for the storytelling instruments drawn in the system map's bead-and-link
// language (storyInstruments.tsx). Content lives in caseStudies.ts as data; these
// types only describe its shape. None of them carries a score: nothing is sized by a
// number, so no confidential figure can be read off a drawing.

/** One verdict grammar for every visual: solid = go, outline = conditional, dashed = planned. */
export type Verdict = 'go' | 'conditional' | 'planned';

/** Milestones on one track. Steps up to `lived` happened (solid line); later ones are ahead (dashed). */
export interface JourneyModel {
    prompt: string;
    lived: number;
    steps: { when: string; title: string; verdict: Verdict; detail: string }[];
    note?: string;
}

/** One agent at the centre, reached through several systems; one spoke per test round. */
export interface WaysInModel {
    prompt: string;
    centre: string;
    spokes: { system: string; when: string; tested: string; roles: string; sessions: string }[];
    note?: string;
}

/** A controlled comparison: everything held the same except one layer. */
export interface SwapModel {
    prompt: string;
    same: string[];
    before: { model: string; verdict: string };
    after: { model: string; verdict: string };
    note?: string;
}

/** Answers side by side under one question; the flagged one is the failure nobody can see. */
export interface SilentModel {
    prompt: string;
    question: string;
    cards: { mock: 'right' | 'wrong' | 'empty'; answer: string; tell: string; flagged?: boolean; badge?: string }[];
    note?: string;
}

export type StoryCaseBlock =
    | { kind: 'journey'; model: JourneyModel }
    | { kind: 'waysin'; model: WaysInModel }
    | { kind: 'swap'; model: SwapModel }
    | { kind: 'silent'; model: SilentModel };

const STORY_KINDS: readonly string[] = ['journey', 'waysin', 'swap', 'silent'];
export const isStoryBlock = (b: { kind: string }): b is StoryCaseBlock => STORY_KINDS.includes(b.kind);
