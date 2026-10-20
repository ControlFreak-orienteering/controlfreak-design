/**
 * The apps of the family, as the app switcher and the hub list them.
 *
 * Names are never translated. "ControlFreak" is written in the text colour and the
 * app's own word after it in the app's accent colour (see `FamilyName`). The one-line
 * descriptions are the same as on controlfreak.se.
 */
import { type Lang } from "../i18n/index.js";
/** Which app a page belongs to. `hub` is controlfreak.se itself. */
export type FamilyAppId = "controlfreak" | "event" | "startklocka" | "run" | "mcp" | "hub";
/** The colour of the app's own word in its name. */
export type FamilyAccent = "purple" | "orange";
/** An app in the family. */
export type FamilyApp = {
    id: FamilyAppId;
    /** The app's address. */
    url: string;
    /** The whole name, for places that cannot colour the app's word. */
    name: string;
    /** The first part of the name, in the text colour; "" for MCP Freak. */
    base: string;
    /** The app's own word, in `accent`; "" when the name has no accent part. */
    word: string;
    accent?: FamilyAccent;
    /** What the app does, one line. */
    what: Record<Lang, string>;
};
/** The apps in the order the hub lists them: the way a competition is made. */
export declare const FAMILY_APPS: readonly FamilyApp[];
/** The hub, controlfreak.se, with all the apps. */
export declare const FAMILY_HUB_URL = "https://controlfreak.se";
/** The hub's page in a language, e.g. `https://controlfreak.se/en`. */
export declare function familyHubUrl(lang: Lang): string;
/** The app with a given id; the hub is not among the apps. */
export declare function familyApp(id: Exclude<FamilyAppId, "hub">): FamilyApp;
