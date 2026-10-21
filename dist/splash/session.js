import { useCallback, useEffect, useState } from "react";
/**
 * The start screen once per session: the first time an app is opened in a tab, and not
 * again after its manual, a change of language or a reload in the same tab. A new tab, or
 * the browser restarted, shows it again. Remembered in `sessionStorage`, per app.
 *
 * The server cannot know this, so it renders the start screen every time. To keep it
 * from flashing up before the page notices, the app puts `startScreenSeenScript(app)` in
 * its document's `<head>`: it marks `<html>` with `cf-start-seen` before the first paint,
 * and `splash.css` hides the start screen under that class. `useStartScreen` then takes
 * it out of the page.
 */
/** The class `startScreenSeenScript` puts on `<html>`; `splash.css` hides the screen under it. */
export const START_SEEN_CLASS = "cf-start-seen";
/** Where it is remembered that the app's start screen has been seen in this tab. */
const keyFor = (app) => `cf-start-seen:${app}`;
function seen(app) {
    try {
        return window.sessionStorage.getItem(keyFor(app)) === "1";
    }
    catch {
        return false;
    }
}
/**
 * Whether the start screen should be open once the page runs in the browser: wanted on
 * this page and not yet seen in this tab.
 */
export function startScreenDue(app, wanted = true) {
    return wanted && !seen(app);
}
/**
 * A small script for the document's `<head>`, run before the first paint: when the start
 * screen has been seen in this tab, it marks `<html>` so the screen is never shown.
 *
 * @param app - The app's id, the same as given to `useStartScreen`, e.g. "controlfreak".
 */
export function startScreenSeenScript(app) {
    return `try{if(sessionStorage.getItem(${JSON.stringify(keyFor(app))})==="1")document.documentElement.classList.add(${JSON.stringify(START_SEEN_CLASS)})}catch(e){}`;
}
/**
 * Whether the app should show its start screen, and the function that closes it for the
 * rest of the session (pass it as the start screen's `onDismiss`; it is stable).
 *
 * @param app - The app's id, the same as given to `startScreenSeenScript`.
 * @param wanted - Whether this page shows a start screen at all (e.g. not on the start
 *   clock's own address); true by default. It may turn true after the first render.
 */
export function useStartScreen(app, wanted = true) {
    const [open, setOpen] = useState(wanted);
    // Also opens it when `wanted` turns true after the first render, as when the page can
    // only tell from its address in the browser whether it shows a start screen.
    useEffect(() => {
        setOpen(startScreenDue(app, wanted));
    }, [app, wanted]);
    const dismiss = useCallback(() => {
        try {
            window.sessionStorage.setItem(keyFor(app), "1");
        }
        catch {
            // Blocked storage: the start screen shows again next time, as before.
        }
        setOpen(false);
    }, [app]);
    return { open, dismiss };
}
