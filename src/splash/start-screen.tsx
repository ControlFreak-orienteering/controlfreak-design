import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { FamilySplash } from "./family-splash.js";

/** How long the screen fades out after the button, in milliseconds. */
const FADE_MS = 350;

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
export function StartScreen({
  app,
  alt,
  caption,
  enterLabel,
  onDismiss,
  className = "",
  renderImage,
}: {
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
}) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);

  // Stable identity: the image restarts its timer whenever `onDone` changes.
  const handleDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (ready) enterRef.current?.focus();
  }, [ready]);

  // The latest `onDismiss`, so that a new function from an app that re-renders often (the
  // start clock ticks ten times a second) does not restart the fade-out for ever.
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => dismissRef.current(), FADE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className={`cf-start ${leaving ? "cf-start--leaving" : ""} ${className}`}
    >
      <div className="cf-start__inner">
        {/* No page colour of its own, and no caption inside the image: the screen's
            background is the same colour, and the caption stands in the row below. */}
        {renderImage ? (
          renderImage({ onDone: handleDone, alt, className: "cf-start__image" })
        ) : (
          <FamilySplash
            app={app}
            showBackground={false}
            caption={null}
            alt={alt}
            onDone={handleDone}
            className="cf-start__image"
          />
        )}
        {/* Both take their room from the start and are only hidden, so the centred column
            does not jump when they appear. */}
        <div
          className={`cf-start__row ${ready ? "" : "cf-start__row--hidden"}`}
        >
          <p className="cf-start__caption">{caption}</p>
          <button
            ref={enterRef}
            type="button"
            className="cf-start__enter"
            aria-hidden={!ready}
            tabIndex={ready ? undefined : -1}
            onClick={() => setLeaving(true)}
          >
            {enterLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
