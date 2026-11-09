// src/i18n.js
var WORDS = {
  es: {
    // shelves
    shelfTrend: "Tendencias",
    shelfNew: "Estrenos",
    shelfPop: "Populares",
    shelfTop: "Mejor valoradas",
    // genres (TMDB ids)
    g28: "Acci\xF3n",
    g12: "Aventura",
    g16: "Animaci\xF3n",
    g35: "Comedia",
    g80: "Crimen",
    g99: "Documental",
    g18: "Drama",
    g10751: "Familia",
    g14: "Fantas\xEDa",
    g27: "Terror",
    g9648: "Misterio",
    g10749: "Romance",
    g878: "Ciencia ficci\xF3n",
    g53: "Suspenso",
    g10759: "Acci\xF3n y aventura",
    g10765: "Ciencia ficci\xF3n y fantas\xEDa",
    // tabs
    tabHome: "Inicio",
    tabMovies: "Pel\xEDculas",
    tabSeries: "Series",
    // categories
    catMovies: "Pel\xEDculas: {g}",
    catSeries: "Series: {g}",
    // resolve
    notFound: "Cinejoy no tiene video para este t\xEDtulo por ahora.",
    timeout: "El reproductor de Cinejoy no mostr\xF3 video a tiempo. Int\xE9ntalo de nuevo.",
    blocked: "Cinejoy pidi\xF3 una verificaci\xF3n que Kino no puede completar. Int\xE9ntalo m\xE1s tarde.",
    busy: "Kino est\xE1 abriendo otra p\xE1gina ahora. Espera un momento e int\xE9ntalo de nuevo.",
    noBrowser: "Este aparato no puede abrir la p\xE1gina de Cinejoy (le falta el navegador interno).",
    notAllowed: "Aprueba en Kino que Cinejoy abra p\xE1ginas web ocultas para encontrar el video.",
    tmdbDown: "El cat\xE1logo no responde ahora. Intenta de nuevo en un rato.",
    // settings
    cacheCleared: "Listo: se borraron {n} datos guardados.",
    // browse screen
    brWatch: "Ver",
    brInfo: "M\xE1s informaci\xF3n",
    brMore: "Ver m\xE1s",
    brRecent: "Continuar viendo",
    brSearch: "Buscar",
    brSearchHint: "Buscar pel\xEDculas y series",
    brSearchTitle: "Buscar",
    brSearchedBefore: "Buscado recientemente",
    brNoResults: "No encontramos nada con esas palabras.",
    brSearchFailed: "No se pudo buscar. Revisa tu conexi\xF3n e int\xE9ntalo de nuevo.",
    brFailed: "No se pudo cargar esta secci\xF3n. Revisa tu conexi\xF3n e int\xE9ntalo de nuevo.",
    brRetry: "Reintentar",
    brEmpty: "A\xFAn no hay nada aqu\xED.",
    brBack: "Atr\xE1s",
    brClose: "Cerrar",
    brSettings: "Configuraci\xF3n",
    // title page
    dEpisodeN: "Episodio {n}",
    dSeasonN: "Temporada {n}",
    dSeasonsN: "{n} temporadas",
    dSeasonOne: "1 temporada",
    dSeriesGo: "Ver episodios",
    dMore: "M\xE1s opciones",
    dCreators: "Creaci\xF3n: {v}",
    dDirector: "Direcci\xF3n: {v}",
    dCast: "Reparto",
    dEpisodes: "Episodios",
    dSimilar: "M\xE1s como esto",
    dSeeInKino: "Ver en Kino",
    // sharing to Kino Social (its "wall" door)
    shShare: "Compartir",
    shSheet: "Compartir en Kino Social",
    shText: "Qu\xE9 quieres contar",
    shWatching: "Estoy viendo \xAB{t}\xBB en Cinejoy",
    shAttach: "Adjuntar el t\xEDtulo",
    shSend: "Enviar a Kino Social",
    shNote: "Llega a Kino Social como borrador: all\xE1 lo revisas y lo publicas.",
    shDone: "Listo: tienes el borrador en Kino Social para revisarlo y publicarlo.",
    shEmpty: "Escribe algo o adjunta el t\xEDtulo.",
    shMissing: "Instala Kino Social para compartir.",
    shOldKino: "Actualiza Kino para compartir en Kino Social.",
    shFailed: "No se pudo enviar a Kino Social. Int\xE9ntalo de nuevo."
  },
  en: {
    shelfTrend: "Trending",
    shelfNew: "New releases",
    shelfPop: "Popular",
    shelfTop: "Top rated",
    g28: "Action",
    g12: "Adventure",
    g16: "Animation",
    g35: "Comedy",
    g80: "Crime",
    g99: "Documentary",
    g18: "Drama",
    g10751: "Family",
    g14: "Fantasy",
    g27: "Horror",
    g9648: "Mystery",
    g10749: "Romance",
    g878: "Science fiction",
    g53: "Thriller",
    g10759: "Action and adventure",
    g10765: "Sci-fi and fantasy",
    tabHome: "Home",
    tabMovies: "Movies",
    tabSeries: "Series",
    catMovies: "Movies: {g}",
    catSeries: "Series: {g}",
    notFound: "Cinejoy has no video for this title right now.",
    timeout: "Cinejoy's player did not show a video in time. Try again.",
    blocked: "Cinejoy asked for a check that Kino cannot complete. Try again later.",
    busy: "Kino is opening another page right now. Wait a moment and try again.",
    noBrowser: "This device cannot open Cinejoy's page (it lacks the built-in browser).",
    notAllowed: "Approve in Kino that Cinejoy may open hidden web pages to find the video.",
    tmdbDown: "The catalog is not answering right now. Try again in a while.",
    cacheCleared: "Done: {n} saved items were cleared.",
    brWatch: "Watch",
    brInfo: "More info",
    brMore: "See more",
    brRecent: "Continue watching",
    brSearch: "Search",
    brSearchHint: "Search movies and series",
    brSearchTitle: "Search",
    brSearchedBefore: "Recently searched",
    brNoResults: "Nothing matched those words.",
    brSearchFailed: "The search failed. Check your connection and try again.",
    brFailed: "This section could not be loaded. Check your connection and try again.",
    brRetry: "Retry",
    brEmpty: "Nothing here yet.",
    brBack: "Back",
    brClose: "Close",
    brSettings: "Settings",
    dEpisodeN: "Episode {n}",
    dSeasonN: "Season {n}",
    dSeasonsN: "{n} seasons",
    dSeasonOne: "1 season",
    dSeriesGo: "Watch episodes",
    dMore: "More options",
    dCreators: "Created by: {v}",
    dDirector: "Directed by: {v}",
    dCast: "Cast",
    dEpisodes: "Episodes",
    dSimilar: "More like this",
    dSeeInKino: "Open in Kino",
    shShare: "Share",
    shSheet: "Share on Kino Social",
    shText: "What do you want to say",
    shWatching: `I'm watching "{t}" on Cinejoy`,
    shAttach: "Attach the title",
    shSend: "Send to Kino Social",
    shNote: "It reaches Kino Social as a draft: you review and post it there.",
    shDone: "Done: the draft waits in Kino Social for you to review and post.",
    shEmpty: "Write something or attach the title.",
    shMissing: "Install Kino Social to share.",
    shOldKino: "Update Kino to share on Kino Social.",
    shFailed: "Could not send to Kino Social. Try again."
  }
};
var fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => vars && vars[k] != null ? String(vars[k]) : m);
function langOf(kino2 = globalThis.kino) {
  return String(kino2 && kino2.lang || "").toLowerCase().startsWith("en") ? "en" : "es";
}
function t(key, vars, kino2 = globalThis.kino) {
  const words = WORDS[langOf(kino2)];
  return fill(words[key] ?? WORDS.es[key] ?? key, vars);
}
function both(key, vars) {
  return { es: fill(WORDS.es[key] ?? key, vars), en: fill(WORDS.en[key] ?? WORDS.es[key] ?? key, vars) };
}
var KEYS = { es: Object.keys(WORDS.es), en: Object.keys(WORDS.en) };

// src/refs.js
var movieRef = (id) => `m:${id}`;
var seriesRef = (id) => `s:${id}`;
var episodeRef = (id, season, episode) => `e:${id}:${season}:${episode}`;
var shelfRef = (type, shelf) => `d:${type}:${shelf}`;
function parseTitleRef(ref) {
  const r = String(ref || "");
  let m = /^([ms]):(\d{1,10})$/.exec(r);
  if (m) return { kind: m[1] === "m" ? "movie" : "series", id: Number(m[2]) };
  m = /^e:(\d{1,10}):(\d{1,3}):(\d{1,5})$/.exec(r);
  if (m) return { kind: "episode", id: Number(m[1]), season: Number(m[2]), episode: Number(m[3]) };
  return null;
}
function parseShelfRef(ref) {
  const m = /^d:(movie|series):([a-z0-9]{1,12})$/.exec(String(ref || ""));
  return m ? { type: m[1], shelf: m[2] } : null;
}

