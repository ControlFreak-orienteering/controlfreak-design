import { useCallback, useEffect, useState } from "react";
/**
 * The start screen once per device: the first time an app is opened in the browser, and
 * not again, in that tab or any other, until the browser's storage for the site is
 * cleared. Remembered in `localStorage`, per app. (Decided 2026-10-24; until v0.13.0 it
 * was once per tab, in `sessionStorage`, and a mark left there still counts.)
 *
 * The server cannot know this, so it renders the start screen every time. To keep it
 * from flashing up before the page notices, the app puts `startScreenSeenScript(app)` in
 * its document's `<head>`: it marks `<html>` with `cf-start-seen` before the first paint,
 * and `splash.css` hides the start screen under that class. `useStartScreen` then takes
 * it out of the page.
 */
/** The class `startScreenSeenScript` puts on `<html>`; `splash.css` hides the screen under it. */
export const START_SEEN_CLASS = "cf-start-seen";
/** Where it is remembered that the app's start screen has been seen on this device. */
const keyFor = (app) => `cf-start-seen:${app}`;
/** Whether one storage says the screen has been seen; blocked storage says no. */
function seenIn(storage, app) {
    try {
        return storage().getItem(keyFor(app)) === "1";
    }
    catch {
        return false;
    }
}
function seen(app) {
    return seenIn(() => window.localStorage, app) || seenIn(() => window.sessionStorage, app);
}
/**
 * Whether the start screen should be open once the page runs in the browser: wanted on
 * this page and not yet seen on this device.
 */
export function startScreenDue(app, wanted = true) {
    return wanted && !seen(app);
}
/**
 * A small script for the document's `<head>`, run before the first paint: when the start
 * screen has been seen on this device, it marks `<html>` so the screen is never shown.
 *
 * @param app - The app's id, the same as given to `useStartScreen`, e.g. "controlfreak".
 */
export function startScreenSeenScript(app) {
    const key = JSON.stringify(keyFor(app));
    const mark = `document.documentElement.classList.add(${JSON.stringify(START_SEEN_CLASS)})`;
    // Each storage on its own, so that one that is blocked does not hide the other.
    return `try{if(localStorage.getItem(${key})==="1")${mark}}catch(e){}try{if(sessionStorage.getItem(${key})==="1")${mark}}catch(e){}`;
}
/**
 * Whether the app should show its start screen, and the function that closes it for good
 * on this device (pass it as the start screen's `onDismiss`; it is stable).
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
            window.localStorage.setItem(keyFor(app), "1");
        }
        catch {
            // Blocked storage: the start screen shows again next time, as before.
        }
        setOpen(false);
    }, [app]);
    return { open, dismiss };
}
