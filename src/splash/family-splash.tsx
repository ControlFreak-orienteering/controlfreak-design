import { useEffect, type CSSProperties } from "react";

import { FamilyTitle } from "./family-title.js";

/** A point on the course, in the map's own coordinates (-250..250, origin in the middle). */
export type CoursePoint = {
  x: number;
  y: number;
  kind: "start" | "control" | "finish";
  label?: string;
};

/**
 * The family's start image: a map tilted in perspective where a course is set out control
 * by control, with the ControlFreak logo and, under it, the name of the app.
 *
 * The map is drawn in a local coordinate system (-250..250 both ways) and projected in
 * perspective. The course uses the same map coordinates, so controls can be moved without
 * recomputing anything on screen. (From ControlFreak's src/brand, moved here 2026-10-17 so
 * every app shows the same image.)
 */

const TILT = "translate(340,290) scale(1,0.5) rotate(-20)";

// The same transform as TILT, computed in JS. Places the control flags, which stand
// upright and so must not be tilted with the ground.
export function project(x: number, y: number): [number, number] {
  return [340 + 0.94 * x + 0.342 * y, 290 - 0.171 * x + 0.47 * y];
}

export const DEFAULT_COURSE: CoursePoint[] = [
  { x: -150, y: 120, kind: "start" },
  { x: -40, y: 60, kind: "control", label: "1" },
  { x: 60, y: 130, kind: "control", label: "2" },
  { x: 140, y: -20, kind: "control", label: "3" },
  { x: 10, y: -90, kind: "control", label: "4" },
  { x: -110, y: -50, kind: "control", label: "5" },
  { x: -180, y: 10, kind: "finish" },
];

const FIRST_DELAY = 0.45;
const STEP = 0.4;

const COLORS = {
  paper: "#FDFAF2",
  page: "#F4EFE6",
  open: "#FBF0B4",
  forest: "#A9D89A",
  forestDense: "#7CC06B",
  water: "#8FC9EA",
  contour: "#C4834C",
  ink: "#2C2C2A",
  purple: "#A6248F",
  purpleDark: "#7A1A69",
  flagOrange: "#F07F2A",
  post: "#6B6A64",
  edge: "#D8CDBA",
  muted: "#6B6A64",
};

const css = `
.cf-ctrl{opacity:0;animation:cf-drop .55s cubic-bezier(.2,.8,.3,1) forwards;transform-box:view-box;transform-origin:center}
@keyframes cf-drop{from{opacity:0;transform:translateY(-34px)}to{opacity:1;transform:translateY(0)}}
.cf-pulse{opacity:0;animation:cf-ring .9s ease-out forwards;transform-box:fill-box;transform-origin:center}
@keyframes cf-ring{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(2.6)}}
.cf-course{stroke-dasharray:1100;stroke-dashoffset:1100;animation:cf-draw 3.2s ease-in-out .5s forwards}
@keyframes cf-draw{to{stroke-dashoffset:0}}
.cf-fade{opacity:0;animation:cf-in .8s ease-out forwards}
@keyframes cf-in{to{opacity:1}}
@media (prefers-reduced-motion: reduce){
.cf-ctrl,.cf-fade{opacity:1;animation:none}
.cf-course{stroke-dashoffset:0;animation:none}
.cf-pulse{display:none}
}
`;

function Flag({ sx, sy }: { sx: number; sy: number }) {
  const top = sy - 42;
  const bottom = sy - 26;
  return (
    <>
      <line
        x1={sx}
        y1={sy}
        x2={sx}
        y2={bottom}
        stroke={COLORS.post}
        strokeWidth="2"
      />
      <polygon
        points={`${sx - 8},${top} ${sx + 8},${top} ${sx - 8},${bottom}`}
        fill="#FFFFFF"
        stroke={COLORS.post}
        strokeWidth="1"
      />
      <polygon
        points={`${sx + 8},${top} ${sx + 8},${bottom} ${sx - 8},${bottom}`}
        fill={COLORS.flagOrange}
      />
    </>
  );
}

