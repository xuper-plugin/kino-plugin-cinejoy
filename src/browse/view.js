// The browse screen's trees: a pure view of what index.js holds. A tab that is not in yet draws skeletons shaped like what
// will replace them, so nothing jumps when the rows arrive. Every text is in both languages.
import { tabLabel } from "../catalog.js";
import { TAB_IDS } from "./model.js";
import { logoNode } from "./logo.js";
import { detailView, openArgs, cardRow, cardGrid, twin } from "./detail.js";
import { shareSheet, shareBarButton } from "./share.js";

const POLL_MS = 1_500;
const SEARCH_CAP = 60;

const tabBar = (active) => ({
  type: "TabBar", key: "tabs", divider: false, value: active, onChanged: "tab",
  tabs: TAB_IDS.map((id) => { const w = tabLabel(id); return { value: id, label: w.es, labelEn: w.en }; }),
});

/** The skeleton of one rail: a heading bar and a row of poster cards (three on a phone, six on a wide window). */
const railSkeleton = (n) => ({
  type: "Column", key: "skel" + n, gap: 8, children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, sizes: ["compact"], children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}c${i}`, flex: 1 })) },
    { type: "Row", gap: 12, sizes: ["medium", "expanded"], children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}w${i}`, flex: 1 })) },
  ],
});

/** The skeleton of a results grid: two rows of poster cards. */
const gridSkeleton = () => ({
  type: "Column", key: "gridSkeleton", gap: 12, children: [
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["compact"], key: `gc${r}`, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `gc${r}-${i}`, flex: 1 })) })),
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["medium", "expanded"], key: `gw${r}`, children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `gw${r}-${i}`, flex: 1 })) })),
  ],
});

const heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });

const slideNode = (s) => ({
  type: "heroCard", key: "slide-" + s.id, h: { compact: 200, expanded: 240 }, ...(s.logo ? { logo: s.logo } : {}), title: s.title, text: s.text, image: s.image,
  buttons: [
    s.kind === "movie"
      ? { type: "ElevatedButton", key: "watch-" + s.id, ...twin("brWatch", "labelText"), icon: "play", onPressed: { go: { play: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } }
      : { type: "ElevatedButton", key: "watch-" + s.id, ...twin("dSeriesGo", "labelText"), icon: "play", onPressed: { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } },
    { type: "TextButton", key: "info-" + s.id, ...twin("brInfo", "labelText"), onPressed: { event: "openTitle", arg: JSON.stringify(openArgs({ ...s, ids: s.tmdb ? { tmdb: s.tmdb } : undefined })) } },
  ],
});

// The key carries the number of slides: Kino's pager keeps the count of its first drawing, and a slider that goes from one
// number of slides to another could close the app. A new key is a new pager.
const hero = (slides) => (slides.length === 1 ? slideNode(slides[0]) : {
  type: "PageView", key: "hero" + slides.length, autoPlayMs: 6_000, children: slides.map(slideNode),
});

const rail = (r, key, titleOverride) => ({
  type: "Column", key, gap: 8, children: [
    { type: "Row", key: key + "-h", crossAxisAlignment: "center", children: [
      { type: "Text", style: "h4", flex: 1, text: titleOverride ? titleOverride.title : r.title, textEn: titleOverride ? titleOverride.titleEn : r.title },
      ...(r.ref ? [{ type: "TextButton", key: key + "-more", ...twin("brMore", "labelText"), onPressed: { go: { browse: { ref: r.ref, title: r.title } } } }] : []),
    ] },
    cardRow(r.items, key, "medium"),
  ],
});

const backButton = () => ({ type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" });

/**
 * `data`: `{ slides, rails }` of the active tab, or null while it is not in. `recent`: the cards of the played titles.
 * `pending`: some tab is still being fetched (the timer polls only then). `failed`: the active tab could not load.
 */
export function browseView({ tab, data, recent, pending, failed, device = "phone", share = null }) {
  const tv = device === "tv";
  const gear = { type: "IconButton", key: "settingsButton", icon: "settings", ...twin("brSettings", "labelText"), ...twin("brSettings", "tooltip"), onPressed: { event: "go", arg: "settings" } };
  const active = TAB_IDS.includes(tab) ? tab : TAB_IDS[0];
  const body = [];
  if (data) {
    if (data.slides.length > 0) body.push(hero(data.slides));
    if (recent.length > 0) body.push(rail({ items: recent }, "recent", twin("brRecent", "title")));
    for (const r of data.rails) body.push(rail(r, "rail-" + String(r.id).replace(/[^A-Za-z0-9_-]/g, "_")));
    if (data.rails.length === 0) body.push({ type: "Text", ...twin("brEmpty", "text"), color: "muted" });
  } else if (failed) {
    body.push({ type: "MaterialBanner", key: "loadFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "retry" } });
  } else {
    body.push(heroSkeleton(), railSkeleton(1), railSkeleton(2), railSkeleton(3));
  }
  const isBanner = (n) => !!n && (n.type === "heroCard" || n.key === "heroSkeleton" || (n.type === "PageView" && String(n.key).startsWith("hero")));
  const banner = body.length > 0 && isBanner(body[0]) ? body.shift() : null; // the main picture goes edge to edge, right under the bar
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      // One bar instead of two (Kino 0.9.81+): the close button where Kino's was and the plugin's logo where its name was.
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin("brClose", "labelText"), ...twin("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
      // Share (text only, to Kino Social), then settings; on a TV search leads.
      actions: tv
        ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin("brSearch", "labelText"), ...twin("brSearch", "tooltip"), onPressed: "openSearch" }, shareBarButton(), gear]
        : [shareBarButton(), gear],
      // On a TV the tabs sit in the bar beside the logo (one D-pad strip); elsewhere they are pinned under it.
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [logoNode(), tabBar(active)] } : logoNode(),
    },
    ...(tv ? {} : { floatingActionButton: { type: "FloatingActionButton", key: "searchFab", icon: "search", ...twin("brSearch", "tooltip"), onPressed: "openSearch" } }),
    // The tabs stay pinned under the bar; only the rows scroll.
    body: { type: "Column", key: "page", children: [
      ...(tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(active)] }]),
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [...(banner ? [banner] : []), { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
      shareSheet(share),
    ] },
    ...(pending ? { every: { ms: POLL_MS, event: "tick" } } : {}),
  };
}

