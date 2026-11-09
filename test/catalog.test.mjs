// The plugin-level exports are imported from the built plugin.js (src/browse/logo.js imports a PNG that only the bundler reads).
import { test } from "node:test";
import assert from "node:assert/strict";
import { install, movie, STORAGE_LIMIT } from "./helpers.mjs";
import { sectionPage, buildRows, browsePage, homeRows, savedHome, shelfInfo, keptRows, TABS, TAB_IDS, HOME_KEY, HOME_JOBS } from "../src/catalog.js";
import { cached, write, read, kept, clear, ENTRY_MAX, HARD_TTL_MS, FRESH_SHELF_MS } from "../src/cache.js";
import { home, section, browse, categories, search, episodes, details } from "../plugin.js";

const answer = (path, params) => ({
  page: Number(params.page || 1), total_pages: 4,
  results: [1, 2, 3].map((i) => movie(i + (path.length % 7) * 100, `T${i} ${path}`)),
});

test("shelves: unknown ones are refused, genres belong to their type", () => {
  assert.equal(shelfInfo("movie", "trend").path, "/trending/movie/week");
  assert.equal(shelfInfo("series", "new").path, "/tv/on_the_air");
  assert.equal(shelfInfo("movie", "g28").params.with_genres, 28);
  assert.equal(shelfInfo("movie", "g10759"), null); // a TV-only genre
  assert.equal(shelfInfo("series", "g10759").params.with_genres, 10759);
  assert.equal(shelfInfo("anime", "trend"), null);
  assert.equal(shelfInfo("movie", "nope"), null);
});

test("tabs: Inicio, Películas, Series, every job a known shelf", () => {
  assert.deepEqual(TAB_IDS, ["inicio", "peliculas", "series"]);
  for (const jobs of Object.values(TABS)) for (const [type, shelf] of jobs) assert.ok(shelfInfo(type, shelf), `${type}:${shelf}`);
  assert.ok(Object.values(TABS).every((j) => j.length <= 8));
});

test("a tab asks TMDB in Spanish for safe titles and builds rows with a hero", async () => {
  const { calls } = install({ tmdb: answer });
  const page = await sectionPage("peliculas");
  assert.equal(page.tab, "peliculas");
  assert.deepEqual(page.tabs.map((t) => t.label), ["Inicio", "Películas", "Series"]);
  assert.equal(page.rows.length, TABS.peliculas.length);
  assert.ok(page.hero && page.hero.image.startsWith("https://image.tmdb.org/"));
  assert.ok(calls.tmdb.every((c) => c.params.language === "es-MX" && c.params.include_adult === false));
  assert.ok(page.rows.every((r) => /^d:movie:/.test(r.ref) && r.genre === "peliculas"));
  assert.equal((await sectionPage("nope")).tab, "inicio");
});

test("English when Kino is in English", async () => {
  const { calls, kino } = install({ tmdb: answer });
  kino.lang = "en-GB";
  const page = await sectionPage("inicio");
  assert.equal(page.tabs[0].label, "Home");
  assert.equal(page.rows[0].title, "Trending · Movies");
  assert.equal(calls.tmdb[0].params.language, "en-US");
});

test("a row that fails or is empty is left out without taking the others", async () => {
  install({ tmdb: async (path) => { if (path.includes("trending")) throw Object.assign(new Error("x"), { code: "timeout" }); return answer(path, {}); } });
  const rows = await buildRows([["movie", "trend"], ["movie", "pop"]]);
  assert.deepEqual(rows.map((r) => r.id), ["d-movie-pop"]);
});

test("shared cache: home(), section() and the screen's tab ask each shelf once", async () => {
  const { calls } = install({ tmdb: answer });
  await homeRows();
  const n = calls.tmdb.length;
  assert.equal(n, HOME_JOBS.length);
  await sectionPage("inicio"); // 6 shelves, 4 already cached
  assert.equal(calls.tmdb.length, n + (TABS.inicio.length - HOME_JOBS.length));
  const m = calls.tmdb.length;
  await sectionPage("inicio");
  assert.equal(calls.tmdb.length, m, "a second pass is all cache");
});