function Marker({ point, delay }: { point: CoursePoint; delay: number }) {
  const [sx, sy] = project(point.x, point.y);
  const style = { animationDelay: `${delay}s` };
  return (
    <g className="cf-ctrl" style={style}>
      {point.kind !== "start" && (
        <ellipse
          className="cf-pulse"
          cx={sx}
          cy={sy}
          rx={point.kind === "finish" ? 20 : 16}
          ry={point.kind === "finish" ? 10 : 8}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth="2"
          style={style}
        />
      )}

      {point.kind === "start" && (
        <polygon
          points={`${sx},${sy - 10} ${sx + 14},${sy + 7} ${sx - 14},${sy + 7}`}
          fill="none"
          stroke={COLORS.purple}
          strokeWidth="3"
        />
      )}

      {point.kind === "control" && (
        <ellipse
          cx={sx}
          cy={sy}
          rx="15"
          ry="7.5"
          fill="none"
          stroke={COLORS.purple}
          strokeWidth="3"
        />
      )}

      {point.kind === "finish" && (
        <>
          <ellipse
            cx={sx}
            cy={sy}
            rx="19"
            ry="9.5"
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="3"
          />
          <ellipse
            cx={sx}
            cy={sy}
            rx="12"
            ry="6"
            fill="none"
            stroke={COLORS.purple}
            strokeWidth="3"
          />
        </>
      )}

      <Flag sx={sx} sy={sy} />

      {point.label && (
        <text
          x={sx + 16}
          y={sy - 30}
          fontSize="12"
          fontWeight="500"
          fill={COLORS.purpleDark}
        >
          {point.label}
        </text>
      )}
    </g>
  );
}

/**
 * How far to the left of a control the robot stands, so that it does not hide the flag
 * it has just set out.
 */
const ROBOT_OFFSET_X = -34;

/** How long before a control drops the robot arrives at it, in seconds. */
const ROBOT_LEAD = 0.2;

/**
 * The CSS that walks the robot from control to control: one keyframe per control, timed
 * so that it arrives just before the control drops (see `Marker`'s delays). It stays at
 * the finish when done. Without motion it stands at the finish from the start.
 */
function robotCss(course: CoursePoint[], total: number, start: number): string {
  const stops = course.map((point, i) => {
    const [sx, sy] = project(point.x, point.y);
    const at = Math.max(0, start + FIRST_DELAY + i * STEP - ROBOT_LEAD);
    const percent = ((at / total) * 100).toFixed(2);
    return `${percent}%{transform:translate(${(sx + ROBOT_OFFSET_X).toFixed(1)}px,${sy.toFixed(1)}px)}`;
  });
  const last = course[course.length - 1]!;
  const [lx, ly] = project(last.x, last.y);
  const end = `translate(${(lx + ROBOT_OFFSET_X).toFixed(1)}px,${ly.toFixed(1)}px)`;
  return (
    `.cf-robot{transform:${end};animation:cf-robot-walk ${total}s ease-in-out forwards}` +
    `@keyframes cf-robot-walk{${stops.join("")}100%{transform:${end}}}` +
    `.cf-robot-bob{animation:cf-robot-bob .35s ease-in-out ${Math.ceil(total / 0.7)} alternate}` +
    `@keyframes cf-robot-bob{to{transform:translateY(-4px)}}` +
    `@media (prefers-reduced-motion: reduce){.cf-robot,.cf-robot-bob{animation:none}}`
  );
}

/**
 * A small robot standing on the map, its feet at (0, 0): the AI assistant setting out the
 * course (MCP Freak). Drawn upright, like the flags, and in the brand's colours.
 */
function Robot() {
  return (
    // A third larger than drawn, so it reads as a figure next to the flags.
    <g className="cf-robot-bob">
      <g transform="scale(1.3)">
        {/* Legs. */}
        <line
          x1="-5"
          y1="0"
          x2="-5"
          y2="-9"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="5"
          y1="0"
          x2="5"
          y2="-9"
          stroke={COLORS.ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Body, with the logo's ring and chevron. */}
        <rect
          x="-11"
          y="-29"
          width="22"
          height="21"
          rx="5"
          fill={COLORS.purple}
        />
        <circle
          cx="0"
          cy="-18.5"
          r="5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
        />
        <path
          d="M-2.6 -17 L0 -19.6 L2.6 -17"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arm reaching out towards the flag it sets out. */}
        <line
          x1="11"
          y1="-22"
          x2="20"
          y2="-28"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="-11"
          y1="-22"
          x2="-16"
          y2="-15"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Head, eyes and antenna. */}
        <rect
          x="-9"
          y="-44"
          width="18"
          height="13"
          rx="4"
          fill={COLORS.paper}
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        <circle cx="-3.5" cy="-37.5" r="1.8" fill={COLORS.ink} />
        <circle cx="3.5" cy="-37.5" r="1.8" fill={COLORS.ink} />
        <line
          x1="0"
          y1="-44"
          x2="0"
          y2="-50"
          stroke={COLORS.ink}
          strokeWidth="2"
        />
        <circle cx="0" cy="-51.5" r="2.5" fill={COLORS.flagOrange} />
      </g>
    </g>
  );
}

