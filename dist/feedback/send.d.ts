/**
 * Sends the user's feedback to the family's shared feedback page (controlfreak-feedback).
 * Only what the user types in the form is sent, and only when they press the send
 * button. Each app says who it is with its own `app` id, so the messages can be sorted
 * per app; the ids are identifiers and stay as they are when an app is renamed.
 */
/** The feedback page's public API. It allows calls from the browser (CORS). */
export declare const FEEDBACK_ENDPOINT = "https://controlfreak-feedback.lovable.app/api/public/feedback";
/** What the user writes in the feedback form. */
export type Feedback = {
    message: string;
    /** Optional. */
    name?: string;
    /** Optional, for those who want an answer. */
    email?: string;
};
/**
 * The request body: the app's id, the trimmed message, and the optional fields only when
 * they are filled in, so that empty strings are not stored as a name or an address.
 *
 * @param app - The app's id at the feedback page, e.g. "controlfreak".
 * @param feedback - What the user wrote.
 */
export declare function feedbackBody(app: string, feedback: Feedback): Feedback & {
    app: string;
};
/**
 * Sends the feedback.
 *
 * @param app - The app's id at the feedback page.
 * @param feedback - What the user wrote.
 * @param fetchImpl - The fetch to use; the browser's by default (tests pass their own).
 * @throws If it did not arrive (no network, too slow, or an error answer), so the form
 *   can keep the text for another try.
 */
export declare function sendFeedback(app: string, feedback: Feedback, fetchImpl?: typeof fetch): Promise<void>;
