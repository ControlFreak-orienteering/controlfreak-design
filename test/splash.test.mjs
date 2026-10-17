// Renders the shared start image and start screen on the server and checks the titles,
// the caption row and the button.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { FamilySplash, StartScreen } from "../dist/splash/index.js";

test("the start image has ControlFreak as the first line and the app as the second", () => {
  const html = renderToStaticMarkup(
    createElement(FamilySplash, { app: "Banläggning" }),
  );
  assert.match(html, /Control<tspan[^>]*>Freak<\/tspan>/);
  assert.match(html, />Banläggning</);
});

test("without an app name there is only the first line", () => {
  const html = renderToStaticMarkup(createElement(FamilySplash, {}));
  assert.doesNotMatch(html, /fontSize="16"|font-size="16"/);
});

test("the start screen has the image, the caption and the button, hidden until ready", () => {
  const html = renderToStaticMarkup(
    createElement(StartScreen, {
      app: "Tävlingsadministration",
      alt: "CompetitionFreak",
      caption: "2 tävlingar sparade i webbläsaren",
      enterLabel: "Kom igång",
      onDismiss: () => {},
    }),
  );
  assert.match(html, />Tävlingsadministration</);
  assert.match(html, />2 tävlingar sparade i webbläsaren</);
  assert.match(html, /cf-start__row--hidden/);
  assert.match(html, /<button[^>]*tabindex="-1"[^>]*>Kom igång<\/button>/);
});

test("the robot walks the course only when asked for", () => {
  const withRobot = renderToStaticMarkup(
    createElement(FamilySplash, { app: "MCP Freak", robot: true }),
  );
  assert.match(withRobot, /class="cf-robot"/);
  assert.match(withRobot, /@keyframes cf-robot-walk/);
  assert.match(withRobot, /prefers-reduced-motion: reduce\)\{\.cf-robot/);
  const without = renderToStaticMarkup(
    createElement(FamilySplash, { app: "Banläggning" }),
  );
  assert.doesNotMatch(without, /cf-robot/);
});
