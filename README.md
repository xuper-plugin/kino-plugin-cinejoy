# Cinejoy (plugin de Kino)

Películas y series. El catálogo sale del TMDB de Kino (`kino.tmdb`, sin llave propia); el video, del reproductor de la
página pública de Cinejoy (https://cinejoy.pk), que Kino abre en un navegador oculto.

**Kino no aloja nada.** Este plugin solo abre la página pública del sitio y toma lo que el propio reproductor de la página
pide; no toca la API del sitio ni se salta ninguna protección (si la página pide una verificación humana, la captura termina).
Cada quien es responsable del plugin que instala y del uso que le da; Kino solo lista los plugins de la comunidad.

## Qué tiene

- **Pantalla propia** (Kino 0.9.74+): barra con el logo, pestañas Inicio / Películas / Series, carrusel con el logo de cada
  título, filas con "Ver más", "Continuar viendo", buscador con historial y página de título (fondo, datos, reparto con fotos,
  temporadas con sus episodios y "Más como esto"). Los géneros están en las Categorías de Kino.
- **Sección en Kino**, **categorías** por género y **filas en el Inicio** de Kino (se apagan en Ajustes).
- **Reproducción:** el video del reproductor de la página (necesita que apruebes en rojo "abrir páginas web ocultas");
  **subtítulos** del índice abierto del sitio (`subs.wing.st`), con el idioma elegido en Ajustes primero (español o inglés).
- **Abre rápido:** una capa de estantes compartida entre el Inicio de Kino, la sección y la pantalla (frescos 6 h, usables
  hasta 24 h si falla la red) y copia de cada pestaña y del Inicio por 7 días que se dibuja al instante y se refresca detrás.
- **Compartir en Kino Social** (Kino 0.9.81+): desde la página de un título o la barra, llega como borrador.
- Todo texto en español e inglés.

## Estructura

```
src/
  plugin.js        lo que Kino llama (search, home, browse, section, categories, episodes, details, resolve, screen…)
  i18n.js          textos en español e inglés
  refs.js          referencias (m:, s:, e:, d:)
  tmdb.js          kino.tmdb, items, episodios, ficha de película
  cache.js         caché persistente compartida (kino.storage, ≤48 KB por entrada, expulsa la más vieja)
  catalog.js       estantes, pestañas, "Ver más", copia del Inicio (home1) y categorías
  resolve.js       página de reproducción → kino.browser.capture → Stream con headers y subtítulos
  settings.js      ajustes
  browse/          la pantalla propia (index, view, detail, model, logos, logo, share)
sdk/ kino.d.ts GUIDE.md contract.json   el kit de Kino (copia, no se edita)
scripts/           make-icon.mjs (icono y logo), package.mjs (.kinoplugin)
test/              pruebas (incluye que plugin.js esté al día)
plugin.js          el archivo único que Kino carga (generado)
```

## Comandos

```bash
npm install
npm run build      # src/ → plugin.js
npm test
npm run validate   # build + node sdk/validate.mjs .
npm run package    # build + dist/cinejoy-<versión>.kinoplugin
npm run icon       # vuelve a dibujar los iconos
```

La captura real del video solo se prueba en un aparato (en el kit de Node `kino.browser.capture` responde `browser_unavailable`).

---

# Cinejoy (Kino plugin) — English

Movies and series. The catalog is Kino's TMDB (`kino.tmdb`, no key of its own); the video comes from the player of
Cinejoy's public page (https://cinejoy.pk), opened in Kino's hidden web view.

**Kino hosts nothing.** The plugin only opens the site's public page and takes what the page's own player requests; it does
not touch the site's API or bypass any protection (a human check ends the capture). Whoever installs the plugin is
responsible for it and for how it is used; Kino only lists community plugins.

It has its own screen (tabs, banner slider, rows, search with history, title page with cast and seasons), a section, genre
categories, Home rows, subtitles from the site's open index (Spanish or English first), a shared persistent shelf cache and
7-day kept copies of each tab and of Home so it opens at once. Build with `npm run build`, test with `npm test`, package
with `npm run package` (a `.kinoplugin` file for Kino ▸ Plugins ▸ + ▸ "Import plugin from a file"). The real video capture
can only be tested on a device.
