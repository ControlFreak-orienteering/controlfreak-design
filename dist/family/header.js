import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The family header: the same first row in every app under controlfreak.se.
 *
 * Left, the mark and the app's name; in the middle, what the app has open (the app's
 * own `children`); right, the family's tools: the app switcher, the language menu, the
 * theme button, the user guide and feedback. The header is 48 px high, 44 in `compact`
 * mode, where the tools fold into a sheet behind one menu button.
 *
 * Every tool is optional: an app without a theme choice (Run follows the phone) leaves
 * `theme` out, an app without a user guide leaves `manualHref` out, and so on. The
 * look is plain CSS in `css/family.css`, on the apps' tokens, since an app's Tailwind
 * does not scan this package.
 */
import { useEffect, useId, useRef, useState } from "react";
import { HTML_LANG, LANG_LABELS, LANGS } from "../i18n/index.js";
import { FAMILY_APPS, familyApp, familyHubUrl } from "./apps.js";
import { AppsIcon, BookIcon, ChevronIcon, CloseIcon, FeedbackIcon, GlobeIcon, Mark, MenuIcon, MoonIcon, SunIcon, } from "./icons.js";
import { TEXTS } from "./texts.js";
/**
 * An app's name written the family's way: "Control" in the text colour, "Freak" in the
 * family's purple (as in the logo), and the app's own word in its accent, as one text so
 * screen readers read the whole name.
 */
