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
const CAPTURE_MS = 24000;
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
  try {
    return await kino.browser.capture(url, opts);
  } catch (e) {
    const code = (e && e.code) || "error";
    kino.log("[cinejoy] capture", code);
    if (code === "timeout") throw fail("unavailable", "timeout", "capture timeout");
    if (code === "blocked") throw fail("unavailable", "blocked", "capture blocked");
    if (code === "busy") throw fail("unavailable", "busy", "capture busy");
    if (code === "browser_unavailable") throw fail("unavailable", "noBrowser", "no web view");
    if (code === "not_allowed") throw fail("unavailable", "notAllowed", "capture not allowed");
    throw fail("not_found", "notFound", "capture failed: " + code);
  }
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
  return stream;
}

/** `resolve(ref)`. */
export async function resolveRef(ref) {
  const p = parseTitleRef(ref);
  const url = watchUrl(p);
  if (!url) throw fail("not_found", "notFound", "not a playable ref");
  if (!canCapture()) throw fail("unavailable", "noBrowser", "kino.browser.capture missing");
  if (inFlight) {
    if (inFlight.url === url) return inFlight.promise;
    throw fail("unavailable", "busy", "another capture is running");
  }
  const promise = streamFor(p, url).finally(() => { inFlight = null; });
  inFlight = { url, promise };
  return promise;
}
