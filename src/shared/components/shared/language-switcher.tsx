"use client";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useLocale } from "next-intl";
import { FC } from "react";
import { cn } from "../../lib/utils";
import { useSearchParams } from "next/navigation";
interface Props {className?:string}
export const LanguageSwitcher:FC<Props>=({className})=>{
 const router=useRouter(),pathname=usePathname(),params=useSearchParams();
 const locale=useLocale();
 const changeLanguage=(newLocale:"ru"|"de")=>{
  if(newLocale===locale)return;
  const query=params.toString();
  router.push(query?`${pathname}?${query}`:pathname,{locale:newLocale});
 };
 return <div role="group" aria-label={locale==="ru"?"Язык сайта":"Seitensprache"} className={cn("inline-flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-[#f7f7f7] p-1",className)}>
  {(["ru","de"] as const).map(lang=><button key={lang} type="button" onClick={()=>changeLanguage(lang)} aria-pressed={locale===lang} className={`min-w-12 rounded-full px-3 py-2 text-[12px] font-semibold tracking-wide transition ${locale===lang?"bg-[#252525] text-white":"text-[#656565] hover:bg-white"}`}>{lang.toUpperCase()}</button>)}
 </div>;
};
