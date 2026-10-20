/**
 * The family footer: who makes the apps, the hub, the licences and the version. Shown
 * at the bottom of a page or a sidebar; the header above does the navigation.
 */

import type { MouseEvent } from "react";

import { MadeBy } from "../credits/made-by.js";
import type { Lang } from "../i18n/index.js";
import { familyHubUrl } from "./apps.js";
import { TEXTS } from "./texts.js";

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

export function FamilyFooter({
  lang,
  licensesHref,
  onLicenses,
  version,
  stacked = false,
  className = "",
}: FamilyFooterProps) {
  const t = TEXTS[lang];
  const licenses = licensesHref ? (
    <a href={licensesHref} onClick={onLicenses}>
      {t.licenses}
    </a>
  ) : onLicenses ? (
    <button type="button" onClick={onLicenses}>
      {t.licenses}
    </button>
  ) : null;
  return (
    <footer
      className={`cf-family-footer${stacked ? " cf-family-stacked" : ""} ${className}`.trim()}
    >
      <MadeBy lang={lang} />
      <span className="cf-family-footer-links">
        <a href={familyHubUrl(lang)}>controlfreak.se</a>
        {licenses}
        {version && (
          <span>
            {t.version} {version}
          </span>
        )}
      </span>
    </footer>
  );
}
