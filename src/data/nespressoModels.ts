// Models for the interactive instruments in the Nespresso case study
// (nespressoInstruments.tsx, nespressoSurfaces.tsx). Content lives in caseNespresso.ts;
// these types only describe its shape. Nothing here is sized by a number, and no screen
// of the prototype is drawn: the path and the walls are illustrations.

/** A result handed on station by station; one bead changes as it goes. */
export interface RelayModel {
    prompt: string;
    stations: { title: string; line: string }[];
    note?: string;
}

/** Constraints switched on one at a time; each narrows the corridor the research had to pass through. */
export interface CorridorModel {
    prompt: string;
    idle: string;
    constraints: { key: 'view' | 'catalogue' | 'time'; title: string; effect: string }[];
    all: string;
    note?: string;
}

/** A member's path, walked task by task; tasks belong to a phase of the lifecycle. */
export interface WalkModel {
    prompt: string;
    phases: string[];
    tasks: { task: string; tells: string; phase: number; extra?: string }[];
    note?: string;
}

/** The surfaces that were tested as a small system: entry points and exit on one side of a line, a partner's catalogue on the other. */
export interface SurfacesModel {
    prompt: string;
    centre: string;
    sides: { own: string; partner: string };
    nodes: { key: string; name: string; kind: string; side: 'own' | 'partner'; tested: string; detail: string }[];
    idle: string;
    note?: string;
}

export type NespressoBlock =
    | { kind: 'relay'; model: RelayModel }
    | { kind: 'corridor'; model: CorridorModel }
    | { kind: 'walk'; model: WalkModel }
    | { kind: 'surfaces'; model: SurfacesModel };

const NESPRESSO_KINDS: readonly string[] = ['relay', 'corridor', 'walk', 'surfaces'];
export const isNespressoBlock = (b: { kind: string }): b is NespressoBlock => NESPRESSO_KINDS.includes(b.kind);
