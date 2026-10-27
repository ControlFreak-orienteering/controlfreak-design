#!/usr/bin/env node
// Writes public/version.json in the app it runs in, so anyone can see which commit a site
// was built from: https://<app>/version.json. Each app runs it first in its `prebuild`:
//
//   "prebuild": "node node_modules/controlfreak-design/scripts/write-version.mjs"
//
// The file is generated and ignored by git (`public/version.json` in .gitignore).
// `scripts/check-deploys.mjs` in this package reads it from every app. Without git (a
// build from a tarball) the commit is null and the file still says when it was built.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/** Runs git in `cwd` and gives its trimmed output, or null when git or the repo is missing. */
function git(cwd, ...args) {
  try {
    return execFileSync("git", args, { cwd, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

/**
 * What the app is built from.
 *
 * @param {string} cwd - The app's root.
 * @param {Date} now - The build time.
 * @returns {{ commit: string | null, committed: string | null, built: string }} The full
 *   commit hash, its commit time (ISO 8601), and the build time (ISO 8601, UTC).
 */
export function versionInfo(cwd, now = new Date()) {
  const commit = git(cwd, "rev-parse", "HEAD");
  const committed = commit ? git(cwd, "log", "-1", "--format=%cI") : null;
  return {
    commit: /^[0-9a-f]{40}$/.test(commit ?? "") ? commit : null,
    committed,
    built: now.toISOString(),
  };
}

/** Writes `public/version.json` under `cwd` and gives what it wrote. */
export function writeVersion(cwd) {
  const info = versionInfo(cwd);
  mkdirSync(join(cwd, "public"), { recursive: true });
  writeFileSync(join(cwd, "public", "version.json"), `${JSON.stringify(info, null, 2)}\n`);
  return info;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const info = writeVersion(process.cwd());
  console.log(`version.json: ${info.commit?.slice(0, 7) ?? "no commit"}, built ${info.built}`);
}
