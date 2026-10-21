// The start screen once per session: the head script, and the hook's closing function.
import { test } from "node:test";
import assert from "node:assert/strict";

import { START_SEEN_CLASS, startScreenSeenScript } from "../dist/splash/index.js";

/** Runs the head script against a fake document and storage. */
function runScript(app, stored) {
  const classes = new Set();
  const sessionStorage = { getItem: (key) => stored[key] ?? null };
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } };
  new Function("sessionStorage", "document", startScreenSeenScript(app))(sessionStorage, document);
  return classes;
}

test("the head script marks the page when this app's start screen was seen in the tab", () => {
  assert.ok(runScript("controlfreak", { "cf-start-seen:controlfreak": "1" }).has(START_SEEN_CLASS));
  assert.equal(runScript("controlfreak", {}).size, 0);
  // Another app's mark does not count.
  assert.equal(runScript("event", { "cf-start-seen:controlfreak": "1" }).size, 0);
});

test("the head script survives blocked storage", () => {
  const classes = new Set();
  const blocked = { getItem: () => { throw new Error("SecurityError"); } };
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } };
  new Function("sessionStorage", "document", startScreenSeenScript("run"))(blocked, document);
  assert.equal(classes.size, 0);
});
