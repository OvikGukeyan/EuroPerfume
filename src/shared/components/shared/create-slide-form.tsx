"use client";
import React, { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { Title } from ".";
import { Label } from "../ui/label";
import { Button, Input } from "..";
import { imageCompressor } from "../../lib";
import { createSlide } from "@/src/app/actions";

type Props = {
  className?: string;
  id: string;
};

export const CreateSlideForm: FC<Props> = ({ className, id }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = new FormData(e.currentTarget);
      const desctopImgRu = form.get("desctopImgRu") as File;
      const mobileImgRu = form.get("mobileImgRu") as File;
      const desctopImgDe = form.get("desctopImgDe") as File;
      const mobileImgDe = form.get("mobileImgDe") as File;

      const compressedDesctopImgRu = await imageCompressor(
        desctopImgRu,
        "image/webp"
      );
      const compressedMobileImgRu = await imageCompressor(
        mobileImgRu,
        "image/webp"
      );
      const compressedDesctopImgDe = await imageCompressor(
        desctopImgDe,
        "image/webp"
      );
      const compressedMobileImgDe = await imageCompressor(
        mobileImgDe,
        "image/webp"
      );

      const newFormData = new FormData();
      newFormData.append("name", form.get("name") as string);
      newFormData.append("link", form.get("link") as string);
      newFormData.append("desctopImgRu", compressedDesctopImgRu);
      newFormData.append("mobileImgRu", compressedMobileImgRu);
      newFormData.append("desctopImgDe", compressedDesctopImgDe);
      newFormData.append("mobileImgDe", compressedMobileImgDe);
      newFormData.append("location", id);

      await createSlide(newFormData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("px-10 mb-10", className)}>
      <Title className="mb-5" text="Create new Slide" />

      <form className="flex flex-col items-start gap-5" onSubmit={handleSubmit}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Name
          </Label>
          <Input required name="name" className="mt-2" placeholder="Name" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="desctopImgRu">
            Desctop Image Ru
          </Label>
          <Input className="mt-2" required type="file" accept="image/*" name="desctopImgRu" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="mobileImgRu">
            Mobile Image Ru
          </Label>
          <Input className="mt-2" required type="file" accept="image/*" name="mobileImgRu" />
        </div>

         <div>
          <Label  className=" text-lg" htmlFor="desctopImgDe">
            Desctop Image De
          </Label>
          <Input className="mt-2" required type="file" accept="image/*" name="desctopImgDe" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="mobileImgDe">
            Mobile Image De
          </Label>
          <Input className="mt-2" required type="file" accept="image/*" name="mobileImgDe" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="name">
            Link
          </Label>
          <Input required name="link" className="mt-2" placeholder="link" />
        </div>
        <Button loading={loading} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};