// src/tmdb.js
var IMG = "https://image.tmdb.org/t/p/";
var tmdbLang = () => langOf() === "en" ? "en-US" : "es-MX";
async function tmdb(path, params = {}) {
  await null;
  if (typeof kino.tmdb !== "function") {
    throw kino.error("unavailable", "kino.tmdb missing (Kino older than 0.9.53)", { userMessage: t("tmdbDown") });
  }
  return kino.tmdb(path, { language: tmdbLang(), include_adult: false, ...params });
}
var img = (size, path) => typeof path === "string" && path.startsWith("/") ? IMG + size + path : void 0;
var yearOf = (d) => typeof d === "string" && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : void 0;
function toItem(m, kind) {
  const isMovie = kind ? kind === "movie" : m.media_type === "movie";
  const item = {
    // Kino takes only A-Z a-z 0-9 . _ ~ - in an id.
    id: `${isMovie ? "m" : "s"}-${m.id}`,
    ref: isMovie ? movieRef(m.id) : seriesRef(m.id),
    title: m.title || m.name || "",
    kind: isMovie ? "movie" : "series",
    ids: { tmdb: m.id }
  };
  const year = yearOf(m.release_date || m.first_air_date);
  if (year) item.year = year;
  const poster = img("w342", m.poster_path);
  if (poster) item.poster = poster;
  const backdrop = img("w780", m.backdrop_path);
  if (backdrop) item.backdrop = backdrop;
  if (m.overview) item.overview = m.overview.length > 240 ? m.overview.slice(0, 239) + "\u2026" : m.overview;
  if (typeof m.vote_average === "number" && m.vote_count > 20) item.rating = Math.round(m.vote_average * 10) / 10;
  const original = m.original_title || m.original_name;
  if (original && original !== item.title) item.originalTitle = original;
  return item;
}
async function searchTitles(query) {
  const data = await tmdb("/search/multi", { query });
  return (data.results || []).filter((m) => (m.media_type === "movie" || m.media_type === "tv") && !m.adult && m.id && (m.title || m.name)).map((m) => toItem(m));
}
async function movieInfo(id) {
  const m = await tmdb(`/movie/${id}`);
  const info = { title: m.title || "", ids: { tmdb: Number(id) } };
  const poster = img("w342", m.poster_path);
  if (poster) info.poster = poster;
  const backdrop = img("w780", m.backdrop_path);
  if (backdrop) info.backdrop = backdrop;
  if (m.overview) info.overview = m.overview;
  if (Array.isArray(m.genres) && m.genres.length) info.genres = m.genres.map((g) => g.name).filter(Boolean).slice(0, 6);
  const year = yearOf(m.release_date);
  if (year) info.year = year;
  if (typeof m.vote_average === "number" && m.vote_count > 20) info.rating = Math.round(m.vote_average * 10) / 10;
  if (m.runtime > 0) info.runtimeMinutes = m.runtime;
  if (m.imdb_id && /^tt\d+$/.test(m.imdb_id)) info.ids.imdb = m.imdb_id;
  return info;
}
async function seriesEpisodes(id) {
  const show = await tmdb(`/tv/${id}`);
  const seasons = (show.seasons || []).filter((s) => s.season_number > 0);
  const batches = [];
  for (let i = 0; i < seasons.length; i += 20) batches.push(seasons.slice(i, i + 20));
  const answers = await Promise.all(batches.map((b) => tmdb(`/tv/${id}`, { append_to_response: b.map((s) => `season/${s.season_number}`).join(",") })));
  const fetched = batches.flatMap((b, i) => b.map((s) => answers[i][`season/${s.season_number}`] || {}));
  const episodes2 = fetched.flatMap((sd, i) => (sd.episodes || []).map((ep) => {
    const out = { season: seasons[i].season_number, number: ep.episode_number, ref: episodeRef(id, seasons[i].season_number, ep.episode_number) };
    if (ep.name) out.title = ep.name;
    const still = img("w300", ep.still_path);
    if (still) out.still = still;
    if (ep.overview) out.overview = ep.overview;
    if (/^\d{4}-\d{2}-\d{2}$/.test(ep.air_date || "")) out.airDate = ep.air_date;
    if (ep.runtime > 0) out.runtimeMinutes = ep.runtime;
    return out;
  }));
  return {
    series: {
      title: show.name,
      ...img("w342", show.poster_path) ? { poster: img("w342", show.poster_path) } : {},
      ...img("w780", show.backdrop_path) ? { backdrop: img("w780", show.backdrop_path) } : {},
      ...show.overview ? { overview: show.overview } : {},
      ids: { tmdb: Number(id) }
    },
    episodes: episodes2
  };
}

// src/cache.js
var PREFIX = "c1:";
var HARD_TTL_MS = 24 * 3600 * 1e3;
var ENTRY_MAX = 48 * 1024;
var FRESH_SHELF_MS = 6 * 3600 * 1e3;
var FRESH_ART_MS = 12 * 3600 * 1e3;
var CACHE_BUDGET = 120 * 1024;
var store = () => globalThis.kino.storage;
var keys = () => {
  try {
    return store().keys().filter((k) => k.startsWith(PREFIX));
  } catch (_) {
    return [];
  }
};
function read(key) {
  try {
    const raw = store().get(PREFIX + key);
    if (!raw) return null;
    const e = JSON.parse(raw);
    return e && typeof e.at === "number" && "v" in e ? e : null;
  } catch (_) {
    try {
      store().remove(PREFIX + key);
    } catch (__) {
    }
    return null;
  }
}
function kept(key) {
  const e = read(key);
  return e ? e.v : void 0;
}
function used() {
  let n = 0;
  for (const k of keys()) {
    try {
      n += (store().get(k) || "").length + k.length;
    } catch (_) {
    }
  }
  return n;
}
function evictOldest(except = "") {
  let victim = null;
  let oldest = Infinity;
  for (const k of keys()) {
    if (k === except) continue;
    let at = 0;
    try {
      at = JSON.parse(store().get(k) || "{}").at || 0;
    } catch (_) {
    }
    if (at < oldest) {
      oldest = at;
      victim = k;
    }
  }
  if (victim === null) return false;
  try {
    store().remove(victim);
  } catch (_) {
    return false;
  }
  return true;
}
function write(key, v) {
  let raw;
  try {
    raw = JSON.stringify({ at: Date.now(), v });
  } catch (_) {
    return false;
  }
  if (raw.length > ENTRY_MAX) return false;
  try {
    let total = used() - (store().get(PREFIX + key) || "").length;
    for (let guard = 0; total + raw.length > CACHE_BUDGET && guard < 40; guard++) {
      if (!evictOldest(PREFIX + key)) break;
      total = used() - (store().get(PREFIX + key) || "").length;
    }
  } catch (_) {
  }
  for (let tries = 0; tries < 30; tries++) {
    try {
      store().set(PREFIX + key, raw, { ttlMs: HARD_TTL_MS });
      return true;
    } catch (e) {
      if (!e || e.code !== "too_large" || !evictOldest()) return false;
    }
  }
  return false;
}
function setWithRoom(key, text, opts) {
  for (let tries = 0; tries < 40; tries++) {
    try {
      store().set(key, text, opts);
      return true;
    } catch (e) {
      if (!e || e.code !== "too_large" || !evictOldest()) return false;
    }
  }
  return false;
}
var inflight = /* @__PURE__ */ new Map();
function cached(key, freshMs, load) {
  const hit = read(key);
  if (hit && Date.now() - hit.at < freshMs) return Promise.resolve(hit.v);
  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    try {
      const v = await load();
      write(key, v);
      return v;
    } catch (e) {
      if (hit) {
        try {
          globalThis.kino.log("[cinejoy] serving older", key, e && e.code || "error");
        } catch (_) {
        }
        return hit.v;
      }
      throw e;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, p);
  return p;
}
function clear() {
  let n = 0;
  for (const k of keys()) {
    try {
      store().remove(k);
      n++;
    } catch (_) {
    }
  }
  return n;
}

