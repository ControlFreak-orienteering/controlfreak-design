import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** The header's icons, drawn in the text colour. All are decorative; the buttons carry the names. */
const common = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};
export const AppsIcon = () => (_jsxs("svg", { ...common, children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7", rx: "1.5" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7", rx: "1.5" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7", rx: "1.5" }), _jsx("rect", { x: "14", y: "14", width: "7", height: "7", rx: "1.5" })] }));
export const ChevronIcon = () => (_jsx("svg", { ...common, width: 14, height: 14, children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
export const MoonIcon = () => (_jsx("svg", { ...common, children: _jsx("path", { d: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" }) }));
export const SunIcon = () => (_jsxs("svg", { ...common, children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })] }));
export const BookIcon = () => (_jsxs("svg", { ...common, children: [_jsx("path", { d: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" }), _jsx("path", { d: "M4 20.5V5.5M8 7h8M8 10.5h6" })] }));
export const FeedbackIcon = () => (_jsx("svg", { ...common, children: _jsx("path", { d: "M4 5h16v11H9l-5 4Z" }) }));
export const GlobeIcon = () => (_jsxs("svg", { ...common, children: [_jsx("circle", { cx: "12", cy: "12", r: "9" }), _jsx("path", { d: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" })] }));
export const MenuIcon = () => (_jsx("svg", { ...common, children: _jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }) }));
export const CloseIcon = () => (_jsx("svg", { ...common, children: _jsx("path", { d: "M6 6l12 12M18 6 6 18" }) }));
/** The family's mark: a white ring with an upward chevron on a rounded purple tile. */
export const Mark = ({ size = 28 }) => (_jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "32", height: "32", rx: "7", fill: "#a6248f" }), _jsx("circle", { cx: "16", cy: "18", r: "7.5", fill: "none", stroke: "#fdfaf2", strokeWidth: "3" }), _jsx("path", { d: "M11 12.5 16 7.5l5 5", fill: "none", stroke: "#fdfaf2", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" })] }));
/**
 * An app's own mark, as its page icon shows it, for the family header, the app switcher
 * and the start image's title. ControlFreak, MCP and the hub show the family's mark. The drawings are copies of the apps' icons (Event,
 * Start, Run and Diff: `src/brand/`).
 */
export const AppMark = ({ app, size = 20 }) => {
    if (app === "event")
        return (_jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "32", height: "32", rx: "7", fill: "#a6248f" }), _jsx("polygon", { points: "16.00,4.60 16.88,6.99 19.42,7.09 17.43,8.66 18.12,11.11 16.00,9.70 13.88,11.11 14.57,8.66 12.58,7.09 15.12,6.99", fill: "#fdfaf2" }), _jsx("path", { d: "M5.5 17.5h7V26h-7z M19.5 20h7v6h-7z", fill: "#fdfaf2" }), _jsx("path", { d: "M12.5 13.5h7V26h-7z", fill: "#f07f2a" })] }));
    if (app === "run")
        return (_jsxs("svg", { viewBox: "0 0 100 100", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "100", height: "100", rx: "22", fill: "#a6248f" }), _jsx("circle", { cx: "50", cy: "50", r: "30", fill: "none", stroke: "#fff", strokeWidth: "6", strokeDasharray: "13.6 10", transform: "rotate(-11 50 50)" }), _jsx("rect", { x: "36", y: "36", width: "28", height: "28", fill: "#fff" }), _jsx("polygon", { points: "64,36 64,64 36,64", fill: "#f07f2a" })] }));
    if (app === "diff")
        return (_jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "32", height: "32", rx: "7", fill: "#a6248f" }), _jsx("line", { x1: "19.2", y1: "19.2", x2: "25.5", y2: "25.5", stroke: "#f07f2a", strokeWidth: "4", strokeLinecap: "round" }), _jsx("circle", { cx: "13.5", cy: "13.5", r: "7", fill: "none", stroke: "#fdfaf2", strokeWidth: "3" })] }));
    if (app === "startklocka")
        return (_jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "32", height: "32", rx: "7", fill: "#a6248f" }), _jsx("circle", { cx: "16", cy: "16", r: "10", fill: "none", stroke: "#fdfaf2", strokeWidth: "2.8" }), _jsx("polygon", { points: "16.00,10.60 21.20,19.60 10.80,19.60", fill: "none", stroke: "#f07f2a", strokeWidth: "2.6", strokeLinejoin: "round" })] }));
    return _jsx(Mark, { size: size });
};
