// The start screen once per device: the head script, and whether the screen is due.
import { test } from "node:test";
import assert from "node:assert/strict";

import { START_SEEN_CLASS, startScreenDue, startScreenSeenScript } from "../dist/splash/index.js";

/** A fake storage holding `stored`, or one that throws as blocked storage does. */
const storage = (stored) =>
  stored === "blocked"
    ? { getItem: () => { throw new Error("SecurityError"); } }
    : { getItem: (key) => stored[key] ?? null };

/** Runs the head script against a fake document and storages. */
function runScript(app, local, session = {}) {
  const classes = new Set();
  const document = { documentElement: { classList: { add: (c) => classes.add(c) } } };
  new Function("localStorage", "sessionStorage", "document", startScreenSeenScript(app))(
    storage(local),
    storage(session),
    document,
  );
  return classes;
}

test("the head script marks the page when this app's start screen was seen on the device", () => {
  assert.ok(runScript("controlfreak", { "cf-start-seen:controlfreak": "1" }).has(START_SEEN_CLASS));
  assert.equal(runScript("controlfreak", {}).size, 0);
  // Another app's mark does not count.
  assert.equal(runScript("event", { "cf-start-seen:controlfreak": "1" }).size, 0);
});

test("the head script still honours a mark left in the tab before v0.13.0", () => {
  assert.ok(runScript("run", {}, { "cf-start-seen:run": "1" }).has(START_SEEN_CLASS));
});

test("the head script survives blocked storage", () => {
  assert.equal(runScript("run", "blocked", "blocked").size, 0);
  // One blocked storage does not hide the other's mark.
  assert.ok(runScript("run", "blocked", { "cf-start-seen:run": "1" }).has(START_SEEN_CLASS));
});

test("the start screen is due when wanted and not seen on this device", () => {
  const local = {};
  const session = {};
  globalThis.window = { localStorage: storage(local), sessionStorage: storage(session) };
  try {
    assert.equal(startScreenDue("run"), true);
    assert.equal(startScreenDue("run", false), false);
    local["cf-start-seen:run"] = "1";
    assert.equal(startScreenDue("run"), false);
    assert.equal(startScreenDue("event"), true);
    session["cf-start-seen:event"] = "1";
    assert.equal(startScreenDue("event"), false);
  } finally {
    delete globalThis.window;
  }
});

test("the start screen is due when storage is blocked", () => {
  globalThis.window = { localStorage: storage("blocked"), sessionStorage: storage("blocked") };
  try {
    assert.equal(startScreenDue("mcp"), true);
  } finally {
    delete globalThis.window;
  }
});
