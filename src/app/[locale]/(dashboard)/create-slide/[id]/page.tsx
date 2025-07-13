"use client";

import { createSlide } from "@/src/app/actions";
import { Button, Input, Title } from "@/src/shared/components";
import { Label } from "@/src/shared/components/ui/label";
import { imageCompressor } from "@/src/shared/lib";
import React, { Usable, use } from "react";
import { useState } from "react";

export default function CreateSlide({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = new FormData(e.currentTarget);
      const desctopImg = form.get("desctopImg") as File;
      const mobileImg = form.get("mobileImg") as File;
  
      const compressedDesctopImg = await imageCompressor(desctopImg, "image/webp");
      const compressedMobileImg = await imageCompressor(mobileImg, "image/webp");
  
      const newFormData = new FormData();
      newFormData.append("name", form.get("name") as string);
      newFormData.append("link", form.get("link") as string);
      newFormData.append("desctopImg", compressedDesctopImg);
      newFormData.append("mobileImg", compressedMobileImg);
      newFormData.append("location", params.id);

  
      await createSlide(newFormData);
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className=" px-10 mb-10">
      <Title className="mb-5" text="Create new Slide" />

      <form className="flex flex-col items-start gap-5" onSubmit={handleSubmit}>
        <div>
          <Label className=" text-lg" htmlFor="name">
            Name
          </Label>
          <Input required name="name" className="mt-2" placeholder="Name" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="desctopImg">
            Desctop Image
          </Label>
          <Input className="mt-2" required type="file" name="desctopImg" />
        </div>

        <div>
          <Label className=" text-lg" htmlFor="mobileImg">
            Mobile Image
          </Label>
          <Input className="mt-2" required type="file" name="mobileImg" />
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
}
