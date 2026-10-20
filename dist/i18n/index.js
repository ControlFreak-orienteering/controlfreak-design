/**
 * The family's languages, shared by every app under controlfreak.se.
 *
 * Five languages: Swedish is the source, every text is written in Swedish first and
 * translated into English, Norwegian (bokmål), Finnish and Czech. The orienteering
 * terms of each language are listed in docs/orienteering-terms.md in this repository.
 *
 * This module holds only what every app needs in the same way: the codes, the names,
 * the tags for `<html lang>`, `Intl` and Open Graph, each language's address, and how
 * a browser's language list is matched. Each app keeps its own texts and its own way
 * of declaring them.
 */
/** The languages in the order pickers show them. Swedish is the source. */
export const LANGS = ["sv", "en", "no", "fi", "cs"];
/** The language the apps are written in. */
export const SOURCE_LANG = "sv";
/** Each language's name in that language, as language pickers do. */
export const LANG_LABELS = {
    sv: "Svenska",
    en: "English",
    no: "Norsk",
    fi: "Suomi",
    cs: "Čeština",
};
/** The code in `<html lang>` and `hreflang`. Norwegian is written in bokmål, `nb`. */
export const HTML_LANG = { sv: "sv", en: "en", no: "nb", fi: "fi", cs: "cs" };
/** The locale for dates, numbers and sorting (`Intl`, `localeCompare`). */
export const LOCALE_TAG = {
    sv: "sv-SE",
    en: "en-GB",
    no: "nb-NO",
    fi: "fi-FI",
    cs: "cs-CZ",
};
/** The Open Graph locale (`og:locale`), which wants language_TERRITORY. */
export const OG_LOCALE = {
    sv: "sv_SE",
    en: "en_GB",
    no: "nb_NO",
    fi: "fi_FI",
    cs: "cs_CZ",
};
/** Each language's address. Swedish is the start page, the others one segment below. */
export const LANG_PATHS = {
    sv: "/",
    en: "/en",
    no: "/no",
    fi: "/fi",
    cs: "/cs",
};
/** Whether a value is one of the family's language codes. */
export function isLang(value) {
    return LANGS.includes(value);
}
/**
 * The address of a page in a language: `langPath("en")` is `/en`, and
 * `langPath("en", "help")` is `/en/help`; for Swedish `/` and `/help`.
 */
export function langPath(lang, page = "") {
    const base = LANG_PATHS[lang];
    const sub = page.replace(/^\/+/, "");
    if (sub === "")
        return base;
    return base === "/" ? `/${sub}` : `${base}/${sub}`;
}
/**
 * The language an address decides, or `undefined` for an address that is not a
 * language's start page (e.g. `/resultat`), which follows the user's choice instead.
 */
export function langForPath(pathname) {
    const path = pathname.replace(/\/+$/, "") || "/";
    return LANGS.find((lang) => LANG_PATHS[lang] === path);
}
/** Which of the family's languages a browser language tag's base belongs to. */
const BROWSER_TAGS = {
    sv: "sv",
    en: "en",
    nb: "no",
    nn: "no",
    no: "no",
    fi: "fi",
    cs: "cs",
};
/**
 * The first of the family's languages in a browser's language list (e.g.
 * `navigator.languages`), read in order so that "de, sv, en" gives Swedish; or
 * `undefined` when none of them is there.
 */
export function matchBrowserLang(tags) {
    for (const tag of tags) {
        const base = tag.toLowerCase().split("-")[0] ?? "";
        const lang = BROWSER_TAGS[base];
        if (lang)
            return lang;
    }
    return undefined;
}
/**
 * The language to use when the address does not say: a stored choice wins; otherwise
 * the browser's list is read in order and the first language we have wins; otherwise
 * `fallback`. Swedish is the default fallback, being the language the apps are
 * written in; an app whose users are mostly abroad may prefer English.
 */
export function resolveLang(preferred, stored, fallback = SOURCE_LANG) {
    if (isLang(stored))
        return stored;
    return matchBrowserLang(preferred) ?? fallback;
}
/**
 * The browser's language list, with `language` as a fallback for the older browsers
 * that lack `languages`; empty where there is no browser (on the server).
 */
export function browserLanguages() {
    if (typeof navigator === "undefined")
        return [];
    return navigator.languages ?? (navigator.language ? [navigator.language] : []);
}
