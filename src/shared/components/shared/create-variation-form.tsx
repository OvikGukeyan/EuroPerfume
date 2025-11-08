"use client";
import React, { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { Title } from ".";
import { Label } from "../ui/label";
import { Button, Input } from "..";
import { imageCompressor } from "../../lib";
import { createVariation } from "@/src/app/actions";

type Props = {
  className?: string;
  id: string;
};

export const CreateVariationForm: FC<Props> = ({ className, id }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = new FormData(e.currentTarget);
      const images = form.getAll("variations") as unknown as File[];

      const compressedImages = await Promise.all(
        images?.map((image) => imageCompressor(image, "image/webp"))
      );

      const newFormData = new FormData();
      if (compressedImages && compressedImages.length > 0) {
        compressedImages.forEach((file) => {
          newFormData.append("variations", file);
          newFormData.append("productId", id);
        });
      }

      await createVariation(newFormData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("px-10 mb-10", className)}>

      <form className="flex flex-col items-start gap-5" onSubmit={handleSubmit}>
        <div>
          <Label className=" text-lg" htmlFor="mobileImgRu">
            Create new Variation
          </Label>
          <Input
            multiple
            className="mt-2"
            required
            type="file"
            accept="image/*"
            name="variations"
          />
        </div>

        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
