// The title page of the browse screen (route "detail"): a banner slider with the title's logo, the facts, the synopsis, the
// cast with photos, the seasons with their episodes and similar titles. A card, a slide or a result opens it through `openTitle`
// (a route push, so Back returns to the list). Kino's own page stays one press away ("Ver episodios" for a series, "Más
// opciones" for a movie): favourites, lists, downloads and the player's copies live there, and an episode opens it too,
// because a plugin screen cannot play a single episode by itself. Pure view of what index.js keeps, plus `loadDetail`.
import { both, langOf } from "../i18n.js";
import { parseTitleRef } from "../refs.js";
import { seriesEpisodes } from "../tmdb.js";
import { shareArgOf } from "./share.js";

const HTTPS = /^https:\/\//;
const MAX_EPISODES = 80;
const MAX_CAST = 12;
const LEAD_MAX = 140;
const TMDB_IMG = "https://image.tmdb.org/t/p/";

/** `key` in both languages as a node's twin texts: `{ [field]: Spanish, [field + "En"]: English }`. */
export const twin = (key, field = "text", vars) => {
  const w = both(key, vars);
  return { [field]: w.es, [field + "En"]: w.en };
};
const same = (text) => ({ text, textEn: text });
const num = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };
const https = (v) => (typeof v === "string" && HTTPS.test(v) && v.length <= 2048 ? v : undefined);
const tmdbLang = () => (langOf() === "en" ? "en-US" : "es-MX");

/** A card that opens the screen's own title page: a movie or a series with one of this plugin's refs. */
const opensPage = (card) => !!card && (card.kind === "movie" || card.kind === "series") && typeof card.id === "string"
  && !!parseTitleRef(card.ref) && parseTitleRef(card.ref).kind !== "episode";

/** One poster card; a movie or a series opens its page through the screen's `openTitle` event, anything else keeps Kino's page. */
export const cardNode = (card, size, scope) => ({
  type: "titleCard", key: `${scope}-${card.id}`, size, item: card,
  ...(opensPage(card) ? { onTap: { event: "openTitle", arg: JSON.stringify(openArgs(card)) } } : {}),
});

/** A horizontal row of poster cards under [key]. */
export const cardRow = (items, key, size) => ({ type: "SingleChildScrollView", key: key + "-s", direction: "horizontal", children: [{ type: "Row", key: key + "-r", gap: 12, children: items.map((c) => cardNode(c, size, key)) }] });

/** A grid of poster cards. */
export const cardGrid = (items, key) => ({ type: "GridView", key, columns: { compact: 3, expanded: 6 }, children: items.map((c) => cardNode(c, "medium", key)) });

/** What the page needs of a card: its ref and id, its name, kind and year, and its TMDB id. */
export function openArgs(card) {
  const r = parseTitleRef(card.ref);
  const tmdb = r ? r.id : card.ids && Number.isInteger(card.ids.tmdb) ? card.ids.tmdb : 0;
  const year = card.year ? num(card.year) : 0;
  return { open: card.ref, i: card.id, t: String(card.title || "").slice(0, 100), k: card.kind, ...(tmdb ? { d: tmdb } : {}), ...(year ? { y: year } : {}) };
}

/** The route push an `openTitle` event's arg asks for, or null. */
export function pushOf(arg) {
  let a = null;
  try { a = JSON.parse(String(arg)); } catch (_) { a = null; }
  if (!a || typeof a.open !== "string" || typeof a.i !== "string" || (a.k !== "movie" && a.k !== "series")) return null;
  return { push: "detail", params: { open: a.open, i: a.i, t: typeof a.t === "string" ? a.t.slice(0, 100) : "", k: a.k, d: Number(a.d) || 0, y: Number(a.y) || 0 } };
}

/** TMDB's backdrops of a title, best voted first: the banner becomes a slider when there is more than one. */
function backdropsOf(images, first) {
  const list = ((images && images.backdrops) || []).filter((b) => b && typeof b.file_path === "string" && b.file_path.startsWith("/") && b.width >= 1000)
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).map((b) => TMDB_IMG + "w780" + b.file_path);
  const out = [];
  for (const u of [first, ...list]) if (u && !out.some((x) => x.slice(x.lastIndexOf("/")) === u.slice(u.lastIndexOf("/")))) out.push(u);
  return out.slice(0, 6);
}

