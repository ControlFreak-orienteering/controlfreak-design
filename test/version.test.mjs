// The build stamp (version.json) and the check that compares every site with main.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { versionInfo, writeVersion } from "../scripts/write-version.mjs";
import { deployStatus, isBuilt } from "../scripts/check-deploys.mjs";

const MAIN = "a".repeat(40);
const OLD = "b".repeat(40);

test("version.json names the commit the app is built from", () => {
  const dir = mkdtempSync(join(tmpdir(), "cf-version-"));
  const run = (...args) => execFileSync("git", args, { cwd: dir, stdio: "ignore" });
  run("init", "-q");
  writeFileSync(join(dir, "a.txt"), "a");
  run("add", "a.txt");
  run("-c", "user.name=t", "-c", "user.email=t@t", "commit", "-q", "-m", "a");
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: dir }).toString().trim();

  const written = writeVersion(dir);
  assert.equal(written.commit, head);
  assert.match(written.committed, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(JSON.parse(readFileSync(join(dir, "public", "version.json"), "utf8")), written);
});

test("without git the commit is null and the build time is still there", () => {
  const dir = mkdtempSync(join(tmpdir(), "cf-version-"));
  const info = versionInfo(dir, new Date("2026-10-27T08:00:00Z"));
  assert.deepEqual(info, { commit: null, committed: null, built: "2026-10-27T08:00:00.000Z" });
});

test("only developer notes and GitHub's files are left out of the build", () => {
  assert.equal(isBuilt(".github/workflows/work-in-progress.yml"), false);
  assert.equal(isBuilt("WORK_IN_PROGRESS.md"), false);
  assert.equal(isBuilt("AGENTS.md"), false);
  assert.equal(isBuilt("src/lib/strings.ts"), true);
  assert.equal(isBuilt("public/THIRD-PARTY-NOTICES.md"), true);
  assert.equal(isBuilt("docs/custom-live/README.md"), true);
});

test("a site is current on main's commit, or when main only moved notes", () => {
  assert.equal(deployStatus({ commit: MAIN }, MAIN, null).ok, true);
  const notesOnly = { ahead_by: 2, files: [{ filename: "WORK_IN_PROGRESS.md" }] };
  assert.equal(deployStatus({ commit: OLD }, MAIN, notesOnly).ok, true);
  const code = { ahead_by: 1, files: [{ filename: "src/App.tsx" }] };
  assert.deepEqual(deployStatus({ commit: OLD }, MAIN, code), {
    ok: false,
    text: "1 commit(s) behind, 1 built file(s) changed",
  });
});

test("a site without version.json or without a commit is not counted as current", () => {
  assert.equal(deployStatus(null, MAIN, null).ok, false);
  assert.equal(deployStatus({ commit: null }, MAIN, null).ok, false);
  assert.equal(deployStatus({ commit: OLD }, MAIN, null).ok, false);
});
