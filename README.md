# controlfreak-design

The shared look of the ControlFreak family of orienteering apps under controlfreak.se:

- **ControlFreak** (course setting)
- **ControlFreak Event** (competition administration)
- **ControlFreak Run** (virtual controls)
- **ControlFreak MCP** (the AI assistant's connection to ControlFreak)
- **ControlFreak Diff** (what changed between two versions of a map)

**A new app** is made the family's way with the Lovable skill `new-controlfreak-app` in the
private repo `ControlFreak-orienteering/controlfreak-skills` (uploaded to the Lovable workspace
as a zip; see its README). Keep it current when the family's shape changes.

**App names** are written the same way in every app: in Nunito Sans, bold, "Control" in
the text colour and "Freak" in the brand's purple, as in the logo, then the app's own word
in the orienteering orange (Event, Start, Run, MCP, Diff),
kept as one text so screen readers read the whole name. ControlFreak itself is just
"ControlFreak". The names are never translated.

It holds only what the apps should share to look like one family: colour tokens, the
Tailwind v4 theme that maps them to utility classes, the font, the logo and icons, and the
start screen, and the credit with the authors. Other components, layouts and texts stay in
each app.

## Use

Depend on a tagged version, never on a branch:

```json
"controlfreak-design": "github:ControlFreak-orienteering/controlfreak-design#v0.10.0"
```

In the app's main stylesheet, after Tailwind:

```css
@import "tailwindcss";
@import "controlfreak-design/fonts.css";
@import "controlfreak-design/tokens.css";
@import "controlfreak-design/theme.css";
@import "controlfreak-design/splash.css";

@custom-variant dark (&:is(.dark *));

/* Each app chooses its own corner radius. */
:root {
  --radius: 0.75rem;
}
```

| File         | What it holds                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens.css` | The light palette (`:root`, `.cf-light`), the dark palette (`.dark`) and the brand colours (`--cf-*`), as hex and, where supported, as exact oklch. |
| `theme.css`  | `@theme inline`: colours as utility classes (`bg-primary` …), the radius scale from `--radius`, and `--font-sans`.                                  |
| `fonts.css`  | Nunito Sans, bundled through npm so it works offline.                                                                                               |

- **Dark mode** follows the class `dark` on an ancestor, as shadcn/ui does.
- **`.cf-light`** puts the light palette back on one element in a dark page, e.g. a map
  drawn on paper.
- **An app may override** any token after the imports, e.g. a different `--card`, and add
  its own entries in another `@theme inline` block.

## Logo and icons

The family's mark is ControlFreak's logo, a white ring with an upward chevron on a rounded
purple tile. The family header shows it in every app. Event, Start, Run and Diff have marks
of their own as page icons, drawn and served by each app (`src/brand/`), and the app
switcher shows each app's own mark (`AppMark` in `src/family/icons.tsx`, a copy of the
apps' drawings: change both together). The files below are the family's mark, used by
ControlFreak, MCP, the hub and any app without a mark of its own.

| File                           | What it is                                                       |
| ------------------------------ | ---------------------------------------------------------------- |
| `assets/controlfreak-mark.svg` | The mark itself: icon for browsers that read SVG, logo in pages. |
| `assets/favicon.ico`           | 16, 32 and 48 px, for browsers that prefer ICO.                  |
| `assets/apple-touch-icon.png`  | 180 px, full purple (iOS rounds the corners itself).             |
| `assets/icon-192.png`          | 192 px with rounded corners and a transparent background.        |
| `assets/icon-512.png`          | 512 px, the same; both for a web app manifest.                   |

The PNG and ICO files are drawn from the mark's shapes by `scripts/gen-app-icons.py`
(no dependencies; run it from the package root). Change the mark and the script
together.

**Serving them at fixed paths.** Browsers ask for icons at fixed paths (`/favicon.ico`,
the paths in a manifest), so each app has one tiny server route per icon instead of a
copy in `public/`. With TanStack Start, e.g. `src/routes/favicon[.]ico.ts`:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { iconResponse } from "controlfreak-design/icons";
import icon from "controlfreak-design/assets/favicon.ico?inline";

export const Route = createFileRoute("/favicon.ico")({
  server: { handlers: { GET: () => iconResponse(icon) } },
});
```

`?inline` makes Vite put the file in the server bundle as a data URL, and `iconResponse`
answers with the bytes, the right content type and a day's caching.

**Link preview images.** `assets/og-<app>.png` is each app's `og:image`, 1200 × 630: the
mark and the app's name as the family header writes it ("Control" in ink, "Freak" in
purple, the app's own word in its accent), on the page colour with the paper strip along
the bottom. The names are never translated, so one image serves every language. There is
one per app in `FAMILY_APPS` except the hub (`og-controlfreak.png`, `og-event.png`,
`og-startklocka.png`, `og-run.png`, `og-mcp.png`, `og-diff.png`). Serve it like an icon, e.g.
`src/routes/og-image[.]png.ts` with `import image from "controlfreak-design/assets/og-run.png?inline"`,
and use `summary_large_image` for `twitter:card`.

They are drawn by `scripts/gen-og-images.py` (no dependencies), from the words' outlines
in `scripts/og-glyphs.json`: Nunito Sans 800 as in the header, shaped with its kerning.
When an app is added or renamed, add its word to `extract-og-glyphs.py` and `gen-og-images.py`,
run the first (it needs fontTools and uharfbuzz; see its comment), then the second.

## Start screen

Every app opens the same way, on the same theme: a picture on the app's own background,
titled with the ControlFreak logo and, under it, the name of the app. The picture may be
the app's own (ControlFreak Event shows a race); the title and the behaviour are shared.

```tsx
import { StartScreen } from "controlfreak-design/splash";

<StartScreen
  app="Tävlingsadministration"
  alt="ControlFreak Event – kontroller sätts ut i terrängen"
  caption="2 tävlingar sparade i webbläsaren"
  enterLabel="Kom igång"
  onDismiss={() => setSplashOpen(false)}
/>;
```

- The row with the caption and the button fades in, and the button takes focus, when the
  animation is over or 1.5 s after the app is hydrated (`START_READY_MS`), whichever
  comes first; the animation goes on behind it. With reduced motion everything shows at
  once.
- `className` adds classes to the screen, e.g. one that keeps it light in a dark theme.
- `renderImage` gives the screen the app's own picture. It gets `onDone` (call it when the
  animation is over, at once with reduced motion), `alt` and `className`, and should draw
  the title with `FamilyTitle` (`x`, `y`, `scale`, `app`).