test("concurrent callers share one request", async () => {
  const { calls } = install({ tmdb: async (p, q) => { await new Promise((r) => setTimeout(r, 10)); return answer(p, q); } });
  await Promise.all([homeRows(), sectionPage("inicio"), buildRows([["movie", "trend"]])]);
  const trend = calls.tmdb.filter((c) => c.path === "/trending/movie/week");
  assert.equal(trend.length, 1);
});

test("fresh for 6 h, stale up to 24 h when TMDB fails, gone after", async () => {
  const { kino, calls, data } = install({ tmdb: answer });
  const t0 = Date.now();
  const realNow = Date.now;
  try {
    await sectionPage("series");
    const first = calls.tmdb.length;
    Date.now = () => t0 + FRESH_SHELF_MS - 1000;
    await sectionPage("series");
    assert.equal(calls.tmdb.length, first, "still fresh");
    Date.now = () => t0 + FRESH_SHELF_MS + 1000;
    kino.tmdb = async () => { throw Object.assign(new Error("down"), { code: "network" }); };
    const page = await sectionPage("series");
    assert.equal(page.rows.length, TABS.series.length, "old shelves serve while TMDB is down");
    // after the hard ttl storage itself drops the entry (simulated)
    for (const k of [...data.keys()]) if (k.startsWith("c1:")) data.delete(k);
    assert.equal((await sectionPage("series")).rows.length, 0);
  } finally { Date.now = realNow; }
});

test("cache entries over 48 KB are not kept; a full storage evicts the oldest entry and keeps writing", () => {
  const { kino, data } = install({});
  assert.equal(write("big", "x".repeat(ENTRY_MAX + 10)), false);
  assert.equal(data.size, 0);
  const realNow = Date.now;
  try {
    let t = 1_000_000;
    Date.now = () => (t += 1000);
    const chunk = "y".repeat(40 * 1024);
    for (let i = 0; i < 8; i++) assert.equal(write("e" + i, chunk), true, "write " + i);
    const keys = kino.storage.keys().filter((k) => k.startsWith("c1:"));
    assert.ok(keys.length < 8, "older entries made room");
    assert.ok(keys.includes("c1:e7"), "the newest is kept");
    assert.ok(!keys.includes("c1:e0"), "the oldest went first");
    assert.ok(kino.storage.keys().join("").length < STORAGE_LIMIT);
  } finally { Date.now = realNow; }
});

test("cache keeps entries with the 24 h hard ttl and clear() removes them", () => {
  const { ttls } = install({});
  write("a", { n: 1 });
  assert.equal(ttls.get("c1:a"), HARD_TTL_MS);
  assert.deepEqual(kept("a"), { n: 1 });
  assert.equal(kept("missing"), undefined);
  assert.equal(clear(), 1);
  assert.equal(read("a"), null);
});

test("cached(): a failing load with nothing kept throws; with an old value it serves it", async () => {
  install({});
  await assert.rejects(cached("k", 1000, async () => { throw new Error("boom"); }), /boom/);
  write("k", "old");
  const realNow = Date.now;
  try {
    Date.now = () => realNow() + 5000;
    assert.equal(await cached("k", 1000, async () => { throw new Error("boom"); }), "old");
  } finally { Date.now = realNow; }
});

test("browse(): page 1 comes from the cache, later pages from TMDB with a cursor", async () => {
  const { calls } = install({ tmdb: answer });
  const p1 = await browse("d:movie:pop");
  assert.equal(p1.next, "2");
  const n = calls.tmdb.length;
  await browse("d:movie:pop");
  assert.equal(calls.tmdb.length, n);
  const p3 = await browsePage("d:movie:pop", "3");
  assert.equal(p3.next, "4");
  assert.equal(calls.tmdb.at(-1).params.page, "3");
  assert.equal((await browsePage("d:movie:pop", "4")).next, undefined, "last page has no cursor");
  assert.deepEqual(await browsePage("d:anime:pop"), { items: [] });
  assert.deepEqual(await browsePage("garbage"), { items: [] });
});

