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
export declare const START_SEEN_CLASS = "cf-start-seen";
/**
 * Whether the start screen should be open once the page runs in the browser: wanted on
 * this page and not yet seen on this device.
 */
export declare function startScreenDue(app: string, wanted?: boolean): boolean;
/**
 * A small script for the document's `<head>`, run before the first paint: when the start
 * screen has been seen on this device, it marks `<html>` so the screen is never shown.
 *
 * @param app - The app's id, the same as given to `useStartScreen`, e.g. "controlfreak".
 */
export declare function startScreenSeenScript(app: string): string;
/**
 * Whether the app should show its start screen, and the function that closes it for good
 * on this device (pass it as the start screen's `onDismiss`; it is stable).
 *
 * @param app - The app's id, the same as given to `startScreenSeenScript`.
 * @param wanted - Whether this page shows a start screen at all (e.g. not on the start
 *   clock's own address); true by default. It may turn true after the first render.
 */
export declare function useStartScreen(app: string, wanted?: boolean): {
    open: boolean;
    dismiss: () => void;
};
