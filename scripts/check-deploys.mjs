#!/usr/bin/env node
// Says whether every app's site runs the latest `main`: reads https://<app>/version.json
// (written at build time by write-version.mjs) and compares its commit with `main` on
// GitHub. Run from this package's root, with the GitHub CLI signed in:
//
//   node scripts/check-deploys.mjs
//
// A site counts as current when the newer commits on `main` only touch files that are not
// part of the build (see NOT_BUILT), such as the work-in-progress table the bot updates.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const ORG = "ControlFreak-orienteering";

/** Each app's site and its repository in the organisation. */
export const APPS = [
  { host: "controlfreak.se", repo: "controlfreak-homebase" },
  { host: "course.controlfreak.se", repo: "orienteer-mapper-viewer" },
  { host: "run.controlfreak.se", repo: "virtual-orienteering-controls" },
  { host: "event.controlfreak.se", repo: "orienteer-joy-hub" },
  { host: "start.controlfreak.se", repo: "ticking-reminder" },
  { host: "mcp.controlfreak.se", repo: "freak-mcp-pal" },
  { host: "diff.controlfreak.se", repo: "controlfreak-diff" },
  { host: "review.controlfreak.se", repo: "controlfreak-review" },
  { host: "live.controlfreak.se", repo: "controlfreak-live" },
];

/** Files no app builds from: GitHub's own files and the notes for developers and agents. */
const NOT_BUILT = [
  /^\.github\//,
  /^(AGENTS|CLAUDE|SUGGESTIONS|WORK_IN_PROGRESS|MANUAL_TESTS|README|roadmap)\.md$/,
];

/** Whether a change to `path` (relative to the repo's root) can change the site. */
export function isBuilt(path) {
  return !NOT_BUILT.some((pattern) => pattern.test(path));
}

/**
 * Compares a site with `main`.
 *
 * @param {{ commit: string | null } | null} deployed - The site's version.json, or null
 *   when the site has none.
 * @param {string} main - The commit `main` points to.
 * @param {{ ahead_by: number, files: { filename: string }[] } | null} compare - GitHub's
 *   comparison of the deployed commit with `main`, or null when it was not needed.
 * @returns {{ ok: boolean, text: string }}
 */
export function deployStatus(deployed, main, compare) {
  if (!deployed) return { ok: false, text: "no version.json" };
  if (!deployed.commit) return { ok: false, text: "built without git, commit unknown" };
  if (deployed.commit === main) return { ok: true, text: "latest" };
  if (!compare) return { ok: false, text: `runs ${deployed.commit.slice(0, 7)}, not on main` };
  const built = compare.files.filter((f) => isBuilt(f.filename));
  if (compare.ahead_by > 0 && built.length === 0) {
    return { ok: true, text: `latest (main is ${compare.ahead_by} ahead, nothing built)` };
  }
  return {
    ok: false,
    text: `${compare.ahead_by} commit(s) behind, ${built.length} built file(s) changed`,
  };
}

function gh(...args) {
  return JSON.parse(execFileSync("gh", ["api", ...args], { stdio: ["ignore", "pipe", "pipe"] }));
}

async function checkApp({ host, repo }) {
  let deployed = null;
  try {
    // A fresh query string and no-cache, so no cache on the way answers for the site.
    const response = await fetch(`https://${host}/version.json?t=${Date.now()}`, {
      headers: { "cache-control": "no-cache" },
    });
    const type = response.headers.get("content-type") ?? "";
    if (response.ok && type.includes("json")) deployed = await response.json();
  } catch {
    // Unreachable: reported below as no version.json.
  }
  const main = gh(`repos/${ORG}/${repo}/commits/main`).sha;
  let compare = null;
  if (deployed?.commit && deployed.commit !== main) {
    try {
      compare = gh(`repos/${ORG}/${repo}/compare/${deployed.commit}...${main}`);
    } catch {
      compare = null;
    }
  }
  return { host, deployed, ...deployStatus(deployed, main, compare) };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const results = await Promise.all(APPS.map(checkApp));
  for (const r of results) {
    const when = r.deployed?.built ? ` (built ${r.deployed.built.slice(0, 16).replace("T", " ")} UTC)` : "";
    console.log(`${r.ok ? "✓" : "✗"} ${r.host.padEnd(24)} ${r.text}${when}`);
  }
  process.exitCode = results.every((r) => r.ok) ? 0 : 1;
}
