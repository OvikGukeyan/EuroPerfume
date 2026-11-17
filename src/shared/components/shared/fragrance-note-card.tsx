import noteImages from "../../lib/fragrance-note-images.json";
import { noteLabel } from "../../lib/note-label";

const imagesById = new Map(noteImages.map(note => [note.id, note]));
const imagesByName = new Map(noteImages.map(note => [note.labelRu.trim().toLowerCase(), note]));

export function FragranceNoteCard({ note, locale }: {
  note: { id?: number; labelRu: string; labelDe: string };
  locale: "ru" | "de";
}) {
  const visual = (note.id === undefined ? undefined : imagesById.get(note.id))
    ?? imagesByName.get(note.labelRu.trim().toLowerCase());
  return <li className="fragrance-note-card">
    {visual && <span className="fragrance-note-photo" aria-hidden="true" style={{
      backgroundImage: `url(/assets/notes/atlas-${String(visual.atlas).padStart(2, "0")}.webp)`,
      backgroundPosition: `${(visual.cell % 6) * 20}% ${Math.floor(visual.cell / 6) * 20}%`,
    }} />}
    <span className="fragrance-note-label">{noteLabel(note, locale)}</span>
  </li>;
}
