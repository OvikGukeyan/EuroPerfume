import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Title, VolumeSelection } from ".";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import { Ingredient } from "@prisma/client";

interface Props {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: Ingredient[];
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  imageUrl,
  className,
  name,
  price,
  ingredients,
  id,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex justify-center bg-secondary rounded-lg h-[260px]">
          <Image
            width={260}
            height={260}
            className=""
            src={
              "https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775"
            }
            alt={name}
          />
        </div>
      </Link>

      <Title
        text={"Emporio Armani Stronger with You"}
        size="sm"
        className="mb-1 mt-3 font-bold"
      />

      {/* <p className="text-sm text-gray-400">
                    {ingredients.map(i => i.name).join(', ')}
                </p> */}
      <VolumeSelection />

      <div className="flex justify-between items-center mt-4">
        <span className="text-[20px]">
          from <b>{price} €</b>
        </span>

        <Button variant="secondary" className="text-base font-bold">
          <Plus size={20} className="mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};
