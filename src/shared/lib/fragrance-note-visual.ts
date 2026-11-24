import existing from "./fragrance-note-images.json";
import additions from "./fragrance-note-visual-additions.json";

type Visual = { file: string; grid: number; cell: number };
type Names = { labelRu: string; labelDe: string };
const key = (s: string) => s.normalize("NFKC").trim().toLowerCase().replace(/[\s‑–—-]+/gu, " ").replaceAll("ё", "е");

const russian = new Map<string, Visual>();
const german = new Map<string, Visual>();
const canonical = new Map<string, Visual>();
for (const {labelRu, labelDe, atlas, cell} of existing) {
  const visual = { file: `atlas-${String(atlas).padStart(2, "0")}`, grid: 6, cell };
  russian.set(key(labelRu), visual);
  german.set(key(labelDe), visual);
  canonical.set(key(labelRu), visual);
}
for (const {ru, de, source} of additions.aliases) {
  const visual = canonical.get(key(source));
  if (!visual) continue;
  russian.set(key(ru), visual);
  german.set(key(de), visual);
}
for (const {ru, de, file, grid, cell} of additions.photos) {
  const visual = { file, grid, cell };
  russian.set(key(ru), visual);
  german.set(key(de), visual);
}

export function fragranceNoteVisual(note: Names): Visual | undefined {
  // IDs are not a stable asset key across production, preview and future imports.
  // Match canonical spellings in either locale, not substrings or unrelated notes.
  return russian.get(key(note.labelRu)) ?? german.get(key(note.labelDe));
}

export function fragranceNoteBackground({file, grid, cell}: Visual) {
  const step = 100 / (grid - 1);
  return {
    backgroundImage: `url(/assets/notes/${file}.webp)`,
    backgroundSize: `${grid * 100}% ${grid * 100}%`,
    backgroundPosition: `${(cell % grid) * step}% ${Math.floor(cell / grid) * step}%`,
  };
}