// src/catalog.js
var MAX_PAGE = 500;
var ROW_MAX = 20;
var TYPES = ["movie", "series"];
var TV_OR_MOVIE = { movie: "movie", series: "tv" };
var GENRES = {
  movie: [28, 12, 16, 35, 80, 99, 18, 10751, 14, 27, 9648, 10749, 878, 53],
  series: [10759, 16, 35, 80, 99, 18, 10751, 9648, 10765]
};
var TABS = {
  inicio: [["movie", "trend", true], ["series", "trend", true], ["movie", "new", true], ["series", "pop", true], ["movie", "top", true], ["series", "top", true]],
  peliculas: [["movie", "trend"], ["movie", "new"], ["movie", "pop"], ["movie", "top"], ["movie", "g28"], ["movie", "g35"], ["movie", "g878"], ["movie", "g27"]],
  series: [["series", "trend"], ["series", "new"], ["series", "pop"], ["series", "top"], ["series", "g10759"], ["series", "g18"], ["series", "g10765"], ["series", "g9648"]]
};
var TAB_IDS = Object.keys(TABS);
var TAB_KEYS = { inicio: "tabHome", peliculas: "tabMovies", series: "tabSeries" };
var HOME_JOBS = TABS.inicio.slice(0, 4);
var typeName = (type) => t(type === "movie" ? "tabMovies" : "tabSeries");
function shelfInfo(type, shelf) {
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
async function mapLimit(jobs, limit, fn) {
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
async function fetchPage(type, shelf, page) {
  const info = shelfInfo(type, shelf);
  if (!info) throw kino.error("not_found", "unknown shelf " + type + ":" + String(shelf).slice(0, 20));
  const data = await tmdb(info.path, { ...info.params, page: String(page) });
  return {
    items: (data.results || []).filter((m) => !m.adult && m.id && (m.title || m.name)).map((m) => toItem(m, type)),
    more: Number(data.total_pages) > page && page < MAX_PAGE
  };
}
var pageKey = (type, shelf) => `shelf2:${type}:${shelf}:${langOf()}`;
var firstPage = (type, shelf) => cached(pageKey(type, shelf), FRESH_SHELF_MS, () => fetchPage(type, shelf, 1));
function rowOf(type, shelf, prefixed, page) {
  const info = shelfInfo(type, shelf);
  const name = t(info.titleKey);
  return {
    id: `d-${type}-${shelf}`,
    title: prefixed ? `${name} \xB7 ${typeName(type)}` : name,
    ref: shelfRef(type, shelf),
    genre: type === "movie" ? "peliculas" : "series",
    items: page.items.slice(0, ROW_MAX)
  };
}
async function shelfRow(type, shelf, prefixed) {
  try {
    const page = await firstPage(type, shelf);
    return page.items.length ? rowOf(type, shelf, prefixed, page) : null;
  } catch (e) {
    kino.log("[cinejoy] shelf", type, shelf, e && e.code || "error");
    return null;
  }
}
function shelfRowKept(type, shelf, prefixed) {
  try {
    const page = kept(pageKey(type, shelf));
    return page && Array.isArray(page.items) && page.items.length ? rowOf(type, shelf, prefixed, page) : null;
  } catch (_) {
    return null;
  }
}
async function buildRows(jobs) {
  return (await mapLimit(jobs, 4, (j) => shelfRow(...j))).filter(Boolean);
}
var keptRows = (jobs) => jobs.map((j) => shelfRowKept(...j)).filter(Boolean);
async function browsePage(ref, cursor) {
  const r = parseShelfRef(ref);
  if (!r || !shelfInfo(r.type, r.shelf)) return { items: [] };
  const page = cursor ? Math.min(MAX_PAGE, Math.max(1, Number(cursor) || 1)) : 1;
  const out = page === 1 ? await firstPage(r.type, r.shelf) : await fetchPage(r.type, r.shelf, page);
  return out.more ? { items: out.items, next: String(page + 1) } : { items: out.items };
}
var tabList = () => TAB_IDS.map((id) => ({ id, label: t(TAB_KEYS[id]) }));
var tabLabel = (id) => both(TAB_KEYS[id]);
function sectionOf(tab, rows) {
  const out = { tabs: tabList(), tab, rows };
  const star = rows.flatMap((r) => r.items).find((i) => i.backdrop && i.overview);
  if (star) out.hero = { title: star.title, text: star.overview.length > 300 ? star.overview.slice(0, 299) + "\u2026" : star.overview, image: star.backdrop };
  return out;
}
async function sectionPage(tab) {
  const chosen = TABS[tab] ? tab : "inicio";
  return sectionOf(chosen, await buildRows(TABS[chosen]));
}
var HOME_KEY = "home1";
var HOME_TTL_MS = 7 * 24 * 3600 * 1e3;
var HOME_MAX = 60 * 1024;
function saveHome(rows) {
  try {
    for (let per = 20; per >= 4; per -= 4) {
      const text = JSON.stringify({ at: Date.now(), rows: rows.map((r) => ({ ...r, items: r.items.slice(0, per) })) });
      if (text.length <= HOME_MAX) {
        return setWithRoom(HOME_KEY, text, { ttlMs: HOME_TTL_MS });
      }
    }
  } catch (_) {
  }
  return false;
}
function savedHome() {
  try {
    const s = JSON.parse(kino.storage.get(HOME_KEY) || "null");
    return s && Array.isArray(s.rows) && s.rows.length && Date.now() - s.at < HOME_TTL_MS ? s.rows : null;
  } catch (_) {
    return null;
  }
}
async function homeRows() {
  const rows = await buildRows(HOME_JOBS);
  if (rows.length) {
    saveHome(rows);
    return rows;
  }
  return savedHome() || [];
}
async function categoryTiles() {
  const tiles = [];
  for (const type of TYPES) {
    tiles.push({ type, shelf: "trend", title: `${t("shelfTrend")} \xB7 ${typeName(type)}` });
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
      kino.log("[cinejoy] art", out.id, e && e.code || "error");
    }
    return out;
  });
}

// src/settings.js
var bool = (v, fallback) => v === true || v === "true" ? true : v === false || v === "false" ? false : fallback;
function readSettings(kino2 = globalThis.kino) {
  const get = (key) => {
    try {
      return kino2 && kino2.config ? kino2.config.get(key) : void 0;
    } catch (_) {
      return void 0;
    }
  };
  return { subLang: get("subLang") === "en" ? "en" : "es", homeRows: bool(get("homeRows"), true) };
}

// src/resolve.js
var SITE = "https://cinejoy.pk";
var SUBS = "https://subs.wing.st/subtitles";
var CAPTURE_MS = 24e3;
var SUBS_MS = 6e3;
var MAX_SUBS = 30;
var MAX_ALTERNATIVES = 3;
var MAX_HEADERS = 20;
var ALSO_MATCH = "\\.m3u8|\\.mpd|\\.mp4|\\.m4s|\\.ts(\\?|$)";
var DROP_HEADERS = /* @__PURE__ */ new Set(["host", "range", "accept-encoding", "content-length", "connection", "content-type", "if-range", "if-none-match", "if-modified-since"]);
var fail = (code, text, why) => kino.error(code, why || text, { userMessage: t(text) });
function watchUrl(p) {
  if (!p) return null;
  if (p.kind === "movie") return `${SITE}/watch/movie/${p.id}`;
  if (p.kind === "episode") return `${SITE}/watch/tv/${p.id}/${p.season}/${p.episode}`;
  return null;
}
var pathOf = (url) => String(url).split("#")[0].split("?")[0].toLowerCase();
function mediaRank(url) {
  const p = pathOf(url);
  if (/\.(m4s|ts|key|aac|vtt|srt)$/.test(p)) return -1;
  if (/\.(m3u8|mpd)$/.test(p) || /\.(m3u8|mpd)(\W|$)/.test(String(url).toLowerCase())) return 0;
  if (/\.(mp4|webm|mkv|mov)$/.test(p)) return 1;
  return 2;
}
function headersOf(h) {
  const out = {};
  if (!h || typeof h !== "object") return out;
  for (const [k, v] of Object.entries(h)) {
    if (typeof v !== "string" || v === "" || DROP_HEADERS.has(k.toLowerCase())) continue;
    if (Object.keys(out).length >= MAX_HEADERS) break;
    out[k] = v;
  }
  return out;
}
function pickMedia(cap) {
  const seen = /* @__PURE__ */ new Set();
  const all = [];
  const add = (url, headers, mime) => {
    if (typeof url !== "string" || !/^https:\/\//i.test(url) || seen.has(url)) return;
    const rank = mediaRank(url);
    if (rank < 0) return;
    seen.add(url);
    all.push({ rank, i: all.length, url, headers: headersOf(headers), ...typeof mime === "string" && mime ? { mime } : {} });
  };
  for (const m of cap && cap.media || []) add(m && m.url, m && m.headers, m && m.mime);
  for (const r of cap && cap.requests || []) if (!r || r.method === void 0 || r.method === "GET") add(r && r.url, r && r.headers);
  return all.sort((a, b) => a.rank - b.rank || a.i - b.i).map(({ rank, i, ...rest }) => rest);
}
function pickSubtitles(answer, prefer) {
  const list = answer && Array.isArray(answer.subtitles) ? answer.subtitles : [];
  const order = prefer === "en" ? ["en", "es"] : ["es", "en"];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const caps = [Math.ceil(MAX_SUBS * 0.6), MAX_SUBS - Math.ceil(MAX_SUBS * 0.6)];
  order.forEach((lang, n) => {
    let taken = 0;
    for (const s of list) {
      if (taken >= caps[n]) break;
      if (!s || s.language !== lang || typeof s.url !== "string" || !/^https:\/\//.test(s.url) || seen.has(s.url)) continue;
      seen.add(s.url);
      taken++;
      out.push({ lang, url: s.url, format: s.type === "vtt" ? "vtt" : "srt" });
    }
  });
  return out;
}
async function subtitlesFor(p) {
  try {
    const q = p.kind === "movie" ? `type=movie&tmdb=${p.id}` : `type=tv&tmdb=${p.id}&season=${p.season}&episode=${p.episode}`;
    const r = await kino.fetch(`${SUBS}?${q}`, { timeoutMs: SUBS_MS });
    return r.ok ? pickSubtitles(r.json(), readSettings().subLang) : [];
  } catch (e) {
    kino.log("[cinejoy] subs", e && e.code || "error");
    return [];
  }
}
var canCapture = () => !!(kino.browser && typeof kino.browser.capture === "function");
async function captureOf(url) {
  const opts = { timeoutMs: CAPTURE_MS };
  if (kino.browser.captureAll === true) {
    opts.captureAll = true;
    opts.alsoMatch = [ALSO_MATCH];
  }
  try {
    return await kino.browser.capture(url, opts);
  } catch (e) {
    const code = e && e.code || "error";
    kino.log("[cinejoy] capture", code);
    if (code === "timeout") throw fail("unavailable", "timeout", "capture timeout");
    if (code === "blocked") throw fail("unavailable", "blocked", "capture blocked");
    if (code === "busy") throw fail("unavailable", "busy", "capture busy");
    if (code === "browser_unavailable") throw fail("unavailable", "noBrowser", "no web view");
    if (code === "not_allowed") throw fail("unavailable", "notAllowed", "capture not allowed");
    throw fail("not_found", "notFound", "capture failed: " + code);
  }
}
var inFlight = null;
async function streamFor(p, url) {
  const subsPromise = subtitlesFor(p);
  const cap = await captureOf(url);
  const media = pickMedia(cap);
  if (media.length === 0) {
    kino.log("[cinejoy] capture saw no playable video");
    throw fail("not_found", "notFound", "no video request");
  }
  const [first, ...rest] = media;
  const subtitles = await subsPromise;
  const have = new Set(subtitles.map((s) => s.url));
  for (const s of cap && cap.subtitles || []) {
    if (subtitles.length >= MAX_SUBS) break;
    if (s && typeof s.url === "string" && /^https:\/\//.test(s.url) && !have.has(s.url)) {
      have.add(s.url);
      subtitles.push({ lang: typeof s.lang === "string" && s.lang ? s.lang : "und", url: s.url });
    }
  }
  const stream = { url: first.url, label: "Cinejoy", ...first.mime ? { mime: first.mime } : {}, ...Object.keys(first.headers).length ? { headers: first.headers } : {} };
  const alternatives = rest.slice(0, MAX_ALTERNATIVES).map((m) => ({ url: m.url, ...Object.keys(m.headers).length ? { headers: m.headers } : {} }));
  if (alternatives.length) stream.alternatives = alternatives;
  if (subtitles.length) stream.subtitles = subtitles;
  return stream;
}
async function resolveRef(ref) {
  const p = parseTitleRef(ref);
  const url = watchUrl(p);
  if (!url) throw fail("not_found", "notFound", "not a playable ref");
  if (!canCapture()) throw fail("unavailable", "noBrowser", "kino.browser.capture missing");
  if (inFlight) {
    if (inFlight.url === url) return inFlight.promise;
    throw fail("unavailable", "busy", "another capture is running");
  }
  const promise = streamFor(p, url).finally(() => {
    inFlight = null;
  });
  inFlight = { url, promise };
  return promise;
}

// src/browse/model.js
var MAX_SLIDES = 6;
var MAX_RAILS = 8;
var MAX_RAIL_ITEMS = 20;
var MAX_SLIDE_TEXT = 160;
var HTTPS = /^https:\/\//;
function cardOf(item) {
  const out = { id: item.id, ref: item.ref, title: item.title, kind: item.kind };
  if (item.poster && HTTPS.test(item.poster)) out.poster = item.poster;
  if (item.backdrop && HTTPS.test(item.backdrop)) out.backdrop = item.backdrop;
  if (item.rating !== void 0) out.rating = item.rating;
  if (item.year !== void 0) out.year = item.year;
  if (item.ids && item.ids.tmdb) out.ids = { tmdb: item.ids.tmdb };
  return out;
}
function slidesOf(rows) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row of rows) {
    for (const item of row.items) {
      if (out.length >= MAX_SLIDES) return out;
      if (seen.has(item.id) || !item.backdrop || !HTTPS.test(item.backdrop)) continue;
      const text = typeof item.overview === "string" ? item.overview.trim() : "";
      if (text === "") continue;
      seen.add(item.id);
      out.push({
        id: item.id,
        ref: item.ref,
        kind: item.kind,
        title: item.title,
        image: item.backdrop,
        ...item.ids && item.ids.tmdb ? { tmdb: item.ids.tmdb } : {},
        text: text.length <= MAX_SLIDE_TEXT ? text : `${text.slice(0, MAX_SLIDE_TEXT - 1).trimEnd()}\u2026`
      });
    }
  }
  return out;
}
function railsOf(rows) {
  return rows.filter((r) => r.items && r.items.length > 0).slice(0, MAX_RAILS).map((r) => ({
    id: r.id,
    title: r.title,
    ...r.ref ? { ref: r.ref } : {},
    items: r.items.slice(0, MAX_RAIL_ITEMS).map(cardOf)
  }));
}
function tabOf(page) {
  const rows = page && Array.isArray(page.rows) ? page.rows : [];
  const rails = railsOf(rows);
  if (rails.length === 0) return null;
  return { slides: slidesOf(rows), rails };
}
function playedKey(ref) {
  const m = /^(?:m|s|e):(\d{1,10})(?::|$)/.exec(String(ref || ""));
  return m ? `t:${m[1]}` : String(ref || "");
}
function recentOf(keys2, tabs) {
  if (keys2.length === 0) return [];
  const byKey = /* @__PURE__ */ new Map();
  for (const data of tabs) {
    for (const rail2 of data.rails) {
      for (const card of rail2.items) {
        const ks = [card.ref];
        if (card.ids && card.ids.tmdb) ks.push(`t:${card.ids.tmdb}`);
        for (const k of ks) if (!byKey.has(k)) byKey.set(k, card);
      }
    }
  }
  const out = [];
  const used2 = /* @__PURE__ */ new Set();
  for (const key of keys2) {
    const card = byKey.get(key);
    if (card && !used2.has(card.id)) {
      used2.add(card.id);
      out.push(card);
    }
  }
  return out;
}

