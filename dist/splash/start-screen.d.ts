import { type ReactNode } from "react";
/**
 * When the button shows at the latest, in milliseconds after the screen appeared in the
 * browser (that is, once the app is hydrated): the family's animation takes 3.45 s, and
 * nobody should have to wait for it to enter an app that is already ready.
 */
export declare const START_READY_MS = 1500;
/**
 * The start screen every app in the family shows when it opens: the start image (the
 * family's `FamilySplash`, or the app's own through `renderImage`) on the app's own
 * background, and under it a row with a caption on the
 * left and the button that enters the app on the right.
 *
 * It never closes by itself. The row fades in and the button takes focus when the
 * animation is over or after `START_READY_MS`, whichever comes first, while the animation
 * goes on behind it; Enter starts the app, and the user decides when it begins. With
 * reduced motion the image shows without animation and the row at once. The look comes from `controlfreak-design/splash.css` and the app's tokens.
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
     * The app's own start image, when it has one (e.g. a race in ControlFreak Event). It must
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
