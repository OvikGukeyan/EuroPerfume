import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  className?: string;
};

export const SocialMediaBar: FC<Props> = ({ className }) => {
  const t = useTranslations("SocialMedia");
  return (
    <div className={cn("flex flex-col items-center  gap-6 bg-white", className)}>
      <div className="text-center">
        <p className="text-lg font-semibold">{t("follow")}</p>
      </div>
      <div className="flex gap-7">
          <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.instagram.com/europerfumedeutschland?igsh=MWY1YWZ0Z25ybnYwcA%3D%3D&utm_source=qr"
        >
          <Image
            src={"/assets/images/instagram.png"}
            width={35}
            height={35}
            alt={"instagram"}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.facebook.com/share/1AS6TtmyrW/?mibextid=wwXIfr"
        >
          <Image
            src={"/assets/images/facebook.png"}
            width={35}
            height={35}
            alt={"facebook"}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tiktok.com/@europerfumede?_t=ZN-8vlgwwUxpfK&_r=1"
        >
          <Image
            src={"/assets/images/tiktok.png"}
            width={35}
            height={35}
            alt={"tiktok"}
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/4915231651047"
        >
          <Image
            src={"/assets/images/whatsapp.png"}
            width={35}
            height={35}
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
            width={35}
            height={35}
            alt={"youtube"}
          />
        </a>
      </div>
    </div>
  );
};
