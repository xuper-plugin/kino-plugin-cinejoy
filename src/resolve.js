// resolve(ref): the video of a movie or an episode.
//
// Where the video comes from: Cinejoy's own public watch page. Its player asks the site's servers for the video itself and plays
// it from a blob, so there is no plain address to read. This plugin does NOT touch that API or its scripts: it opens the public
// page in Kino's hidden web view (`kino.browser.capture`, approved by the person in the manifest's `"browser": true`), lets the
// page's own player run as in any browser, and takes the video requests the player made. Nothing on the page is bypassed, and a
// human check on it ends the capture (Kino never tries to solve one).
//
// The captures are one page at a time in the whole app: a second resolve for the same title joins the one in flight, and one for
// another title is told the app is busy instead of opening a second page.
// Subtitles come from the open subtitle index of the same site (subs.wing.st), asked while the page loads.
import { t } from "./i18n.js";
import { parseTitleRef } from "./refs.js";
import { readSettings } from "./settings.js";

export const SITE = "https://cinejoy.pk";
const SUBS = "https://subs.wing.st/subtitles";
// Kino's own limit for one hidden page (PluginBrowser.MAX_TIMEOUT_MS); a resolve that opens pages gets 75 s in all.
const CAPTURE_MS = 25000;
const RESOLVE_BUDGET_MS = 70000;
const MAX_ATTEMPTS = 2;
const SUBS_MS = 6000;
const MAX_SUBS = 30;
const MAX_ALTERNATIVES = 3;
const MAX_HEADERS = 20;
// What a capture asks for besides Kino's default video pattern (manifests, files and the segments a manifest names).
export const ALSO_MATCH = "\\.m3u8|\\.mpd|\\.mp4|\\.m4s|\\.ts(\\?|$)";
// Headers a replayed request never takes from the page's copy.
const DROP_HEADERS = new Set(["host", "range", "accept-encoding", "content-length", "connection", "content-type", "if-range", "if-none-match", "if-modified-since"]);

const fail = (code, text, why) => kino.error(code, why || text, { userMessage: t(text) });

/** The public watch page of a parsed ref, or null (a series itself has no video). */
export function watchUrl(p) {
  if (!p) return null;
  if (p.kind === "movie") return `${SITE}/watch/movie/${p.id}`;
  if (p.kind === "episode") return `${SITE}/watch/tv/${p.id}/${p.season}/${p.episode}`;
  return null;
}

const pathOf = (url) => String(url).split("#")[0].split("?")[0].toLowerCase();

/** 0 manifest (HLS/DASH), 1 plain file, 2 another stream address, -1 a segment or key (not playable alone). */
export function mediaRank(url) {
  const p = pathOf(url);
  if (/\.(m4s|ts|key|aac|vtt|srt)$/.test(p)) return -1;
  if (/\.(m3u8|mpd)$/.test(p) || /\.(m3u8|mpd)(\W|$)/.test(String(url).toLowerCase())) return 0;
  if (/\.(mp4|webm|mkv|mov)$/.test(p)) return 1;
  return 2;
}

/** The headers to send back with a captured request: what the page sent, minus the ones a replay must not carry. */
export function headersOf(h) {
  const out = {};
  if (!h || typeof h !== "object") return out;
  for (const [k, v] of Object.entries(h)) {
    if (typeof v !== "string" || v === "" || DROP_HEADERS.has(k.toLowerCase())) continue;
    if (Object.keys(out).length >= MAX_HEADERS) break;
    out[k] = v;
  }
  return out;
}

