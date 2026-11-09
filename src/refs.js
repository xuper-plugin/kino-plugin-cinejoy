// Refs (what Kino hands back to resolve, episodes, details and browse):
//   m:<tmdb>                      a movie
//   s:<tmdb>                      a series
//   e:<tmdb>:<season>:<episode>   an episode
//   d:<movie|series>:<shelf>      a catalog shelf ("Ver más"), see catalog.js

export const movieRef = (id) => `m:${id}`;
export const seriesRef = (id) => `s:${id}`;
export const episodeRef = (id, season, episode) => `e:${id}:${season}:${episode}`;
export const shelfRef = (type, shelf) => `d:${type}:${shelf}`;

/** `{ kind: "movie"|"series"|"episode", id, season?, episode? }` of a title ref, or null. */
export function parseTitleRef(ref) {
  const r = String(ref || "");
  let m = /^([ms]):(\d{1,10})$/.exec(r);
  if (m) return { kind: m[1] === "m" ? "movie" : "series", id: Number(m[2]) };
  m = /^e:(\d{1,10}):(\d{1,3}):(\d{1,5})$/.exec(r);
  if (m) return { kind: "episode", id: Number(m[1]), season: Number(m[2]), episode: Number(m[3]) };
  return null;
}

/** `{ type: "movie"|"series", shelf }` of a shelf ref, or null. */
export function parseShelfRef(ref) {
  const m = /^d:(movie|series):([a-z0-9]{1,12})$/.exec(String(ref || ""));
  return m ? { type: m[1], shelf: m[2] } : null;
}
