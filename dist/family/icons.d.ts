/** The header's icons, drawn in the text colour. All are decorative; the buttons carry the names. */
export declare const AppsIcon: () => import("react").JSX.Element;
export declare const ChevronIcon: () => import("react").JSX.Element;
export declare const MoonIcon: () => import("react").JSX.Element;
export declare const SunIcon: () => import("react").JSX.Element;
export declare const BookIcon: () => import("react").JSX.Element;
export declare const FeedbackIcon: () => import("react").JSX.Element;
export declare const GlobeIcon: () => import("react").JSX.Element;
export declare const MenuIcon: () => import("react").JSX.Element;
export declare const CloseIcon: () => import("react").JSX.Element;
/**
 * The family's mark: a white ring with an upward chevron inside it on a rounded purple
 * tile, `assets/controlfreak-mark.svg` scaled from its 512 grid to 32.
 */
export declare const Mark: ({ size }: {
    size?: number;
}) => import("react").JSX.Element;
/**
 * An app's own mark, as its page icon shows it, for the family header, the app switcher
 * and the start image's title. ControlFreak, MCP and the hub show the family's mark. The drawings are copies of the apps' icons (Event,
 * Start, Run and Diff: `src/brand/`).
 */
export declare const AppMark: ({ app, size }: {
    app: string;
    size?: number;
}) => import("react").JSX.Element;
