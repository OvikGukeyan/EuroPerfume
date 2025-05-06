import { DeshboardSlide, DragAndDrop } from "@/src/shared/components";
import { getSlides } from "@/src/shared/lib";
import { reorderSlides } from "@/src/shared/services/slides";

export default async function Slides() {
  const slides = await getSlides();
  return (
   <DragAndDrop slides={slides} />
  );
}
