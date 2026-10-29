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
  assert.match(html, /title="Henrik Flordal på GitHub"/);
  // The names are shown, not only the marks.
  assert.match(html, /<\/svg>Henrik Flordal<\/a><span>och<\/span>/);
  assert.match(html, /<\/svg>Hugo Flordal<\/a>/);
});

test("the credit follows the app's language", () => {
  const html = renderToStaticMarkup(createElement(MadeBy, { lang: "cs" }));
  assert.match(html, />Vytvořili</);
  assert.match(html, /title="Hugo Flordal na GitHubu"/);
  assert.match(html, /<span>a<\/span>/);
});
