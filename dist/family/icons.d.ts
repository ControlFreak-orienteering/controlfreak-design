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
/** The family's mark: a white ring with an upward chevron on a rounded purple tile. */
export declare const Mark: ({ size }: {
    size?: number;
}) => import("react").JSX.Element;
/**
 * An app's own mark, as its page icon shows it, for the app switcher. ControlFreak, MCP
 * and the hub show the family's mark. The drawings are copies of the apps' icons (Event,
 * Run and Diff: `src/brand/`, Start: `public/favicon.svg`).
 */
export declare const AppMark: ({ app, size }: {
    app: string;
    size?: number;
}) => import("react").JSX.Element;
