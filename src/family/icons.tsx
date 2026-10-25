/** The header's icons, drawn in the text colour. All are decorative; the buttons carry the names. */

const common = {
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const AppsIcon = () => (
  <svg {...common}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const ChevronIcon = () => (
  <svg {...common} width={14} height={14}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const MoonIcon = () => (
  <svg {...common}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);

export const SunIcon = () => (
  <svg {...common}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const BookIcon = () => (
  <svg {...common}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
    <path d="M4 20.5V5.5M8 7h8M8 10.5h6" />
  </svg>
);

export const FeedbackIcon = () => (
  <svg {...common}>
    <path d="M4 5h16v11H9l-5 4Z" />
  </svg>
);

export const GlobeIcon = () => (
  <svg {...common}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const MenuIcon = () => (
  <svg {...common}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = () => (
  <svg {...common}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

/** The family's mark: a white ring with an upward chevron on a rounded purple tile. */
export const Mark = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="#a6248f" />
    <circle cx="16" cy="18" r="7.5" fill="none" stroke="#fdfaf2" strokeWidth="3" />
    <path
      d="M11 12.5 16 7.5l5 5"
      fill="none"
      stroke="#fdfaf2"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * An app's own mark, as its page icon shows it, for the app switcher. ControlFreak and the
 * hub show the family's mark. The drawings are copies of the apps' icons (Event, Run, MCP
 * and Diff: `src/brand/`, Start: `public/favicon.svg`).
 */
export const AppMark = ({ app, size = 20 }: { app: string; size?: number }) => {
  if (app === "event")
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#a6248f" />
        <polygon
          points="16.00,4.60 16.88,6.99 19.42,7.09 17.43,8.66 18.12,11.11 16.00,9.70 13.88,11.11 14.57,8.66 12.58,7.09 15.12,6.99"
          fill="#fdfaf2"
        />
        <path d="M5.5 17.5h7V26h-7z M19.5 20h7v6h-7z" fill="#fdfaf2" />
        <path d="M12.5 13.5h7V26h-7z" fill="#f07f2a" />
      </svg>
    );
  if (app === "mcp")
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#a6248f" />
        <path
          d="M9 7.5h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8l-5.5 4v-4H9a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z"
          fill="none"
          stroke="#fdfaf2"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="14.5" r="3.2" fill="none" stroke="#f07f2a" strokeWidth="2.4" />
      </svg>
    );
  if (app === "run")
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        <rect width="100" height="100" rx="22" fill="#a6248f" />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeDasharray="13.6 10"
          transform="rotate(-11 50 50)"
        />
        <rect x="36" y="36" width="28" height="28" fill="#fff" />
        <polygon points="64,36 64,64 36,64" fill="#f07f2a" />
      </svg>
    );
  if (app === "diff")
    return (
      <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#a6248f" />
        <line
          x1="19.2"
          y1="19.2"
          x2="25.5"
          y2="25.5"
          stroke="#f07f2a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="13.5" cy="13.5" r="7" fill="none" stroke="#fdfaf2" strokeWidth="3" />
      </svg>
    );
  if (app === "startklocka")
    return (
      <svg viewBox="0 0 400 400" width={size} height={size} aria-hidden="true">
        <rect width="400" height="400" rx="88" fill="#1f3a5f" />
        <circle cx="200" cy="200" r="144" fill="none" stroke="#f4efe4" strokeWidth="10" />
        <g
          fill="none"
          stroke="#f4efe4"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="132" cy="132" r="16" fill="#f4efe4" stroke="none" />
          <line x1="196" y1="98" x2="196" y2="310" />
          <path d="M 96,214 L 296,224" />
          <path d="M 296,224 C 312,258 288,300 236,310" />
          <path d="M 250,310 L 250,236 L 244,168" />
          <path d="M 262,308 L 256,236 L 288,184" />
        </g>
      </svg>
    );
  return <Mark size={size} />;
};
