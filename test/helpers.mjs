// A simulated `kino` for the tests: kino.storage with the real 256 KB limit, kino.tmdb answering from a table, a fetch and a
// hidden browser the tests script.
export const STORAGE_LIMIT = 256 * 1024;

export function makeKino(over = {}) {
  const data = new Map();
  const ttls = new Map();
  const size = () => [...data].reduce((n, [k, v]) => n + k.length + v.length, 0);
  const calls = { tmdb: [], fetch: [], capture: [] };
  const kino = {
    lang: "es-CO",
    log() {},
    error: (code, message, opts) => Object.assign(new Error(message), { code, userMessage: opts && opts.userMessage }),
    storage: {
      get: (k) => (data.has(k) ? data.get(k) : null),
      set(k, v, opts) {
        const was = data.has(k) ? k.length + data.get(k).length : 0;
        if (size() - was + k.length + String(v).length > STORAGE_LIMIT) throw Object.assign(new Error("storage full"), { code: "too_large" });
        data.set(k, String(v));
        ttls.set(k, opts && opts.ttlMs);
      },
      remove: (k) => { data.delete(k); ttls.delete(k); },
      keys: () => [...data.keys()],
    },
    config: { get: (k) => (over.config ? over.config[k] : undefined) },
    rank: { shortQuery: (q) => q, sortBySimilarity: (items) => items },
    tmdb: async (path, params) => {
      calls.tmdb.push({ path, params });
      if (over.tmdb) return over.tmdb(path, params);
      return { page: params.page ? Number(params.page) : 1, total_pages: 3, results: [movie(1, "Uno"), movie(2, "Dos")] };
    },
    fetch: async (url, opts) => {
      calls.fetch.push({ url, opts });
      if (over.fetch) return over.fetch(url, opts);
      throw Object.assign(new Error("no network"), { code: "network" });
    },
    browser: over.browser === null ? undefined : (over.browser || { captureAll: true, capture: async (url, opts) => { calls.capture.push({ url, opts }); return { media: [], subtitles: [], finalUrl: url }; } }),
    ...(over.kino || {}),
  };
  return { kino, calls, data, ttls, size };
}

export function install(over) {
  const k = makeKino(over);
  globalThis.kino = k.kino;
  return k;
}

export const movie = (id, title, extra = {}) => ({
  id, title, overview: "Una historia. ".repeat(10), poster_path: `/p${id}.jpg`, backdrop_path: `/b${id}.jpg`,
  release_date: "2020-01-02", vote_average: 7.5, vote_count: 500, ...extra,
});