// logo-bar.png
var logo_bar_default = "data:image/png;base64,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";

// src/browse/logo.js
var logoNode = () => ({
  type: "Row",
  key: "logo",
  gap: 12,
  crossAxisAlignment: "center",
  children: [
    {
      type: "Image",
      key: "logoIcon",
      url: logo_bar_default,
      aspect: "1:1",
      fit: "contain",
      h: 32,
      width: 32,
      alt: "Cinejoy",
      altEn: "Cinejoy",
      fallback: { type: "Icon", name: "movie" }
    },
    { type: "Text", key: "logoText", text: "Cinejoy", textEn: "Cinejoy", style: "h4", bold: true }
  ]
});

// src/browse/share.js
var SOCIAL_REPO = "kinotvapp/kino-social";
var ALIAS = "social";
var MAX_TEXT = 500;
var SHEET = "shareSheet";
var twin = (key, field = "text", vars) => {
  const w = both(key, vars);
  return { [field]: w.es, [field + "En"]: w.en };
};
function shareArgOf({ kind, tmdb: tmdb2, title }) {
  return JSON.stringify({ k: kind === "movie" ? "movie" : "series", d: Number(tmdb2) || 0, t: String(title || "").slice(0, 100) });
}
function shareTitleOf(arg) {
  let a = null;
  try {
    a = JSON.parse(String(arg));
  } catch (_) {
    a = null;
  }
  if (!a || a.k !== "movie" && a.k !== "series" || !(Number(a.d) > 0)) return null;
  return { kind: a.k, tmdb: Number(a.d), title: typeof a.t === "string" ? a.t.slice(0, 100) : "" };
}
function openShare(arg) {
  const title = shareTitleOf(arg);
  return {
    state: { share: title, inputs: { shareText: title && title.title ? t("shWatching", { t: title.title }) : "", shareTitle: !!title } },
    ui: [{ open: SHEET }]
  };
}
function shareSheet(share) {
  return {
    type: "BottomSheet",
    key: SHEET,
    ...twin("shSheet", "title"),
    children: [{ type: "Form", key: "shareForm", onSubmitted: { event: "sendShare", timeoutMs: 15e3 }, gap: 12, children: [
      { type: "TextField", key: "shareText", multiline: true, maxLines: 6, maxLength: MAX_TEXT, ...twin("shText", "labelText") },
      ...share ? [{ type: "Switch", key: "shareTitle", ...twin("shAttach", "labelText"), value: true }] : [],
      { type: "Text", ...twin("shNote"), style: "caption", color: "muted" },
      { type: "ElevatedButton", key: "shareSend", icon: "send", ...twin("shSend", "labelText"), submit: true }
    ] }]
  };
}
var toast = (key) => {
  const w = both(key);
  return { toast: w.es, toastEn: w.en };
};
async function sendShare(values, share) {
  const v = values && typeof values === "object" ? values : {};
  const text = String(v.shareText || "").trim().slice(0, MAX_TEXT);
  const withTitle = !!share && v.shareTitle !== false && v.shareTitle !== "false";
  if (!text && !withTitle) return toast("shEmpty");
  if (typeof kino.plugins !== "object" || !kino.plugins || typeof kino.plugins.call !== "function") return toast("shOldKino");
  const arg = { from: "Cinejoy", ...text ? { text } : {}, ...withTitle ? { title: { kind: share.kind, tmdb: share.tmdb } } : {} };
  try {
    await kino.plugins.call(ALIAS, "share", arg);
    return { ui: [{ close: SHEET }], state: { share: null }, ...toast("shDone") };
  } catch (e) {
    const code = e && e.code;
    try {
      kino.log("[cinejoy] share", code || "error");
    } catch (_) {
    }
    if (code === "provider_missing") return { ui: [{ close: SHEET }], go: { installPlugin: { repo: SOCIAL_REPO } }, ...toast("shMissing") };
    if (code === "not_declared") return toast("shOldKino");
    return toast("shFailed");
  }
}
var shareBarButton = () => ({
  type: "IconButton",
  key: "shareButton",
  icon: "share",
  ...twin("shShare", "labelText"),
  ...twin("shShare", "tooltip"),
  onPressed: { event: "openShare", arg: "" }
});