/** Playable candidates `{ url, mime?, headers }` of a capture, manifests first, one per address. */
export function pickMedia(cap) {
  const seen = new Set();
  const all = [];
  const add = (url, headers, mime) => {
    if (typeof url !== "string" || !/^https:\/\//i.test(url) || seen.has(url)) return;
    const rank = mediaRank(url);
    if (rank < 0) return;
    seen.add(url);
    all.push({ rank, i: all.length, url, headers: headersOf(headers), ...(typeof mime === "string" && mime ? { mime } : {}) });
  };
  for (const m of (cap && cap.media) || []) add(m && m.url, m && m.headers, m && m.mime);
  for (const r of (cap && cap.requests) || []) if (!r || r.method === undefined || r.method === "GET") add(r && r.url, r && r.headers);
  return all.sort((a, b) => a.rank - b.rank || a.i - b.i).map(({ rank, i, ...rest }) => rest);
}

/** Subtitle entries of the open index's answer: the person's language first, then the other of es/en, at most MAX_SUBS. */
export function pickSubtitles(answer, prefer) {
  const list = answer && Array.isArray(answer.subtitles) ? answer.subtitles : [];
  const order = prefer === "en" ? ["en", "es"] : ["es", "en"];
  const out = [];
  const seen = new Set();
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

/** The subtitle index's tracks for a parsed ref; never throws (a movie plays without them). */
async function subtitlesFor(p) {
  try {
    const q = p.kind === "movie"
      ? `type=movie&tmdb=${p.id}`
      : `type=tv&tmdb=${p.id}&season=${p.season}&episode=${p.episode}`;
    const r = await kino.fetch(`${SUBS}?${q}`, { timeoutMs: SUBS_MS });
    return r.ok ? pickSubtitles(r.json(), readSettings().subLang) : [];
  } catch (e) {
    kino.log("[cinejoy] subs", (e && e.code) || "error");
    return [];
  }
}

const canCapture = () => !!(kino.browser && typeof kino.browser.capture === "function");

async function captureOf(url) {
  const opts = { timeoutMs: CAPTURE_MS };
  if (kino.browser.captureAll === true) {
    opts.captureAll = true;
    opts.alsoMatch = [ALSO_MATCH];
  }
  const started = Date.now();
  for (let attempt = 1; ; attempt++) {
    try {
      return await kino.browser.capture(url, opts);
    } catch (e) {
      const code = (e && e.code) || "error";
      kino.log("[cinejoy] capture", code, "attempt", attempt);
      // The page's own start (its scripts, then a sealed request that took 1.5-7 s) put the video at 12-17 s on a Redmi and
      // past the capture's limit when slower (2026-11-23). A second page loads its scripts from the cache and usually makes
      // it: once, and only while Kino's resolve limit still has room for a whole capture.
      if (code === "timeout" && attempt < MAX_ATTEMPTS && Date.now() - started + CAPTURE_MS < RESOLVE_BUDGET_MS) continue;
      throw captureFailure(code);
    }
  }
}

/** The person's sentence for a capture that ended with [code]. */
function captureFailure(code) {
  if (code === "timeout") return fail("unavailable", "timeout", "capture timeout");
  if (code === "blocked") return fail("unavailable", "blocked", "capture blocked");
  if (code === "busy") return fail("unavailable", "busy", "capture busy");
  if (code === "browser_unavailable") return fail("unavailable", "noBrowser", "no web view");
  if (code === "not_allowed") return fail("unavailable", "notAllowed", "capture not allowed");
  return fail("not_found", "notFound", "capture failed: " + code);
}

let inFlight = null; // { url, promise }: the one capture this sandbox runs

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
  for (const s of (cap && cap.subtitles) || []) {
    if (subtitles.length >= MAX_SUBS) break;
    if (s && typeof s.url === "string" && /^https:\/\//.test(s.url) && !have.has(s.url)) {
      have.add(s.url);
      subtitles.push({ lang: typeof s.lang === "string" && s.lang ? s.lang : "und", url: s.url });
    }
  }
  const stream = { url: first.url, label: "Cinejoy", ...(first.mime ? { mime: first.mime } : {}), ...(Object.keys(first.headers).length ? { headers: first.headers } : {}) };
  const alternatives = rest.slice(0, MAX_ALTERNATIVES).map((m) => ({ url: m.url, ...(Object.keys(m.headers).length ? { headers: m.headers } : {}) }));
  if (alternatives.length) stream.alternatives = alternatives;
  if (subtitles.length) stream.subtitles = subtitles;
  remember(url, first);
  return stream;
}

// ---- the stream a title played, kept ----
// The page always leads to the same address for a title (lightspeed.st/hls/<uuid>/1/master.m3u8, measured twice on a Redmi,
// 2026-11-22), which answers any client that sends the page's Referer. So the stream a capture found is kept per title; the next
// play of it (a resume, the next day) peeks at it and plays it at once, with no hidden page (~10 s each). A kept stream that no
// longer answers is dropped and the page is captured again.
const KEPT_PREFIX = "stream1:";
const KEPT_MS = 7 * 24 * 3600 * 1000;
const PEEK_MS = 5000;

function remember(url, media) {
  try { kino.storage.set(KEPT_PREFIX + url, JSON.stringify({ at: Date.now(), url: media.url, headers: media.headers || {}, mime: media.mime || "" }), { ttlMs: KEPT_MS }); } catch (_) { /* full storage: capture next time */ }
}

function keptFor(url) {
  try {
    const o = JSON.parse(kino.storage.get(KEPT_PREFIX + url) || "null");
    return o && typeof o.url === "string" && /^https:\/\//.test(o.url) && Date.now() - o.at < KEPT_MS ? o : null;
  } catch (_) { return null; }
}

/** Whether a kept stream still answers: 2 KB of it; a playlist must read like one. */
async function answers(kept) {
  try {
    const r = await kino.fetch(kept.url, { headers: { ...kept.headers, Range: "bytes=0-2047" }, timeoutMs: PEEK_MS, maxBytes: 2048 });
    if (!r.ok) return false;
    return !/\.m3u8(\?|$)/i.test(kept.url) || /^\s*#EXTM3U/.test(r.text() || "");
  } catch (e) {
    return !!(e && e.code === "too_large");
  }
}

async function keptStream(p, url) {
  const kept = keptFor(url);
  if (!kept) return null;
  const subsPromise = subtitlesFor(p);
  if (!(await answers(kept))) {
    try { kino.storage.remove(KEPT_PREFIX + url); } catch (_) { /* gone anyway */ }
    kino.log("[cinejoy] kept stream no longer answers: capturing again");
    return null;
  }
  const subtitles = await subsPromise;
  const stream = { url: kept.url, label: "Cinejoy", ...(kept.mime ? { mime: kept.mime } : {}), ...(Object.keys(kept.headers).length ? { headers: kept.headers } : {}) };
  if (subtitles.length) stream.subtitles = subtitles;
  kino.log("[cinejoy] kept stream answers: no hidden page");
  return stream;
}

/** `resolve(ref)`. */
export async function resolveRef(ref) {
  const p = parseTitleRef(ref);
  const url = watchUrl(p);
  if (!url) throw fail("not_found", "notFound", "not a playable ref");
  const kept = await keptStream(p, url);
  if (kept) return kept;
  if (!canCapture()) throw fail("unavailable", "noBrowser", "kino.browser.capture missing");
  if (inFlight) {
    if (inFlight.url === url) return inFlight.promise;
    throw fail("unavailable", "busy", "another capture is running");
  }
  const promise = streamFor(p, url).finally(() => { inFlight = null; });
  inFlight = { url, promise };
  return promise;
}
