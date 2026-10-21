/**
 * Sends the user's feedback to the family's shared feedback page (controlfreak-feedback).
 * Only what the user types in the form is sent, and only when they press the send
 * button. Each app says who it is with its own `app` id, so the messages can be sorted
 * per app; the ids are identifiers and stay as they are when an app is renamed.
 */
/** The feedback page's public API. It allows calls from the browser (CORS). */
export const FEEDBACK_ENDPOINT = "https://controlfreak-feedback.lovable.app/api/public/feedback";
/** How long to wait for an answer before giving up, in milliseconds. */
const FETCH_TIMEOUT_MS = 15000;
/**
 * The request body: the app's id, the trimmed message, and the optional fields only when
 * they are filled in, so that empty strings are not stored as a name or an address.
 *
 * @param app - The app's id at the feedback page, e.g. "controlfreak".
 * @param feedback - What the user wrote.
 */
export function feedbackBody(app, feedback) {
    const body = { app, message: feedback.message.trim() };
    const name = feedback.name?.trim();
    const email = feedback.email?.trim();
    if (name)
        body.name = name;
    if (email)
        body.email = email;
    return body;
}
/**
 * Sends the feedback.
 *
 * @param app - The app's id at the feedback page.
 * @param feedback - What the user wrote.
 * @param fetchImpl - The fetch to use; the browser's by default (tests pass their own).
 * @throws If it did not arrive (no network, too slow, or an error answer), so the form
 *   can keep the text for another try.
 */
export async function sendFeedback(app, feedback, fetchImpl = fetch) {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetchImpl(FEEDBACK_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(feedbackBody(app, feedback)),
            signal: abort.signal,
        });
        if (!response.ok)
            throw new Error(`Feedback: HTTP ${response.status}`);
    }
    finally {
        clearTimeout(timer);
    }
}
