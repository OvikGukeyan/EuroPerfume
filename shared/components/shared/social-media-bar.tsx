import React, { FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  className?: string;
};

export const SocialMediaBar: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex flex-row md:flex-col gap-5", className)}>
      <div className="flex justify-end gap-5 ">
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
      <div className="flex items-center justify-end gap-5 ">
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
  );
};
