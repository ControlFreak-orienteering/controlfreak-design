import { useEffect, useId, useState, type FormEvent } from "react";

import type { Lang } from "../i18n/index.js";
import { sendFeedback, type Feedback } from "./send.js";
import { FEEDBACK_TEXTS } from "./texts.js";

type Status = "idle" | "sending" | "sent" | "failed";

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
export function FeedbackForm({ app, lang, open, onClose, intro, send }: FeedbackFormProps) {
  const t = FEEDBACK_TEXTS[lang];
  const id = useId();
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // A sent form starts empty when the dialog is opened again. Name and email stay: it is
  // the same person writing again.
  useEffect(() => {
    if (!open && status === "sent") {
      setMessage("");
      setStatus("idle");
    }
  }, [open, status]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      await (send ?? ((feedback: Feedback) => sendFeedback(app, feedback)))({
        message,
        name,
        email,
      });
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="cf-feedback">
        <p className="cf-feedback-thanks">{t.thanks}</p>
        <div className="cf-feedback-actions">
          <button type="button" className="cf-feedback-button" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="cf-feedback" onSubmit={submit}>
      <p className="cf-feedback-intro">{intro ?? t.intro}</p>
      <label className="cf-feedback-field" htmlFor={`${id}-message`}>
        <span>{t.message}</span>
        <textarea
          id={`${id}-message`}
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="cf-feedback-input"
        />
      </label>
      <label className="cf-feedback-field" htmlFor={`${id}-name`}>
        <span>{t.name}</span>
        <input
          id={`${id}-name`}
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="cf-feedback-input"
        />
      </label>
      <label className="cf-feedback-field" htmlFor={`${id}-email`}>
        <span>{t.email}</span>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="cf-feedback-input"
        />
      </label>
      {status === "failed" && (
        <p role="alert" className="cf-feedback-error">
          {t.failed}
        </p>
      )}
      <div className="cf-feedback-actions">
        <button type="button" className="cf-feedback-button" onClick={onClose}>
          {t.cancel}
        </button>
        <button
          type="submit"
          className="cf-feedback-button cf-feedback-primary"
          disabled={!message.trim() || status === "sending"}
        >
          {status === "sending" ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
