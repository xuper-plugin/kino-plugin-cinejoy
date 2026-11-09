import { test } from "node:test";
import assert from "node:assert/strict";
import { install } from "./helpers.mjs";
import { resolveRef, watchUrl, pickMedia, pickSubtitles, mediaRank, headersOf, ALSO_MATCH } from "../src/resolve.js";
import { parseTitleRef } from "../src/refs.js";

const H = { Referer: "https://cinejoy.pk/", "User-Agent": "UA", Origin: "https://cinejoy.pk", Cookie: "a=b", Range: "bytes=0-", "Accept-Encoding": "gzip" };
const SUBS = {
  total: 5,
  subtitles: [
    { language: "en", url: "https://subs.wing.st/sub/en1", type: "srt" },
    { language: "es", url: "https://subs.wing.st/sub/es1", type: "srt" },
    { language: "fr", url: "https://subs.wing.st/sub/fr1", type: "srt" },
    { language: "es", url: "https://subs.wing.st/sub/es2", type: "vtt" },
    { language: "es", url: "http://subs.wing.st/sub/insecure", type: "srt" },
  ],
};
const subsFetch = (answer = SUBS) => async (url) => ({ ok: true, status: 200, url, json: () => answer });

const capturing = (result, seen = []) => ({ captureAll: true, capture: async (url, opts) => { seen.push({ url, opts }); if (result instanceof Error) throw result; return result; } });

test("watch pages by ref", () => {
  assert.equal(watchUrl(parseTitleRef("m:603")), "https://cinejoy.pk/watch/movie/603");
  assert.equal(watchUrl(parseTitleRef("e:1399:2:7")), "https://cinejoy.pk/watch/tv/1399/2/7");
  assert.equal(watchUrl(parseTitleRef("s:1399")), null);
  assert.equal(watchUrl(null), null);
});

test("media ranking: manifests, then files; segments and keys are not playable alone", () => {
  assert.equal(mediaRank("https://c/x/master.m3u8?t=1"), 0);
  assert.equal(mediaRank("https://c/x.mpd"), 0);
  assert.equal(mediaRank("https://c/x.mp4"), 1);
  assert.equal(mediaRank("https://c/hls/index"), 2);
  assert.equal(mediaRank("https://c/seg1.ts?x=1"), -1);
  assert.equal(mediaRank("https://c/seg1.m4s"), -1);
  assert.ok(new RegExp(ALSO_MATCH, "i").test("https://c/a.m4s") && new RegExp(ALSO_MATCH, "i").test("https://c/a.ts?x"));
});

test("headers: what the page sent, without Range, Accept-Encoding and the like", () => {
  assert.deepEqual(headersOf(H), { Referer: "https://cinejoy.pk/", "User-Agent": "UA", Origin: "https://cinejoy.pk", Cookie: "a=b" });
  assert.deepEqual(headersOf(null), {});
});

test("pickMedia: manifest first, deduplicated, https only, segments dropped", () => {
  const out = pickMedia({
    media: [{ url: "https://c/v.mp4", headers: H }, { url: "http://c/insecure.m3u8", headers: H }],
    requests: [
      { url: "https://c/seg.ts", method: "GET", headers: H },
      { url: "https://c/master.m3u8", method: "GET", headers: H },
      { url: "https://c/v.mp4", method: "GET", headers: H },
      { url: "https://api/g", method: "POST", headers: H },
    ],
  });
  assert.deepEqual(out.map((m) => m.url), ["https://c/master.m3u8", "https://c/v.mp4"]);
  assert.equal(out[0].headers.Cookie, "a=b");
});

test("pickSubtitles: the person's language first, then the other, https only, srt/vtt, at most 30", () => {
  assert.deepEqual(pickSubtitles(SUBS, "es").map((s) => s.url), ["https://subs.wing.st/sub/es1", "https://subs.wing.st/sub/es2", "https://subs.wing.st/sub/en1"]);
  assert.deepEqual(pickSubtitles(SUBS, "en").map((s) => s.lang), ["en", "es", "es"]);
  assert.equal(pickSubtitles(SUBS, "es")[1].format, "vtt");
  const many = { subtitles: Array.from({ length: 80 }, (_, i) => ({ language: i % 2 ? "es" : "en", url: `https://subs.wing.st/sub/${i}`, type: "srt" })) };
  assert.equal(pickSubtitles(many, "es").length, 30);
  assert.equal(pickSubtitles(many, "es")[0].lang, "es");
  assert.deepEqual(pickSubtitles(null, "es"), []);
});

