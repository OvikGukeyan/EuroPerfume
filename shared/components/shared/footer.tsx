import React, { FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { Separator } from "../ui";

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex flex-col p-3 md:p-5 border-t", className)}>
      <div className="flex items-center justify-between">
        <Image src={"/assets/logo.jpg"} width={120} height={40} alt="logo" />
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <p>Follow our social networks</p>
            <div className="flex justify-end gap-3 ">
              <Image
                src={"/assets/images/instagram.png"}
                width={30}
                height={30}
                alt={"instagram"}
              />
              <Image
                src={"/assets/images/youtube.png"}
                width={30}
                height={30}
                alt={"youtube"}
              />
              <Image
                src={"/assets/images/tiktok.png"}
                width={30}
                height={30}
                alt={"tiktok"}
              />
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <p>Contact us</p>
            <div className="flex items-center gap-3 ">
              <Image
                src={"/assets/images/whatsapp.png"}
                width={30}
                height={30}
                alt={"instagram"}
              />
              <Image
                src={"/assets/images/telegram.png"}
                width={30}
                height={30}
                alt={"youtube"}
              />
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="flex items-center justify-between  ">
        <h5>EuroPerfume 2024. All rights reserved.</h5>
        <div className="flex gap-3">
          <p>Datenschutz</p>
          <p>Impressum</p>
        </div>
      </div>
    </div>
  );
};
