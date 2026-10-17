import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
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
export function project(x, y) {
    return [340 + 0.94 * x + 0.342 * y, 290 - 0.171 * x + 0.47 * y];
}
export const DEFAULT_COURSE = [
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
function Flag({ sx, sy }) {
    const top = sy - 42;
    const bottom = sy - 26;
    return (_jsxs(_Fragment, { children: [_jsx("line", { x1: sx, y1: sy, x2: sx, y2: bottom, stroke: COLORS.post, strokeWidth: "2" }), _jsx("polygon", { points: `${sx - 8},${top} ${sx + 8},${top} ${sx - 8},${bottom}`, fill: "#FFFFFF", stroke: COLORS.post, strokeWidth: "1" }), _jsx("polygon", { points: `${sx + 8},${top} ${sx + 8},${bottom} ${sx - 8},${bottom}`, fill: COLORS.flagOrange })] }));
}
function Marker({ point, delay }) {
    const [sx, sy] = project(point.x, point.y);
    const style = { animationDelay: `${delay}s` };
    return (_jsxs("g", { className: "cf-ctrl", style: style, children: [point.kind !== "start" && (_jsx("ellipse", { className: "cf-pulse", cx: sx, cy: sy, rx: point.kind === "finish" ? 20 : 16, ry: point.kind === "finish" ? 10 : 8, fill: "none", stroke: COLORS.purple, strokeWidth: "2", style: style })), point.kind === "start" && (_jsx("polygon", { points: `${sx},${sy - 10} ${sx + 14},${sy + 7} ${sx - 14},${sy + 7}`, fill: "none", stroke: COLORS.purple, strokeWidth: "3" })), point.kind === "control" && (_jsx("ellipse", { cx: sx, cy: sy, rx: "15", ry: "7.5", fill: "none", stroke: COLORS.purple, strokeWidth: "3" })), point.kind === "finish" && (_jsxs(_Fragment, { children: [_jsx("ellipse", { cx: sx, cy: sy, rx: "19", ry: "9.5", fill: "none", stroke: COLORS.purple, strokeWidth: "3" }), _jsx("ellipse", { cx: sx, cy: sy, rx: "12", ry: "6", fill: "none", stroke: COLORS.purple, strokeWidth: "3" })] })), _jsx(Flag, { sx: sx, sy: sy }), point.label && (_jsx("text", { x: sx + 16, y: sy - 30, fontSize: "12", fontWeight: "500", fill: COLORS.purpleDark, children: point.label }))] }));
}
function Terrain() {
    const contour = {
        fill: "none",
        stroke: COLORS.contour,
        strokeWidth: 2,
        vectorEffect: "non-scaling-stroke",
    };
    return (_jsx("g", { transform: TILT, children: _jsxs("g", { clipPath: "url(#cf-mapclip)", children: [_jsx("rect", { x: "-250", y: "-250", width: "500", height: "500", fill: COLORS.paper }), _jsx("ellipse", { cx: "-70", cy: "150", rx: "150", ry: "100", fill: COLORS.open }), _jsx("ellipse", { cx: "130", cy: "-170", rx: "120", ry: "85", fill: COLORS.open }), _jsx("ellipse", { cx: "185", cy: "70", rx: "95", ry: "120", fill: COLORS.forest }), _jsx("ellipse", { cx: "-195", cy: "-115", rx: "105", ry: "95", fill: COLORS.forest }), _jsx("ellipse", { cx: "200", cy: "95", rx: "45", ry: "55", fill: COLORS.forestDense }), _jsx("ellipse", { cx: "-215", cy: "-135", rx: "45", ry: "40", fill: COLORS.forestDense }), _jsx("ellipse", { cx: "-165", cy: "205", rx: "95", ry: "48", fill: COLORS.water }), _jsx("ellipse", { cx: "60", cy: "-40", rx: "132", ry: "96", transform: "rotate(18 60 -40)", ...contour }), _jsx("ellipse", { cx: "60", cy: "-40", rx: "96", ry: "70", transform: "rotate(18 60 -40)", ...contour }), _jsx("ellipse", { cx: "62", cy: "-42", rx: "58", ry: "44", transform: "rotate(18 62 -42)", ...contour }), _jsx("ellipse", { cx: "64", cy: "-44", rx: "26", ry: "20", transform: "rotate(18 64 -44)", ...contour }), _jsx("ellipse", { cx: "-150", cy: "30", rx: "80", ry: "52", transform: "rotate(-25 -150 30)", ...contour }), _jsx("ellipse", { cx: "-150", cy: "30", rx: "42", ry: "26", transform: "rotate(-25 -150 30)", ...contour }), _jsx("path", { d: "M-250 80 C-140 40 -60 120 40 90 C140 60 200 140 250 110", fill: "none", stroke: COLORS.ink, strokeWidth: "2.5", strokeDasharray: "10 8", vectorEffect: "non-scaling-stroke" }), _jsx("path", { d: "M-60 250 C-40 140 30 60 20 -60 C10 -170 90 -220 150 -250", fill: "none", stroke: COLORS.ink, strokeWidth: "1.5", strokeDasharray: "5 6", vectorEffect: "non-scaling-stroke" }), _jsx("rect", { x: "-250", y: "-250", width: "500", height: "500", rx: "8", fill: "none", stroke: COLORS.edge, strokeWidth: "2", vectorEffect: "non-scaling-stroke" })] }) }));
}
/**
 * The start image. See the module comment.
 */
export function FamilySplash({ app = null, course = DEFAULT_COURSE, caption = "7 kontroller utsatta · 4,3 km", showBackground = true, alt = "ControlFreak — kontroller sätts ut i terrängen", onDone, className, style, }) {
    const lastDelay = FIRST_DELAY + (course.length - 1) * STEP + 0.6;
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
        if (!onDone)
            return;
        const reduced = typeof window !== "undefined" &&
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
    return (_jsxs("svg", { viewBox: `0 ${view.top} 680 ${view.height}`, width: "100%", role: "img", "aria-label": alt, className: className, style: style, xmlns: "http://www.w3.org/2000/svg", children: [_jsx("defs", { children: _jsx("clipPath", { id: "cf-mapclip", children: _jsx("rect", { x: "-250", y: "-250", width: "500", height: "500", rx: "8" }) }) }), _jsx("style", { children: css }), showBackground && (_jsx("rect", { x: "0", y: view.top, width: "680", height: view.height, fill: COLORS.page })), _jsx(Terrain, {}), _jsx("path", { className: "cf-course", d: path, fill: "none", stroke: COLORS.purple, strokeWidth: "3", strokeLinejoin: "round", strokeLinecap: "round" }), course.map((p, i) => (_jsx(Marker, { point: p, delay: FIRST_DELAY + i * STEP }, i))), _jsxs("g", { transform: "translate(-152, 36)", children: [_jsx("rect", { x: "252", y: "46", width: "52", height: "52", rx: "13", fill: COLORS.purple }), _jsx("circle", { cx: "278", cy: "72", r: "16", fill: "none", stroke: "#FFFFFF", strokeWidth: "4" }), _jsx("path", { d: "M270 78 L278 70 L286 78", fill: "none", stroke: "#FFFFFF", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round" }), _jsxs("text", { x: "318", y: "81", fontSize: "34", fontWeight: "500", fill: COLORS.ink, children: ["Control", _jsx("tspan", { fill: COLORS.purple, children: "Freak" })] }), app && (_jsx("text", { x: "320", y: "104", fontSize: "16", fontWeight: "600", fill: COLORS.muted, children: app }))] }), caption && (_jsx("text", { className: "cf-fade", style: { animationDelay: `${lastDelay - 0.3}s` }, x: "340", y: "474", textAnchor: "middle", fontSize: "14", fill: COLORS.muted, children: caption }))] }));
}
