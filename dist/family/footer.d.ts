/**
 * The family footer: who makes the apps, the hub, the licences and the version. Shown
 * at the bottom of a page or a sidebar; the header above does the navigation.
 */
import type { MouseEvent } from "react";
import type { Lang } from "../i18n/index.js";
export type FamilyFooterProps = {
    lang: Lang;
    /** The licence list's address, or a click handler when it is a dialog in the app. */
    licensesHref?: string;
    onLicenses?: (event: MouseEvent<HTMLElement>) => void;
    /** The app's version, as the app writes it (a date or a number). */
    version?: string;
    /** Stacks the parts under each other, for a narrow sidebar. */
    stacked?: boolean;
    className?: string;
};
export declare function FamilyFooter({ lang, licensesHref, onLicenses, version, stacked, className, }: FamilyFooterProps): import("react").JSX.Element;
