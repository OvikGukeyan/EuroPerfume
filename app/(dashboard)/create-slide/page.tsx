"use client";

import { createSlide } from "@/app/actions";
import { Button, Input, Title } from "@/shared/components";
import { Label } from "@/shared/components/ui/label";
import { imageCompressor } from "@/shared/lib";
import { useState } from "react";
import { set } from "zod";

export default function CreateSlide() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const desctopImg = form.get("desctopImg") as File;
    const mobileImg = form.get("mobileImg") as File;

    // Сжатие файлов
    const compressedDesctopImg = await imageCompressor(desctopImg);
    const compressedMobileImg = await imageCompressor(mobileImg);

    // Новый FormData с уже сжатыми файлами
    const newFormData = new FormData();
    newFormData.append("name", form.get("name") as string);
    newFormData.append("link", form.get("link") as string);
    newFormData.append("desctopImg", compressedDesctopImg);
    newFormData.append("mobileImg", compressedMobileImg);

    // Отправка в server action
    await createSlide(newFormData);

    setLoading(false);
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
