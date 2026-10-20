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
/** A language of the family, by its code. */
export type Lang = "sv" | "en" | "no" | "fi" | "cs";
/** The languages in the order pickers show them. Swedish is the source. */
export declare const LANGS: readonly Lang[];
/** The language the apps are written in. */
export declare const SOURCE_LANG: Lang;
/** Each language's name in that language, as language pickers do. */
export declare const LANG_LABELS: Record<Lang, string>;
/** The code in `<html lang>` and `hreflang`. Norwegian is written in bokmål, `nb`. */
export declare const HTML_LANG: Record<Lang, string>;
/** The locale for dates, numbers and sorting (`Intl`, `localeCompare`). */
export declare const LOCALE_TAG: Record<Lang, string>;
/** The Open Graph locale (`og:locale`), which wants language_TERRITORY. */
export declare const OG_LOCALE: Record<Lang, string>;
/** Each language's address. Swedish is the start page, the others one segment below. */
export declare const LANG_PATHS: Record<Lang, string>;
/** Whether a value is one of the family's language codes. */
export declare function isLang(value: unknown): value is Lang;
/**
 * The address of a page in a language: `langPath("en")` is `/en`, and
 * `langPath("en", "help")` is `/en/help`; for Swedish `/` and `/help`.
 */
export declare function langPath(lang: Lang, page?: string): string;
/**
 * The language an address decides, or `undefined` for an address that is not a
 * language's start page (e.g. `/resultat`), which follows the user's choice instead.
 */
export declare function langForPath(pathname: string): Lang | undefined;
/**
 * The first of the family's languages in a browser's language list (e.g.
 * `navigator.languages`), read in order so that "de, sv, en" gives Swedish; or
 * `undefined` when none of them is there.
 */
export declare function matchBrowserLang(tags: readonly string[]): Lang | undefined;
/**
 * The language to use when the address does not say: a stored choice wins; otherwise
 * the browser's list is read in order and the first language we have wins; otherwise
 * `fallback`. Swedish is the default fallback, being the language the apps are
 * written in; an app whose users are mostly abroad may prefer English.
 */
export declare function resolveLang(preferred: readonly string[], stored: unknown, fallback?: Lang): Lang;
/**
 * The browser's language list, with `language` as a fallback for the older browsers
 * that lack `languages`; empty where there is no browser (on the server).
 */
export declare function browserLanguages(): readonly string[];
