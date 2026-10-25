import { AppMark } from "../family/icons.js";

/** The brand's own colours for the title, the same in every app and theme. */
const PURPLE = "#A6248F";
const INK = "#2C2C2A";
const MUTED = "#6B6A64";

/**
 * The family's title for a start image: the mark, the wordmark "ControlFreak" and, under
 * it, the name of the app (e.g. "Tävlingsadministration"). Every app's start image draws
 * its title with this, so the apps look like one family even when their pictures differ.
 *
 * An SVG group to place inside the image. At scale 1 it is 52 units high (the mark) and
 * about 300 wide; its top left corner is the mark's.
 *
 * @param x - Where the top left corner goes.
 * @param y - Where the top left corner goes.
 * @param scale - Size relative to ControlFreak's own start image.
 * @param app - The second line; null for none.
 * @param mark - The app whose own mark to draw (an id as in FAMILY_APPS, e.g. "event");
 *   left out, the family's mark.
 */
export function FamilyTitle({
  x = 0,
  y = 0,
  scale = 1,
  app = null,
  mark,
}: {
  x?: number;
  y?: number;
  scale?: number;
  app?: string | null;
  mark?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {mark ? (
        <AppMark app={mark} size={52} />
      ) : (
        <>
          <rect width="52" height="52" rx="13" fill={PURPLE} />
          <circle
            cx="26"
            cy="26"
            r="16"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <path
            d="M18 32 L26 24 L34 32"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      <text x="66" y="35" fontSize="34" fontWeight="500" fill={INK}>
        Control
        <tspan fill={PURPLE}>Freak</tspan>
      </text>
      {app && (
        <text x="68" y="58" fontSize="16" fontWeight="600" fill={MUTED}>
          {app}
        </text>
      )}
    </g>
  );
}
