"use client";

import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { Separator } from "../ui";
import { SocialMediaBar } from "./social-media-bar";
import { links } from "@/src/shared/services/constants";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  const t = useTranslations("Footer");
  const locale = useLocale() as "ru" | "de";

  return (
    <div
      className={cn("flex flex-col p-3 md:p-5 border-t bg-gray-50", className)}
    >
      <SocialMediaBar className="py-10" />
      <Separator className="my-10" />

      <div className="flex flex-col gap-10 justify-between ">
        <Image src="/assets/logo.png" width={120} height={40} alt="logo" />
        <div className="flex flex-col gap-5 max-h-[230px] flex-wrap px-0 md:px-5">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <h3 className="text-md  ">{link.label[locale]}</h3>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-5 mt-10">
        <p className="text-xs text-slate-600">
          Die hier angebotenen Duftproben (Decants) stammen aus originalen,
          rechtmäßig erworbenen Parfümflakons. Verkauf ausschließlich als
          Sammlerobjekte. Nicht zur Anwendung auf der Haut bestimmt.
        </p>
        <h5>EuroPerfume 2024. Alle Rechte vorbehalten.</h5>
      </div>
    </div>
  );
};
