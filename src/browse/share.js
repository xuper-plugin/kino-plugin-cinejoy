// Sharing to Kino Social through its "wall" door (the plugin protocol, Kino 0.9.81: the manifest's consumes "social").
// One sheet for both cases: from a title page it starts with "Estoy viendo «…» en Cinejoy" and the title attached (a switch
// takes it off: text only); from the bar it starts empty, text only. Kino Social keeps what arrives as a draft the person
// reviews and posts there; nothing is published from here.
import { both, t } from "../i18n.js";

export const SOCIAL_REPO = "kinotvapp/kino-social";
const ALIAS = "social";
const MAX_TEXT = 500;
const SHEET = "shareSheet";

const twin = (key, field = "text", vars) => { const w = both(key, vars); return { [field]: w.es, [field + "En"]: w.en }; };

/** The arg a "Compartir" press carries: the title page's `{ k, d, t }`, or nothing (text only). */
export function shareArgOf({ kind, tmdb, title }) {
  return JSON.stringify({ k: kind === "movie" ? "movie" : "series", d: Number(tmdb) || 0, t: String(title || "").slice(0, 100) });
}

/** `{ kind, tmdb, title }` of a press's arg, or null (text only). */
export function shareTitleOf(arg) {
  let a = null;
  try { a = JSON.parse(String(arg)); } catch (_) { a = null; }
  if (!a || (a.k !== "movie" && a.k !== "series") || !(Number(a.d) > 0)) return null;
  return { kind: a.k, tmdb: Number(a.d), title: typeof a.t === "string" ? a.t.slice(0, 100) : "" };
}

/** The answer to a "Compartir" press: the sheet opens with its text (and the title, when there is one). */
export function openShare(arg) {
  const title = shareTitleOf(arg);
  return {
    state: { share: title, inputs: { shareText: title && title.title ? t("shWatching", { t: title.title }) : "", shareTitle: !!title } },
    ui: [{ open: SHEET }],
  };
}

/** The sheet (a pop-up of the screen, opened by `openShare`): the text, the switch when there is a title, and Send. */
export function shareSheet(share) {
  return {
    type: "BottomSheet", key: SHEET, ...twin("shSheet", "title"),
    children: [{ type: "Form", key: "shareForm", onSubmitted: { event: "sendShare", timeoutMs: 15000 }, gap: 12, children: [
      { type: "TextField", key: "shareText", multiline: true, maxLines: 6, maxLength: MAX_TEXT, ...twin("shText", "labelText") },
      ...(share ? [{ type: "Switch", key: "shareTitle", ...twin("shAttach", "labelText"), value: true }] : []),
      { type: "Text", ...twin("shNote"), style: "caption", color: "muted" },
      { type: "ElevatedButton", key: "shareSend", icon: "send", ...twin("shSend", "labelText"), submit: true },
    ] }],
  };
}

const toast = (key) => { const w = both(key); return { toast: w.es, toastEn: w.en }; };

/**
 * The sheet's submit: `{ shareText, shareTitle }` from the form and the title the sheet was opened for. Sends the draft to
 * Kino Social and answers the screen: closed with a toast, or Kino's install sheet when Kino Social is missing.
 */
export async function sendShare(values, share) {
  const v = values && typeof values === "object" ? values : {};
  const text = String(v.shareText || "").trim().slice(0, MAX_TEXT);
  const withTitle = !!share && v.shareTitle !== false && v.shareTitle !== "false";
  if (!text && !withTitle) return toast("shEmpty");
  if (typeof kino.plugins !== "object" || !kino.plugins || typeof kino.plugins.call !== "function") return toast("shOldKino");
  const arg = { from: "Cinejoy", ...(text ? { text } : {}), ...(withTitle ? { title: { kind: share.kind, tmdb: share.tmdb } } : {}) };
  try {
    await kino.plugins.call(ALIAS, "share", arg);
    return { ui: [{ close: SHEET }], state: { share: null }, ...toast("shDone") };
  } catch (e) {
    const code = e && e.code;
    try { kino.log("[cinejoy] share", code || "error"); } catch (_) { /* no log */ }
    // Kino Social not installed (or off): Kino's own install sheet, from the person's own press.
    if (code === "provider_missing") return { ui: [{ close: SHEET }], go: { installPlugin: { repo: SOCIAL_REPO } }, ...toast("shMissing") };
    if (code === "not_declared") return toast("shOldKino");
    return toast("shFailed");
  }
}

/** The bar's share button (text only). */
export const shareBarButton = () => ({
  type: "IconButton", key: "shareButton", icon: "share", ...twin("shShare", "labelText"), ...twin("shShare", "tooltip"),
  onPressed: { event: "openShare", arg: "" },
});
