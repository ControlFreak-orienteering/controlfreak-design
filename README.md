# controlfreak-design

The shared look of the ControlFreak family of orienteering apps under controlfreak.se:

- **ControlFreak** (course setting)
- **CompetitionFreak** (competition administration)
- later others, e.g. live results

It holds only what the apps should share to look like one family: colour tokens, the
Tailwind v4 theme that maps them to utility classes, the font, and the logo and icons.
Components, layouts and texts stay in each app.

## Use

Depend on a tagged version, never on a branch:

```json
"controlfreak-design": "github:HenrikF/controlfreak-design#v0.2.0"
```

In the app's main stylesheet, after Tailwind:

```css
@import "tailwindcss";
@import "controlfreak-design/fonts.css";
@import "controlfreak-design/tokens.css";
@import "controlfreak-design/theme.css";

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

All apps show the same mark: ControlFreak's logo, a white ring with an upward chevron on a
rounded purple tile.

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

## Changing the package

- Versions follow semver. A changed colour is a minor version; a removed or renamed token
  is a major version, since the apps use the names.
- Every release is tagged (`v0.2.0`), and the apps upgrade the tag on their own branch.
- Run `npm test` before every commit. It checks that the light and dark palettes, in hex
  and oklch, have the same colours, that every colour the theme maps exists, that the
  icons are there, and that `iconResponse` gives back the files.
- Lovable cannot change this repository: it only sees each app's repository. Try a
  change in an app first (by overriding the token there), then move it here.

## License

MIT, see [LICENSE](LICENSE). Nunito Sans is under the SIL Open Font License and comes
from [@fontsource-variable/nunito-sans](https://www.npmjs.com/package/@fontsource-variable/nunito-sans).
