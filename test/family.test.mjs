// Renders the family header and footer on the server and checks the name, the tools,
// the switcher's list and that optional tools stay out when not given.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { FAMILY_APPS, FamilyFooter, FamilyHeader, FamilyName, familyHubUrl } from "../dist/family/index.js";

test("the name is the family's way: ControlFreak and the app's word in its accent", () => {
  assert.equal(
    renderToStaticMarkup(createElement(FamilyName, { app: "event" })),
    '<span class="cf-family-name">ControlFreak <span class="cf-family-accent-purple">Event</span></span>',
  );
  assert.match(renderToStaticMarkup(createElement(FamilyName, { app: "run" })), /cf-family-accent-orange">Run</);
  assert.equal(renderToStaticMarkup(createElement(FamilyName, { app: "controlfreak" })), '<span class="cf-family-name">ControlFreak</span>');
  assert.match(renderToStaticMarkup(createElement(FamilyName, { app: "startklocka" })), />Startklocka</);
});

test("the header shows the tools it is given, in the language it is given", () => {
  const html = renderToStaticMarkup(
    createElement(FamilyHeader, {
      app: "event",
      lang: "en",
      langHref: (l) => (l === "sv" ? "/" : `/${l}`),
      theme: { dark: false, onToggle: () => {} },
      manualHref: "/manual",
      onFeedback: () => {},
      children: "Vårspringet 2026",
    }),
  );
  assert.match(html, /<header class="cf-family-header"/);
  assert.match(html, /aria-label="The apps"/);
  assert.match(html, /aria-label="Language: English"/);
  assert.match(html, /aria-label="Dark mode"/);
  assert.match(html, /href="\/manual"[^>]*aria-label="User guide"/);
  assert.match(html, /aria-label="Send feedback"/);
  assert.match(html, /cf-family-middle">Vårspringet 2026</);
  assert.match(html, /aria-label="To the start page"/);
});

test("tools that are not given are not there, and compact mode has one menu button", () => {
  const html = renderToStaticMarkup(createElement(FamilyHeader, { app: "run", lang: "sv", compact: true }));
  assert.match(html, /cf-family-compact/);
  assert.match(html, /aria-label="Meny"/);
  assert.doesNotMatch(html, /Mörkt läge|Manual|Skicka feedback|Språk/);
});

test("the switcher lists every app and the hub", () => {
  assert.deepEqual(
    FAMILY_APPS.map((a) => a.id),
    ["controlfreak", "event", "startklocka", "run", "mcp"],
  );
  for (const app of FAMILY_APPS) {
    for (const lang of ["sv", "en", "no", "fi", "cs"]) assert.equal(typeof app.what[lang], "string");
  }
  assert.equal(familyHubUrl("sv"), "https://controlfreak.se");
  assert.equal(familyHubUrl("cs"), "https://controlfreak.se/cs");
});

test("the footer has the credit, the hub, the licences and the version", () => {
  const html = renderToStaticMarkup(
    createElement(FamilyFooter, { lang: "no", licensesHref: "/licenser", version: "2026-10-20" }),
  );
  assert.match(html, />Laget av</);
  assert.match(html, /href="https:\/\/controlfreak.se\/no">controlfreak.se</);
  assert.match(html, /href="\/licenser">Lisenser</);
  assert.match(html, /Versjon 2026-10-20/);
  const bare = renderToStaticMarkup(createElement(FamilyFooter, { lang: "sv" }));
  assert.doesNotMatch(bare, /Licenser|Version/);
});
