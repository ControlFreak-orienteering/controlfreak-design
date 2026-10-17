/**
 * The start screen every app in the family shows when it opens: the start image
 * (`FamilySplash`) on the app's own background, and under it a row with a caption on the
 * left and the button that enters the app on the right.
 *
 * It never closes by itself. The animation plays to the end, then the row fades in and
 * the button takes focus, so Enter starts the app; the user decides when the app
 * begins, not a timer. With reduced motion the image shows without animation and the
 * row at once. The look comes from `controlfreak-design/splash.css` and the app's tokens.
 */
export declare function StartScreen({ app, alt, caption, enterLabel, onDismiss, className, }: {
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
}): import("react").JSX.Element;
