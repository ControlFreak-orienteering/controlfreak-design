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
/** Where every app serves its own mark, at its own address. */
export declare const APP_MARK_PATH = "/app-mark.svg";
/**
 * An app's own mark. Each app owns its mark and serves it at `/app-mark.svg`, so a new
 * mark needs only that app to be published, not every app and not this package.
 *
 * `src` is the image to show; left out, the family's mark. When the image cannot be
 * loaded (offline, or an app that does not serve one yet), the family's mark is shown
 * instead, so a mark is never a broken image.
 */
export declare function FamilyAppMark({ src, size }: {
    src?: string;
    size?: number;
}): import("react").JSX.Element;
