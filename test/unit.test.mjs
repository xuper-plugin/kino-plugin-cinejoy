import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseTitleRef, parseShelfRef, episodeRef, shelfRef } from "../src/refs.js";
import { toItem } from "../src/tmdb.js";
import { slidesOf, tabOf, playedKey, recentOf } from "../src/browse/model.js";
import { pushOf, openArgs } from "../src/browse/detail.js";
import { KEYS, both, t } from "../src/i18n.js";
import { install } from "./helpers.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

test("title refs round-trip and reject anything else", () => {
  assert.deepEqual(parseTitleRef("m:603"), { kind: "movie", id: 603 });
  assert.deepEqual(parseTitleRef("s:1399"), { kind: "series", id: 1399 });
  assert.deepEqual(parseTitleRef(episodeRef(1399, 2, 7)), { kind: "episode", id: 1399, season: 2, episode: 7 });
  assert.equal(parseTitleRef("m|603|x"), null);
  assert.equal(parseTitleRef("d:movie:trend"), null);
  assert.deepEqual(parseShelfRef(shelfRef("series", "g10759")), { type: "series", shelf: "g10759" });
  assert.equal(parseShelfRef("d:anime:trend"), null);
  assert.equal(parseShelfRef("m:1"), null);
});

test("items carry Kino-safe ids and https art", () => {
  const item = toItem({ id: 603, title: "Matrix", release_date: "1999-03-30", poster_path: "/a.jpg", backdrop_path: "/b.jpg", vote_average: 8.2, vote_count: 900, overview: "x".repeat(500) }, "movie");
  assert.match(item.id, /^[A-Za-z0-9._~-]{1,128}$/);
  assert.equal(item.ref, "m:603");
  assert.equal(item.year, 1999);
  assert.match(item.poster, /^https:\/\/image\.tmdb\.org\/t\/p\/w342\/a\.jpg$/);
  assert.match(item.backdrop, /^https:/);
  assert.ok(item.overview.length <= 240, "overviews are trimmed to keep the cached shelves small");
  const tv = toItem({ id: 1399, name: "GoT", first_air_date: "2011-04-17", media_type: "tv" });
  assert.equal(tv.kind, "series");
  assert.equal(tv.ref, "s:1399");
});

test("slides need a backdrop and a synopsis; tabs without rows are null", () => {
  const rows = [{ id: "r", title: "R", items: [
    { id: "s-1", ref: "s:1", kind: "series", title: "A", backdrop: "https://i/b.jpg", overview: "x".repeat(400), ids: { tmdb: 1 } },
    { id: "s-2", ref: "s:2", kind: "series", title: "B", overview: "no picture" },
  ] }];
  const slides = slidesOf(rows);
  assert.equal(slides.length, 1);
  assert.ok(slides[0].text.length <= 160);
  assert.equal(slides[0].tmdb, 1);
  assert.equal(tabOf({ rows: [] }), null);
});

test("continue watching finds episodes by their series", () => {
  assert.equal(playedKey("e:1399:1:3"), "t:1399");
  const tabs = [{ rails: [{ items: [{ id: "s-1399", ref: "s:1399", ids: { tmdb: 1399 } }] }] }];
  assert.deepEqual(recentOf(["t:1399"], tabs).map((c) => c.id), ["s-1399"]);
});

test("a card's open args push its title page", () => {
  const route = pushOf(JSON.stringify(openArgs({ id: "s-1", ref: "s:1", kind: "series", title: "Dark", year: 2017 })));
  assert.equal(route.push, "detail");
  assert.equal(route.params.d, 1);
  assert.equal(pushOf("{bad"), null);
});

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".js") ? [p] : [];
  });
}

test("every text exists in Spanish and English, and every key the code asks for exists", () => {
  assert.deepEqual([...KEYS.es].sort(), [...KEYS.en].sort());
  assert.equal(both("dSeasonsN", { n: 3 }).en, "3 seasons");
  const SAME = new Set(["g18", "g10749", "tabSeries", "catSeries"]); // the same word in both languages
  for (const k of KEYS.es) if (!SAME.has(k)) assert.notEqual(both(k).es, both(k).en, `${k} looks untranslated`);
  const used = new Set();
  for (const file of walk(join(ROOT, "src"))) {
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/\b(?:t|both|twin)\(\s*"([A-Za-z0-9]+)"\s*[,)]/g)) used.add(m[1]);
    for (const m of src.matchAll(/(?:titleKey|title|text|label|labelText):\s*"((?:br|d|sh|g|shelf|tab|cat)[A-Za-z0-9]+)"/g)) used.add(m[1]);
  }
  for (const k of used) assert.ok(KEYS.es.includes(k), `src asks for the text "${k}" which i18n.js does not have`);
  install({});
  assert.equal(t("tabHome"), "Inicio");
  globalThis.kino.lang = "en-US";
  assert.equal(t("tabHome"), "Home");
});

test("the manifest's settings, section and screen have English texts", () => {
  const m = JSON.parse(readFileSync(join(ROOT, "kino-plugin.json"), "utf8"));
  for (const s of m.settings) {
    assert.ok(s.labelEn, s.key);
    if (s.hint) assert.ok(s.hintEn, s.key);
    for (const o of s.options || []) assert.ok(o.labelEn, o.value);
  }
  assert.ok(m.section.labelEn);
  assert.equal(m.id, "cinejoy");
  assert.equal(m.browser, true);
  assert.equal(m.streamHosts, "any");
});

test("the committed plugin.js is a fresh build of src/", () => {
  const dir = mkdtempSync(join(tmpdir(), "cinejoy-build-"));
  try {
    const out = join(dir, "plugin.js");
    execFileSync(process.execPath, [join(ROOT, "node_modules", "esbuild", "bin", "esbuild"), join(ROOT, "src", "plugin.js"), "--bundle", "--format=esm", "--target=es2020", "--loader:.png=dataurl", `--outfile=${out}`, "--log-level=error"], { cwd: ROOT });
    const norm = (s) => s.replace(/\r\n/g, "\n");
    assert.equal(norm(readFileSync(out, "utf8")), norm(readFileSync(join(ROOT, "plugin.js"), "utf8")), "run npm run build");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
