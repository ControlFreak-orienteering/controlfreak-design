// The feedback sender's body and request, and the form's fields and texts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  FEEDBACK_ENDPOINT,
  FEEDBACK_TEXTS,
  FeedbackForm,
  feedbackBody,
  sendFeedback,
} from "../dist/feedback/index.js";
import { LANGS } from "../dist/i18n/index.js";

test("the body carries the app id and leaves out empty optional fields", () => {
  assert.deepEqual(feedbackBody("run", { message: "  Hej  ", name: " ", email: "" }), {
    app: "run",
    message: "Hej",
  });
  assert.deepEqual(feedbackBody("run", { message: "Hej", name: " Anna ", email: "a@b.se" }), {
    app: "run",
    message: "Hej",
    name: "Anna",
    email: "a@b.se",
  });
});

test("sending posts JSON to the feedback page and throws on an error answer", async () => {
  const calls = [];
  const ok = async (url, init) => {
    calls.push([url, init]);
    return { ok: true, status: 200 };
  };
  await sendFeedback("controlfreak", { message: "Hej" }, ok);
  assert.equal(calls[0][0], FEEDBACK_ENDPOINT);
  assert.equal(calls[0][1].method, "POST");
  assert.deepEqual(JSON.parse(calls[0][1].body), { app: "controlfreak", message: "Hej" });
  await assert.rejects(sendFeedback("x", { message: "Hej" }, async () => ({ ok: false, status: 500 })));
});

test("every language has every text, and the form shows them", () => {
  const keys = Object.keys(FEEDBACK_TEXTS.sv).sort();
  for (const lang of LANGS) assert.deepEqual(Object.keys(FEEDBACK_TEXTS[lang]).sort(), keys);
  const html = renderToStaticMarkup(
    createElement(FeedbackForm, { app: "run", lang: "en", open: true, onClose: () => {} }),
  );
  assert.match(html, /<textarea[^>]*required/);
  assert.match(html, /autoComplete="email"|autocomplete="email"/);
  assert.match(html, />Send</);
  assert.match(html, /disabled=""/);
  assert.match(html, /Only what you write here is sent/);
});

test("an app can give its own intro", () => {
  const html = renderToStaticMarkup(
    createElement(FeedbackForm, {
      app: "competitionfreak",
      lang: "sv",
      open: true,
      onClose: () => {},
      intro: "Aldrig något om dina tävlingar.",
    }),
  );
  assert.match(html, /Aldrig något om dina tävlingar\./);
});
