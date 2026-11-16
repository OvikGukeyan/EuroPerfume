import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import { Instagram, Facebook, Send } from "lucide-react";
import { useTranslations } from "next-intl";
const networks = [
 {name:"Instagram",href:"https://www.instagram.com/europerfumedeutschland?igsh=MWY1YWZ0Z25ybnYwcA%3D%3D&utm_source=qr",Icon:Instagram},
 {name:"Facebook",href:"https://www.facebook.com/share/1AS6TtmyrW/?mibextid=wwXIfr",Icon:Facebook},
 {name:"Telegram",href:"https://t.me/EuroPerfum",Icon:Send},
];
export const SocialMediaBar: FC<{className?:string}> = ({className}) => {
 const t=useTranslations("SocialMedia");
 return <div className={cn("flex flex-col items-center gap-5 bg-white",className)}>
  <p className="text-center text-base font-medium">{t("follow")}</p>
  <div className="flex flex-wrap justify-center gap-5">
   {networks.map(({name,href,Icon})=><a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-2 rounded text-neutral-700 hover:text-[#304a3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"><Icon size={23} strokeWidth={1.5} aria-hidden="true"/><span className="text-xs">{name}</span></a>)}
  </div>
 </div>;
};
