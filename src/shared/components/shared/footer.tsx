"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { Separator } from "../ui";
import { SocialMediaBar } from "./social-media-bar";
import { links } from "@/src/shared/services/constants";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  const t = useTranslations("Footer");
  const locale = useLocale() as "ru" | "de";

  return (
    <div className={cn("flex flex-col p-3 md:p-5 border-t bg-gray-50", className)}>
      <SocialMediaBar className="py-10"/>
      <Separator className="my-10" />

      <div className="flex flex-col gap-7 md:flex-row items-center justify-between ">
        <Image src="/assets/logo.png" width={120} height={40} alt="logo" />
        <div className="flex flex-col md:flex-row md:gap-14 justify-between text-center items-center flex-1 mx-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <h3 className="text-md font-semibold">{link.label[locale]}</h3>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 mt-20">
        <h5>EuroPerfume 2024. Alle Rechte vorbehalten.</h5>
        <div className="flex gap-3">
          <Link href="/privacy-policy">
            <p>Datenschutz</p>
          </Link>
          <Link href="/impressum">
            <p>Impressum</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
