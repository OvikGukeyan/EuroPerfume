import React, { FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { Separator } from "../ui";
import { SocialMediaBar } from "./social-media-bar";

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex flex-col p-3 md:p-5 border-t", className)}>
      <div className="flex items-center justify-between">
        <Image src={"/assets/logo.png"} width={120} height={40} alt="logo" />
       <SocialMediaBar />
      </div>
      <Separator className="my-5" />
      <div className="flex items-center justify-between gap-5 ">
        <h5>EuroPerfume 2024. All rights reserved.</h5>
        <div className="flex gap-3">
          <p>Datenschutz</p>
          <p>Impressum</p>
        </div>
      </div>
    </div>
  );
};
