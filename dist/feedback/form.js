import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useState } from "react";
import { sendFeedback } from "./send.js";
import { FEEDBACK_TEXTS } from "./texts.js";
/**
 * The feedback form every app in the family shows: the message (required), name and
 * email (optional), and the send and cancel buttons; after sending, a thank-you and a
 * close button. If sending fails the text stays, so nothing has to be written again.
 *
 * Only the form: each app puts it in its own dialog, so it looks like the app's other
 * dialogs, and gives the dialog the title `FEEDBACK_TEXTS[lang].title`. The look comes
 * from `controlfreak-design/feedback.css` and the app's tokens.
 */
export function FeedbackForm({ app, lang, open, onClose, intro, send }) {
    const t = FEEDBACK_TEXTS[lang];
    const id = useId();
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    // A sent form starts empty when the dialog is opened again. Name and email stay: it is
    // the same person writing again.
    useEffect(() => {
        if (!open && status === "sent") {
            setMessage("");
            setStatus("idle");
        }
    }, [open, status]);
    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim() || status === "sending")
            return;
        setStatus("sending");
        try {
            await (send ?? ((feedback) => sendFeedback(app, feedback)))({
                message,
                name,
                email,
            });
            setStatus("sent");
        }
        catch {
            setStatus("failed");
        }
    };
    if (status === "sent") {
        return (_jsxs("div", { className: "cf-feedback", children: [_jsx("p", { className: "cf-feedback-thanks", children: t.thanks }), _jsx("div", { className: "cf-feedback-actions", children: _jsx("button", { type: "button", className: "cf-feedback-button", onClick: onClose, children: t.close }) })] }));
    }
    return (_jsxs("form", { className: "cf-feedback", onSubmit: submit, children: [_jsx("p", { className: "cf-feedback-intro", children: intro ?? t.intro }), _jsxs("label", { className: "cf-feedback-field", htmlFor: `${id}-message`, children: [_jsx("span", { children: t.message }), _jsx("textarea", { id: `${id}-message`, required: true, rows: 5, value: message, onChange: (e) => setMessage(e.target.value), className: "cf-feedback-input" })] }), _jsxs("label", { className: "cf-feedback-field", htmlFor: `${id}-name`, children: [_jsx("span", { children: t.name }), _jsx("input", { id: `${id}-name`, type: "text", autoComplete: "name", value: name, onChange: (e) => setName(e.target.value), className: "cf-feedback-input" })] }), _jsxs("label", { className: "cf-feedback-field", htmlFor: `${id}-email`, children: [_jsx("span", { children: t.email }), _jsx("input", { id: `${id}-email`, type: "email", autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "cf-feedback-input" })] }), status === "failed" && (_jsx("p", { role: "alert", className: "cf-feedback-error", children: t.failed })), _jsxs("div", { className: "cf-feedback-actions", children: [_jsx("button", { type: "button", className: "cf-feedback-button", onClick: onClose, children: t.cancel }), _jsx("button", { type: "submit", className: "cf-feedback-button cf-feedback-primary", disabled: !message.trim() || status === "sending", children: status === "sending" ? t.sending : t.send })] })] }));
}
