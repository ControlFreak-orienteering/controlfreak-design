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
  /** The mark's link. */
  toStart: string;
  /** Marks the app one is in. */
  thisApp: string;
};

export const TEXTS: Record<Lang, FamilyTexts> = {
  sv: {
    apps: "Apparna",
    allApps: "Alla apparna",
    language: "Språk",
    darkMode: "Mörkt läge",
    lightMode: "Ljust läge",
    manual: "Manual",
    feedback: "Skicka feedback",
    menu: "Meny",
    close: "Stäng",
    licenses: "Licenser",
    version: "Version",
    toStart: "Till startsidan",
    thisApp: "Den här appen",
  },
  en: {
    apps: "The apps",
    allApps: "All the apps",
    language: "Language",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    manual: "User guide",
    feedback: "Send feedback",
    menu: "Menu",
    close: "Close",
    licenses: "Licenses",
    version: "Version",
    toStart: "To the start page",
    thisApp: "This app",
  },
  no: {
    apps: "Appene",
    allApps: "Alle appene",
    language: "Språk",
    darkMode: "Mørk modus",
    lightMode: "Lys modus",
    manual: "Brukerveiledning",
    feedback: "Send tilbakemelding",
    menu: "Meny",
    close: "Lukk",
    licenses: "Lisenser",
    version: "Versjon",
    toStart: "Til startsiden",
    thisApp: "Denne appen",
  },
  fi: {
    apps: "Sovellukset",
    allApps: "Kaikki sovellukset",
    language: "Kieli",
    darkMode: "Tumma tila",
    lightMode: "Vaalea tila",
    manual: "Käyttöohje",
    feedback: "Lähetä palautetta",
    menu: "Valikko",
    close: "Sulje",
    licenses: "Lisenssit",
    version: "Versio",
    toStart: "Etusivulle",
    thisApp: "Tämä sovellus",
  },
  cs: {
    apps: "Aplikace",
    allApps: "Všechny aplikace",
    language: "Jazyk",
    darkMode: "Tmavý režim",
    lightMode: "Světlý režim",
    manual: "Příručka",
    feedback: "Poslat zpětnou vazbu",
    menu: "Nabídka",
    close: "Zavřít",
    licenses: "Licence",
    version: "Verze",
    toStart: "Na úvodní stránku",
    thisApp: "Tato aplikace",
  },
};
