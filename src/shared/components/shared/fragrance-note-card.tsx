import { fragranceNoteBackground, fragranceNoteVisual } from "../../lib/fragrance-note-visual";
import { noteLabel } from "../../lib/note-label";

export function FragranceNoteCard({ note, locale }: {
  note: { id?: number; labelRu: string; labelDe: string };
  locale: "ru" | "de";
}) {
  const visual = fragranceNoteVisual(note);
  return <li className="fragrance-note-card">
    {visual && <span className="fragrance-note-photo" aria-hidden="true" style={fragranceNoteBackground(visual)} />}
    <span className="fragrance-note-label">{noteLabel(note, locale)}</span>
  </li>;
}
