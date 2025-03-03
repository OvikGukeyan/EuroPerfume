'use client'

import { cn } from "@/shared/lib/utils";
import React, { FC, useState } from "react";
import { GroupVariants } from "./group-variants";
import { Button, Separator } from "../ui";
import Image from "next/image";
import { Title, Text, VolumeSelection } from ".";
import { Volume } from "@/shared/constants/perfume";

interface Props {
  id: number,
  imageUrl: string;
  name: string;
  price: number;
  description: string;
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
  loading,
  onSubmit,
  className,
}) => {
  const [volume, setVolume] = useState<Volume>(1)

  return (
    <div className={cn("flex flex-col lg:flex-row flex-1", className)}>
      <div className="flex  items-center justify-center flex-1 relative w-2/5">
        <Image
          width={350}
          height={350}
          src={imageUrl}
          alt="product"
          className="z-10 duration-300 w-[350px] h-[350px] "
        />
      </div>

      <div className="w-3/5 bg-[#f2f2f2] p-7">
        <Title text={name} size="md" className="font-extrabold mb-2" />

        <Separator />

        <Text className="my-4">{description}</Text>

        <VolumeSelection volume={volume} setVolume={setVolume} className="mb-4" />

        <Separator />

        <Button
          loading={loading}
          onClick={() => onSubmit?.(id, volume)}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-6"
        >
          Add too cart for {price * (volume as number)} €
        </Button>
        <GroupVariants items={[]} />
      </div>
    </div>
  );
};
