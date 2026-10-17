import { type ReactNode } from "react";
/**
 * The start screen every app in the family shows when it opens: the start image (the
 * family's `FamilySplash`, or the app's own through `renderImage`) on the app's own
 * background, and under it a row with a caption on the
 * left and the button that enters the app on the right.
 *
 * It never closes by itself. The animation plays to the end, then the row fades in and
 * the button takes focus, so Enter starts the app; the user decides when the app
 * begins, not a timer. With reduced motion the image shows without animation and the
 * row at once. The look comes from `controlfreak-design/splash.css` and the app's tokens.
 */
export declare function StartScreen({ app, alt, caption, enterLabel, onDismiss, className, renderImage, }: {
    /** The app's name, the second title line under "ControlFreak", e.g. "Banläggning". */
    app: string | null;
    /** The image's alternative text, in the app's language. */
    alt: string;
    /** The text on the left of the row, e.g. how many projects are stored; "" for none. */
    caption: string;
    /** The button's text, e.g. "Kom igång". */
    enterLabel: string;
    /** Called once the screen has faded out after the button. */
    onDismiss: () => void;
    /** Extra class names for the screen, e.g. one that keeps it light in a dark theme. */
    className?: string;
    /**
     * The app's own start image, when it has one (e.g. a race in CompetitionFreak). It must
     * call `onDone` when its animation is over, at once with reduced motion, and should show
     * the family's title with `FamilyTitle`. Without it, the family's image (`FamilySplash`)
     * with `app` as its second title line is shown.
     */
    renderImage?: (image: {
        onDone: () => void;
        alt: string;
        className: string;
    }) => ReactNode;
}): import("react").JSX.Element;
