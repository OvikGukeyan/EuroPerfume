import { DeshboardSlide, DragAndDrop } from "@/src/shared/components";
import { getSlides } from "@/src/shared/lib";
import { Slide, SlideImage } from "@prisma/client";

export default async function Slides() {
  const slides = await getSlides();
  return (
    <DragAndDrop slides={slides as (Slide & { images: SlideImage[] })[]} />
  );
}
