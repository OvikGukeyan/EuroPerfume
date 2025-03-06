import { DeshboardSlide } from "@/shared/components";
import { getSlides } from "@/shared/lib";

export default async function Slides() {
  const slides = await getSlides();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
      {slides.length > 0 ? (
        slides.map((slide) => (
          <DeshboardSlide
            key={slide.id}
            slide={slide}/>
        ))
      ) : (
        <p>No slides found</p>
      )}
    </div>
  );
}
