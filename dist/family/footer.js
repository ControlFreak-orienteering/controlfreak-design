import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MadeBy } from "../credits/made-by.js";
import { FAMILY_FACEBOOK_URL, familyHubUrl } from "./apps.js";
import { TEXTS } from "./texts.js";
export function FamilyFooter({ lang, licensesHref, onLicenses, version, stacked = false, className = "", }) {
    const t = TEXTS[lang];
    const licenses = licensesHref ? (_jsx("a", { href: licensesHref, onClick: onLicenses, children: t.licenses })) : onLicenses ? (_jsx("button", { type: "button", onClick: onLicenses, children: t.licenses })) : null;
    return (_jsxs("footer", { className: `cf-family-footer${stacked ? " cf-family-stacked" : ""} ${className}`.trim(), children: [_jsx(MadeBy, { lang: lang }), _jsxs("span", { className: "cf-family-footer-links", children: [_jsx("a", { href: familyHubUrl(lang), children: "controlfreak.se" }), _jsx("a", { href: FAMILY_FACEBOOK_URL, target: "_blank", rel: "noreferrer", title: t.onFacebook, children: "Facebook" }), licenses, version && (_jsxs("span", { children: [t.version, " ", version] }))] })] }));
}
