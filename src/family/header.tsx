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

import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";

import { HTML_LANG, LANG_LABELS, LANGS, type Lang } from "../i18n/index.js";
import { FAMILY_APPS, familyApp, familyHubUrl, type FamilyAccent, type FamilyAppId } from "./apps.js";
import {
  AppMark,
  AppsIcon,
  BookIcon,
  ChevronIcon,
  CloseIcon,
  FeedbackIcon,
  GlobeIcon,
  Mark,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "./icons.js";
import { TEXTS } from "./texts.js";

/**
 * An app's name written the family's way: "Control" in the text colour, "Freak" in the
 * family's purple (as in the logo), and the app's own word in its accent, as one text so
 * screen readers read the whole name.
 */
/** "ControlFreak" with "Freak" in purple; any other base as it is. */
function FreakName({ base }: { base: string }) {
  if (!base.endsWith("Freak")) return <>{base}</>;
  return (
    <>
      {base.slice(0, -"Freak".length)}
      <span className="cf-family-freak">Freak</span>
    </>
  );
}

export function FamilyName({
  app,
  className = "",
}: {
  app: Exclude<FamilyAppId, "hub"> | { base: string; word: string; accent?: FamilyAccent };
  className?: string;
}) {
  const a = typeof app === "string" ? familyApp(app) : app;
  return (
    <span className={`cf-family-name ${className}`.trim()}>
      <FreakName base={a.base} />
      {a.base && a.word ? " " : ""}
      {a.word && (
        <span className={a.accent ? `cf-family-accent-${a.accent}` : undefined}>{a.word}</span>
      )}
    </span>
  );
}

export type FamilyHeaderProps = {
  /** Which app this is. The name is drawn from it, and the switcher marks it. */
  app: FamilyAppId;
  lang: Lang;
  /**
   * The address of this page in each language. With it, the language menu is real links
   * (search engines follow them); `onLangChange` is still called on a click and may
   * call `preventDefault` to navigate itself.
   */
  langHref?: (lang: Lang) => string;
  /** Called with the chosen language. Without `langHref`, the menu is buttons. */
  onLangChange?: (lang: Lang, event: MouseEvent<HTMLElement>) => void;
  /** The theme button: whether it is dark now, and the toggle. Left out, no button. */
  theme?: { dark: boolean; onToggle: () => void };
  /** The user guide's address, or a click handler when it is a page inside the app. */
  manualHref?: string;
  onManual?: (event: MouseEvent<HTMLElement>) => void;
  /** Opens the user guide in a new tab (ControlFreak keeps the map in memory). */
  manualNewTab?: boolean;
  /** Opens the app's feedback dialog. Left out, no button. */
  onFeedback?: () => void;
  /** Where the mark and name lead; the app's start page when left out. */
  homeHref?: string;
  /**
   * A name other than the app's own in the family list, for an app whose name depends
   * on where it is served (the start clock on its old and its family address).
   */
  name?: { base: string; word: string; accent?: FamilyAccent };
  /** The app's own middle: what is open. */
  children?: ReactNode;
  /** Phone layout: the tools fold into a sheet behind one menu button. */
  compact?: boolean;
  /** The app switcher; `false` on a page that lists the apps itself, as the hub does. */
  showApps?: boolean;
  className?: string;
};

type Menu = "apps" | "lang" | "sheet" | null;

/** Closes the open menu on a click outside it or on Escape. */
function useCloseMenu(open: boolean, close: () => void, ref: { current: HTMLElement | null }) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}

