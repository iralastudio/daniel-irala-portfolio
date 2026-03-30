export type LineId = 'profile' | 'projects' | 'thinking';

export type StopId =
    | 'home' | 'about-me' | 'how-i-work' | 'what-i-do' | 'contact'
    | 'workshops' | 'meeting-experience' | 'podcast' | 'product-offering'
    | 'it-key-roles' | 'experiments'
    | 'articles' | 'reading';

export interface MetroLine {
    id: LineId;
    name: string;
    color: string;
    stops: StopId[];
}

export type LabelPosition = 'left' | 'right' | 'top' | 'bottom';

export interface MetroStop {
    id: StopId;
    name: string;
    lines: LineId[];
    coordinates: {
        desktop: { x: number; y: number };
        mobile: { x: number; y: number };
    };
    contentType: 'page' | 'project' | 'portfolio' | 'grid' | 'list';
    labelPosition: LabelPosition;
}
