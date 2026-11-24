import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import additions from "../src/shared/lib/fragrance-note-visual-additions.json";
import { fragranceNoteBackground, fragranceNoteVisual } from "../src/shared/lib/fragrance-note-visual";

test("Tempest's ten newly mapped notes resolve with real sprite assets", () => {
  const tempest = ["Парагвайский петитгрей", "Болгарская лаванда", "Амбровая древесина", "Индийский жасмин самбак", "Индийский циприол", "Малайзийский гурьюнский бальзам", "Гаитянский ветивер", "Лаосский уд Буая", "Сингапурские пачули", "Австралийский сандал"];
  for (const labelRu of tempest) {
    const v = fragranceNoteVisual({labelRu, labelDe: ""});
    assert.ok(v, labelRu);
    assert.ok(existsSync(`public/assets/notes/${v.file}.webp`), v.file);
  }
});

test("catalog input is normalized in both locales, without arbitrary image guesses", () => {
  assert.deepEqual(fragranceNoteVisual({labelRu: "  ЗЕЛЕНОЕ   ЯБЛОКО ", labelDe: ""}), fragranceNoteVisual({labelRu: "", labelDe: "Grüner Apfel"}));
  assert.equal(fragranceNoteVisual({labelRu: "незнакомый аккорд", labelDe: "nicht kartiert"}), undefined);
});

test("all declared note pictures point at real atlas cells", () => {
  for (const {ru, de} of [...additions.aliases, ...additions.photos]) {
    const v = fragranceNoteVisual({labelRu: ru, labelDe: ""});
    assert.ok(v, ru);
    assert.deepEqual(v, fragranceNoteVisual({labelRu: "", labelDe: de}));
    assert.ok(v.cell >= 0 && v.cell < v.grid ** 2);
    assert.ok(existsSync(`public/assets/notes/${v.file}.webp`), v.file);
  }
  assert.deepEqual(fragranceNoteBackground({file: "materials-01", grid: 4, cell: 15}), {
    backgroundImage: "url(/assets/notes/materials-01.webp)",
    backgroundSize: "400% 400%",
    backgroundPosition: "100% 100%",
  });
});