/** How long the prompt takes to be typed before the course is set out, in seconds. */
const PROMPT_TIME = 1.4;

/** The CSS for the chat: the prompt typed letter by letter, the reply fading in. */
function chatCss(replyAt: number): string {
  return (
    `.cf-type{transform-box:fill-box;transform-origin:left;transform:scaleX(0);` +
    `animation:cf-type 1s steps(20,end) .2s forwards}` +
    `@keyframes cf-type{to{transform:scaleX(1)}}` +
    `.cf-reply{opacity:0;animation:cf-in .6s ease-out ${replyAt.toFixed(2)}s forwards}` +
    `@media (prefers-reduced-motion: reduce){.cf-type{transform:none;animation:none}` +
    `.cf-reply{opacity:1;animation:none}}`
  );
}

/**
 * A chat with the AI assistant, above the map's right corner: the user's prompt, typed
 * out at the start, and the assistant's reply when the course is done (MCP Freak).
 */
function Chat({ prompt, reply }: { prompt: string; reply: string | null }) {
  // Wide enough for the text at 13 units per letter-ish, but never past the image.
  const promptWidth = Math.min(200, 24 + prompt.length * 7.2);
  const replyWidth = reply ? Math.min(180, 24 + reply.length * 6.8) : 0;
  return (
    <g fontSize="13">
      <defs>
        <clipPath id="cf-typed">
          <rect
            className="cf-type"
            x={650 - promptWidth}
            y="74"
            width={promptWidth}
            height="34"
          />
        </clipPath>
      </defs>
      {/* The user's prompt, with its tail at the bottom right. */}
      <rect
        x={650 - promptWidth}
        y="74"
        width={promptWidth}
        height="32"
        rx="10"
        fill={COLORS.paper}
        stroke={COLORS.edge}
        strokeWidth="1.5"
      />
      <path
        d="M628 105 L648 116 L640 104 Z"
        fill={COLORS.paper}
        stroke={COLORS.edge}
        strokeWidth="1.5"
      />
      <text
        x={650 - promptWidth + 12}
        y="95"
        fill={COLORS.ink}
        clipPath="url(#cf-typed)"
      >
        {prompt}
      </text>
      {reply && (
        <g className="cf-reply">
          {/* The assistant's reply, in the brand's purple, with the tail down to the map. */}
          <rect
            x={650 - replyWidth}
            y="120"
            width={replyWidth}
            height="30"
            rx="10"
            fill={COLORS.purple}
          />
          <path d="M600 148 L594 160 L610 148 Z" fill={COLORS.purple} />
          <text
            x={650 - replyWidth + 12}
            y="140"
            fill="#FFFFFF"
            fontWeight="600"
          >
            {reply}
          </text>
        </g>
      )}
    </g>
  );
}

function Terrain() {
  const contour = {
    fill: "none",
    stroke: COLORS.contour,
    strokeWidth: 2,
    vectorEffect: "non-scaling-stroke",
  };
  return (
    <g transform={TILT}>
      <g clipPath="url(#cf-mapclip)">
        <rect x="-250" y="-250" width="500" height="500" fill={COLORS.paper} />
        <ellipse cx="-70" cy="150" rx="150" ry="100" fill={COLORS.open} />
        <ellipse cx="130" cy="-170" rx="120" ry="85" fill={COLORS.open} />
        <ellipse cx="185" cy="70" rx="95" ry="120" fill={COLORS.forest} />
        <ellipse cx="-195" cy="-115" rx="105" ry="95" fill={COLORS.forest} />
        <ellipse cx="200" cy="95" rx="45" ry="55" fill={COLORS.forestDense} />
        <ellipse
          cx="-215"
          cy="-135"
          rx="45"
          ry="40"
          fill={COLORS.forestDense}
        />
        <ellipse cx="-165" cy="205" rx="95" ry="48" fill={COLORS.water} />

        <ellipse
          cx="60"
          cy="-40"
          rx="132"
          ry="96"
          transform="rotate(18 60 -40)"
          {...contour}
        />
        <ellipse
          cx="60"
          cy="-40"
          rx="96"
          ry="70"
          transform="rotate(18 60 -40)"
          {...contour}
        />
        <ellipse
          cx="62"
          cy="-42"
          rx="58"
          ry="44"
          transform="rotate(18 62 -42)"
          {...contour}
        />
        <ellipse
          cx="64"
          cy="-44"
          rx="26"
          ry="20"
          transform="rotate(18 64 -44)"
          {...contour}
        />
        <ellipse
          cx="-150"
          cy="30"
          rx="80"
          ry="52"
          transform="rotate(-25 -150 30)"
          {...contour}
        />
        <ellipse
          cx="-150"
          cy="30"
          rx="42"
          ry="26"
          transform="rotate(-25 -150 30)"
          {...contour}
        />

        <path
          d="M-250 80 C-140 40 -60 120 40 90 C140 60 200 140 250 110"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="2.5"
          strokeDasharray="10 8"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M-60 250 C-40 140 30 60 20 -60 C10 -170 90 -220 150 -250"
          fill="none"
          stroke={COLORS.ink}
          strokeWidth="1.5"
          strokeDasharray="5 6"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x="-250"
          y="-250"
          width="500"
          height="500"
          rx="8"
          fill="none"
          stroke={COLORS.edge}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </g>
  );
}