- `FamilySplash` is the family's picture, a course being set out on a map: `app`,
  `caption`, `course`, `showBackground`, `onDone`, and for ControlFreak MCP `robot` (a robot
  sets out the controls), `prompt` (a request typed into a chat bubble first) and `reply`
  (the assistant's answer when the course is done).
- Once per device: `useStartScreen(app)` gives `open` and a stable `dismiss` (pass it as
  `onDismiss`). The screen shows the first time the app is opened in the browser, and not
  again in any tab until the site's storage is cleared (`localStorage`, per app; until
  v0.13.0 it was once per tab, and a mark left in `sessionStorage` still counts). Put
  `startScreenSeenScript(app)` in an inline `<script>` in the document's `<head>`, so a
  screen already seen never flashes up while the server-rendered page loads (it marks
  `<html>` with `cf-start-seen`, which `splash.css` hides the screen under).
- The screen's look is plain CSS in `css/splash.css`, using the tokens; import it in the
  app's stylesheet. An app's Tailwind does not scan this package.
- The source is TypeScript in `src/splash/`; `npm run build` writes `dist/`, which is
  committed, so the apps need no build step for it. React is a peer dependency.

## Service workers

The apps that open without a connection (ControlFreak, ControlFreak Run, ControlFreak Start)
fetch their pages the same way, with `sw-fetch.js`: from the network first, from the cache
when the network fails, and also when it has not answered within three seconds, which on
one bar of coverage in the forest can otherwise take a minute. The late answer still
refreshes the cache for next time.

It is plain JavaScript for a classic service worker, so the app serves it at a fixed path
from its own server, like the icons. With TanStack Start, `src/routes/cf-sw-fetch[.]js.ts`:

```ts
import { createFileRoute } from "@tanstack/react-router";
import source from "controlfreak-design/sw-fetch.js?raw";

export const Route = createFileRoute("/cf-sw-fetch.js")({
  server: {
    handlers: {
      GET: () =>
        new Response(source, {
          headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-cache" },
        }),
    },
  },
});
```

and in `public/sw.js`:

```js
importScripts("/cf-sw-fetch.js");
// in the fetch handler, for a navigation:
event.respondWith(self.cfPageFromNetwork(request, { cacheName: PAGES, fallback: "/" }));
```

The browser keeps an imported script with the worker, so it works offline, and checks it
for changes when it checks `sw.js`. `timeoutMs` (3000 by default) changes the wait.

## Changing the package

- Versions follow semver. A changed colour is a minor version; a removed or renamed token
  is a major version, since the apps use the names.
- Every release is tagged (`v0.2.0`), and the apps upgrade the tag on their own branch.
- Run `npm test` before every commit; it builds `dist/` first. Commit `dist/` with the
  source. It checks that the light and dark palettes, in hex
  and oklch, have the same colours, that every colour the theme maps exists, that the
  icons are there, and that `iconResponse` gives back the files.
- Lovable cannot change this repository: it only sees each app's repository. Try a
  change in an app first (by overriding the token there), then move it here.

## Credit

Every app shows who makes it: "Gjord av" and a GitHub mark for each author, linking to
their profile, with the name in the link's label and tooltip.

```tsx
import { MadeBy } from "controlfreak-design/credits";

<MadeBy lang="en" className="text-xs text-muted-foreground" />;
```

- `lang` is one of the family's languages, `sv` (the default), `en`, `no`, `fi` or `cs`;
  the texts are in the package.
- It takes the colour and size of the surrounding text; `className` styles it.
- `AUTHORS` is the list of names and GitHub accounts, for an app that needs them
  elsewhere.

## Languages

