// The catalog: shelves of movies and series from TMDB. A shelf is "trend", "new", "pop", "top" or "g<TMDB genre id>" of a type
// ("movie" or "series"); its ref (`d:<type>:<shelf>`) pages it in "Ver más". home(), section() and the browse screen all build
// their rows from the same shelves, and every shelf's first page goes through the shared cache (cache.js): fresh for 6 h, served
// up to 24 h old when TMDB does not answer, asked once when two callers want it together.
import { t, both, langOf } from "./i18n.js";
import { tmdb, toItem } from "./tmdb.js";
import { shelfRef, parseShelfRef } from "./refs.js";
import { cached, kept, setWithRoom, FRESH_SHELF_MS, FRESH_ART_MS } from "./cache.js";

const MAX_PAGE = 500; // TMDB serves at most 500 pages
const ROW_MAX = 20;
const TYPES = ["movie", "series"];
const TV_OR_MOVIE = { movie: "movie", series: "tv" };

/** TMDB genre ids each type has a shelf for, in the order the genre tiles and the tabs show them. */
export const GENRES = {
  movie: [28, 12, 16, 35, 80, 99, 18, 10751, 14, 27, 9648, 10749, 878, 53],
  series: [10759, 16, 35, 80, 99, 18, 10751, 9648, 10765],
};

/** The tabs, each a list of `[type, shelf, prefixed]` jobs (prefixed: the row title names the type, as the tab mixes both). */
export const TABS = {
  inicio: [["movie", "trend", true], ["series", "trend", true], ["movie", "new", true], ["series", "pop", true], ["movie", "top", true], ["series", "top", true]],
  peliculas: [["movie", "trend"], ["movie", "new"], ["movie", "pop"], ["movie", "top"], ["movie", "g28"], ["movie", "g35"], ["movie", "g878"], ["movie", "g27"]],
  series: [["series", "trend"], ["series", "new"], ["series", "pop"], ["series", "top"], ["series", "g10759"], ["series", "g18"], ["series", "g10765"], ["series", "g9648"]],
};
export const TAB_IDS = Object.keys(TABS);
const TAB_KEYS = { inicio: "tabHome", peliculas: "tabMovies", series: "tabSeries" };
/** What Kino's own Home shows: the first rows of the Inicio tab. */
export const HOME_JOBS = TABS.inicio.slice(0, 4);

const typeName = (type) => t(type === "movie" ? "tabMovies" : "tabSeries");

/** `{ titleKey, path, params }` of a shelf, or null when it is unknown. */
export function shelfInfo(type, shelf) {
  if (!TYPES.includes(type)) return null;
  const k = TV_OR_MOVIE[type];
  if (shelf === "trend") return { titleKey: "shelfTrend", path: `/trending/${k}/week`, params: {} };
  if (shelf === "new") return { titleKey: "shelfNew", path: type === "movie" ? "/movie/now_playing" : "/tv/on_the_air", params: {} };
  if (shelf === "pop") return { titleKey: "shelfPop", path: `/discover/${k}`, params: { sort_by: "popularity.desc", "vote_count.gte": 50 } };
  if (shelf === "top") return { titleKey: "shelfTop", path: `/discover/${k}`, params: { sort_by: "vote_average.desc", "vote_count.gte": 1500 } };
  const m = /^g(\d{1,6})$/.exec(String(shelf));
  const id = m ? Number(m[1]) : 0;
  if (!GENRES[type].includes(id)) return null;
  return { titleKey: "g" + id, path: `/discover/${k}`, params: { sort_by: "popularity.desc", "vote_count.gte": 100, with_genres: id } };
}

/** At most [limit] jobs at a time; results in order. */
export async function mapLimit(jobs, limit, fn) {
  const out = new Array(jobs.length);
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const i = next++;
      out[i] = await fn(jobs[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, jobs.length) }, worker));
  return out;
}

/** One page of a shelf as `{ items, more }`; straight from TMDB (the caller caches page 1). */
async function fetchPage(type, shelf, page) {
  const info = shelfInfo(type, shelf);
  if (!info) throw kino.error("not_found", "unknown shelf " + type + ":" + String(shelf).slice(0, 20));
  const data = await tmdb(info.path, { ...info.params, page: String(page) });
  return {
    items: (data.results || []).filter((m) => !m.adult && m.id && (m.title || m.name)).map((m) => toItem(m, type)),
    more: Number(data.total_pages) > page && page < MAX_PAGE,
  };
}

const pageKey = (type, shelf) => `shelf2:${type}:${shelf}:${langOf()}`;

/** A shelf's first page, cached. */
const firstPage = (type, shelf) => cached(pageKey(type, shelf), FRESH_SHELF_MS, () => fetchPage(type, shelf, 1));

function rowOf(type, shelf, prefixed, page) {
  const info = shelfInfo(type, shelf);
  const name = t(info.titleKey);
  return {
    id: `d-${type}-${shelf}`,
    title: prefixed ? `${name} · ${typeName(type)}` : name,
    ref: shelfRef(type, shelf),
    genre: type === "movie" ? "peliculas" : "series",
    items: page.items.slice(0, ROW_MAX),
  };
}

