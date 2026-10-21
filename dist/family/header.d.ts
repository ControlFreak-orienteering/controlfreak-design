/**
 * The family header: the same first row in every app under controlfreak.se.
 *
 * Left, the mark and the app's name; in the middle, what the app has open (the app's
 * own `children`); right, the family's tools: the app switcher, the language menu, the
 * theme button, the user guide and feedback. The header is 48 px high, 44 in `compact`
 * mode, where the tools fold into a sheet behind one menu button.
 *
 * Every tool is optional: an app without a theme choice (Run follows the phone) leaves
 * `theme` out, an app without a user guide leaves `manualHref` out, and so on. The
 * look is plain CSS in `css/family.css`, on the apps' tokens, since an app's Tailwind
 * does not scan this package.
 */
import { type MouseEvent, type ReactNode } from "react";
import { type Lang } from "../i18n/index.js";
import { type FamilyAccent, type FamilyAppId } from "./apps.js";
export declare function FamilyName({ app, className, }: {
    app: Exclude<FamilyAppId, "hub"> | {
        base: string;
        word: string;
        accent?: FamilyAccent;
    };
    className?: string;
}): import("react").JSX.Element;
export type FamilyHeaderProps = {
    /** Which app this is. The name is drawn from it, and the switcher marks it. */
    app: FamilyAppId;
    lang: Lang;
    /**
     * The address of this page in each language. With it, the language menu is real links
     * (search engines follow them); `onLangChange` is still called on a click and may
     * call `preventDefault` to navigate itself.
     */
    langHref?: (lang: Lang) => string;
    /** Called with the chosen language. Without `langHref`, the menu is buttons. */
    onLangChange?: (lang: Lang, event: MouseEvent<HTMLElement>) => void;
    /** The theme button: whether it is dark now, and the toggle. Left out, no button. */
    theme?: {
        dark: boolean;
        onToggle: () => void;
    };
    /** The user guide's address, or a click handler when it is a page inside the app. */
    manualHref?: string;
    onManual?: (event: MouseEvent<HTMLElement>) => void;
    /** Opens the user guide in a new tab (ControlFreak keeps the map in memory). */
    manualNewTab?: boolean;
    /** Opens the app's feedback dialog. Left out, no button. */
    onFeedback?: () => void;
    /** Where the mark and name lead; the app's start page when left out. */
    homeHref?: string;
    /**
     * A name other than the app's own in the family list, for an app whose name depends
     * on where it is served (the start clock on its old and its family address).
     */
    name?: {
        base: string;
        word: string;
        accent?: FamilyAccent;
    };
    /** The app's own middle: what is open. */
    children?: ReactNode;
    /** Phone layout: the tools fold into a sheet behind one menu button. */
    compact?: boolean;
    /** The app switcher; `false` on a page that lists the apps itself, as the hub does. */
    showApps?: boolean;
    className?: string;
};
export declare function FamilyHeader({ app, lang, langHref, onLangChange, theme, manualHref, onManual, manualNewTab, onFeedback, homeHref, name, children, compact, showApps, className, }: FamilyHeaderProps): import("react").JSX.Element;
