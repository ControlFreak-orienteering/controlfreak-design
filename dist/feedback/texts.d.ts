/** The feedback form's texts, in the family's five languages. */
import type { Lang } from "../i18n/index.js";
export type FeedbackTexts = {
    /** The dialog's title and the header button's label. */
    title: string;
    /**
     * What the form is for and what is sent. The default says nothing about the app's own
     * data; an app may pass its own (e.g. "never anything about your events").
     */
    intro: string;
    message: string;
    name: string;
    email: string;
    cancel: string;
    send: string;
    sending: string;
    thanks: string;
    close: string;
    failed: string;
};
export declare const FEEDBACK_TEXTS: Record<Lang, FeedbackTexts>;