The family's five languages, so every app says the same codes, names and tags and
matches a browser's language list the same way. Each app keeps its own texts.

```ts
import { LANGS, LANG_LABELS, HTML_LANG, langPath, resolveLang } from "controlfreak-design/i18n";

const lang = resolveLang(navigator.languages, localStorage.getItem("lang")); // "sv" | "en" | "no" | "fi" | "cs"
langPath("en", "help"); // "/en/help"; Swedish is the start page, "/help"
```

- `Lang`, `LANGS` (in picker order, Swedish first) and `SOURCE_LANG` (`sv`).
- `LANG_LABELS` (each name in its own language), `HTML_LANG` (`<html lang>` and
  `hreflang`; Norwegian is `nb`), `LOCALE_TAG` (`Intl`), `OG_LOCALE` (Open Graph) and
  `LANG_PATHS` (`/`, `/en`, `/no`, `/fi`, `/cs`).
- `isLang`, `langPath`, `langForPath`, `matchBrowserLang`, `browserLanguages` and
  `resolveLang` (a stored choice wins, then the browser's list in order, then a fallback
  that is Swedish unless the app says otherwise).

## Family header and footer

Every app opens with the same first row: the mark and the app's name on the left, what
the app has open in the middle, and the family's tools on the right (the app switcher,
the language menu, the theme button, the user guide and feedback). The footer has the
credit, the hub, the licences and the version.

```css
@import "controlfreak-design/family.css";
```

```tsx
import { FamilyFooter, FamilyHeader, FamilyName } from "controlfreak-design/family";

<FamilyHeader
  app="event"
  lang={lang}
  langHref={(l) => LANG_PATHS[l]}          // links; or onLangChange for buttons
  theme={{ dark, onToggle }}                 // leave out for an app without a choice
  manualHref="/manual"                       // or onManual for a page inside the app
  onFeedback={() => setFeedbackOpen(true)}   // leave out for an app without a dialog
>
  {competition.name}
</FamilyHeader>

<FamilyFooter lang={lang} licensesHref="/THIRD-PARTY-NOTICES.md" version="2026-10-20" />
```

- `app` is `controlfreak`, `event`, `startklocka`, `run`, `mcp`, `diff` or `hub`; the name is
  drawn from it, and the switcher marks it. `name` gives the header another name than
  the list's, for an app whose name depends on its address. `FamilyName` draws a name
  on its own.
- Every tool is optional: what the app does not pass is not shown. `compact` folds the
  tools into one menu button for a phone; `stacked` on the footer suits a sidebar. The
  menus are in the page even when closed, so search engines see the links to the apps
  and the languages; the hub (`app="hub"`) gets no switcher, since it lists the apps.
- The look is plain CSS on the apps' own tokens (`--card`, `--foreground`, `--border`,
  `--muted`, `--primary`, `--accent`), so it follows the app's palette, light or dark.
- `FAMILY_APPS` is the list the switcher shows, with each app's address and one-line
  description in the five languages; `familyHubUrl(lang)` is the hub's page.

## Feedback

`controlfreak-design/feedback` is the form every app shows behind the header's feedback
button, with `controlfreak-design/feedback.css` for its look (on the app's tokens).

- `FeedbackForm({ app, lang, open, onClose, intro? })`: the message (required), name and
  email, send and cancel, then a thank-you. Only the form: put it in the app's own dialog,
  titled `FEEDBACK_TEXTS[lang].title`, so it looks like the app's other dialogs. `app` is
  the app's id at the feedback page (`controlfreak`, `competitionfreak`, `run`,
  `startklocka`, `mcpfreak`, `diff`), an identifier that stays when the app is renamed. `intro`
  replaces the default text, e.g. to say what the app never sends.
- `sendFeedback(app, feedback)` posts to the family's feedback page
  (`FEEDBACK_ENDPOINT`); `feedbackBody` is the request body.
- `FEEDBACK_TEXTS` has the form's texts in the five languages.

## QR camera

`controlfreak-design/qr-camera` reads QR codes with the camera, for the apps' own
scanners. Each app keeps its `<video>`, layout and what it does with a code.

- `useQrCamera({ onCode, loadJsQr, intervalMs?, active?, maxReadWidth? })` gives `video`
  (for a `<video muted playsInline>`) and `problem`. It uses the browser's own
  `BarcodeDetector` where it reads QR codes, and otherwise jsQR, which the app passes:
  `loadJsQr: () => import("jsqr").then((m) => m.default)`, so the package has no
  dependency on it. `onCode(text, capturedAt)` returns `true` to stop; `capturedAt` is
  when the picture was taken.
- `CameraProblem`, `cameraAvailability`, `cameraProblemFrom` and `CAMERA_PROBLEM_TEXTS`
  say why the camera could not be used, in the five languages.

## License

MIT, see [LICENSE](LICENSE). Nunito Sans is under the SIL Open Font License and comes
from [@fontsource-variable/nunito-sans](https://www.npmjs.com/package/@fontsource-variable/nunito-sans).
The GitHub mark in the credit is from [Octicons](https://github.com/primer/octicons)
(MIT, © GitHub Inc.).
