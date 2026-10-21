import type { Lang } from "../i18n/index.js";
import { type Feedback } from "./send.js";
/** What the feedback form needs from the app. */
export type FeedbackFormProps = {
    /** The app's id at the feedback page, e.g. "controlfreak". Not its visible name. */
    app: string;
    lang: Lang;
    /** Whether the dialog around the form is open; a sent form starts empty next time. */
    open: boolean;
    /** Closes the dialog around the form (Cancel, and Close after sending). */
    onClose: () => void;
    /** The app's own intro, e.g. one that says nothing about its events is sent. */
    intro?: string | undefined;
    /** Sends the feedback; `sendFeedback` with `app` by default (tests pass their own). */
    send?: ((feedback: Feedback) => Promise<void>) | undefined;
};
/**
 * The feedback form every app in the family shows: the message (required), name and
 * email (optional), and the send and cancel buttons; after sending, a thank-you and a
 * close button. If sending fails the text stays, so nothing has to be written again.
 *
 * Only the form: each app puts it in its own dialog, so it looks like the app's other
 * dialogs, and gives the dialog the title `FEEDBACK_TEXTS[lang].title`. The look comes
 * from `controlfreak-design/feedback.css` and the app's tokens.
 */
export declare function FeedbackForm({ app, lang, open, onClose, intro, send }: FeedbackFormProps): import("react").JSX.Element;
