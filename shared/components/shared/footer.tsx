import React, { FC } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";
import { Separator } from "../ui";
import { SocialMediaBar } from "./social-media-bar";
import { links } from "@/shared/services/constants";
import Link from "next/link";

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  return (
    <div className={cn("flex flex-col p-3 md:p-5 border-t", className)}>
      <div className="flex flex-col gap-7 md:flex-row  items-center justify-between">
        <Image src={"/assets/logo.png"} width={120} height={40} alt="logo" />
        <div className="flex flex-col md:flex-row gap-7 md:gap-20 justify-center items-center flex-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <h3 className="text-lg font-semibold">{link.label.ru}</h3>
            </Link>
          ))}
        </div>
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
