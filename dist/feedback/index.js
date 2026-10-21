/**
 * Feedback from the user to the family's shared feedback page: the form every app shows
 * (in its own dialog), its texts in five languages, and the sender. Import
 * `controlfreak-design/feedback.css` in the app's stylesheet for the form's look.
 */
export { FeedbackForm } from "./form.js";
export { FEEDBACK_ENDPOINT, feedbackBody, sendFeedback } from "./send.js";
export { FEEDBACK_TEXTS } from "./texts.js";
