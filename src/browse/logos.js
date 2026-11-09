// Title logos for the slides, through Kino's own `kino.meta` (no key in the plugin): a slide with a logo draws it where its
// title is. One lookup per title by its TMDB id, kept in kino.storage (`logo1`, at most MAX entries, the oldest dropped) so a
// title is asked once. Nothing here throws: a title without a logo keeps its name.
const KEY = "logo1";
const MAX = 120;
const CALL_MS = 8_000;
const HTTPS = /^https:\/\//;

export function makeLogoCache({ kino, clock = { now: () => Date.now() } }) {
  const usable = () => { try { return typeof kino.meta === "function"; } catch (_) { return false; } };
  let book = null; // card id -> logo url | "" (asked, none)

  function read() {
    if (book) return book;
    try {
      const o = JSON.parse(kino.storage.get(KEY) || "null");
      book = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (_) { book = {}; }
    return book;
  }
  function write() {
    try {
      const ids = Object.keys(book);
      if (ids.length > MAX) for (const id of ids.slice(0, ids.length - MAX)) delete book[id];
      kino.storage.set(KEY, JSON.stringify(book));
    } catch (_) { /* full storage: asked again next time */ }
  }

  /** The logo known for card [id], or undefined. */
  function logoOf(id) {
    const l = read()[id];
    return typeof l === "string" && HTTPS.test(l) ? l : undefined;
  }

  /** Asks Kino about [slides] not asked yet, one after another, until [budgetMs] is spent. Returns how many were asked. */
  async function fill(slides, budgetMs) {
    if (!usable()) return 0;
    const b = read();
    const end = clock.now() + budgetMs;
    let asked = 0;
    for (const s of slides) {
      if (clock.now() + CALL_MS > end) break;
      if (!s || typeof s.id !== "string" || !s.tmdb || Object.hasOwn(b, s.id)) continue;
      try {
        const a = await kino.meta({ type: s.kind === "series" ? "series" : "movie", ids: { tmdb: s.tmdb } });
        b[s.id] = a && typeof a.logo === "string" ? a.logo : "";
      } catch (e) {
        if (e && e.code === "rate_limited") break; // asked again later
        continue;
      }
      asked++;
    }
    if (asked > 0) write();
    return asked;
  }

  return { logoOf, fill, usable };
}
