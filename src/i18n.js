// Every text the person sees, in Spanish (neutral, tuteo) and English, picked by kino.lang. Screen trees carry both at once
// (`both`), so a language change needs no new call.

const WORDS = {
  es: {
    // shelves
    shelfTrend: "Tendencias",
    shelfNew: "Estrenos",
    shelfPop: "Populares",
    shelfTop: "Mejor valoradas",
    // genres (TMDB ids)
    g28: "Acción",
    g12: "Aventura",
    g16: "Animación",
    g35: "Comedia",
    g80: "Crimen",
    g99: "Documental",
    g18: "Drama",
    g10751: "Familia",
    g14: "Fantasía",
    g27: "Terror",
    g9648: "Misterio",
    g10749: "Romance",
    g878: "Ciencia ficción",
    g53: "Suspenso",
    g10759: "Acción y aventura",
    g10765: "Ciencia ficción y fantasía",
    // tabs
    tabHome: "Inicio",
    tabMovies: "Películas",
    tabSeries: "Series",
    // categories
    catMovies: "Películas: {g}",
    catSeries: "Series: {g}",
    // resolve
    notFound: "Cinejoy no tiene video para este título por ahora.",
    timeout: "El reproductor de Cinejoy no mostró video a tiempo. Inténtalo de nuevo.",
    blocked: "Cinejoy pidió una verificación que Kino no puede completar. Inténtalo más tarde.",
    busy: "Kino está abriendo otra página ahora. Espera un momento e inténtalo de nuevo.",
    noBrowser: "Este aparato no puede abrir la página de Cinejoy (le falta el navegador interno).",
    notAllowed: "Aprueba en Kino que Cinejoy abra páginas web ocultas para encontrar el video.",
    tmdbDown: "El catálogo no responde ahora. Intenta de nuevo en un rato.",
    // settings
    cacheCleared: "Listo: se borraron {n} datos guardados.",
    // browse screen
    brWatch: "Ver",
    brInfo: "Más información",
    brMore: "Ver más",
    brRecent: "Continuar viendo",
    brSearch: "Buscar",
    brSearchHint: "Buscar películas y series",
    brSearchTitle: "Buscar",
    brSearchedBefore: "Buscado recientemente",
    brNoResults: "No encontramos nada con esas palabras.",
    brSearchFailed: "No se pudo buscar. Revisa tu conexión e inténtalo de nuevo.",
    brFailed: "No se pudo cargar esta sección. Revisa tu conexión e inténtalo de nuevo.",
    brRetry: "Reintentar",
    brEmpty: "Aún no hay nada aquí.",
    brBack: "Atrás",
    brClose: "Cerrar",
    brSettings: "Configuración",
    // title page
    dEpisodeN: "Episodio {n}",
    dSeasonN: "Temporada {n}",
    dSeasonsN: "{n} temporadas",
    dSeasonOne: "1 temporada",
    dSeriesGo: "Ver episodios",
    dMore: "Más opciones",
    dCreators: "Creación: {v}",
    dDirector: "Dirección: {v}",
    dCast: "Reparto",
    dEpisodes: "Episodios",
    dSimilar: "Más como esto",
    dSeeInKino: "Ver en Kino",
    // sharing to Kino Social (its "wall" door)
    shShare: "Compartir",
    shSheet: "Compartir en Kino Social",
    shText: "Qué quieres contar",
    shWatching: "Estoy viendo «{t}» en Cinejoy",
    shAttach: "Adjuntar el título",
    shSend: "Enviar a Kino Social",
    shNote: "Llega a Kino Social como borrador: allá lo revisas y lo publicas.",
    shDone: "Listo: tienes el borrador en Kino Social para revisarlo y publicarlo.",
    shEmpty: "Escribe algo o adjunta el título.",
    shMissing: "Instala Kino Social para compartir.",
    shOldKino: "Actualiza Kino para compartir en Kino Social.",
    shFailed: "No se pudo enviar a Kino Social. Inténtalo de nuevo.",
  },
  en: {
    shelfTrend: "Trending",
    shelfNew: "New releases",
    shelfPop: "Popular",
    shelfTop: "Top rated",
    g28: "Action",
    g12: "Adventure",
    g16: "Animation",
    g35: "Comedy",
    g80: "Crime",
    g99: "Documentary",
    g18: "Drama",
    g10751: "Family",
    g14: "Fantasy",
    g27: "Horror",
    g9648: "Mystery",
    g10749: "Romance",
    g878: "Science fiction",
    g53: "Thriller",
    g10759: "Action and adventure",
    g10765: "Sci-fi and fantasy",
    tabHome: "Home",
    tabMovies: "Movies",
    tabSeries: "Series",
    catMovies: "Movies: {g}",
    catSeries: "Series: {g}",
    notFound: "Cinejoy has no video for this title right now.",
    timeout: "Cinejoy's player did not show a video in time. Try again.",
    blocked: "Cinejoy asked for a check that Kino cannot complete. Try again later.",
    busy: "Kino is opening another page right now. Wait a moment and try again.",
    noBrowser: "This device cannot open Cinejoy's page (it lacks the built-in browser).",
    notAllowed: "Approve in Kino that Cinejoy may open hidden web pages to find the video.",
    tmdbDown: "The catalog is not answering right now. Try again in a while.",
    cacheCleared: "Done: {n} saved items were cleared.",
    brWatch: "Watch",
    brInfo: "More info",
    brMore: "See more",
    brRecent: "Continue watching",
    brSearch: "Search",
    brSearchHint: "Search movies and series",
    brSearchTitle: "Search",
    brSearchedBefore: "Recently searched",
    brNoResults: "Nothing matched those words.",
    brSearchFailed: "The search failed. Check your connection and try again.",
    brFailed: "This section could not be loaded. Check your connection and try again.",
    brRetry: "Retry",
    brEmpty: "Nothing here yet.",
    brBack: "Back",
    brClose: "Close",
    brSettings: "Settings",
    dEpisodeN: "Episode {n}",
    dSeasonN: "Season {n}",
    dSeasonsN: "{n} seasons",
    dSeasonOne: "1 season",
    dSeriesGo: "Watch episodes",
    dMore: "More options",
    dCreators: "Created by: {v}",
    dDirector: "Directed by: {v}",
    dCast: "Cast",
    dEpisodes: "Episodes",
    dSimilar: "More like this",
    dSeeInKino: "Open in Kino",
    shShare: "Share",
    shSheet: "Share on Kino Social",
    shText: "What do you want to say",
    shWatching: "I'm watching \"{t}\" on Cinejoy",
    shAttach: "Attach the title",
    shSend: "Send to Kino Social",
    shNote: "It reaches Kino Social as a draft: you review and post it there.",
    shDone: "Done: the draft waits in Kino Social for you to review and post.",
    shEmpty: "Write something or attach the title.",
    shMissing: "Install Kino Social to share.",
    shOldKino: "Update Kino to share on Kino Social.",
    shFailed: "Could not send to Kino Social. Try again.",
  },
};

const fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? String(vars[k]) : m));

/** "en" when Kino runs in English, else "es". */
export function langOf(kino = globalThis.kino) {
  return String((kino && kino.lang) || "").toLowerCase().startsWith("en") ? "en" : "es";
}

/** The sentence for [key] in the person's language, its `{name}` placeholders filled from [vars]. */
export function t(key, vars, kino = globalThis.kino) {
  const words = WORDS[langOf(kino)];
  return fill(words[key] ?? WORDS.es[key] ?? key, vars);
}

/** [key] in both languages: `{ es, en }`. */
export function both(key, vars) {
  return { es: fill(WORDS.es[key] ?? key, vars), en: fill(WORDS.en[key] ?? WORDS.es[key] ?? key, vars) };
}

export const KEYS = { es: Object.keys(WORDS.es), en: Object.keys(WORDS.en) };
