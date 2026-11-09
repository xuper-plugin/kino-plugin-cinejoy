import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { openShare, sendShare, shareArgOf, shareSheet, shareTitleOf, SOCIAL_REPO } from "../src/browse/share.js";

let calls;
let answer;
beforeEach(() => {
  calls = [];
  answer = async () => ({ status: "draft", draftId: "d1", pending: 1 });
  globalThis.kino = {
    lang: "es-CO",
    log() {},
    plugins: { call: async (alias, call, arg) => { calls.push({ alias, call, arg }); return answer(); } },
  };
});

const FRIEREN = { kind: "series", tmdb: 209867, title: "Frieren" };

test("a title page's press carries the title; the bar's carries none", () => {
  assert.deepEqual(shareTitleOf(shareArgOf(FRIEREN)), FRIEREN);
  assert.equal(shareTitleOf(""), null);
  assert.equal(shareTitleOf('{"k":"song","d":1}'), null);
});

test("the sheet opens with the watching line and the title switch on; from the bar, empty and text only", () => {
  const withTitle = openShare(shareArgOf(FRIEREN));
  assert.deepEqual(withTitle.ui, [{ open: "shareSheet" }]);
  assert.equal(withTitle.state.inputs.shareText, "Estoy viendo «Frieren» en Cinejoy");
  assert.equal(withTitle.state.inputs.shareTitle, true);
  assert.match(JSON.stringify(shareSheet(withTitle.state.share)), /"type":"Switch","key":"shareTitle"/);
  const bare = openShare("");
  assert.equal(bare.state.share, null);
  assert.equal(bare.state.inputs.shareText, "");
  assert.doesNotMatch(JSON.stringify(shareSheet(null)), /Switch/);
});

test("send: the title and the text, as the wall door takes them", async () => {
  const out = await sendShare({ shareText: "Estoy viendo «Frieren» en Cinejoy", shareTitle: true }, FRIEREN);
  assert.deepEqual(calls, [{ alias: "social", call: "share", arg: { from: "Cinejoy", text: "Estoy viendo «Frieren» en Cinejoy", title: { kind: "series", tmdb: 209867 } } }]);
  assert.deepEqual(out.ui, [{ close: "shareSheet" }]);
  assert.match(out.toast, /borrador en Kino Social/);
});

test("send: text only, from the bar or with the switch off", async () => {
  await sendShare({ shareText: "Recomiendo Cinejoy" }, null);
  await sendShare({ shareText: "Solo texto", shareTitle: false }, FRIEREN);
  assert.deepEqual(calls.map((c) => c.arg), [{ from: "Cinejoy", text: "Recomiendo Cinejoy" }, { from: "Cinejoy", text: "Solo texto" }]);
});

test("send: nothing to send stays in the sheet", async () => {
  const out = await sendShare({ shareText: "   ", shareTitle: false }, FRIEREN);
  assert.equal(calls.length, 0);
  assert.equal(out.toast, "Escribe algo o adjunta el título.");
  assert.equal(out.ui, undefined);
});

test("Kino Social missing: Kino's install sheet; an old Kino: a plain word", async () => {
  answer = async () => { throw Object.assign(new Error("x"), { code: "provider_missing" }); };
  const missing = await sendShare({ shareText: "hola" }, null);
  assert.deepEqual(missing.go, { installPlugin: { repo: SOCIAL_REPO } });
  delete globalThis.kino.plugins;
  const old = await sendShare({ shareText: "hola" }, null);
  assert.equal(old.toast, "Actualiza Kino para compartir en Kino Social.");
});
