// The browse screen through the built plugin.js (its logo is a PNG only the bundler reads). Each test imports a fresh copy of the
// bundle (`?n`), so the screen's in-memory state starts empty, as in a new sandbox.
import { test } from "node:test";
import assert from "node:assert/strict";
import { install, movie } from "./helpers.mjs";

let n = 0;
const fresh = () => import(`../plugin.js?n=${++n}`);
const answer = (path) => ({ page: 1, total_pages: 2, results: [1, 2, 3].map((i) => movie(i + (path.length % 9) * 100, `Film ${path.slice(-6)} ${i}`)) });
const SNAP_TTL = 7 * 24 * 3600 * 1000;

async function opened(p, state = {}) {
  const out = await p.screenEvent({ name: "open", route: { name: "browse", args: {} }, state, device: "phone" });
  const tree = await p.screen({ route: { name: "browse" }, state: { ...state, ...out.state }, device: "phone" });
  return { out, tree: JSON.stringify(tree) };
}

test("a tick loads the active tab and keeps it for 7 days under browse1:<tab>, at most 20 KB", async () => {
  const { ttls, data } = install({ tmdb: answer });
  const p = await fresh();
  const { out } = await opened(p);
  assert.equal(out.state.tab, "inicio");
  assert.ok(out.state.pending.includes("inicio"));
  const r = await p.screenEvent({ name: "tick", state: { pending: ["inicio"] } });
  assert.deepEqual(r.state.pending, []);
  assert.equal(ttls.get("browse1:inicio"), SNAP_TTL);
  assert.ok(data.get("browse1:inicio").length <= 20 * 1024);
  const snap = JSON.parse(data.get("browse1:inicio"));
  assert.ok(snap.data.rails.length >= 4 && snap.data.slides.length >= 1);
});

test("an old copy (a day, six days) is drawn at once and refreshed behind; one past 7 days is not drawn", async () => {
  const { data } = install({ tmdb: answer });
  const p0 = await fresh();
  await opened(p0);
  await p0.screenEvent({ name: "tick", state: { pending: ["peliculas"] } });
  const realNow = Date.now;
  try {
    for (const [days, drawn] of [[1, true], [6, true], [8, false]]) {
      Date.now = () => realNow() + days * 24 * 3600 * 1000;
      for (const k of [...data.keys()]) if (k.startsWith("c1:") || k === "home1") data.delete(k); // only the tab's own copy is left
      const p = await fresh();
      const out = await p.screenEvent({ name: "open", route: { name: "browse", args: { tab: "peliculas" } }, state: {}, device: "phone" });
      const tree = JSON.stringify(await p.screen({ route: { name: "browse" }, state: { tab: "peliculas", pending: out.state.pending }, device: "phone" }));
      assert.equal(tree.includes("Film"), drawn, `${days} days`);
      if (drawn) assert.ok(out.state.pending.includes("peliculas"), "the next tick refreshes it");
    }
  } finally { Date.now = realNow; }
});

test("Inicio is seeded from Home's copy (home1) when nothing else is kept", async () => {
  const { data } = install({ tmdb: answer });
  const p0 = await fresh();
  await p0.home(); // keeps home1 and the shelves
  for (const k of [...data.keys()]) if (k.startsWith("c1:") || k.startsWith("browse1:")) data.delete(k);
  assert.ok(data.has("home1"));
  const p = await fresh();
  const { tree } = await opened(p);
  assert.ok(tree.includes("Film"), "the tab paints from home1");
});

test("a tab with no copy is seeded from the shared shelf cache, with no network", async () => {
  const { calls, data } = install({ tmdb: answer });
  const p0 = await fresh();
  await p0.section({ tab: "series" });
  for (const k of [...data.keys()]) if (k.startsWith("browse1:") || k === "home1") data.delete(k);
  const before = calls.tmdb.length;
  const p = await fresh();
  const out = await p.screenEvent({ name: "open", route: { name: "browse", args: { tab: "series" } }, state: {}, device: "phone" });
  const tree = JSON.stringify(await p.screen({ route: { name: "browse" }, state: { tab: "series", pending: out.state.pending }, device: "phone" }));
  assert.ok(tree.includes("Film"));
  assert.equal(calls.tmdb.length, before, "opening reads no network");
});

test("with nothing kept the screen still opens (skeletons) and does not call TMDB until a tick", async () => {
  const { calls } = install({ tmdb: answer });
  const p = await fresh();
  const { out } = await opened(p);
  assert.equal(calls.tmdb.length, 0);
  assert.ok(out.state.pending.length >= 1);
});

test("TV boxes load only the active tab; phones prefetch the others", async () => {
  install({ tmdb: answer });
  const p = await fresh();
  const phone = await p.screenEvent({ name: "open", route: { name: "browse", args: {} }, state: {}, device: "phone" });
  const tv = await p.screenEvent({ name: "open", route: { name: "browse", args: {} }, state: {}, device: "tv" });
  assert.equal(phone.state.pending.length, 3);
  assert.deepEqual(tv.state.pending, ["inicio"]);
});

test("the search page keeps what was found as history", async () => {
  const { data } = install({ tmdb: async (path) => (path === "/search/multi" ? { results: [{ ...movie(7, "Matrix"), media_type: "movie" }] } : answer(path)) });
  const p = await fresh();
  await p.screenEvent({ name: "search", value: { q: "matrix" }, route: { name: "browse" }, state: {} });
  const r = await p.screenEvent({ name: "stick", state: { sq: "matrix", sstate: "loading" } });
  assert.equal(r.state.sstate, "done");
  assert.match(data.get("searchHist1"), /Matrix/);
});

test("clearing the cache removes the shelves, the kept tabs and Home's copy, not the history", async () => {
  const { data } = install({ tmdb: answer });
  const p = await fresh();
  await p.home();
  await p.screenEvent({ name: "tick", state: { pending: ["inicio"] } });
  data.set("searchHist1", "[]");
  const out = await p.action("clearCache");
  assert.match(out.message, /se borraron \d+ datos/);
  assert.ok(![...data.keys()].some((k) => k.startsWith("c1:") || k.startsWith("browse1:") || k === "home1"));
  assert.ok(data.has("searchHist1"));
});
