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
 * MCP Freak's course: seven controls, matching the reply "Klart! 7 kontroller" and the
 * caption "7 kontroller utsatta". The default when the robot is shown.
 */
export declare const MCP_COURSE: CoursePoint[];
/**
 * The start image. See the module comment.
 */
export declare function FamilySplash({ app, robot, prompt, reply, course: courseProp, caption, showBackground, alt, onDone, className, style, }: {
    /** The app's name, the second title line under "ControlFreak"; null for none. */
    app?: string | null;
    /** Shows a robot walking the course and setting out the controls (MCP Freak). */
    robot?: boolean;
    /**
     * A request to the AI assistant, typed out in a chat bubble before the course is set
     * out (MCP Freak), e.g. "Lägg en bana på 4 km". Null for none.
     */
    prompt?: string | null;
    /** The assistant's reply, shown when the course is done, e.g. "Klart! 7 kontroller". */
    reply?: string | null;
    /** The course to set out; otherwise `MCP_COURSE` with the robot, else `DEFAULT_COURSE`. */
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