test("resolve a movie: opens the public watch page with every-match capture and returns the best stream with its headers and subtitles", async () => {
  const seen = [];
  const { calls } = install({
    browser: capturing({ media: [{ url: "https://cdn/v.mp4", headers: H }], requests: [{ url: "https://cdn/master.m3u8", method: "GET", headers: H }], subtitles: [{ url: "https://x/cap.vtt" }], finalUrl: "x" }, seen),
    fetch: subsFetch(),
    config: { subLang: "es" },
  });
  const s = await resolveRef("m:603");
  assert.equal(seen.length, 1);
  assert.equal(seen[0].url, "https://cinejoy.pk/watch/movie/603");
  assert.equal(seen[0].opts.captureAll, true);
  assert.equal(seen[0].opts.timeoutMs, 24000);
  assert.deepEqual(seen[0].opts.alsoMatch, [ALSO_MATCH]);
  assert.equal(seen[0].opts.match, undefined, "Kino's default video pattern");
  assert.equal(s.url, "https://cdn/master.m3u8");
  assert.deepEqual(s.alternatives, [{ url: "https://cdn/v.mp4", headers: headersOf(H) }]);
  assert.equal(s.headers.Referer, "https://cinejoy.pk/");
  assert.equal(s.headers.Range, undefined);
  assert.equal(s.label, "Cinejoy");
  assert.deepEqual(s.subtitles.map((x) => x.lang), ["es", "es", "en", "und"]);
  assert.equal(calls.fetch[0].url, "https://subs.wing.st/subtitles?type=movie&tmdb=603");
});

test("resolve an episode: the tv watch page and the tv subtitles query; English first when preferred", async () => {
  const seen = [];
  const { calls } = install({
    browser: capturing({ media: [{ url: "https://cdn/e.m3u8", headers: H }], subtitles: [], finalUrl: "x" }, seen),
    fetch: subsFetch(),
    config: { subLang: "en" },
  });
  const s = await resolveRef("e:1399:2:7");
  assert.equal(seen[0].url, "https://cinejoy.pk/watch/tv/1399/2/7");
  assert.equal(calls.fetch[0].url, "https://subs.wing.st/subtitles?type=tv&tmdb=1399&season=2&episode=7");
  assert.equal(s.subtitles[0].lang, "en");
});

test("a Kino without captureAll gets a plain capture; subtitle failures never fail the play", async () => {
  const seen = [];
  install({ browser: { capture: async (url, opts) => { seen.push(opts); return { media: [{ url: "https://cdn/a.m3u8", headers: H }], subtitles: [], finalUrl: url }; } } });
  const s = await resolveRef("m:1");
  assert.deepEqual(seen[0], { timeoutMs: 24000 });
  assert.equal(s.url, "https://cdn/a.m3u8");
  assert.equal(s.subtitles, undefined);
});

test("only segments seen: not found, in the person's language", async () => {
  install({ browser: capturing({ media: [], requests: [{ url: "https://c/s1.ts", method: "GET", headers: H }, { url: "https://c/s2.m4s", method: "GET", headers: H }], subtitles: [], finalUrl: "x" }) });
  await assert.rejects(resolveRef("m:1"), (e) => e.code === "not_found" && /no tiene video/.test(e.userMessage));
});

test("capture errors become clear Spanish and English messages", async () => {
  const cases = [
    ["timeout", /no mostró video a tiempo/, /did not show a video in time/],
    ["blocked", /verificación/, /check/],
    ["busy", /otra página/, /another page/],
    ["browser_unavailable", /navegador interno/, /built-in browser/],
    ["not_allowed", /Aprueba/, /Approve/],
  ];
  for (const [code, es, en] of cases) {
    const { kino } = install({ browser: capturing(Object.assign(new Error(code), { code })) });
    await assert.rejects(resolveRef("m:1"), (e) => e.code === "unavailable" && es.test(e.userMessage), code + " es");
    kino.lang = "en";
    await assert.rejects(resolveRef("m:1"), (e) => en.test(e.userMessage), code + " en");
  }
});

test("a Kino with no browser says so; a series ref is not playable", async () => {
  install({ browser: null });
  await assert.rejects(resolveRef("m:1"), (e) => /navegador interno/.test(e.userMessage));
  install({});
  await assert.rejects(resolveRef("s:1"), (e) => e.code === "not_found");
  await assert.rejects(resolveRef("garbage"), (e) => e.code === "not_found");
});

test("one capture at a time: the same title joins the one in flight, another title is told the app is busy", async () => {
  let release;
  const gate = new Promise((r) => { release = r; });
  const seen = [];
  install({ browser: { captureAll: true, capture: async (url) => { seen.push(url); await gate; return { media: [{ url: "https://cdn/a.m3u8", headers: H }], subtitles: [], finalUrl: url }; } } });
  const a = resolveRef("m:5");
  const b = resolveRef("m:5");
  await assert.rejects(resolveRef("m:6"), (e) => /otra página/.test(e.userMessage));
  release();
  const [sa, sb] = await Promise.all([a, b]);
  assert.equal(sa.url, sb.url);
  assert.equal(seen.length, 1, "one hidden page");
  // and afterwards another title may open
  install({ browser: capturing({ media: [{ url: "https://cdn/b.m3u8", headers: H }], subtitles: [], finalUrl: "x" }) });
  assert.equal((await resolveRef("m:6")).url, "https://cdn/b.m3u8");
});
