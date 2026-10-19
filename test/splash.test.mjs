// Renders the shared start image and start screen on the server and checks the titles,
// the caption row and the button.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  FamilySplash,
  FamilyTitle,
  StartScreen,
} from "../dist/splash/index.js";

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
      alt: "ControlFreak Event",
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

test("an app can give the start screen its own image, with the family's title", () => {
  const html = renderToStaticMarkup(
    createElement(StartScreen, {
      app: "Tävlingsadministration",
      alt: "ControlFreak Event",
      caption: "",
      enterLabel: "Kom igång",
      onDismiss: () => {},
      renderImage: ({ className }) =>
        createElement(
          "svg",
          { className, "data-own": "yes" },
          createElement(FamilyTitle, {
            app: "Tävlingsadministration",
            scale: 0.75,
          }),
        ),
    }),
  );
  assert.match(html, /data-own="yes"/);
  assert.match(html, /Control<tspan[^>]*>Freak<\/tspan>/);
  assert.match(html, />Tävlingsadministration</);
  assert.doesNotMatch(html, /cf-course/);
});

test("with a prompt, the chat shows and the course waits for it", () => {
  const html = renderToStaticMarkup(
    createElement(FamilySplash, {
      app: "MCP Freak",
      robot: true,
      prompt: "Lägg en bana på 4 km",
      reply: "Klart! 7 kontroller",
    }),
  );
  assert.match(html, />Lägg en bana på 4 km</);
  assert.match(html, />Klart! 7 kontroller</);
  assert.match(html, /animation-delay:1.9s/);
});