// src/browse/detail.js
var HTTPS2 = /^https:\/\//;
var MAX_EPISODES = 80;
var MAX_CAST = 12;
var LEAD_MAX = 140;
var TMDB_IMG = "https://image.tmdb.org/t/p/";
var twin2 = (key, field = "text", vars) => {
  const w = both(key, vars);
  return { [field]: w.es, [field + "En"]: w.en };
};
var same = (text) => ({ text, textEn: text });
var num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
var https = (v) => typeof v === "string" && HTTPS2.test(v) && v.length <= 2048 ? v : void 0;
var tmdbLang2 = () => langOf() === "en" ? "en-US" : "es-MX";
var opensPage = (card) => !!card && (card.kind === "movie" || card.kind === "series") && typeof card.id === "string" && !!parseTitleRef(card.ref) && parseTitleRef(card.ref).kind !== "episode";
var cardNode = (card, size, scope) => ({
  type: "titleCard",
  key: `${scope}-${card.id}`,
  size,
  item: card,
  ...opensPage(card) ? { onTap: { event: "openTitle", arg: JSON.stringify(openArgs(card)) } } : {}
});
var cardRow = (items, key, size) => ({ type: "SingleChildScrollView", key: key + "-s", direction: "horizontal", children: [{ type: "Row", key: key + "-r", gap: 12, children: items.map((c) => cardNode(c, size, key)) }] });
var cardGrid = (items, key) => ({ type: "GridView", key, columns: { compact: 3, expanded: 6 }, children: items.map((c) => cardNode(c, "medium", key)) });
function openArgs(card) {
  const r = parseTitleRef(card.ref);
  const tmdb2 = r ? r.id : card.ids && Number.isInteger(card.ids.tmdb) ? card.ids.tmdb : 0;
  const year = card.year ? num(card.year) : 0;
  return { open: card.ref, i: card.id, t: String(card.title || "").slice(0, 100), k: card.kind, ...tmdb2 ? { d: tmdb2 } : {}, ...year ? { y: year } : {} };
}
function pushOf(arg) {
  let a = null;
  try {
    a = JSON.parse(String(arg));
  } catch (_) {
    a = null;
  }
  if (!a || typeof a.open !== "string" || typeof a.i !== "string" || a.k !== "movie" && a.k !== "series") return null;
  return { push: "detail", params: { open: a.open, i: a.i, t: typeof a.t === "string" ? a.t.slice(0, 100) : "", k: a.k, d: Number(a.d) || 0, y: Number(a.y) || 0 } };
}
function backdropsOf(images, first) {
  const list = (images && images.backdrops || []).filter((b) => b && typeof b.file_path === "string" && b.file_path.startsWith("/") && b.width >= 1e3).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).map((b) => TMDB_IMG + "w780" + b.file_path);
  const out = [];
  for (const u of [first, ...list]) if (u && !out.some((x) => x.slice(x.lastIndexOf("/")) === u.slice(u.lastIndexOf("/")))) out.push(u);
  return out.slice(0, 6);
}
var hoursOf = (min) => {
  const m = num(min);
  return m > 0 ? m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min` : "";
};
var MONTHS = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
var dateText = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 ? { es: `${d} ${MONTHS.es[m - 1]} ${y}`, en: `${MONTHS.en[m - 1]} ${d}, ${y}` } : { es: iso, en: iso };
};
async function loadDetail(args) {
  const kind = args.k === "movie" ? "movie" : "series";
  const tmdbId = Number(args.d) || 0;
  if (!tmdbId) throw Object.assign(new Error("no tmdb id"), { code: "not_found" });
  const tv = kind === "movie" ? "movie" : "tv";
  const x = await kino.tmdb(`/${tv}/${tmdbId}`, {
    language: tmdbLang2(),
    append_to_response: "credits,images,recommendations," + (kind === "movie" ? "release_dates" : "content_ratings"),
    include_image_language: "null,es,en,ja"
  });
  const cert = kind === "movie" ? ((x.release_dates && x.release_dates.results || []).find((r) => r.iso_3166_1 === "MX" || r.iso_3166_1 === "US")?.release_dates || []).map((r) => r.certification).find(Boolean) : ((x.content_ratings && x.content_ratings.results || []).find((r) => r.iso_3166_1 === "MX") || (x.content_ratings && x.content_ratings.results || []).find((r) => r.iso_3166_1 === "US") || {}).rating;
  const backdrop = typeof x.backdrop_path === "string" ? TMDB_IMG + "w780" + x.backdrop_path : void 0;
  const d = {
    kind,
    title: String(x.title || x.name || args.t || "").slice(0, 200),
    overview: String(x.overview || ""),
    year: num(String(x.release_date || x.first_air_date || "").slice(0, 4)),
    backdrop,
    genres: (x.genres || []).map((g) => g && g.name).filter((g) => typeof g === "string").slice(0, 4),
    runtime: kind === "movie" ? num(x.runtime) : 0,
    tagline: String(x.tagline || ""),
    certification: String(cert || "").slice(0, 8),
    directors: (kind === "movie" ? (x.credits && x.credits.crew || []).filter((c) => c.job === "Director").map((c) => c.name) : (x.created_by || []).map((c) => c.name)).filter(Boolean).slice(0, 3),
    ratings: typeof x.vote_average === "number" && x.vote_count > 20 ? [{ source: "tmdb", value: (Math.round(x.vote_average * 10) / 10).toFixed(1) }] : [],
    cast: (x.credits && x.credits.cast || []).filter((c) => c && c.name).slice(0, MAX_CAST).map((c) => ({
      name: String(c.name),
      character: String(c.character || ""),
      photo: typeof c.profile_path === "string" && c.profile_path.startsWith("/") ? TMDB_IMG + "w185" + c.profile_path : void 0
    })),
    images: backdropsOf(x.images, backdrop),
    similar: (x.recommendations && x.recommendations.results || []).filter((m) => m && m.id && (m.title || m.name) && m.poster_path && !m.adult).slice(0, 12).map((m) => ({
      id: (kind === "movie" ? "m-" : "s-") + m.id,
      ref: (kind === "movie" ? "m:" : "s:") + m.id,
      kind,
      title: String(m.title || m.name).slice(0, 200),
      poster: TMDB_IMG + "w342" + m.poster_path,
      ids: { tmdb: m.id }
    })),
    episodes: []
  };
  if (kind === "series") {
    const eps = await seriesEpisodes(tmdbId).then((r) => r.episodes).catch(() => []);
    d.episodes = eps.slice(0, 1200).map((e) => ({
      s: num(e.season),
      n: num(e.number),
      title: String(e.title || "").slice(0, 120),
      overview: String(e.overview || "").slice(0, 110),
      still: https(e.still),
      air: e.airDate || ""
    }));
  }
  if (typeof kino.meta === "function") {
    try {
      const meta = await kino.meta({ type: kind, ids: { tmdb: tmdbId } });
      if (meta && https(meta.logo)) d.logo = https(meta.logo);
    } catch (_) {
    }
  }
  return d;
}
var heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var railSkeleton = () => ({
  type: "Column",
  key: "dskel1",
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `dsk${i}`, flex: 1 })) }
  ]
});
var sectionTitle = (key) => ({ type: "Text", ...twin2(key), style: "h4" });
var episodeGo = (d, r) => ({ go: { title: { ref: r.ref, kind: "series", id: r.id, title: d.title } } });
function episodeRow(d, r, ep) {
  const facts = ep.air ? dateText(ep.air) : null;
  const heading = ep.title ? { text: `${ep.n}. ${ep.title}`, textEn: `${ep.n}. ${ep.title}` } : twin2("dEpisodeN", "text", { n: ep.n });
  return {
    type: "Row",
    key: `ep-${ep.s}-${ep.n}`,
    gap: 12,
    crossAxisAlignment: "center",
    onTap: episodeGo(d, r),
    canRequestFocus: true,
    children: [
      { type: "Image", key: `epi-${ep.s}-${ep.n}`, width: 120, aspect: "16:9", fit: "cover", radius: "medium", ...ep.still ? { url: ep.still } : {}, fallback: { type: "Skeleton", shape: "block", height: 64 } },
      { type: "Column", flex: 1, gap: 4, children: [
        { type: "Text", bold: true, maxLines: 2, ...heading },
        ...facts ? [{ type: "Text", style: "caption", color: "muted", text: facts.es, textEn: facts.en }] : [],
        ...ep.overview ? [{ type: "Text", style: "caption", color: "muted", maxLines: 2, ...same(ep.overview) }] : []
      ] }
    ]
  };
}
function castItem(c) {
  const name = String(c.name || "").slice(0, 60);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    type: "Column",
    key: "cast-" + name.replace(/[^A-Za-z0-9]/g, "").slice(0, 24) + "-" + String(c.character || "").length,
    width: 96,
    gap: 4,
    crossAxisAlignment: "center",
    canRequestFocus: true,
    children: [
      { type: "CircleAvatar", radius: 32, ...https(c.photo) ? { image: https(c.photo) } : {}, text: initials, textEn: initials },
      { type: "Text", ...same(name), style: "caption", maxLines: 2 },
      ...c.character ? [{ type: "Text", ...same(String(c.character).slice(0, 40)), style: "caption", color: "muted", maxLines: 1 }] : []
    ]
  };
}
function detailView({ r, entry, season, logo, back, sheet = null }) {
  const d = entry && entry.d;
  const appBar = { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: back, title: logo };
  const body = [];
  let hero2 = null;
  if (!entry) {
    hero2 = heroSkeleton();
    body.push(railSkeleton());
  } else if (!d) {
    body.push({ type: "MaterialBanner", key: "detailFailed", role: "error", ...twin2("brFailed"), action: { ...twin2("brRetry", "label"), onTap: "dretry" } });
    body.push({ type: "ElevatedButton", key: "dkino", icon: "play", ...twin2("dSeeInKino", "labelText"), onPressed: { go: { title: { ref: r.ref, kind: r.kind, id: r.id, title: r.title } } } });
  } else {
    const series = d.kind === "series";
    const seasons = [...new Set(d.episodes.map((e) => e.s))].sort((a, b) => a - b);
    const shown = seasons.includes(season) ? season : seasons[0];
    const toKino = { go: { title: { ref: r.ref, kind: d.kind, id: r.id, title: r.title || d.title } } };
    const tmdb2 = (parseTitleRef(r.ref) || {}).id;
    const share = tmdb2 ? [{
      type: "TextButton",
      key: "dshare",
      icon: "share",
      ...twin2("shShare", "labelText"),
      onPressed: { event: "openShare", arg: shareArgOf({ kind: d.kind, tmdb: tmdb2, title: d.title }) }
    }] : [];
    const buttons = series ? [{ type: "ElevatedButton", key: "dplay", ...twin2("dSeriesGo", "labelText"), icon: "play", autofocus: true, onPressed: toKino }, ...share] : [
      { type: "ElevatedButton", key: "dplay", ...twin2("brWatch", "labelText"), icon: "play", autofocus: true, onPressed: { go: { play: { ref: r.ref, kind: "movie", id: r.id, title: d.title } } } },
      { type: "TextButton", key: "dmore", ...twin2("dMore", "labelText"), onPressed: toKino },
      ...share
    ];
    const lead = d.tagline || (d.overview.length <= LEAD_MAX ? d.overview : d.overview.slice(0, LEAD_MAX - 1).trimEnd() + "\u2026");
    const images = (d.images && d.images.length ? d.images : [d.backdrop || ""]).slice(0, 6);
    const slide = (image, i) => ({
      type: "heroCard",
      key: i ? "dhero-" + i : "dhero",
      h: { compact: 240, expanded: 320 },
      title: d.title,
      titleEn: d.title,
      ...lead ? same(lead) : {},
      ...image ? { image } : {},
      ...d.logo ? { logo: d.logo } : {},
      buttons: i ? buttons.map((b) => ({ ...b, key: b.key + "-" + i, autofocus: false })) : buttons
    });
    hero2 = images.length > 1 ? { type: "PageView", key: "hero" + images.length, autoPlayMs: 6e3, children: images.map(slide) } : slide(images[0], 0);
    const rating = d.ratings.find((x) => x.source === "imdb") || d.ratings.find((x) => x.source === "tmdb");
    const facts = [];
    if (rating) facts.push("\u2605 " + rating.value);
    if (d.year) facts.push(String(d.year));
    if (d.certification) facts.push(d.certification);
    if (d.runtime) facts.push(hoursOf(d.runtime));
    const seasonsText = seasons.length === 1 ? both("dSeasonOne") : both("dSeasonsN", { n: seasons.length });
    const es = facts.concat(series && seasons.length ? [seasonsText.es] : []);
    const en = facts.concat(series && seasons.length ? [seasonsText.en] : []);
    if (es.length) body.push({ type: "Text", key: "dfacts", style: "h4", text: es.join("  \xB7  "), textEn: en.join("  \xB7  ") });
    if (d.genres.length) body.push({ type: "Row", key: "dgenres", gap: 8, children: d.genres.map((g, i) => ({ type: "Badge", key: "dg-" + i, ...same(g) })) });
    if (d.overview) body.push({ type: "Text", key: "dsynopsis", canRequestFocus: true, ...same(d.overview) });
    if (d.directors.length) body.push({ type: "Text", ...twin2(series ? "dCreators" : "dDirector", "text", { v: d.directors.join(", ") }), color: "muted" });
    if (d.cast.length) {
      body.push(sectionTitle("dCast"));
      body.push({ type: "SingleChildScrollView", key: "dcast", direction: "horizontal", children: [{ type: "Row", gap: 12, children: d.cast.map(castItem) }] });
    }
    if (series && seasons.length) {
      body.push(seasons.length > 1 ? { type: "DropdownButton", key: "dseason", value: String(shown), onChanged: "season", options: seasons.map((s) => {
        const w = both("dSeasonN", { n: s });
        return { value: String(s), label: w.es, labelEn: w.en };
      }) } : sectionTitle("dEpisodes"));
      for (const ep of d.episodes.filter((e) => e.s === shown).slice(0, MAX_EPISODES)) body.push(episodeRow(d, r, ep));
    }
    if (d.similar.length) {
      body.push(sectionTitle("dSimilar"));
      body.push(cardRow(d.similar, "dsimilar", "small"));
    }
  }
  return {
    type: "Scaffold",
    appBar,
    body: { type: "Column", key: "detail-wrap", flex: 1, children: [
      { type: "SingleChildScrollView", key: "detail-page", flex: 1, children: [...hero2 ? [hero2] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
      ...sheet ? [sheet] : []
    ] },
    ...!entry ? { every: { ms: 1e3, event: "dtick" } } : {}
  };
}

// src/browse/view.js
var POLL_MS = 1500;
var SEARCH_CAP = 60;
var tabBar = (active) => ({
  type: "TabBar",
  key: "tabs",
  divider: false,
  value: active,
  onChanged: "tab",
  tabs: TAB_IDS.map((id) => {
    const w = tabLabel(id);
    return { value: id, label: w.es, labelEn: w.en };
  })
});
var railSkeleton2 = (n) => ({
  type: "Column",
  key: "skel" + n,
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, sizes: ["compact"], children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}c${i}`, flex: 1 })) },
    { type: "Row", gap: 12, sizes: ["medium", "expanded"], children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}w${i}`, flex: 1 })) }
  ]
});
var gridSkeleton = () => ({
  type: "Column",
  key: "gridSkeleton",
  gap: 12,
  children: [
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["compact"], key: `gc${r}`, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `gc${r}-${i}`, flex: 1 })) })),
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["medium", "expanded"], key: `gw${r}`, children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `gw${r}-${i}`, flex: 1 })) }))
  ]
});
var heroSkeleton2 = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var slideNode = (s) => ({
  type: "heroCard",
  key: "slide-" + s.id,
  h: { compact: 200, expanded: 240 },
  ...s.logo ? { logo: s.logo } : {},
  title: s.title,
  text: s.text,
  image: s.image,
  buttons: [
    s.kind === "movie" ? { type: "ElevatedButton", key: "watch-" + s.id, ...twin2("brWatch", "labelText"), icon: "play", onPressed: { go: { play: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } } : { type: "ElevatedButton", key: "watch-" + s.id, ...twin2("dSeriesGo", "labelText"), icon: "play", onPressed: { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } },
    { type: "TextButton", key: "info-" + s.id, ...twin2("brInfo", "labelText"), onPressed: { event: "openTitle", arg: JSON.stringify(openArgs({ ...s, ids: s.tmdb ? { tmdb: s.tmdb } : void 0 })) } }
  ]
});
var hero = (slides) => slides.length === 1 ? slideNode(slides[0]) : {
  type: "PageView",
  key: "hero" + slides.length,
  autoPlayMs: 6e3,
  children: slides.map(slideNode)
};
var rail = (r, key, titleOverride) => ({
  type: "Column",
  key,
  gap: 8,
  children: [
    { type: "Row", key: key + "-h", crossAxisAlignment: "center", children: [
      { type: "Text", style: "h4", flex: 1, text: titleOverride ? titleOverride.title : r.title, textEn: titleOverride ? titleOverride.titleEn : r.title },
      ...r.ref ? [{ type: "TextButton", key: key + "-more", ...twin2("brMore", "labelText"), onPressed: { go: { browse: { ref: r.ref, title: r.title } } } }] : []
    ] },
    cardRow(r.items, key, "medium")
  ]
});
var backButton = () => ({ type: "IconButton", key: "back", icon: "arrow_back", ...twin2("brBack", "labelText"), ...twin2("brBack", "tooltip"), onPressed: "back" });
function browseView({ tab, data, recent, pending, failed, device = "phone", share = null }) {
  const tv = device === "tv";
  const gear = { type: "IconButton", key: "settingsButton", icon: "settings", ...twin2("brSettings", "labelText"), ...twin2("brSettings", "tooltip"), onPressed: { event: "go", arg: "settings" } };
  const active = TAB_IDS.includes(tab) ? tab : TAB_IDS[0];
  const body = [];
  if (data) {
    if (data.slides.length > 0) body.push(hero(data.slides));
    if (recent.length > 0) body.push(rail({ items: recent }, "recent", twin2("brRecent", "title")));
    for (const r of data.rails) body.push(rail(r, "rail-" + String(r.id).replace(/[^A-Za-z0-9_-]/g, "_")));
    if (data.rails.length === 0) body.push({ type: "Text", ...twin2("brEmpty", "text"), color: "muted" });
  } else if (failed) {
    body.push({ type: "MaterialBanner", key: "loadFailed", role: "error", ...twin2("brFailed"), action: { ...twin2("brRetry", "label"), onTap: "retry" } });
  } else {
    body.push(heroSkeleton2(), railSkeleton2(1), railSkeleton2(2), railSkeleton2(3));
  }
  const isBanner = (n) => !!n && (n.type === "heroCard" || n.key === "heroSkeleton" || n.type === "PageView" && String(n.key).startsWith("hero"));
  const banner = body.length > 0 && isBanner(body[0]) ? body.shift() : null;
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      // One bar instead of two (Kino 0.9.81+): the close button where Kino's was and the plugin's logo where its name was.
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin2("brClose", "labelText"), ...twin2("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
      // Share (text only, to Kino Social), then settings; on a TV search leads.
      actions: tv ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin2("brSearch", "labelText"), ...twin2("brSearch", "tooltip"), onPressed: "openSearch" }, shareBarButton(), gear] : [shareBarButton(), gear],
      // On a TV the tabs sit in the bar beside the logo (one D-pad strip); elsewhere they are pinned under it.
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [logoNode(), tabBar(active)] } : logoNode()
    },
    ...tv ? {} : { floatingActionButton: { type: "FloatingActionButton", key: "searchFab", icon: "search", ...twin2("brSearch", "tooltip"), onPressed: "openSearch" } },
    // The tabs stay pinned under the bar; only the rows scroll.
    body: { type: "Column", key: "page", children: [
      ...tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(active)] }],
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [...banner ? [banner] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
      shareSheet(share)
    ] },
    ...pending ? { every: { ms: POLL_MS, event: "tick" } } : {}
  };
}
function settingsView() {
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: backButton(), title: logoNode() },
    body: { type: "SingleChildScrollView", key: "settings-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: [{ type: "settings", key: "form" }] }] }
  };
}
function searchView({ query, status, items, history = [], device = "phone" }) {
  const tv = device === "tv";
  const searchForm = () => ({
    type: "Form",
    key: "searchForm",
    onSubmitted: "search",
    gap: 8,
    children: tv ? [{ type: "Row", key: "searchRow", gap: 16, crossAxisAlignment: "center", children: [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin2("brSearchHint", "labelText"), maxLength: 100, autofocus: true, weight: 1 },
      { type: "ElevatedButton", key: "searchGo", ...twin2("brSearch", "labelText"), icon: "search", submit: true }
    ] }] : [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin2("brSearchHint", "labelText"), maxLength: 100, autofocus: true },
      { type: "ElevatedButton", key: "searchGo", ...twin2("brSearch", "labelText"), icon: "search", submit: true }
    ]
  });
  const body = tv ? [] : [searchForm()];
  if (status === "fail") {
    body.push({ type: "MaterialBanner", key: "searchFailed", role: "error", ...twin2("brSearchFailed"), action: { ...twin2("brRetry", "label"), onTap: "sretry" } });
  } else if (status === "done" && items) {
    if (items.length === 0) body.push({ type: "Text", ...twin2("brNoResults", "text"), color: "muted" });
    else body.push(cardGrid(items.slice(0, SEARCH_CAP), "results"));
  } else if (status !== "idle") {
    body.push(gridSkeleton());
  } else if (history.length > 0) {
    body.push({ type: "Text", ...twin2("brSearchedBefore", "text"), style: "h4" });
    body.push(cardGrid(history.slice(0, SEARCH_CAP), "history"));
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: backButton(),
      ...tv ? { title: searchForm() } : twin2("brSearchTitle", "title")
    },
    body: { type: "SingleChildScrollView", key: "search-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...status === "loading" ? { every: { ms: 1e3, event: "stick" } } : {}
  };
}
function detailPage({ r, entry, season, share = null }) {
  return detailView({ r, entry, season, logo: logoNode(), back: backButton(), sheet: shareSheet(share) });
}

// src/browse/logos.js
var KEY = "logo1";
var MAX = 120;
var CALL_MS = 8e3;
var HTTPS3 = /^https:\/\//;
function makeLogoCache({ kino: kino2, clock = { now: () => Date.now() } }) {
  const usable = () => {
    try {
      return typeof kino2.meta === "function";
    } catch (_) {
      return false;
    }
  };
  let book = null;
  function read2() {
    if (book) return book;
    try {
      const o = JSON.parse(kino2.storage.get(KEY) || "null");
      book = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (_) {
      book = {};
    }
    return book;
  }
  function write2() {
    try {
      const ids = Object.keys(book);
      if (ids.length > MAX) for (const id of ids.slice(0, ids.length - MAX)) delete book[id];
      kino2.storage.set(KEY, JSON.stringify(book));
    } catch (_) {
    }
  }
  function logoOf(id) {
    const l = read2()[id];
    return typeof l === "string" && HTTPS3.test(l) ? l : void 0;
  }
  async function fill2(slides, budgetMs) {
    if (!usable()) return 0;
    const b = read2();
    const end = clock.now() + budgetMs;
    let asked = 0;
    for (const s of slides) {
      if (clock.now() + CALL_MS > end) break;
      if (!s || typeof s.id !== "string" || !s.tmdb || Object.hasOwn(b, s.id)) continue;
      try {
        const a = await kino2.meta({ type: s.kind === "series" ? "series" : "movie", ids: { tmdb: s.tmdb } });
        b[s.id] = a && typeof a.logo === "string" ? a.logo : "";
      } catch (e) {
        if (e && e.code === "rate_limited") break;
        continue;
      }
      asked++;
    }
    if (asked > 0) write2();
    return asked;
  }
  return { logoOf, fill: fill2, usable };
}

// src/browse/index.js
var TAB_KEY = "browseTab";
var SNAP_PREFIX = "browse1:";
var SNAP_TTL_MS = 7 * 24 * 3600 * 1e3;
var HOME_KEY2 = "home1";
var SNAP_MAX = 20 * 1024;
var RECENT_KEY = "recent1";
var RECENT_MAX = 12;
var HIST_KEY = "searchHist1";
var HIST_MAX = 24;
function makeBrowse({ kino: kino2, loadTab, searchTitles: searchTitles2, keptTab = () => null }) {
  const logos = makeLogoCache({ kino: kino2 });
  const enrich = (data) => data ? { ...data, slides: data.slides.map((s) => {
    const l = logos.logoOf(s.id);
    return l ? { ...s, logo: l } : s;
  }) } : data;
  const memo = /* @__PURE__ */ new Map();
  const log = (...a) => {
    try {
      kino2.log("[cinejoy]", ...a);
    } catch (_) {
    }
  };
  const get = (k) => {
    try {
      return kino2.storage.get(k);
    } catch (_) {
      return null;
    }
  };
  const set = (k, v, opts) => setWithRoom(k, v, opts);
  function readSnap(tab) {
    try {
      const o = JSON.parse(get(SNAP_PREFIX + tab) || "null");
      return o && Date.now() - o.at < SNAP_TTL_MS && o.data && Array.isArray(o.data.rails) ? o.data : null;
    } catch (_) {
      return null;
    }
  }
  function writeSnap(tab, data) {
    for (let per = 12; per >= 3; per -= 3) {
      const slim2 = { slides: data.slides, rails: data.rails.map((r) => ({ ...r, items: r.items.slice(0, per) })) };
      const text = JSON.stringify({ at: Date.now(), data: slim2 });
      if (text.length <= SNAP_MAX) {
        set(SNAP_PREFIX + tab, text, { ttlMs: SNAP_TTL_MS });
        return;
      }
    }
  }
  function keptSeed(tab) {
    try {
      return tabOf(keptTab(tab));
    } catch (_) {
      return null;
    }
  }
  function homeSeed(tab) {
    if (tab !== "inicio") return null;
    try {
      const o = JSON.parse(get(HOME_KEY2) || "null");
      return o && Array.isArray(o.rows) && o.rows.length ? tabOf({ rows: o.rows }) : null;
    } catch (_) {
      return null;
    }
  }
  const stored = () => {
    const t2 = get(TAB_KEY);
    return TAB_IDS.includes(t2) ? t2 : null;
  };
  const remember = (tab) => set(TAB_KEY, tab);
  function dataOf(tab) {
    if (memo.has(tab)) return memo.get(tab).data;
    const snap = readSnap(tab) || keptSeed(tab) || homeSeed(tab);
    if (snap) {
      memo.set(tab, { data: snap, whole: false });
      return snap;
    }
    return null;
  }
  const readKeys = () => {
    try {
      const a = JSON.parse(get(RECENT_KEY) || "[]");
      return Array.isArray(a) ? a.filter((k) => typeof k === "string") : [];
    } catch (_) {
      return [];
    }
  };
  function notePlayed(ref) {
    try {
      const key = playedKey(ref);
      if (key === "" || key.startsWith("x:")) return;
      const keys2 = readKeys();
      if (keys2[0] === key) return;
      set(RECENT_KEY, JSON.stringify([key, ...keys2.filter((k) => k !== key)].slice(0, RECENT_MAX)));
    } catch (_) {
    }
  }
  const slim = (c) => ({ id: c.id, ref: c.ref, title: c.title, kind: c.kind, ...c.poster ? { poster: c.poster } : {}, ...c.ids ? { ids: c.ids } : {}, ...c.year ? { year: c.year } : {} });
  function readHistory() {
    try {
      const a = JSON.parse(get(HIST_KEY) || "[]");
      return Array.isArray(a) ? a.filter((c) => c && typeof c.id === "string" && typeof c.ref === "string" && typeof c.title === "string").slice(0, HIST_MAX) : [];
    } catch (_) {
      return [];
    }
  }
  function rememberFound(cards) {
    try {
      const fresh = cards.slice(0, 12).map(slim);
      const ids = new Set(fresh.map((c) => c.id));
      set(HIST_KEY, JSON.stringify([...fresh, ...readHistory().filter((c) => !ids.has(c.id))].slice(0, HIST_MAX)));
    } catch (_) {
    }
  }
  let found = null;
  const details2 = /* @__PURE__ */ new Map();
  const paramsOf = (route) => route && route.params && typeof route.params === "object" ? route.params : {};
  const tabFromArgs = (route) => {
    const a = route && route.args && typeof route.args === "object" ? route.args : {};
    return TAB_IDS.includes(a.tab) ? a.tab : null;
  };
  function needed(tab, device) {
    const order = [tab, ...TAB_IDS.filter((t2) => t2 !== tab)];
    return order.filter((t2, i) => (i === 0 || device !== "tv") && !(memo.get(t2) && memo.get(t2).whole));
  }
  function view(ctx) {
    const st = ctx.state && typeof ctx.state === "object" ? ctx.state : {};
    if (ctx.route && ctx.route.name === "settings") return settingsView();
    if (ctx.route && ctx.route.name === "detail") {
      const p = paramsOf(ctx.route);
      if (typeof p.open === "string" && typeof p.i === "string") {
        return detailPage({ r: { ref: p.open, id: p.i, kind: p.k === "movie" ? "movie" : "series", title: typeof p.t === "string" ? p.t : "" }, entry: details2.get(p.open) || null, season: Number(st.season) || 0, share: st.share || null });
      }
    }
    if (ctx.route && ctx.route.name === "search") {
      const query = typeof st.sq === "string" ? st.sq : "";
      const items = found && found.q === query ? found.items : null;
      const status = query === "" ? "idle" : st.sstate === "fail" ? "fail" : items ? "done" : "loading";
      return searchView({ query, status, items, history: query === "" ? readHistory() : [], device: ctx.device });
    }
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(ctx.route) ?? stored() ?? TAB_IDS[0];
    const data = enrich(dataOf(tab));
    const loaded = TAB_IDS.map((t2) => memo.get(t2)).filter(Boolean).map((m) => m.data);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    return browseView({ tab, data, recent: recentOf(readKeys(), loaded), pending, failed: !!(st.failed && st.failed[tab]), device: ctx.device, share: st.share || null });
  }
  async function load(tab) {
    const page = await loadTab(tab);
    const data = tabOf(page);
    if (data) {
      memo.set(tab, { data, whole: true });
      writeSnap(tab, data);
    }
    return data !== null;
  }
  const events = {
    open({ route, state, device }) {
      const tab = tabFromArgs(route) ?? (TAB_IDS.includes(state.tab) ? state.tab : stored() ?? TAB_IDS[0]);
      for (const t2 of TAB_IDS) dataOf(t2);
      const out = { state: { tab, pending: needed(tab, device), failed: null } };
      const a = route && route.args && typeof route.args === "object" ? route.args : {};
      if (typeof a.open === "string" && typeof a.i === "string" && (a.k === "movie" || a.k === "series")) {
        out.route = { push: "detail", params: { open: a.open, i: a.i, t: typeof a.t === "string" ? a.t.slice(0, 100) : "", k: a.k, d: Number(a.d) || 0, y: Number(a.y) || 0 } };
        out.state.season = null;
      }
      return out;
    },
    // A card of the list was tapped: its page goes over the list.
    openTitle({ arg }) {
      const route = pushOf(arg);
      return route ? { route, state: { season: null } } : null;
    },
    // The page's timer: loads the title once, then no timer.
    async dtick({ route }) {
      const p = paramsOf(route);
      if (typeof p.open !== "string" || details2.has(p.open)) return { state: { dv: Date.now() } };
      try {
        details2.set(p.open, { d: await loadDetail({ t: p.t, k: p.k, d: p.d, y: p.y }) });
      } catch (e) {
        log("browse detail", e && e.code || "error");
        details2.set(p.open, { d: null });
      }
      return { state: { dv: Date.now() } };
    },
    dretry({ route }) {
      details2.delete(paramsOf(route).open);
      return { state: { dv: Date.now() } };
    },
    season({ value, arg }) {
      const n = parseInt(value != null ? value : arg, 10);
      return n > 0 ? { state: { season: n } } : null;
    },
    tab({ value, arg, state }) {
      const tab = TAB_IDS.includes(value) ? value : TAB_IDS.includes(arg) ? arg : null;
      if (!tab) return null;
      remember(tab);
      dataOf(tab);
      const failed = { ...state.failed || {} };
      delete failed[tab];
      const pending = [tab, ...Array.isArray(state.pending) ? state.pending.filter((t2) => t2 !== tab) : []];
      return { state: { tab, pending: memo.get(tab) && memo.get(tab).whole ? pending.slice(1) : pending, failed } };
    },
    retry({ state, device }) {
      const tab = TAB_IDS.includes(state.tab) ? state.tab : TAB_IDS[0];
      return { state: { failed: null, pending: [tab, ...needed(tab, device).filter((t2) => t2 !== tab)] } };
    },
    async tick({ state }) {
      const pending = Array.isArray(state.pending) ? state.pending : [];
      if (pending.length === 0) return null;
      const [next, ...rest] = pending;
      const failed = { ...state.failed || {} };
      if (next.startsWith("logo:")) {
        const m = memo.get(next.slice(5));
        if (m) await logos.fill(m.data.slides, 12e3);
        return { state: { pending: rest } };
      }
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
        if (ok && logos.usable()) rest.unshift("logo:" + next);
      } catch (e) {
        log("browse tab", e && e.code || "error");
        failed[next] = true;
      }
      return { state: { pending: rest, failed } };
    },
    // The search button: straight to the search page, empty and ready for the words.
    openSearch() {
      return { route: { push: "search" }, state: { sq: "", sstate: null } };
    },
    search({ value, route }) {
      const q = value && typeof value.q === "string" ? value.q.trim().slice(0, 100) : "";
      if (q === "") return null;
      const state = { sq: q, sstate: "loading" };
      return route && route.name === "search" ? { state } : { route: { push: "search" }, state };
    },
    // The search page's timer: one search per press, then no timer.
    async stick({ state }) {
      const q = typeof state.sq === "string" ? state.sq : "";
      if (q === "" || state.sstate !== "loading") return null;
      try {
        const out = await searchTitles2(q);
        found = { q, items: (Array.isArray(out) ? out : []).slice(0, 60).map(cardOf) };
        rememberFound(found.items);
        return { state: { sstate: "done" } };
      } catch (e) {
        log("browse search", e && e.code || "error");
        return { state: { sstate: "fail" } };
      }
    },
    sretry({ state }) {
      return typeof state.sq === "string" && state.sq !== "" ? { state: { sstate: "loading" } } : null;
    },
    // Share to Kino Social: the sheet (from a title page with the title, from the bar text only), then its send.
    openShare({ arg }) {
      return openShare(arg);
    },
    // The form's fields come as the event's value; the screen's inputs hold them too (and are all an older Kino sends).
    sendShare({ value, state }) {
      const values = { ...state.inputs || {}, ...value && typeof value === "object" ? value : {} };
      return sendShare(values, state.share || null);
    },
    // The gear: the plugin's settings are a page of their own, one Back away.
    go({ arg }) {
      return arg === "settings" ? { route: { push: "settings" }, state: { fromBrowse: true } } : null;
    },
    back({ state, route }) {
      if (route && route.name === "settings" && !state.fromBrowse) return { close: true };
      return { route: { pop: true }, state: { sq: null, sstate: null } };
    }
  };
  async function event(ev) {
    const handler = Object.hasOwn(events, ev.name) ? events[ev.name] : null;
    return handler ? await handler({ ...ev, state: ev.state || {} }) ?? null : null;
  }
  return { view, event, notePlayed };
}

// src/plugin.js
var tmdbFailure = (e) => e && ["timeout", "network", "unavailable", "rate_limited"].includes(e.code) ? kino.error("unavailable", "tmdb: " + e.code, { userMessage: t("tmdbDown") }) : e;
async function search(query) {
  const q = typeof query === "string" ? query : query && query.q || "";
  let items;
  try {
    items = await searchTitles(kino.rank.shortQuery(q));
  } catch (e) {
    throw tmdbFailure(e);
  }
  const sorted = kino.rank.sortBySimilarity(items, q);
  const lean = query && (query.type === "movie" || query.type === "series") ? query.type : null;
  return lean ? [...sorted.filter((i) => i.kind === lean), ...sorted.filter((i) => i.kind !== lean)] : sorted;
}
async function home() {
  if (!readSettings().homeRows) return [];
  return homeRows();
}
async function browse(ref, cursor) {
  try {
    return await browsePage(ref, cursor);
  } catch (e) {
    throw tmdbFailure(e);
  }
}
async function section(arg) {
  return sectionPage(arg && arg.tab);
}
async function categories() {
  return categoryTiles();
}
async function episodes(ref) {
  const r = parseTitleRef(ref);
  if (!r || r.kind !== "series") throw kino.error("not_found", "not a series ref");
  try {
    return await seriesEpisodes(r.id);
  } catch (e) {
    throw tmdbFailure(e);
  }
}
async function details(ref) {
  const r = parseTitleRef(ref);
  if (!r || r.kind !== "movie") throw kino.error("not_found", "not a movie ref");
  try {
    return await movieInfo(r.id);
  } catch (e) {
    throw tmdbFailure(e);
  }
}
async function resolve(ref) {
  const out = await resolveRef(ref);
  try {
    browseScreen().notePlayed(String(ref));
  } catch (_) {
  }
  return out;
}
var browseInstance = null;
var browseScreen = () => browseInstance ?? (browseInstance = makeBrowse({
  kino,
  loadTab: (tab) => sectionPage(tab),
  keptTab: (tab) => TABS[tab] ? { rows: keptRows(TABS[tab]) } : null,
  searchTitles: (q) => search({ q })
}));
async function screen(ctx) {
  await null;
  return browseScreen().view(ctx && typeof ctx === "object" ? ctx : {});
}
async function screenEvent(ev) {
  await null;
  return browseScreen().event(ev && typeof ev === "object" ? ev : {});
}
function clearCache() {
  let n = clear();
  for (const key of kino.storage.keys()) {
    if (["browse1:", "home1", "logo1"].some((p) => key.startsWith(p))) {
      kino.storage.remove(key);
      n++;
    }
  }
  return { message: t("cacheCleared", { n }) };
}
async function action(key) {
  if (key === "clearCache") return clearCache();
  return null;
}
export {
  action,
  browse,
  categories,
  details,
  episodes,
  home,
  resolve,
  screen,
  screenEvent,
  search,
  section
};
