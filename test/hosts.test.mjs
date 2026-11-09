// Every host the code can ask for is declared in kino-plugin.json. Paths come from import.meta.url through fileURLToPath, so the
// test also passes on Windows (new URL(...).pathname gives "/C:/..." there).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAnyHost, validateManifest } from "../sdk/contract.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const manifest = JSON.parse(readFileSync(join(ROOT, "kino-plugin.json"), "utf8"));
const declared = manifest.hosts.map((h) => (typeof h === "string" ? h : h.host).toLowerCase());
const covered = (host) => declared.some((d) => host === d || host.endsWith("." + d));

// Named in the code but never fetched through kino.fetch: images are not checked against `hosts`, and the TMDB API is reached
// through kino.tmdb (Kino's own call), not by address.
const NOT_FETCHED = new Set(["image.tmdb.org"]);

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") ? [p] : [];
  });
}

test("hosts audit: every hostname in src/ that can be fetched, opened or played is declared", () => {
  const found = new Set();
  for (const file of walk(join(ROOT, "src"))) {
    for (const m of readFileSync(file, "utf8").matchAll(/https?:\/\/([a-z0-9][a-z0-9.-]*\.[a-z]{2,})/gi)) found.add(m[1].toLowerCase());
  }
  assert.ok(found.size >= 3, "the audit found the hosts in src/");
  const missing = [...found].filter((h) => !NOT_FETCHED.has(h) && !covered(h));
  assert.deepEqual(missing, [], "hosts named in src/ but not in kino-plugin.json's hosts");
});

test("the hosts the plugin relies on are declared: the watch page, the subtitle index and the posters", () => {
  for (const h of ["cinejoy.pk", "subs.wing.st", "image.tmdb.org"]) assert.ok(covered(h), h);
});

test("no secret host sneaks in: nothing from the site's video API is named", () => {
  for (const file of walk(join(ROOT, "src"))) assert.doesNotMatch(readFileSync(file, "utf8"), /api\.wing\.st/i, file);
});

test("the manifest asks for the hidden page and any stream host, and the contract accepts it", () => {
  assert.equal(manifest.browser, true);
  assert.equal(manifest.streamHosts, "any");
  assert.equal(fetchAnyHost(manifest), false);
  const verdict = validateManifest(readFileSync(join(ROOT, "kino-plugin.json"), "utf8"));
  assert.equal(verdict.ok, true, JSON.stringify(verdict.errors || verdict.error || verdict));
});
