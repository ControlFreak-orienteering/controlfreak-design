// The service workers' page fetch: network first, the cache when it fails or is slow.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const SOURCE = readFileSync(new URL("../sw-fetch.js", import.meta.url), "utf8");

/**
 * Loads sw-fetch.js in a fake service worker. `network(url)` gives the network's answer as
 * a promise; `saved` holds the cache's pages by URL.
 */
function worker({ network, saved = {} }) {
  const cache = new Map(Object.entries(saved));
  const self = {};
  const context = {
    self,
    setTimeout,
    clearTimeout,
    fetch: (request) => network(request.url ?? request),
    caches: {
      match: async (request) => cache.get(request.url ?? request),
      open: async () => ({ put: async (request, response) => cache.set(request.url ?? request, response) }),
    },
  };
  vm.runInNewContext(SOURCE, context);
  return { page: self.cfPageFromNetwork, cache };
}

const page = (body, status = 200) => new Response(body, { status });
const later = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const URL_A = "https://run.controlfreak.se/en";
const req = { url: URL_A };

test("gives the network's answer when it comes in time, and saves it", async () => {
  const w = worker({ network: async () => page("new"), saved: { [URL_A]: page("old") } });
  const response = await w.page(req, { cacheName: "pages" });
  assert.equal(await response.text(), "new");
  assert.equal(await w.cache.get(URL_A).text(), "new");
});

test("gives the saved copy when the network is slow, and saves the late answer", async () => {
  let arrived;
  const w = worker({
    network: () => (arrived = later(80, page("late"))),
    saved: { [URL_A]: page("saved") },
  });
  const response = await w.page(req, { cacheName: "pages", timeoutMs: 20 });
  assert.equal(await response.text(), "saved");
  await arrived;
  await later(5);
  assert.equal(await w.cache.get(URL_A).text(), "late");
});

test("waits for a slow network when nothing is saved", async () => {
  const w = worker({ network: () => later(60, page("late")) });
  const response = await w.page(req, { cacheName: "pages", timeoutMs: 10 });
  assert.equal(await response.text(), "late");
});

test("uses the fallback's copy when the page has none", async () => {
  const w = worker({
    network: () => later(60, page("late")),
    saved: { "/": page("start") },
  });
  const response = await w.page(req, { cacheName: "pages", fallback: "/", timeoutMs: 10 });
  assert.equal(await response.text(), "start");
});

test("uses the saved copy when the network fails, or else fails", async () => {
  const offline = async () => {
    throw new TypeError("Failed to fetch");
  };
  const w = worker({ network: offline, saved: { [URL_A]: page("saved") } });
  assert.equal(await (await w.page(req, { cacheName: "pages" })).text(), "saved");
  await assert.rejects(worker({ network: offline }).page(req, { cacheName: "pages" }), TypeError);
});

test("does not save an error page", async () => {
  const w = worker({ network: async () => page("oops", 500) });
  const response = await w.page(req, { cacheName: "pages" });
  assert.equal(response.status, 500);
  assert.equal(w.cache.has(URL_A), false);
});
