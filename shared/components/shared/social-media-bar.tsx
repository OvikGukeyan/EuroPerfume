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
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/europerfumedeutschland?igsh=MWY1YWZ0Z25ybnYwcA%3D%3D&utm_source=qr"
        >
          <Image
            src={"/assets/images/instagram.png"}
            width={30}
            height={30}
            alt={"instagram"}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/share/1AS6TtmyrW/?mibextid=wwXIfr"
        >
          <Image
            src={"/assets/images/youtube.png"}
            width={30}
            height={30}
            alt={"youtube"}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tiktok.com/@europerfumede?_t=ZN-8vlgwwUxpfK&_r=1"
        >
          <Image
            src={"/assets/images/tiktok.png"}
            width={30}
            height={30}
            alt={"tiktok"}
          />
        </a>
      </div>
      <div className="flex items-center justify-end gap-5 ">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/4915231651047"
        >
          <Image
            src={"/assets/images/whatsapp.png"}
            width={30}
            height={30}
            alt={"instagram"}
          />
        </a>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://t.me/EuroPerfum"
        >
          <Image
            src={"/assets/images/telegram.png"}
            width={30}
            height={30}
            alt={"youtube"}
          />
        </a>
      </div>
    </div>
  );
};
