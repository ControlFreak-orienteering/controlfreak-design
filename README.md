# controlfreak-design

The shared look of the ControlFreak family of orienteering apps under controlfreak.se:

- **ControlFreak** (course setting)
- **CompetitionFreak** (competition administration)
- later others, e.g. live results

It holds only what the apps should share to look like one family: colour tokens, the
Tailwind v4 theme that maps them to utility classes, and the font. Components, layouts
and texts stay in each app.

## Use

Depend on a tagged version, never on a branch:

```json
"controlfreak-design": "github:HenrikF/controlfreak-design#v0.1.0"
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

## Changing the package

- Versions follow semver. A changed colour is a minor version; a removed or renamed token
  is a major version, since the apps use the names.
- Every release is tagged (`v0.2.0`), and the apps upgrade the tag on their own branch.
- Run `npm test` before every commit. It checks that the light and dark palettes, in hex
  and oklch, have the same colours, and that every colour the theme maps exists.
- Lovable cannot change this repository: it only sees each app's repository. Try a
  change in an app first (by overriding the token there), then move it here.

## License

MIT, see [LICENSE](LICENSE). Nunito Sans is under the SIL Open Font License and comes
from [@fontsource-variable/nunito-sans](https://www.npmjs.com/package/@fontsource-variable/nunito-sans).
