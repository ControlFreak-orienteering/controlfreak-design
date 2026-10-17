import { type CSSProperties } from "react";
/** A point on the course, in the map's own coordinates (-250..250, origin in the middle). */
export type CoursePoint = {
    x: number;
    y: number;
    kind: "start" | "control" | "finish";
    label?: string;
};
export declare function project(x: number, y: number): [number, number];
export declare const DEFAULT_COURSE: CoursePoint[];
/**
 * The start image. See the module comment.
 */
export declare function FamilySplash({ app, course, caption, showBackground, alt, onDone, className, style, }: {
    /** The app's name, the second title line under "ControlFreak"; null for none. */
    app?: string | null;
    /** The course to set out; a default course otherwise. */
    course?: CoursePoint[];
    /** The text under the image. An empty string or null hides it. */
    caption?: string | null;
    /** Draws its own page colour behind the map. Off when the image sits on the app's own
     * background (see StartScreen). */
    showBackground?: boolean;
    /** The image's alternative text, in the app's language. */
    alt?: string;
    /** Called when the sequence has finished; at once with reduced motion. */
    onDone?: () => void;
    /** Extra class names for the svg, e.g. its width. */
    className?: string;
    style?: CSSProperties;
}): import("react").JSX.Element;