/** "ControlFreak" with "Freak" in purple; any other base as it is. */
function FreakName({ base }) {
    if (!base.endsWith("Freak"))
        return _jsx(_Fragment, { children: base });
    return (_jsxs(_Fragment, { children: [base.slice(0, -"Freak".length), _jsx("span", { className: "cf-family-freak", children: "Freak" })] }));
}
export function FamilyName({ app, className = "", }) {
    const a = typeof app === "string" ? familyApp(app) : app;
    return (_jsxs("span", { className: `cf-family-name ${className}`.trim(), children: [_jsx(FreakName, { base: a.base }), a.base && a.word ? " " : "", a.word && (_jsx("span", { className: a.accent ? `cf-family-accent-${a.accent}` : undefined, children: a.word }))] }));
}
/** Closes the open menu on a click outside it or on Escape. */
function useCloseMenu(open, close, ref) {
    useEffect(() => {
        if (!open)
            return;
        const onDown = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                close();
        };
        const onKey = (e) => {
            if (e.key === "Escape")
                close();
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, close, ref]);
}
export function FamilyHeader({ app, lang, langHref, onLangChange, theme, manualHref, onManual, manualNewTab, onFeedback, homeHref, name, children, compact = false, showApps = app !== "hub", className = "", }) {
    const t = TEXTS[lang];
    const [menu, setMenu] = useState(null);
    const root = useRef(null);
    const close = () => setMenu(null);
    useCloseMenu(menu !== null, close, root);
    const appsId = useId();
    const langId = useId();
    const sheetId = useId();
    const hasLang = Boolean(langHref || onLangChange);
    const hasManual = Boolean(manualHref || onManual);
    const home = homeHref ?? (app === "hub" ? familyHubUrl(lang) : "/");
    const langItems = LANGS.map((l) => {
        const current = l === lang;
        const onClick = (e) => {
            close();
            onLangChange?.(l, e);
        };
        const inner = LANG_LABELS[l];
        return langHref ? (_jsx("a", { href: langHref(l), hrefLang: HTML_LANG[l], lang: HTML_LANG[l], role: "menuitem", "aria-current": current ? "true" : undefined, className: current ? "cf-family-current" : undefined, onClick: onClick, children: inner }, l)) : (_jsx("button", { type: "button", lang: HTML_LANG[l], role: "menuitem", "aria-current": current ? "true" : undefined, className: current ? "cf-family-current" : undefined, onClick: onClick, children: inner }, l));
    });
    const appItems = (_jsxs(_Fragment, { children: [FAMILY_APPS.map((a) => {
                const current = a.id === app;
                return (_jsxs("a", { href: a.url, role: "menuitem", "aria-current": current ? "true" : undefined, className: current ? "cf-family-current" : undefined, onClick: close, children: [_jsx(Mark, { size: 20 }), _jsxs("span", { children: [_jsxs("span", { className: "cf-family-app-title", children: [_jsx(FamilyName, { app: a }), current && _jsx("span", { className: "cf-family-sr", children: ` (${t.thisApp})` })] }), _jsx("span", { className: "cf-family-app-what", children: a.what[lang] })] })] }, a.id));
            }), _jsxs("a", { href: familyHubUrl(lang), role: "menuitem", className: `cf-family-hub${app === "hub" ? " cf-family-current" : ""}`, "aria-current": app === "hub" ? "true" : undefined, onClick: close, children: [_jsx("span", { className: "cf-family-app-title", children: "controlfreak.se" }), _jsx("span", { className: "cf-family-app-what", children: t.allApps })] })] }));
    const manualLink = hasManual && (_jsxs("a", { href: manualHref ?? "#", onClick: (e) => {
            close();
            onManual?.(e);
        }, ...(manualNewTab ? { target: "_blank", rel: "noopener" } : {}), className: "cf-family-tool", "aria-label": compact ? undefined : t.manual, title: compact ? undefined : t.manual, children: [_jsx(BookIcon, {}), compact && _jsx("span", { children: t.manual })] }));
    const feedbackButton = onFeedback && (_jsxs("button", { type: "button", className: "cf-family-tool", onClick: () => {
            close();
            onFeedback();
        }, "aria-label": compact ? undefined : t.feedback, title: compact ? undefined : t.feedback, children: [_jsx(FeedbackIcon, {}), compact && _jsx("span", { children: t.feedback })] }));
    const themeButton = theme && (_jsxs("button", { type: "button", className: "cf-family-tool", onClick: () => {
            close();
            theme.onToggle();
        }, "aria-label": compact ? undefined : theme.dark ? t.lightMode : t.darkMode, title: compact ? undefined : theme.dark ? t.lightMode : t.darkMode, children: [theme.dark ? _jsx(SunIcon, {}) : _jsx(MoonIcon, {}), compact && _jsx("span", { children: theme.dark ? t.lightMode : t.darkMode })] }));
    return (_jsxs("header", { ref: root, className: `cf-family-header${compact ? " cf-family-compact" : ""} ${className}`.trim(), children: [_jsxs("a", { href: home, className: "cf-family-home", "aria-label": app === "hub" ? undefined : t.toStart, children: [_jsx(Mark, { size: compact ? 26 : 28 }), app === "hub" ? (_jsx("span", { className: "cf-family-name", children: "controlfreak.se" })) : (_jsx(FamilyName, { app: name ?? app }))] }), children !== undefined && children !== null && (_jsx("div", { className: "cf-family-middle", children: children })), compact ? (_jsx("div", { className: "cf-family-tools", children: _jsx("button", { type: "button", className: `cf-family-tool${menu === "sheet" ? " cf-family-on" : ""}`, "aria-expanded": menu === "sheet", "aria-controls": sheetId, "aria-label": menu === "sheet" ? t.close : t.menu, onClick: () => setMenu(menu === "sheet" ? null : "sheet"), children: menu === "sheet" ? _jsx(CloseIcon, {}) : _jsx(MenuIcon, {}) }) })) : (_jsxs("div", { className: "cf-family-tools", children: [showApps && (_jsx("button", { type: "button", className: `cf-family-tool${menu === "apps" ? " cf-family-on" : ""}`, "aria-expanded": menu === "apps", "aria-controls": appsId, "aria-haspopup": "menu", "aria-label": t.apps, title: t.apps, onClick: () => setMenu(menu === "apps" ? null : "apps"), children: _jsx(AppsIcon, {}) })), hasLang && (_jsxs("button", { type: "button", className: `cf-family-tool cf-family-lang${menu === "lang" ? " cf-family-on" : ""}`, "aria-expanded": menu === "lang", "aria-controls": langId, "aria-haspopup": "menu", "aria-label": `${t.language}: ${LANG_LABELS[lang]}`, title: t.language, onClick: () => setMenu(menu === "lang" ? null : "lang"), children: [lang, _jsx(ChevronIcon, {})] })), themeButton, manualLink, feedbackButton] })), showApps && !compact && (_jsxs("div", { id: appsId, role: "menu", "aria-label": t.apps, className: "cf-family-pop cf-family-apps", hidden: menu !== "apps", children: [_jsx("div", { className: "cf-family-pop-head", children: t.apps }), appItems] })), hasLang && !compact && (_jsx("div", { id: langId, role: "menu", "aria-label": t.language, className: "cf-family-pop cf-family-langs", hidden: menu !== "lang", children: langItems })), compact && (_jsxs("div", { id: sheetId, className: "cf-family-sheet", hidden: menu !== "sheet", children: [hasLang && (_jsxs("div", { className: "cf-family-sheet-row", children: [_jsx(GlobeIcon, {}), _jsx("span", { className: "cf-family-sheet-label", children: t.language }), _jsx("div", { className: "cf-family-sheet-langs", role: "menu", "aria-label": t.language, children: langItems })] })), themeButton, manualLink, feedbackButton, showApps && (_jsxs(_Fragment, { children: [_jsx("div", { className: "cf-family-pop-head", children: t.apps }), _jsx("div", { role: "menu", "aria-label": t.apps, className: "cf-family-sheet-apps", children: appItems })] }))] }))] }));
}
