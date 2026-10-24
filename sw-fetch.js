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

self.cfPageFromNetwork = cfPageFromNetwork;