/**
 * The start image. See the module comment.
 */
export function FamilySplash({
  app = null,
  robot = false,
  prompt = null,
  reply = null,
  course = DEFAULT_COURSE,
  caption = "7 kontroller utsatta · 4,3 km",
  showBackground = true,
  alt = "ControlFreak — kontroller sätts ut i terrängen",
  onDone,
  className,
  style,
}: {
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
}) {
  // With a prompt, everything waits for it to be typed.
  const start = prompt ? PROMPT_TIME : 0;
  const lastDelay = start + FIRST_DELAY + (course.length - 1) * STEP + 0.6;

  /**
   * The image's box.
   *
   * Everything drawn lies between y=82 (the top of the logo) and y=450 (the lowest
   * corner of the map), and the map has 19.5 units of margin left and right. Without a
   * caption the same margin goes above and below, so the image weighs evenly; otherwise
   * the band above the logo would be empty space pushing everything down.
   *
   * With a caption it stands at y=474, and the box must start at the top and reach all
   * the way down.
   */
  const view = caption ? { top: 0, height: 500 } : { top: 62, height: 408 };

  useEffect(() => {
    if (!onDone) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(onDone, reduced ? 0 : lastDelay * 1000);
    return () => clearTimeout(id);
  }, [onDone, lastDelay]);

  const path = course
    .map((p, i) => {
      const [sx, sy] = project(p.x, p.y);
      return `${i === 0 ? "M" : "L"}${sx.toFixed(1)} ${sy.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 ${view.top} 680 ${view.height}`}
      width="100%"
      role="img"
      aria-label={alt}
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="cf-mapclip">
          <rect x="-250" y="-250" width="500" height="500" rx="8" />
        </clipPath>
      </defs>
      <style>
        {css +
          (robot ? robotCss(course, lastDelay, start) : "") +
          (prompt ? chatCss(lastDelay - 0.4) : "")}
      </style>

      {showBackground && (
        <rect
          x="0"
          y={view.top}
          width="680"
          height={view.height}
          fill={COLORS.page}
        />
      )}

      <Terrain />

      <path
        className="cf-course"
        // The course is drawn as the controls drop, so it waits for a prompt too.
        style={start ? { animationDelay: `${0.5 + start}s` } : undefined}
        d={path}
        fill="none"
        stroke={COLORS.purple}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {course.map((p, i) => (
        <Marker key={i} point={p} delay={start + FIRST_DELAY + i * STEP} />
      ))}

      {robot && (
        <g className="cf-robot">
          <Robot />
        </g>
      )}

      {/* The logo sits in the wedge above the map's upper left edge, which runs from
          (20, 215) to (489, 130), a slope of -10.3 degrees. Moved down and left, the whole
          lockup stays inside the edge, the space narrowing to the right along the
          diagonal. The app's name is the second line, under the wordmark. */}
      <FamilyTitle x={100} y={82} app={app} />

      {prompt && <Chat prompt={prompt} reply={reply} />}

      {caption && (
        <text
          className="cf-fade"
          style={{ animationDelay: `${lastDelay - 0.3}s` }}
          x="340"
          y="474"
          textAnchor="middle"
          fontSize="14"
          fill={COLORS.muted}
        >
          {caption}
        </text>
      )}
    </svg>
  );
}