export function FamilyHeader({
  app,
  lang,
  langHref,
  onLangChange,
  theme,
  manualHref,
  onManual,
  manualNewTab,
  onFeedback,
  homeHref,
  name,
  children,
  compact = false,
  showApps = app !== "hub",
  className = "",
}: FamilyHeaderProps) {
  const t = TEXTS[lang];
  const [menu, setMenu] = useState<Menu>(null);
  const root = useRef<HTMLElement | null>(null);
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
    const onClick = (e: MouseEvent<HTMLElement>) => {
      close();
      onLangChange?.(l, e);
    };
    const inner = LANG_LABELS[l];
    return langHref ? (
      <a
        key={l}
        href={langHref(l)}
        hrefLang={HTML_LANG[l]}
        lang={HTML_LANG[l]}
        role="menuitem"
        aria-current={current ? "true" : undefined}
        className={current ? "cf-family-current" : undefined}
        onClick={onClick}
      >
        {inner}
      </a>
    ) : (
      <button
        key={l}
        type="button"
        lang={HTML_LANG[l]}
        role="menuitem"
        aria-current={current ? "true" : undefined}
        className={current ? "cf-family-current" : undefined}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  });

  const appItems = (
    <>
      {FAMILY_APPS.map((a) => {
        const current = a.id === app;
        return (
          <a
            key={a.id}
            href={a.url}
            role="menuitem"
            aria-current={current ? "true" : undefined}
            className={current ? "cf-family-current" : undefined}
            onClick={close}
          >
            <AppMark app={a.id} size={20} />
            <span>
              <span className="cf-family-app-title">
                <FamilyName app={a} />
                {current && <span className="cf-family-sr">{` (${t.thisApp})`}</span>}
              </span>
              <span className="cf-family-app-what">{a.what[lang]}</span>
            </span>
          </a>
        );
      })}
      <a
        href={familyHubUrl(lang)}
        role="menuitem"
        className={`cf-family-hub${app === "hub" ? " cf-family-current" : ""}`}
        aria-current={app === "hub" ? "true" : undefined}
        onClick={close}
      >
        <span className="cf-family-app-title">controlfreak.se</span>
        <span className="cf-family-app-what">{t.allApps}</span>
      </a>
    </>
  );

  const manualLink = hasManual && (
    <a
      href={manualHref ?? "#"}
      onClick={(e) => {
        close();
        onManual?.(e);
      }}
      {...(manualNewTab ? { target: "_blank", rel: "noopener" } : {})}
      className="cf-family-tool"
      aria-label={compact ? undefined : t.manual}
      title={compact ? undefined : t.manual}
    >
      <BookIcon />
      {compact && <span>{t.manual}</span>}
    </a>
  );

  const feedbackButton = onFeedback && (
    <button
      type="button"
      className="cf-family-tool"
      onClick={() => {
        close();
        onFeedback();
      }}
      aria-label={compact ? undefined : t.feedback}
      title={compact ? undefined : t.feedback}
    >
      <FeedbackIcon />
      {compact && <span>{t.feedback}</span>}
    </button>
  );

  const themeButton = theme && (
    <button
      type="button"
      className="cf-family-tool"
      onClick={() => {
        close();
        theme.onToggle();
      }}
      aria-label={compact ? undefined : theme.dark ? t.lightMode : t.darkMode}
      title={compact ? undefined : theme.dark ? t.lightMode : t.darkMode}
    >
      {theme.dark ? <SunIcon /> : <MoonIcon />}
      {compact && <span>{theme.dark ? t.lightMode : t.darkMode}</span>}
    </button>
  );

  return (
    <header
      ref={root}
      className={`cf-family-header${compact ? " cf-family-compact" : ""} ${className}`.trim()}
    >
      <a href={home} className="cf-family-home" aria-label={app === "hub" ? undefined : t.toStart}>
        <Mark size={compact ? 26 : 28} />
        {app === "hub" ? (
          <span className="cf-family-name">controlfreak.se</span>
        ) : (
          <FamilyName app={name ?? app} />
        )}
      </a>
      {children !== undefined && children !== null && (
        <div className="cf-family-middle">{children}</div>
      )}
      {compact ? (
        <div className="cf-family-tools">
          <button
            type="button"
            className={`cf-family-tool${menu === "sheet" ? " cf-family-on" : ""}`}
            aria-expanded={menu === "sheet"}
            aria-controls={sheetId}
            aria-label={menu === "sheet" ? t.close : t.menu}
            onClick={() => setMenu(menu === "sheet" ? null : "sheet")}
          >
            {menu === "sheet" ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      ) : (
        <div className="cf-family-tools">
          {showApps && (
            <button
              type="button"
              className={`cf-family-tool${menu === "apps" ? " cf-family-on" : ""}`}
              aria-expanded={menu === "apps"}
              aria-controls={appsId}
              aria-haspopup="menu"
              aria-label={t.apps}
              title={t.apps}
              onClick={() => setMenu(menu === "apps" ? null : "apps")}
            >
              <AppsIcon />
            </button>
          )}
          {hasLang && (
            <button
              type="button"
              className={`cf-family-tool cf-family-lang${menu === "lang" ? " cf-family-on" : ""}`}
              aria-expanded={menu === "lang"}
              aria-controls={langId}
              aria-haspopup="menu"
              aria-label={`${t.language}: ${LANG_LABELS[lang]}`}
              title={t.language}
              onClick={() => setMenu(menu === "lang" ? null : "lang")}
            >
              {lang}
              <ChevronIcon />
            </button>
          )}
          {themeButton}
          {manualLink}
          {feedbackButton}
        </div>
      )}
      {/* The menus are in the page even when closed, so that the links to the apps
          and to the other languages are there for search engines; `hidden` shows one. */}
      {showApps && !compact && (
        <div
          id={appsId}
          role="menu"
          aria-label={t.apps}
          className="cf-family-pop cf-family-apps"
          hidden={menu !== "apps"}
        >
          <div className="cf-family-pop-head">{t.apps}</div>
          {appItems}
        </div>
      )}
      {hasLang && !compact && (
        <div
          id={langId}
          role="menu"
          aria-label={t.language}
          className="cf-family-pop cf-family-langs"
          hidden={menu !== "lang"}
        >
          {langItems}
        </div>
      )}
      {compact && (
        <div id={sheetId} className="cf-family-sheet" hidden={menu !== "sheet"}>
          {hasLang && (
            <div className="cf-family-sheet-row">
              <GlobeIcon />
              <span className="cf-family-sheet-label">{t.language}</span>
              <div className="cf-family-sheet-langs" role="menu" aria-label={t.language}>
                {langItems}
              </div>
            </div>
          )}
          {themeButton}
          {manualLink}
          {feedbackButton}
          {showApps && (
            <>
              <div className="cf-family-pop-head">{t.apps}</div>
              <div role="menu" aria-label={t.apps} className="cf-family-sheet-apps">
                {appItems}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
