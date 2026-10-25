import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
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
/**
 * The family's mark: a white ring with an upward chevron inside it on a rounded purple
 * tile, `assets/controlfreak-mark.svg` scaled from its 512 grid to 32.
 */
export const Mark = ({ size = 28 }) => (_jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, "aria-hidden": "true", children: [_jsx("rect", { width: "32", height: "32", rx: "7.25", fill: "#a6248f" }), _jsx("circle", { cx: "16", cy: "16", r: "9.375", fill: "none", stroke: "#fff", strokeWidth: "2.375" }), _jsx("path", { d: "M11.3125 17.8125 16 13.125l4.6875 4.6875", fill: "none", stroke: "#fff", strokeWidth: "2.375", strokeLinecap: "round", strokeLinejoin: "round" })] }));
/** Where every app serves its own mark, at its own address. */
export const APP_MARK_PATH = "/app-mark.svg";
/**
 * An app's own mark. Each app owns its mark and serves it at `/app-mark.svg`, so a new
 * mark needs only that app to be published, not every app and not this package.
 *
 * `src` is the image to show; left out, the family's mark. When the image cannot be
 * loaded (offline, or an app that does not serve one yet), the family's mark is shown
 * instead, so a mark is never a broken image.
 */
export function FamilyAppMark({ src, size = 20 }) {
    const [failed, setFailed] = useState(false);
    const img = useRef(null);
    useEffect(() => {
        setFailed(false);
        // An error before React took over the server's markup fires no onError.
        const el = img.current;
        if (el && el.complete && el.naturalWidth === 0)
            setFailed(true);
    }, [src]);
    if (!src || failed)
        return _jsx(Mark, { size: size });
    return (_jsx("img", { ref: img, src: src, width: size, height: size, alt: "", "aria-hidden": "true", decoding: "async", onError: () => setFailed(true) }));
}