/** The row of a shelf, or null when nobody could read it (it never takes the other rows with it). */
export async function shelfRow(type, shelf, prefixed) {
  try {
    const page = await firstPage(type, shelf);
    return page.items.length ? rowOf(type, shelf, prefixed, page) : null;
  } catch (e) {
    kino.log("[cinejoy] shelf", type, shelf, (e && e.code) || "error");
    return null;
  }
}

/** The same row from storage alone, however old the kept page is (storage drops it at 24 h). No network, never throws. */
export function shelfRowKept(type, shelf, prefixed) {
  try {
    const page = kept(pageKey(type, shelf));
    return page && Array.isArray(page.items) && page.items.length ? rowOf(type, shelf, prefixed, page) : null;
  } catch (_) { return null; }
}

/** Rows for [jobs], four shelves at a time (Kino lets a plugin make 20 kino.tmdb calls every 10 s). */
export async function buildRows(jobs) {
  return (await mapLimit(jobs, 4, (j) => shelfRow(...j))).filter(Boolean);
}

/** The rows of [jobs] that storage already holds. */
export const keptRows = (jobs) => jobs.map((j) => shelfRowKept(...j)).filter(Boolean);

/** `browse(ref, cursor)`: a shelf's page. */
export async function browsePage(ref, cursor) {
  const r = parseShelfRef(ref);
  if (!r || !shelfInfo(r.type, r.shelf)) return { items: [] };
  const page = cursor ? Math.min(MAX_PAGE, Math.max(1, Number(cursor) || 1)) : 1;
  const out = page === 1 ? await firstPage(r.type, r.shelf) : await fetchPage(r.type, r.shelf, page);
  return out.more ? { items: out.items, next: String(page + 1) } : { items: out.items };
}

/** The tabs as Kino's section draws them. */
export const tabList = () => TAB_IDS.map((id) => ({ id, label: t(TAB_KEYS[id]) }));
/** A tab's label in both languages (the screen's TabBar). */
export const tabLabel = (id) => both(TAB_KEYS[id]);

/** A tab's rows with the first title that has a backdrop and a synopsis as the hero. */
function sectionOf(tab, rows) {
  const out = { tabs: tabList(), tab, rows };
  const star = rows.flatMap((r) => r.items).find((i) => i.backdrop && i.overview);
  if (star) out.hero = { title: star.title, text: star.overview.length > 300 ? star.overview.slice(0, 299) + "…" : star.overview, image: star.backdrop };
  return out;
}

/** `section({ tab })`: a tab's rows. */
export async function sectionPage(tab) {
  const chosen = TABS[tab] ? tab : "inicio";
  return sectionOf(chosen, await buildRows(TABS[chosen]));
}

// ---------- Home's own copy (home1) ----------
// The rows home() last built, kept 7 days (trimmed until they fit): the browse screen draws its Inicio tab from them when it has
// no copy of its own, and home() itself serves them when the network is down. A fresh home() always asks the shelves again.
export const HOME_KEY = "home1";
export const HOME_TTL_MS = 7 * 24 * 3600 * 1000;
export const HOME_MAX = 60 * 1024;

export function saveHome(rows) {
  try {
    for (let per = 20; per >= 4; per -= 4) {
      const text = JSON.stringify({ at: Date.now(), rows: rows.map((r) => ({ ...r, items: r.items.slice(0, per) })) });
      if (text.length <= HOME_MAX) { return setWithRoom(HOME_KEY, text, { ttlMs: HOME_TTL_MS }); }
    }
  } catch (_) { /* full storage: no copy */ }
  return false;
}

export function savedHome() {
  try {
    const s = JSON.parse(kino.storage.get(HOME_KEY) || "null");
    return s && Array.isArray(s.rows) && s.rows.length && Date.now() - s.at < HOME_TTL_MS ? s.rows : null;
  } catch (_) { return null; }
}

/** `home()`'s rows. */
export async function homeRows() {
  const rows = await buildRows(HOME_JOBS);
  if (rows.length) { saveHome(rows); return rows; }
  return savedHome() || [];
}

// ---------- Categorías ----------

/** `categories()`: trending of both types, then a tile per genre; the art is the first title of the shelf (backdrop, else poster). */
export async function categoryTiles() {
  const tiles = [];
  for (const type of TYPES) {
    tiles.push({ type, shelf: "trend", title: `${t("shelfTrend")} · ${typeName(type)}` });
    for (const id of GENRES[type]) tiles.push({ type, shelf: "g" + id, title: t(type === "movie" ? "catMovies" : "catSeries", { g: t("g" + id) }) });
  }
  return mapLimit(tiles.slice(0, 24), 4, async (tile) => {
    const out = { id: `${tile.type}-${tile.shelf}`, title: tile.title.slice(0, 40), ref: shelfRef(tile.type, tile.shelf) };
    try {
      const art = await cached(`art:${out.id}:${langOf()}`, FRESH_ART_MS, async () => {
        const first = (await firstPage(tile.type, tile.shelf)).items[0];
        return first ? first.backdrop || first.poster || "" : "";
      });
      if (art) out.art = art;
    } catch (e) {
      kino.log("[cinejoy] art", out.id, (e && e.code) || "error");
    }
    return out;
  });
}

