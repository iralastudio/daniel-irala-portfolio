/**
 * Where a window opens from (Phase 4). A dot gives its centre and drawn radius
 * (`r`): the window opens as a circle out of the dot. A list row gives its box
 * (`rect`): the window unfolds as a rectangle out of the row. A bare point is a
 * plain click; no origin at all (keyboard elsewhere, deep links) blooms from the
 * upper centre.
 */
export interface WindowOrigin {
    x: number;
    y: number;
    r?: number;
    rect?: { left: number; top: number; right: number; bottom: number };
}

// Pointer position of a click, used as the window circle-reveal origin.
// Keyboard activation (Enter/Space) dispatches a click with detail 0 and
// (0,0) coordinates in several browsers — treat those as "no origin" so the
// reveal uses its designed upper-centre fallback instead of blooming from
// the screen corner.
export function clickOrigin(e: {
    detail: number;
    clientX: number;
    clientY: number;
}): { x: number; y: number } | undefined {
    if (e.detail === 0 || (e.clientX === 0 && e.clientY === 0)) return undefined;
    return { x: e.clientX, y: e.clientY };
}
