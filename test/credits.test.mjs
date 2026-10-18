// Renders the credit on the server and checks the links and the translated texts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { MadeBy } from "../dist/credits/index.js";

test("the credit links to both authors' GitHub profiles", () => {
  const html = renderToStaticMarkup(createElement(MadeBy, {}));
  assert.match(html, /href="https:\/\/github.com\/HenrikF"/);
  assert.match(html, /href="https:\/\/github.com\/hugoflordal"/);
  assert.match(html, /^<span[^>]*>Gjord av</);
  assert.match(html, /aria-label="Henrik Flordal på GitHub"/);
});

test("the credit follows the app's language", () => {
  const html = renderToStaticMarkup(createElement(MadeBy, { lang: "cs" }));
  assert.match(html, />Vytvořili</);
  assert.match(html, /title="Hugo Flordal na GitHubu"/);
});
