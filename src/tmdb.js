// TMDB through Kino's own key (kino.tmdb): no key of ours. Kino lets one plugin make 20 calls every 10 s on it, so every
// list is one call and a series' seasons come 20 at a time.
import { langOf, t } from "./i18n.js";
import { movieRef, seriesRef, episodeRef } from "./refs.js";

const IMG = "https://image.tmdb.org/t/p/";

/** TMDB's language tag for the person's language. */
export const tmdbLang = () => (langOf() === "en" ? "en-US" : "es-MX");

/** One kino.tmdb call in the person's language. */
export async function tmdb(path, params = {}) {
  await null;
  if (typeof kino.tmdb !== "function") {
    throw kino.error("unavailable", "kino.tmdb missing (Kino older than 0.9.53)", { userMessage: t("tmdbDown") });
  }
  return kino.tmdb(path, { language: tmdbLang(), include_adult: false, ...params });
}

const img = (size, path) => (typeof path === "string" && path.startsWith("/") ? IMG + size + path : undefined);
const yearOf = (d) => (typeof d === "string" && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : undefined);

/** A Kino item from a TMDB list entry. [kind] when the list does not say (search lists carry media_type). */
export function toItem(m, kind) {
  const isMovie = kind ? kind === "movie" : m.media_type === "movie";
  const item = {
    // Kino takes only A-Z a-z 0-9 . _ ~ - in an id.
    id: `${isMovie ? "m" : "s"}-${m.id}`,
    ref: isMovie ? movieRef(m.id) : seriesRef(m.id),
    title: m.title || m.name || "",
    kind: isMovie ? "movie" : "series",
    ids: { tmdb: m.id },
  };
  const year = yearOf(m.release_date || m.first_air_date);
  if (year) item.year = year;
  const poster = img("w342", m.poster_path);
  if (poster) item.poster = poster;
  const backdrop = img("w780", m.backdrop_path);
  if (backdrop) item.backdrop = backdrop;
  // Kept short: shelves are cached in the plugin's 256 KB of storage, and a slide shows 160 characters at most.
  if (m.overview) item.overview = m.overview.length > 240 ? m.overview.slice(0, 239) + "…" : m.overview;
  if (typeof m.vote_average === "number" && m.vote_count > 20) item.rating = Math.round(m.vote_average * 10) / 10;
  const original = m.original_title || m.original_name;
  if (original && original !== item.title) item.originalTitle = original;
  return item;
}

/** Movies and series matching [query], safe ones only. */
export async function searchTitles(query) {
  const data = await tmdb("/search/multi", { query });
  return (data.results || [])
    .filter((m) => (m.media_type === "movie" || m.media_type === "tv") && !m.adult && m.id && (m.title || m.name))
    .map((m) => toItem(m));
}

/** A movie's details for its title page (`details` export). */
export async function movieInfo(id) {
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

/** A series' episodes, flat. TMDB appends at most 20 seasons to one answer: one call per 20 seasons. */
export async function seriesEpisodes(id) {
  const show = await tmdb(`/tv/${id}`);
  const seasons = (show.seasons || []).filter((s) => s.season_number > 0);
  const batches = [];
  for (let i = 0; i < seasons.length; i += 20) batches.push(seasons.slice(i, i + 20));
  const answers = await Promise.all(batches.map((b) =>
    tmdb(`/tv/${id}`, { append_to_response: b.map((s) => `season/${s.season_number}`).join(",") })));
  const fetched = batches.flatMap((b, i) => b.map((s) => answers[i][`season/${s.season_number}`] || {}));
  const episodes = fetched.flatMap((sd, i) => (sd.episodes || []).map((ep) => {
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
      ...(img("w342", show.poster_path) ? { poster: img("w342", show.poster_path) } : {}),
      ...(img("w780", show.backdrop_path) ? { backdrop: img("w780", show.backdrop_path) } : {}),
      ...(show.overview ? { overview: show.overview } : {}),
      ids: { tmdb: Number(id) },
    },
    episodes,
  };
}
