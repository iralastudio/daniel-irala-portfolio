'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * useDialogFocus — WAI-ARIA modal behaviour for role="dialog" aria-modal
 * containers (the CaseStudyOverlay content window). aria-modal only hides the
 * background from assistive tech; it does not move or contain focus, so
 * without this a keyboard user keeps tabbing through the page behind the
 * dialog. Attach the returned ref to the dialog root (give it tabIndex={-1}).
 *
 * On mount: remembers the trigger and moves focus onto the dialog.
 * While open: keeps Tab / Shift+Tab cycling inside the dialog.
 * On unmount: returns focus to the trigger.
 */
export function useDialogFocus<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.focus({ preventScroll: true });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;
            const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                (el) => el.offsetParent !== null // skip anything display:none'd
            );
            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (e.shiftKey) {
                if (active === first || active === dialog) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (active === last) {
                e.preventDefault();
                first.focus();
            }
        };

        dialog.addEventListener('keydown', onKeyDown);
        return () => {
            dialog.removeEventListener('keydown', onKeyDown);
            trigger?.focus({ preventScroll: true });
        };
    }, []);

    return ref;
}