/** The settings page (route "settings"): the same bar, then Kino's own form of the plugin's settings. */
export function settingsView() {
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: backButton(), title: logoNode() },
    body: { type: "SingleChildScrollView", key: "settings-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: [{ type: "settings", key: "form" }] }] },
  };
}

/**
 * The search page (route "search"): the box, then skeletons while TMDB answers, then the results as a grid; empty, it paints
 * what earlier searches found. `status`: "idle", "loading", "done" or "fail".
 */
export function searchView({ query, status, items, history = [], device = "phone" }) {
  const tv = device === "tv";
  const searchForm = () => ({
    type: "Form", key: "searchForm", onSubmitted: "search", gap: 8, children: tv
      ? [{ type: "Row", key: "searchRow", gap: 16, crossAxisAlignment: "center", children: [
        { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true, weight: 1 },
        { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true },
      ] }]
      : [
        { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true },
        { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true },
      ],
  });
  const body = tv ? [] : [searchForm()];
  if (status === "fail") {
    body.push({ type: "MaterialBanner", key: "searchFailed", role: "error", ...twin("brSearchFailed"), action: { ...twin("brRetry", "label"), onTap: "sretry" } });
  } else if (status === "done" && items) {
    if (items.length === 0) body.push({ type: "Text", ...twin("brNoResults", "text"), color: "muted" });
    else body.push(cardGrid(items.slice(0, SEARCH_CAP), "results"));
  } else if (status !== "idle") {
    body.push(gridSkeleton());
  } else if (history.length > 0) {
    body.push({ type: "Text", ...twin("brSearchedBefore", "text"), style: "h4" });
    body.push(cardGrid(history.slice(0, SEARCH_CAP), "history"));
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: backButton(),
      ...(tv ? { title: searchForm() } : twin("brSearchTitle", "title")),
    },
    body: { type: "SingleChildScrollView", key: "search-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...(status === "loading" ? { every: { ms: 1_000, event: "stick" } } : {}),
  };
}

/** The title page (route "detail"): the same bar, with Back where Close was. */
export function detailPage({ r, entry, season, share = null }) {
  return detailView({ r, entry, season, logo: logoNode(), back: backButton(), sheet: shareSheet(share) });
}
