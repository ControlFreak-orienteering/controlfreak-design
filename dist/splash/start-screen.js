import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState, } from "react";
import { FamilySplash } from "./family-splash.js";
/** How long the screen fades out after the button, in milliseconds. */
const FADE_MS = 350;
/**
 * When the button shows at the latest, in milliseconds after the screen appeared in the
 * browser (that is, once the app is hydrated): the family's animation takes 3.45 s, and
 * nobody should have to wait for it to enter an app that is already ready.
 */
export const START_READY_MS = 1500;
/**
 * The start screen every app in the family shows when it opens: the start image (the
 * family's `FamilySplash`, or the app's own through `renderImage`) on the app's own
 * background, and under it a row with a caption on the
 * left and the button that enters the app on the right.
 *
 * It never closes by itself. The row fades in and the button takes focus when the
 * animation is over or after `START_READY_MS`, whichever comes first, while the animation
 * goes on behind it; Enter starts the app, and the user decides when it begins. With
 * reduced motion the image shows without animation and the row at once. The look comes from `controlfreak-design/splash.css` and the app's tokens.
 */
export function StartScreen({ app, alt, caption, enterLabel, onDismiss, className = "", renderImage, }) {
    const [ready, setReady] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const enterRef = useRef(null);
    // Stable identity: the image restarts its timer whenever `onDone` changes.
    const handleDone = useCallback(() => setReady(true), []);
    useEffect(() => {
        if (ready)
            enterRef.current?.focus();
    }, [ready]);
    // Effects run only in the browser, so this counts from when the app is hydrated.
    useEffect(() => {
        const timer = setTimeout(() => setReady(true), START_READY_MS);
        return () => clearTimeout(timer);
    }, []);
    // The latest `onDismiss`, so that a new function from an app that re-renders often (the
    // start clock ticks ten times a second) does not restart the fade-out for ever.
    const dismissRef = useRef(onDismiss);
    dismissRef.current = onDismiss;
    useEffect(() => {
        if (!leaving)
            return;
        const timer = setTimeout(() => dismissRef.current(), FADE_MS);
        return () => clearTimeout(timer);
    }, [leaving]);
    return (_jsx("div", { role: "dialog", "aria-modal": "true", "aria-label": alt, className: `cf-start ${leaving ? "cf-start--leaving" : ""} ${className}`, children: _jsxs("div", { className: "cf-start__inner", children: [renderImage ? (renderImage({ onDone: handleDone, alt, className: "cf-start__image" })) : (_jsx(FamilySplash, { app: app, showBackground: false, caption: null, alt: alt, onDone: handleDone, className: "cf-start__image" })), _jsxs("div", { className: `cf-start__row ${ready ? "" : "cf-start__row--hidden"}`, children: [_jsx("p", { className: "cf-start__caption", children: caption }), _jsx("button", { ref: enterRef, type: "button", className: "cf-start__enter", "aria-hidden": !ready, tabIndex: ready ? undefined : -1, onClick: () => setLeaving(true), children: enterLabel })] })] }) }));
}
