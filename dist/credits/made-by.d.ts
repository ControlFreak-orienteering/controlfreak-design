import type { Lang } from "../i18n/index.js";
export type { Lang };
/** The people who make the apps, in the order they are shown. */
export declare const AUTHORS: readonly [{
    readonly name: "Henrik Flordal";
    readonly github: "HenrikF";
}, {
    readonly name: "Hugo Flordal";
    readonly github: "hugoflordal";
}];
/**
 * Who makes the apps: "Made by" and each author's name with GitHub's mark, linking to
 * their profile ("Gjord av Henrik Flordal och Hugo Flordal"). The link's tooltip says it
 * goes to GitHub.
 *
 * It takes the colour and size of the surrounding text, so the app decides how it looks
 * through `className` (e.g. `text-xs text-muted-foreground`). An app's Tailwind does not
 * scan this package, so the little layout it needs is set inline.
 */
export declare function MadeBy({ lang, className }: {
    lang?: Lang;
    className?: string;
}): import("react").JSX.Element;
