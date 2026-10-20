// The family's languages: codes, tags, addresses and how a browser's list is matched.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  HTML_LANG,
  LANGS,
  LANG_LABELS,
  LANG_PATHS,
  LOCALE_TAG,
  OG_LOCALE,
  isLang,
  langForPath,
  langPath,
  matchBrowserLang,
  resolveLang,
} from "../dist/i18n/index.js";

test("every language has a name, an html tag, a locale, an Open Graph locale and a path", () => {
  assert.deepEqual(LANGS, ["sv", "en", "no", "fi", "cs"]);
  for (const lang of LANGS) {
    for (const table of [LANG_LABELS, HTML_LANG, LOCALE_TAG, OG_LOCALE, LANG_PATHS]) {
      assert.equal(typeof table[lang], "string");
    }
  }
  // Norwegian is written in bokmål.
  assert.equal(HTML_LANG.no, "nb");
  assert.equal(LOCALE_TAG.no, "nb-NO");
  assert.equal(OG_LOCALE.no, "nb_NO");
});

test("addresses: Swedish is the start page, the others one segment below", () => {
  assert.equal(langPath("sv"), "/");
  assert.equal(langPath("en"), "/en");
  assert.equal(langPath("sv", "help"), "/help");
  assert.equal(langPath("cs", "/help"), "/cs/help");
  assert.equal(langForPath("/"), "sv");
  assert.equal(langForPath("/fi/"), "fi");
  assert.equal(langForPath("/resultat"), undefined);
});

test("a browser's list is read in order, and a stored choice wins", () => {
  assert.equal(matchBrowserLang(["de", "sv-SE", "en"]), "sv");
  assert.equal(matchBrowserLang(["nn-NO"]), "no");
  assert.equal(matchBrowserLang(["de"]), undefined);
  assert.equal(resolveLang(["de"], null), "sv");
  assert.equal(resolveLang(["de"], null, "en"), "en");
  assert.equal(resolveLang(["en"], "cs"), "cs");
  assert.equal(resolveLang(["en"], "xx"), "en");
  assert.equal(isLang("no"), true);
  assert.equal(isLang("nb"), false);
});
