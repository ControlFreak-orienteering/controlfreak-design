import type { Lang } from "../i18n/index.js";

export type { Lang };

/** The people who make the apps, in the order they are shown. */
export const AUTHORS = [
  { name: "Henrik Flordal", github: "HenrikF" },
  { name: "Hugo Flordal", github: "hugoflordal" },
] as const;

/** The credit's texts. `{name}` in `onGitHub` is replaced by the person's name. */
const TEXTS: Record<Lang, { madeBy: string; onGitHub: string }> = {
  sv: { madeBy: "Gjord av", onGitHub: "{name} på GitHub" },
  en: { madeBy: "Made by", onGitHub: "{name} on GitHub" },
  no: { madeBy: "Laget av", onGitHub: "{name} på GitHub" },
  fi: { madeBy: "Tekijät", onGitHub: "{name} GitHubissa" },
  cs: { madeBy: "Vytvořili", onGitHub: "{name} na GitHubu" },
};

/** GitHub's mark (Octicons `mark-github`, MIT), drawn in the text's colour. */
const GITHUB_MARK =
  "M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z";

/**
 * Who makes the apps: "Made by" and a GitHub mark for each author, linking to their
 * profile. The mark has no visible name, so its name is in the link's label and tooltip.
 *
 * It takes the colour and size of the surrounding text, so the app decides how it looks
 * through `className` (e.g. `text-xs text-muted-foreground`). An app's Tailwind does not
 * scan this package, so the little layout it needs is set inline.
 */
export function MadeBy({ lang = "sv", className = "" }: { lang?: Lang; className?: string }) {
  const texts = TEXTS[lang];
  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5em" }}
    >
      {texts.madeBy}
      {AUTHORS.map((author) => {
        const label = texts.onGitHub.replace("{name}", author.name);
        return (
          <a
            key={author.github}
            href={`https://github.com/${author.github}`}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
            style={{ display: "inline-flex", color: "inherit" }}
          >
            <svg
              viewBox="0 0 16 16"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={GITHUB_MARK} />
            </svg>
          </a>
        );
      })}
    </span>
  );
}
