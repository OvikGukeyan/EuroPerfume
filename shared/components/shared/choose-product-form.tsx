"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC, useEffect, useState } from "react";
import { Button, Separator } from "../ui";
import Image from "next/image";
import { Title, Text, VolumeSelection } from ".";
import { Volume } from "@/shared/constants/perfume";
import {
  Aromas,
  Brands,
  Classifications,
  Gender,
  Notes,
  PerfumeConcentration,
  Review,
} from "@prisma/client";
import {
  brands,
  concentrations,
  genders,
  notes,
  perfumeAromas,
  classifications,
} from "@/prisma/constants";
import { calcAverageRating, calcPrice, useModalContext } from "@/shared/lib";
import { Rating } from "./rating";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  topNotes: Notes[];
  heartNotes: Notes[];
  baseNotes: Notes[];
  aromas: Aromas[];
  classification: Classifications[];
  concentration: PerfumeConcentration;
  brandCountry: string;
  brand: Brands;
  manufacturingCountry: string;
  perfumer: string;
  gender: Gender;
  releaseYear: number;
  reviews: Review[];
  loading: boolean;
  onSubmit?: (productId: number, volume: Volume) => Promise<void>;
  className?: string;
}
export const ChooseProductForm: FC<Props> = ({
  id,
  name,
  imageUrl,
  price,
  description,
  releaseYear,
  loading,
  onSubmit,
  topNotes,
  heartNotes,
  baseNotes,
  classification,
  brand,
  concentration,
  aromas,
  brandCountry,
  manufacturingCountry,
  perfumer,
  gender,
  reviews,
  className,
}) => {
  const [volume, setVolume] = useState<Volume>(1);
  const currentTopNotes = notes.filter((note) => topNotes.includes(note.value));
  const currentHeartNotes = notes.filter((note) =>
    heartNotes.includes(note.value)
  );
  const currentBaseNotes = notes.filter((note) =>
    baseNotes.includes(note.value)
  );
  const currentAroma = perfumeAromas.filter((aroma) =>
    aromas.includes(aroma.value)
  );
  const currentClassification = classifications.filter((item) =>
    classification.includes(item.value)
  );
  const currentConcentration = concentrations.find(
    (item) => item.value === concentration
  )?.name;
  const currentBrand = brands.find((item) => item.value === brand)?.name;
  const finalPrice = calcPrice(volume, price);
  const { averageRating, count } = calcAverageRating(reviews);
  const router = useRouter();
  const { isModal } = useModalContext();

  useEffect(() => {
    if (!isModal) {
      scrollToReviews();
    }
  }, [isModal]);
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById("reviews");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/product/${id}#reviews`);
    }
  };

  return (
    <div className={cn("flex flex-col lg:flex-row flex-1", className)}>
      <div className="flex  items-center justify-center flex-1 relative w-full lg:w-2/5 bg-[#f2f2f2]">
        <Image
          width={350}
          height={350}
          src={imageUrl}
          alt="product"
          className="z-10 duration-300 w-[350px] h-[350px] "
        />
      </div>

      <div className="w-full lg:w-3/5  bg-[#f2f2f2] p-7">
        <Title text={name} size="md" className="font-extrabold mb-2" />

        <Separator />

        <Text size="md" className="my-4">
          {description}
        </Text>

        <Title text="Characteristics:" size="sm" className="font-bold" />

        <div className="flex justify-between mb-4">
          <ul>
            <li>
              <span className="font-bold mr-2">Brand: </span> {currentBrand}
            </li>
            <li>
              <span className="font-bold mr-2">Classification:</span>{" "}
              {currentClassification.map((classification) => classification.label.ru).join(", ")}
            </li>
            <li>
              <span className="font-bold mr-2">Concentration:</span>{" "}
              {currentConcentration}
            </li>
            <li>
              <span className="font-bold mr-2">Aroma:</span>{" "}
              {currentAroma.map((aroma) => aroma.label.ru).join(", ")}
            </li>
            <li>
              <span className="font-bold mr-2">Top Notes:</span>
              {currentTopNotes.map((note) => note.label.ru).join(", ")}
            </li>
            <li>
              <span className="font-bold mr-2">Heart Notes:</span>{" "}
              {currentHeartNotes.map((note) => note.label.ru).join(", ")}
            </li>
          </ul>
          <ul>
            <li>
              <span className="font-bold mr-2">Base Notes:</span>
              {currentBaseNotes.map((note) => note.label.ru).join(", ")}
            </li>

            <li>
              <span className="font-bold mr-2">Brand Country:</span>{" "}
              {brandCountry}
            </li>
            <li>
              <span className="font-bold mr-2">Manufacturing Country:</span>{" "}
              {manufacturingCountry}
            </li>
            <li>
              <span className="font-bold mr-2">Perfumer:</span> {perfumer}
            </li>

            <li>
              <span className="font-bold mr-2">Gender:</span>
              {genders.find((item) => item.value === gender)?.name}
            </li>
            <li>
              <span className="font-bold mr-2">Release year:</span>{" "}
              {releaseYear}
            </li>
          </ul>
        </div>

        {!isModal ? (
          <div onClick={scrollToReviews} className="cursor-pointer">
            <Rating
              className="mt-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </div>
        ) : (
          <a href={`/product/${id}`}>
            <Rating
              className="mt-5"
              value={averageRating}
              withNumber
              reviewsCount={count}
            />
          </a>
        )}

        <VolumeSelection
          volume={volume}
          setVolume={setVolume}
          className="my-4"
        />

        <Separator />

        <Button
          loading={loading}
          onClick={() => onSubmit?.(id, volume)}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6"
        >
          Add too cart for {finalPrice} €
        </Button>
      </div>
    </div>
  );
};