const hoursOf = (min) => {
  const m = num(min);
  return m > 0 ? (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min`) : "";
};

const MONTHS = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const dateText = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 ? { es: `${d} ${MONTHS.es[m - 1]} ${y}`, en: `${MONTHS.en[m - 1]} ${d}, ${y}` } : { es: iso, en: iso };
};

/**
 * What the page shows for [args] (`{ t: title, k: kind, d: TMDB id }`): TMDB's record in one call (facts, cast with photos,
 * backdrops, similar titles), the series' episodes, and the title's logo from Kino (kino.meta) when it has one. Throws when TMDB
 * does not answer.
 */
export async function loadDetail(args) {
  const kind = args.k === "movie" ? "movie" : "series";
  const tmdbId = Number(args.d) || 0;
  if (!tmdbId) throw Object.assign(new Error("no tmdb id"), { code: "not_found" });
  const tv = kind === "movie" ? "movie" : "tv";
  const x = await kino.tmdb(`/${tv}/${tmdbId}`, {
    language: tmdbLang(),
    append_to_response: "credits,images,recommendations," + (kind === "movie" ? "release_dates" : "content_ratings"),
    include_image_language: "null,es,en,ja",
  });
  const cert = kind === "movie"
    ? (((x.release_dates && x.release_dates.results) || []).find((r) => r.iso_3166_1 === "MX" || r.iso_3166_1 === "US")?.release_dates || []).map((r) => r.certification).find(Boolean)
    : (((x.content_ratings && x.content_ratings.results) || []).find((r) => r.iso_3166_1 === "MX") || ((x.content_ratings && x.content_ratings.results) || []).find((r) => r.iso_3166_1 === "US") || {}).rating;
  const backdrop = typeof x.backdrop_path === "string" ? TMDB_IMG + "w780" + x.backdrop_path : undefined;
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
    directors: (kind === "movie"
      ? ((x.credits && x.credits.crew) || []).filter((c) => c.job === "Director").map((c) => c.name)
      : (x.created_by || []).map((c) => c.name)).filter(Boolean).slice(0, 3),
    ratings: typeof x.vote_average === "number" && x.vote_count > 20 ? [{ source: "tmdb", value: (Math.round(x.vote_average * 10) / 10).toFixed(1) }] : [],
    cast: ((x.credits && x.credits.cast) || []).filter((c) => c && c.name).slice(0, MAX_CAST).map((c) => ({
      name: String(c.name), character: String(c.character || ""),
      photo: typeof c.profile_path === "string" && c.profile_path.startsWith("/") ? TMDB_IMG + "w185" + c.profile_path : undefined,
    })),
    images: backdropsOf(x.images, backdrop),
    similar: ((x.recommendations && x.recommendations.results) || [])
      .filter((m) => m && m.id && (m.title || m.name) && m.poster_path && !m.adult).slice(0, 12)
      .map((m) => ({
        id: (kind === "movie" ? "m-" : "s-") + m.id, ref: (kind === "movie" ? "m:" : "s:") + m.id, kind, title: String(m.title || m.name).slice(0, 200),
        poster: TMDB_IMG + "w342" + m.poster_path, ids: { tmdb: m.id },
      })),
    episodes: [],
  };
  if (kind === "series") {
    const eps = await seriesEpisodes(tmdbId).then((r) => r.episodes).catch(() => []);
    d.episodes = eps.slice(0, 1200).map((e) => ({
      s: num(e.season), n: num(e.number), title: String(e.title || "").slice(0, 120), overview: String(e.overview || "").slice(0, 110),
      still: https(e.still), air: e.airDate || "",
    }));
  }
  // The title's logo (drawn where its name is): Kino's answer, when it has one.
  if (typeof kino.meta === "function") {
    try {
      const meta = await kino.meta({ type: kind, ids: { tmdb: tmdbId } });
      if (meta && https(meta.logo)) d.logo = https(meta.logo);
    } catch (_) { /* the name stays */ }
  }
  return d;
}

const heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
const railSkeleton = () => ({
  type: "Column", key: "dskel1", gap: 8, children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `dsk${i}`, flex: 1 })) },
  ],
});

const sectionTitle = (key) => ({ type: "Text", ...twin(key), style: "h4" });

/** The tap on an episode: Kino's page of the series (this plugin's own, with its copies). */
const episodeGo = (d, r) => ({ go: { title: { ref: r.ref, kind: "series", id: r.id, title: d.title } } });

function episodeRow(d, r, ep) {
  const facts = ep.air ? dateText(ep.air) : null;
  const heading = ep.title ? { text: `${ep.n}. ${ep.title}`, textEn: `${ep.n}. ${ep.title}` } : twin("dEpisodeN", "text", { n: ep.n });
  return {
    type: "Row", key: `ep-${ep.s}-${ep.n}`, gap: 12, crossAxisAlignment: "center", onTap: episodeGo(d, r), canRequestFocus: true,
    children: [
      { type: "Image", key: `epi-${ep.s}-${ep.n}`, width: 120, aspect: "16:9", fit: "cover", radius: "medium", ...(ep.still ? { url: ep.still } : {}), fallback: { type: "Skeleton", shape: "block", height: 64 } },
      { type: "Column", flex: 1, gap: 4, children: [
        { type: "Text", bold: true, maxLines: 2, ...heading },
        ...(facts ? [{ type: "Text", style: "caption", color: "muted", text: facts.es, textEn: facts.en }] : []),
        ...(ep.overview ? [{ type: "Text", style: "caption", color: "muted", maxLines: 2, ...same(ep.overview) }] : []),
      ] },
    ],
  };
}

function castItem(c) {
  const name = String(c.name || "").slice(0, 60);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    type: "Column", key: "cast-" + name.replace(/[^A-Za-z0-9]/g, "").slice(0, 24) + "-" + String(c.character || "").length, width: 96, gap: 4, crossAxisAlignment: "center", canRequestFocus: true, children: [
      { type: "CircleAvatar", radius: 32, ...(https(c.photo) ? { image: https(c.photo) } : {}), text: initials, textEn: initials },
      { type: "Text", ...same(name), style: "caption", maxLines: 2 },
      ...(c.character ? [{ type: "Text", ...same(String(c.character).slice(0, 40)), style: "caption", color: "muted", maxLines: 1 }] : []),
    ],
  };
}

/**
 * The tree of the title route. `r`: `{ ref, id, kind, title }` of the page's title; `entry`: `{ d }` loaded (d null: it failed) or
 * null while it loads; `season`: the chosen season (0 = the first); `back`/`logo`: the screen's own back button and logo.
 */
export function detailView({ r, entry, season, logo, back, sheet = null }) {
  const d = entry && entry.d;
  const appBar = { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: back, title: logo };
  const body = [];
  let hero = null; // the banner goes edge to edge: outside the padded column
  if (!entry) {
    hero = heroSkeleton();
    body.push(railSkeleton());
  } else if (!d) {
    body.push({ type: "MaterialBanner", key: "detailFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "dretry" } });
    body.push({ type: "ElevatedButton", key: "dkino", icon: "play", ...twin("dSeeInKino", "labelText"), onPressed: { go: { title: { ref: r.ref, kind: r.kind, id: r.id, title: r.title } } } });
  } else {
    const series = d.kind === "series";
    const seasons = [...new Set(d.episodes.map((e) => e.s))].sort((a, b) => a - b);
    const shown = seasons.includes(season) ? season : seasons[0];
    const toKino = { go: { title: { ref: r.ref, kind: d.kind, id: r.id, title: r.title || d.title } } };
    const tmdb = (parseTitleRef(r.ref) || {}).id;
    // Share to Kino Social: the sheet opens with the title attached and "Estoy viendo «…»" (both editable).
    const share = tmdb ? [{ type: "TextButton", key: "dshare", icon: "share", ...twin("shShare", "labelText"),
      onPressed: { event: "openShare", arg: shareArgOf({ kind: d.kind, tmdb, title: d.title }) } }] : [];
    const buttons = series
      ? [{ type: "ElevatedButton", key: "dplay", ...twin("dSeriesGo", "labelText"), icon: "play", autofocus: true, onPressed: toKino }, ...share]
      : [
        { type: "ElevatedButton", key: "dplay", ...twin("brWatch", "labelText"), icon: "play", autofocus: true, onPressed: { go: { play: { ref: r.ref, kind: "movie", id: r.id, title: d.title } } } },
        { type: "TextButton", key: "dmore", ...twin("dMore", "labelText"), onPressed: toKino },
        ...share,
      ];
    const lead = d.tagline || (d.overview.length <= LEAD_MAX ? d.overview : d.overview.slice(0, LEAD_MAX - 1).trimEnd() + "…");
    const images = (d.images && d.images.length ? d.images : [d.backdrop || ""]).slice(0, 6);
    const slide = (image, i) => ({
      type: "heroCard", key: i ? "dhero-" + i : "dhero", h: { compact: 240, expanded: 320 }, title: d.title, titleEn: d.title, ...(lead ? same(lead) : {}),
      ...(image ? { image } : {}), ...(d.logo ? { logo: d.logo } : {}), buttons: i ? buttons.map((b) => ({ ...b, key: b.key + "-" + i, autofocus: false })) : buttons,
    });
    // The key carries the number of slides: Kino's pager keeps the count of its first drawing.
    hero = images.length > 1 ? { type: "PageView", key: "hero" + images.length, autoPlayMs: 6000, children: images.map(slide) } : slide(images[0], 0);
    const rating = d.ratings.find((x) => x.source === "imdb") || d.ratings.find((x) => x.source === "tmdb");
    const facts = [];
    if (rating) facts.push("★ " + rating.value);
    if (d.year) facts.push(String(d.year));
    if (d.certification) facts.push(d.certification);
    if (d.runtime) facts.push(hoursOf(d.runtime));
    const seasonsText = seasons.length === 1 ? both("dSeasonOne") : both("dSeasonsN", { n: seasons.length });
    const es = facts.concat(series && seasons.length ? [seasonsText.es] : []);
    const en = facts.concat(series && seasons.length ? [seasonsText.en] : []);
    if (es.length) body.push({ type: "Text", key: "dfacts", style: "h4", text: es.join("  ·  "), textEn: en.join("  ·  ") });
    if (d.genres.length) body.push({ type: "Row", key: "dgenres", gap: 8, children: d.genres.map((g, i) => ({ type: "Badge", key: "dg-" + i, ...same(g) })) });
    if (d.overview) body.push({ type: "Text", key: "dsynopsis", canRequestFocus: true, ...same(d.overview) });
    if (d.directors.length) body.push({ type: "Text", ...twin(series ? "dCreators" : "dDirector", "text", { v: d.directors.join(", ") }), color: "muted" });
    if (d.cast.length) {
      body.push(sectionTitle("dCast"));
      body.push({ type: "SingleChildScrollView", key: "dcast", direction: "horizontal", children: [{ type: "Row", gap: 12, children: d.cast.map(castItem) }] });
    }
    if (series && seasons.length) {
      body.push(seasons.length > 1
        ? { type: "DropdownButton", key: "dseason", value: String(shown), onChanged: "season", options: seasons.map((s) => { const w = both("dSeasonN", { n: s }); return { value: String(s), label: w.es, labelEn: w.en }; }) }
        : sectionTitle("dEpisodes"));
      for (const ep of d.episodes.filter((e) => e.s === shown).slice(0, MAX_EPISODES)) body.push(episodeRow(d, r, ep));
    }
    if (d.similar.length) {
      body.push(sectionTitle("dSimilar"));
      body.push(cardRow(d.similar, "dsimilar", "small"));
    }
  }
  return {
    type: "Scaffold", appBar,
    body: { type: "Column", key: "detail-wrap", flex: 1, children: [
      { type: "SingleChildScrollView", key: "detail-page", flex: 1, children: [...(hero ? [hero] : []), { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
      ...(sheet ? [sheet] : []),
    ] },
    ...(!entry ? { every: { ms: 1000, event: "dtick" } } : {}),
  };
}
