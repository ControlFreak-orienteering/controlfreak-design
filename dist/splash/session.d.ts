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
export declare const START_SEEN_CLASS = "cf-start-seen";
/**
 * A small script for the document's `<head>`, run before the first paint: when the start
 * screen has been seen in this tab, it marks `<html>` so the screen is never shown.
 *
 * @param app - The app's id, the same as given to `useStartScreen`, e.g. "controlfreak".
 */
export declare function startScreenSeenScript(app: string): string;
/**
 * Whether the app should show its start screen, and the function that closes it for the
 * rest of the session (pass it as the start screen's `onDismiss`; it is stable).
 *
 * @param app - The app's id, the same as given to `startScreenSeenScript`.
 * @param wanted - Whether this page shows a start screen at all (e.g. not on the start
 *   clock's own address); true by default.
 */
export declare function useStartScreen(app: string, wanted?: boolean): {
    open: boolean;
    dismiss: () => void;
};
