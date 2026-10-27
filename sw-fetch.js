/**
 * The page fetch the apps' service workers share: from the network, with the cache as the
 * fallback, and the cache also when the network is slow. In the forest, one bar of coverage
 * often means a request that neither answers nor fails for a minute; after `timeoutMs` the
 * saved copy is shown instead, while the network request carries on and refreshes the
 * cache for next time.
 *
 * Plain JavaScript with no dependencies, for a classic service worker:
 *
 *   importScripts("/cf-sw-fetch.js");
 *   event.respondWith(self.cfPageFromNetwork(request, { cacheName: PAGES, fallback: "/" }));
 *   const pages = self.cfPrecachePages(PRECACHE_PAGES); // at install
 *
 * The app serves this file at that path from its own server (see "Service workers" in the
 * README), so the browser keeps it with the worker and it works offline too.
 */

/** How long the network gets before a saved copy is used: three seconds. */
const CF_PAGE_TIMEOUT_MS = 3000;

/**
 * A page from the network first, from the cache when the network fails or is slow.
 *
 * - The network answers within `timeoutMs`: its answer, saved in `cacheName` when it is ok.
 * - The network is slower: the saved copy of the page (or of `fallback`) if there is one;
 *   otherwise the network's answer when it comes.
 * - The network fails: the saved copy, or the fallback's, or the error.
 *
 * @param {Request} request - The page request (a navigation).
 * @param {{ cacheName: string, fallback?: string, timeoutMs?: number }} options -
 *   `cacheName` is the cache pages are saved in; `fallback` the address whose saved copy
 *   stands in when this page has none (e.g. "/"); `timeoutMs` 3000 by default.
 * @returns {Promise<Response>}
 */
async function cfPageFromNetwork(request, options) {
  const { cacheName, fallback, timeoutMs = CF_PAGE_TIMEOUT_MS } = options;
  const saved = async () =>
    (await caches.match(request)) ?? (fallback ? await caches.match(fallback) : undefined);

  const network = fetch(request).then(async (response) => {
    if (response.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  });

  let timer;
  const slow = new Promise((resolve) => {
    timer = setTimeout(() => resolve("slow"), timeoutMs);
  });
  try {
    const first = await Promise.race([network, slow]);
    if (first !== "slow") return first;
    const copy = await saved();
    if (copy) {
      // The network request goes on and saves the page; a failure then is no one's concern.
      network.catch(() => {});
      return copy;
    }
    return await network;
  } catch (error) {
    const copy = await saved();
    if (copy) return copy;
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** The family's languages with their own address prefix; Swedish, the source, has none. */
const CF_PREFIXED_LANGS = ["en", "no", "fi", "cs"];

/**
 * The pages of `paths` worth fetching ahead for one visitor: `/` (every worker's fallback)
 * and the pages in the visitor's language. Fetching all five languages costs the server
 * five renderings or more per new visitor, where one is used (controlfreak-plans
 * 2026-10-27 D1).
 *
 * A path is in the language its first segment names (`/en`, `/en/manual`); a path without
 * one is Swedish. Pages that belong to no language (e.g. a field mode) are added by the
 * app after the call. The language is `lang`, or else the `lang` the app registered the
 * worker with (`/sw.js?lang=en`); with neither, or an unknown one, every path is kept, as
 * before.
 *
 * @param {string[]} paths - Every page the app can fetch ahead, in all languages.
 * @param {string} [lang] - The visitor's language, e.g. "en".
 * @returns {string[]}
 */
function cfPrecachePages(paths, lang) {
  const wanted = lang ?? new URL(self.location.href).searchParams.get("lang");
  if (wanted !== "sv" && !CF_PREFIXED_LANGS.includes(wanted)) return [...paths];
  const langOf = (path) => {
    const first = path.split("/")[1] ?? "";
    return CF_PREFIXED_LANGS.includes(first) ? first : "sv";
  };
  return paths.filter((path) => path === "/" || langOf(path) === wanted);
}

self.cfPageFromNetwork = cfPageFromNetwork;
self.cfPrecachePages = cfPrecachePages;
