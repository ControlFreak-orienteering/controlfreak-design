// Checks the shared icons: the files exist, and iconResponse turns both kinds of data URL
// that Vite produces back into the file's bytes.
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

import { iconResponse } from "../icons.js";

const ASSETS = [
  "controlfreak-mark.svg",
  "favicon.ico",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
];

test("every shared icon is in assets/", () => {
  for (const name of ASSETS) {
    assert.ok(existsSync(new URL(`../assets/${name}`, import.meta.url)), name);
  }
});

test("a base64 data URL gives back the file", async () => {
  const bytes = readFileSync(new URL("../assets/favicon.ico", import.meta.url));
  const response = iconResponse(
    `data:image/x-icon;base64,${bytes.toString("base64")}`,
  );
  assert.equal(response.headers.get("content-type"), "image/x-icon");
  assert.match(response.headers.get("cache-control"), /max-age=86400/);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
});

test("a URL-encoded SVG data URL gives back the text", async () => {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>';
  const response = iconResponse(
    `data:image/svg+xml,${encodeURIComponent(svg)}`,
  );
  assert.equal(response.headers.get("content-type"), "image/svg+xml");
  assert.equal(await response.text(), svg);
});

test("anything else is a 404", () => {
  assert.equal(iconResponse("not a data url").status, 404);
});
