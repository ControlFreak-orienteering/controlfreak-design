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
 */
export declare function FamilyTitle({ x, y, scale, app, }: {
    x?: number;
    y?: number;
    scale?: number;
    app?: string | null;
}): import("react").JSX.Element;