test("home(): four rows, kept as home1 (7 days, at most 60 KB), off when the toggle is off", async () => {
  const { kino, ttls, data } = install({ tmdb: answer });
  const rows = await home();
  assert.equal(rows.length, 4);
  assert.ok(rows.every((r) => r.items.length > 0 && r.ref.startsWith("d:")));
  assert.equal(ttls.get(HOME_KEY), 7 * 24 * 3600 * 1000);
  assert.ok(data.get(HOME_KEY).length <= 60 * 1024);
  assert.equal(savedHome().length, 4);
  kino.config.get = (k) => (k === "homeRows" ? false : undefined);
  assert.deepEqual(await home(), []);
});

test("home(): when every shelf fails, the last kept Home is served", async () => {
  const { kino, data } = install({ tmdb: answer });
  await home();
  for (const k of [...data.keys()]) if (k.startsWith("c1:")) data.delete(k);
  kino.tmdb = async () => { throw Object.assign(new Error("down"), { code: "network" }); };
  assert.equal((await home()).length, 4);
});

test("home1 is trimmed until it fits", async () => {
  const { data } = install({ tmdb: async () => ({ page: 1, total_pages: 1, results: Array.from({ length: 20 }, (_, i) => movie(i + 1, "T".repeat(150), { overview: "z".repeat(900) })) }) });
  await home();
  assert.ok(data.get(HOME_KEY).length <= 60 * 1024);
});

test("categories: trending and genre tiles of both types, with art from the first title", async () => {
  install({ tmdb: answer });
  const tiles = await categories();
  assert.equal(tiles.length, 24);
  assert.ok(tiles.every((t) => t.title.length <= 40 && /^d:(movie|series):/.test(t.ref) && /^[A-Za-z0-9._~-]+$/.test(t.id)));
  assert.ok(tiles.every((t) => t.art && t.art.startsWith("https://")));
  assert.equal(tiles[1].title, "Películas: Acción");
});

test("search, episodes and details", async () => {
  install({
    tmdb: async (path) => {
      if (path === "/search/multi") return { results: [{ ...movie(1, "A"), media_type: "movie" }, { id: 2, name: "B", media_type: "tv", poster_path: "/x.jpg" }, { id: 3, name: "P", media_type: "person" }, { ...movie(4, "Adult"), media_type: "movie", adult: true }] };
      if (path === "/movie/603") return { title: "Matrix", overview: "o", runtime: 136, release_date: "1999-03-30", genres: [{ id: 28, name: "Acción" }], vote_average: 8, vote_count: 99, imdb_id: "tt0133093" };
      if (path === "/tv/1399") return { name: "GoT", seasons: [{ season_number: 0 }, { season_number: 1 }], "season/1": { episodes: [{ episode_number: 1, name: "E1", air_date: "2011-04-17" }] } };
      throw new Error("unexpected " + path);
    },
  });
  const found = await search({ q: "x", type: "series" });
  assert.deepEqual(found.map((i) => i.id), ["s-2", "m-1"]);
  const info = await details("m:603");
  assert.equal(info.runtimeMinutes, 136);
  assert.equal(info.ids.imdb, "tt0133093");
  const eps = await episodes("s:1399");
  assert.equal(eps.episodes[0].ref, "e:1399:1:1");
  await assert.rejects(episodes("m:1"), (e) => e.code === "not_found");
  await assert.rejects(details("s:1"), (e) => e.code === "not_found");
});

test("section() is the same page the screen builds", async () => {
  install({ tmdb: answer });
  const a = await section({ tab: "series" });
  assert.equal(a.tab, "series");
  assert.equal(keptRows(TABS.series).length, TABS.series.length);
});
