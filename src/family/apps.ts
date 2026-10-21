/**
 * The apps of the family, as the app switcher and the hub list them.
 *
 * Names are never translated. "ControlFreak" is written in the text colour and the
 * app's own word after it in the app's accent colour (see `FamilyName`). The one-line
 * descriptions are the same as on controlfreak.se.
 */

import { langPath, type Lang } from "../i18n/index.js";

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
  /** The first part of the name, in the text colour; "" for none. */
  base: string;
  /** The app's own word, in `accent`; "" when the name has no accent part. */
  word: string;
  accent?: FamilyAccent;
  /** What the app does, one line. */
  what: Record<Lang, string>;
};

/** The apps in the order the hub lists them: the way a competition is made. */
export const FAMILY_APPS: readonly FamilyApp[] = [
  {
    id: "controlfreak",
    url: "https://course.controlfreak.se",
    name: "ControlFreak",
    base: "ControlFreak",
    word: "",
    what: {
      sv: "Sätt ut kontroller, skriv kontrolldefinitioner och skriv ut banorna.",
      en: "Place controls, write control descriptions and print the courses.",
      no: "Sett ut poster, skriv postbeskrivelser og skriv ut løypene.",
      fi: "Sijoita rastit, kirjoita rastimääritteet ja tulosta radat.",
      cs: "Rozmístěte kontroly, napište popisy kontrol a vytiskněte tratě.",
    },
  },
  {
    id: "event",
    url: "https://event.controlfreak.se",
    name: "ControlFreak Event",
    base: "ControlFreak",
    word: "Event",
    accent: "purple",
    what: {
      sv: "Anmälningar, lottning, brickavläsning och resultat.",
      en: "Entries, start draw, card readout and results.",
      no: "Påmeldinger, trekning, brikkeavlesing og resultater.",
      fi: "Ilmoittautumiset, arvonta, korttien luku ja tulokset.",
      cs: "Přihlášky, losování, vyčítání čipů a výsledky.",
    },
  },
  {
    id: "startklocka",
    url: "https://start.controlfreak.se",
    name: "ControlFreak Start",
    base: "ControlFreak",
    word: "Start",
    accent: "purple",
    what: {
      sv: "Startklocka: visar starttiden, piper inför varje start och läser upp vem som startar.",
      en: "Start clock: shows the start time, beeps before every start and reads out who starts.",
      no: "Startklokke: viser starttiden, piper før hver start og leser opp hvem som starter.",
      fi: "Lähtökello: näyttää lähtöajan, piippaa ennen jokaista lähtöä ja lukee lähtijät ääneen.",
      cs: "Startovní hodiny: ukazují čas startu, pípají před každým startem a čtou, kdo startuje.",
    },
  },
  {
    id: "run",
    url: "https://run.controlfreak.se",
    name: "ControlFreak Run",
    base: "ControlFreak",
    word: "Run",
    accent: "orange",
    what: {
      sv: "Träning med virtuella kontroller: skanna QR-koden på kartan, så stämplar telefonen med GPS.",
      en: "Training with virtual controls: scan the QR code on the map, and your phone punches by GPS.",
      no: "Trening med virtuelle poster: skann QR-koden på kartet, så stempler telefonen med GPS.",
      fi: "Harjoittelu virtuaalirasteilla: skannaa kartan QR-koodi, niin puhelin leimaa GPS:llä.",
      cs: "Trénink s virtuálními kontrolami: naskenujte QR kód na mapě a telefon razí pomocí GPS.",
    },
  },
  {
    id: "mcp",
    url: "https://mcp.controlfreak.se",
    name: "ControlFreak MCP",
    base: "ControlFreak",
    word: "MCP",
    accent: "purple",
    what: {
      sv: "Låt en AI-assistent lägga kontroller och banor i ControlFreak.",
      en: "Let an AI assistant place controls and courses in ControlFreak.",
      no: "La en AI-assistent legge poster og løyper i ControlFreak.",
      fi: "Anna tekoälyavustajan sijoittaa rastit ja radat ControlFreakissa.",
      cs: "Nechte AI asistenta umístit kontroly a tratě v aplikaci ControlFreak.",
    },
  },
];

/** The hub, controlfreak.se, with all the apps. */
export const FAMILY_HUB_URL = "https://controlfreak.se";

/** The hub's page in a language, e.g. `https://controlfreak.se/en`. */
export function familyHubUrl(lang: Lang): string {
  return `${FAMILY_HUB_URL}${langPath(lang) === "/" ? "" : langPath(lang)}`;
}

/** The app with a given id; the hub is not among the apps. */
export function familyApp(id: Exclude<FamilyAppId, "hub">): FamilyApp {
  return FAMILY_APPS.find((app) => app.id === id)!;
}
