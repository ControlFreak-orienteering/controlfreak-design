# controlfreak-design – rules for development

This repository is **public**. Never commit secrets, keys or user data.

- It holds the look the ControlFreak family shares: colour tokens, the Tailwind theme, the
  font, and the logo and icons (`assets/`, drawn by `scripts/gen-app-icons.py`).
  Components, layouts, texts and app logic stay in the apps.
- Exceptions, all shared by the apps so they work the same everywhere: the start screen
  (`src/splash/`), the credit with the authors' GitHub links (`src/credits/`), the family
  header and footer (`src/family/`), the language core (`src/i18n/`), the feedback form
  and its sender (`src/feedback/`) and the QR camera (`src/qr-camera/`), with their texts
  in the family's five languages. They are TypeScript and React, built to `dist/`, which
  is committed. React is a peer dependency only; anything else a part needs (e.g. jsQR
  for the QR camera) is passed in by the app, so the package gains no dependency.
- `icons.js` is a dependency-free helper the apps' servers use to serve the
  icons at fixed paths. Keep it plain JavaScript with its types in `icons.d.ts`.
- `sw-fetch.js` is the page fetch the apps' service workers load with `importScripts`
  (network first, the cache when the network fails or takes over three seconds). Keep it
  plain JavaScript with no imports, since it runs in a classic service worker.
- Both developers (HenrikF and proverhugo) use it from their apps. A change of a colour,
  the font or a token name changes every app, so make it only when the user asks, and say
  which apps it affects.
- When the two apps differ and the choice is a matter of taste, ask the user instead of
  choosing.
- Every colour is given in both palettes (light and dark), as hex and as oklch: hex for
  browsers without oklch, such as the Android 9 tablets used at competitions.
- The corner radius is not set here; each app chooses its own `--radius`.
- No new dependencies without agreement from both developers. Every dependency ends up in
  every app and its license list.
- Versions follow semver and every release is tagged. Comments are in English.
- Run `npm test` before every commit; it builds `dist/`, and `dist/` is committed with the
  source.
