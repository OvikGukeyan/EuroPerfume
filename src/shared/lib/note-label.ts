export function noteLabel(note:{labelRu:string;labelDe:string},locale:"ru"|"de") {
  if(locale==="ru") return note.labelRu.trim();
  return note.labelRu.trim()==="Лесной орех" && note.labelDe.trim()==="Walnuss" ? "Haselnuss" : note.labelDe.trim();
}
