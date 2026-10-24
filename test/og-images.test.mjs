// The link preview images: one per app, 1200 x 630, drawn by scripts/gen-og-images.py.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { FAMILY_APPS } from "../dist/family/index.js";

test("every app has a 1200 x 630 PNG preview image", () => {
  for (const app of FAMILY_APPS.filter((a) => a.id !== "hub")) {
    const png = readFileSync(new URL(`../assets/og-${app.id}.png`, import.meta.url));
    assert.equal(png.subarray(1, 4).toString("latin1"), "PNG", app.id);
    // The IHDR chunk starts at byte 16 with width and height as 32-bit integers.
    assert.equal(png.readUInt32BE(16), 1200, app.id);
    assert.equal(png.readUInt32BE(20), 630, app.id);
  }
});

test("the outlines hold every app's word, so the images can be drawn again", () => {
  const glyphs = JSON.parse(readFileSync(new URL("../scripts/og-glyphs.json", import.meta.url), "utf8"));
  for (const word of ["ControlFreak", ...FAMILY_APPS.map((a) => a.word).filter(Boolean)]) {
    assert.ok(glyphs.words[word]?.glyphs.length === word.length, word);
  }
});
