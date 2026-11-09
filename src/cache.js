// One persistent cache shared by home(), section() and the browse screen, in kino.storage.
//
// kino.storage keeps 256 KB in all for the whole plugin, so every entry is `{ at, v }`, at most ENTRY_MAX chars, and lives
// HARD_TTL_MS. An entry is "fresh" for the window the caller gives (a shelf: 6 h); an older one is still served when the
// network fails (an old list beats an empty screen) until storage drops it at HARD_TTL_MS (24 h). When storage is full the
// oldest cache entry is evicted and the write retried. A cache never fails the call it serves.
const PREFIX = "c1:";
export const HARD_TTL_MS = 24 * 3600 * 1000;
export const ENTRY_MAX = 48 * 1024;
export const FRESH_SHELF_MS = 6 * 3600 * 1000;
export const FRESH_ART_MS = 12 * 3600 * 1000;
// The shelf cache never takes more than this of the 256 KB, so the screen's own copies (home1, browse1:<tab>, ~60 KB), the
// logo book and the search history always find room. Over it the oldest cache entry goes before a new one is written.
export const CACHE_BUDGET = 120 * 1024;

const store = () => globalThis.kino.storage;

const keys = () => {
  try { return store().keys().filter((k) => k.startsWith(PREFIX)); } catch (_) { return []; }
};

/** The entry `{ at, v }` kept under [key], or null. */
export function read(key) {
  try {
    const raw = store().get(PREFIX + key);
    if (!raw) return null;
    const e = JSON.parse(raw);
    return e && typeof e.at === "number" && "v" in e ? e : null;
  } catch (_) {
    try { store().remove(PREFIX + key); } catch (__) { /* gone or never there */ }
    return null;
  }
}

/** The value kept under [key] however old it is (storage drops it at HARD_TTL_MS), or undefined. Never throws, no network. */
export function kept(key) {
  const e = read(key);
  return e ? e.v : undefined;
}

/** Characters the cache entries hold now. */
function used() {
  let n = 0;
  for (const k of keys()) { try { n += (store().get(k) || "").length + k.length; } catch (_) { /* unreadable: counts nothing */ } }
  return n;
}

function evictOldest(except = "") {
  let victim = null;
  let oldest = Infinity;
  for (const k of keys()) {
    if (k === except) continue;
    let at = 0;
    try { at = JSON.parse(store().get(k) || "{}").at || 0; } catch (_) { /* unreadable: the first to go */ }
    if (at < oldest) { oldest = at; victim = k; }
  }
  if (victim === null) return false;
  try { store().remove(victim); } catch (_) { return false; }
  return true;
}

/** Keeps [v] under [key]; whatever storage refuses is simply not cached. Returns whether it was kept. */
export function write(key, v) {
  let raw;
  try { raw = JSON.stringify({ at: Date.now(), v }); } catch (_) { return false; }
  if (raw.length > ENTRY_MAX) return false;
  // Within the cache's own budget first: older entries go until this one fits (it replaces its own previous copy).
  try {
    let total = used() - ((store().get(PREFIX + key) || "").length);
    for (let guard = 0; total + raw.length > CACHE_BUDGET && guard < 40; guard++) {
      if (!evictOldest(PREFIX + key)) break;
      total = used() - ((store().get(PREFIX + key) || "").length);
    }
  } catch (_) { /* storage unreadable: the write below decides */ }
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

/**
 * Stores [text] under [key] (the screen's own copies: home1, browse1:<tab>) and, when storage is full, drops the oldest cache
 * entries until it fits: a copy of what the person last saw is worth more than a shelf. Returns whether it was kept; never throws.
 */
export function setWithRoom(key, text, opts) {
  for (let tries = 0; tries < 40; tries++) {
    try { store().set(key, text, opts); return true; } catch (e) {
      if (!e || e.code !== "too_large" || !evictOldest()) return false;
    }
  }
  return false;
}

const inflight = new Map();

/**
 * [load]'s value for [key]: the kept one when younger than [freshMs]; else a new load (kept), asked once even when home(), the
 * section and the screen want it at the same moment; when the load fails, the older kept value if there is one, else the error.
 */
export function cached(key, freshMs, load) {
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
        try { globalThis.kino.log("[cinejoy] serving older", key, (e && e.code) || "error"); } catch (_) { /* no log */ }
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

/** Removes every cache entry; returns how many. */
export function clear() {
  let n = 0;
  for (const k of keys()) { try { store().remove(k); n++; } catch (_) { /* stays */ } }
  return n;
}
