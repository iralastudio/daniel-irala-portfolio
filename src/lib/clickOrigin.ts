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
