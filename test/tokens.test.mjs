// Checks that the palettes in tokens.css stay complete: every colour exists in the light
// and the dark palette, in hex and in oklch, and every colour theme.css maps exists.
import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const tokens = readFileSync(
  new URL("../css/tokens.css", import.meta.url),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");
const theme = readFileSync(
  new URL("../css/theme.css", import.meta.url),
  "utf8",
);

/** The custom properties declared in the first block after `selector` in `css`. */
function block(css, selector) {
  const start = css.indexOf(selector);
  assert.notEqual(start, -1, `${selector} is missing`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  return new Map(
    [...css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(
      (m) => [m[1], m[2].trim()],
    ),
  );
}

const supports = tokens.slice(tokens.indexOf("@supports"));
const hexOnly = tokens.slice(0, tokens.indexOf("@supports"));
const palettes = {
  "light hex": block(hexOnly, ":root,\n.cf-light"),
  "dark hex": block(hexOnly, ".dark"),
  "light oklch": block(supports, ".cf-light"),
  "dark oklch": block(supports, ".dark"),
};

test("every palette has the same colours", () => {
  const names = [...palettes["light hex"].keys()].sort();
  for (const [name, palette] of Object.entries(palettes)) {
    assert.deepEqual([...palette.keys()].sort(), names, name);
  }
});

test("hex palettes are hex and oklch palettes are oklch", () => {
  for (const [name, palette] of Object.entries(palettes)) {
    for (const [property, value] of palette) {
      const ok = name.endsWith("hex")
        ? /^#[0-9a-f]{6}([0-9a-f]{2})?$/
        : /^oklch\(/;
      assert.match(value, ok, `${name} ${property}`);
    }
  }
});

test("no palette sets the radius, which each app chooses", () => {
  for (const palette of Object.values(palettes))
    assert.equal(palette.has("--radius"), false);
});

test("every colour the theme maps exists in the palettes", () => {
  for (const m of theme.matchAll(/--color-[\w-]+:\s*var\((--[\w-]+)\)/g)) {
    assert.ok(palettes["light hex"].has(m[1]), `${m[1]} is not in tokens.css`);
  }
});
