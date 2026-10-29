/** The header's and footer's own texts, in the family's five languages. */
import type { Lang } from "../i18n/index.js";
export type FamilyTexts = {
    /** The app switcher's button and heading. */
    apps: string;
    /** The hub's row in the switcher. */
    allApps: string;
    language: string;
    darkMode: string;
    lightMode: string;
    manual: string;
    feedback: string;
    menu: string;
    close: string;
    licenses: string;
    version: string;
    /** The Facebook link's tooltip. */
    onFacebook: string;
    /** The mark's link. */
    toStart: string;
    /** Marks the app one is in. */
    thisApp: string;
};
export declare const TEXTS: Record<Lang, FamilyTexts>;
