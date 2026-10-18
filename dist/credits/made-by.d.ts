/** The family's languages; the same codes the apps use (see docs/orienteering-terms.md). */
export type Lang = "sv" | "en" | "no" | "fi" | "cs";
/** The people who make the apps, in the order they are shown. */
export declare const AUTHORS: readonly [{
    readonly name: "Henrik Flordal";
    readonly github: "HenrikF";
}, {
    readonly name: "Hugo Flordal";
    readonly github: "hugoflordal";
}];
/**
 * Who makes the apps: "Made by" and a GitHub mark for each author, linking to their
 * profile. The mark has no visible name, so its name is in the link's label and tooltip.
 *
 * It takes the colour and size of the surrounding text, so the app decides how it looks
 * through `className` (e.g. `text-xs text-muted-foreground`). An app's Tailwind does not
 * scan this package, so the little layout it needs is set inline.
 */
export declare function MadeBy({ lang, className }: {
    lang?: Lang;
    className?: string;
}): import("react").JSX.Element;
