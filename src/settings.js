// The person's settings, read from kino.config with the defaults filled in. Kino syncs them across the person's devices.

const bool = (v, fallback) => (v === true || v === "true" ? true : v === false || v === "false" ? false : fallback);

/** `{ subLang: "es"|"en", homeRows: boolean }`. */
export function readSettings(kino = globalThis.kino) {
  const get = (key) => { try { return kino && kino.config ? kino.config.get(key) : undefined; } catch (_) { return undefined; } };
  return { subLang: get("subLang") === "en" ? "en" : "es", homeRows: bool(get("homeRows"), true) };
}
