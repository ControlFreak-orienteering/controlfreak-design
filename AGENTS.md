# controlfreak-design – rules for development

This repository is **public**. Never commit secrets, keys or user data.

- It holds the look the ControlFreak family shares: colour tokens, the Tailwind theme and
  the font. Components, layouts, texts and app logic stay in the apps.
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
- Run `npm test` before every commit.
