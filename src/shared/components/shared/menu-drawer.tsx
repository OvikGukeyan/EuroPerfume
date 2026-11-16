"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";
import { LanguageSwitcher, MenuDrawerItem, SocialMediaBar } from ".";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { Button } from "..";
import { Menu } from "lucide-react";
import { useCategories } from "@/src/shared/hooks";
import { links } from "@/src/shared/services/constants";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";

type Props={className?:string};
type Featured={id:number;name:string;brand:string;image:string;price:number};
export const MenuDrawer:FC<Props>=({className})=>{
 const {categories}=useCategories();
 const [open,setOpen]=useState(false);
 const [featured,setFeatured]=useState<Featured[]>([]);
 const locale=useLocale() as "ru"|"de";
 useEffect(()=>{
  if(!open)return;
  const controller=new AbortController();
  void fetch("/api/menu-featured",{signal:controller.signal}).then(r=>r.ok?r.json():[]).then((p:Featured[])=>setFeatured(p)).catch(()=>undefined);
  return ()=>controller.abort();
 },[open]);
 return <div className={cn(className,"relative z-20")}>
  <Suspense>
   <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
     <Button size="icon" variant="ghost" aria-label={locale==="ru"?"Открыть меню":"Menü öffnen"} className="flex flex-col items-center xl:hidden">
      <Menu size={23}/><span className="text-xs">Menü</span>
     </Button>
    </SheetTrigger>
    <SheetContent side="left" className="flex h-[100dvh] w-full max-w-none flex-col overflow-y-auto border-0 bg-white px-5 pb-8 pt-6 text-[#202020] shadow-none sm:w-[620px] sm:max-w-none sm:px-8 xl:hidden [&>button]:right-5 [&>button]:top-7 [&>button_svg]:h-6 [&>button_svg]:w-6">
     <header className="sticky top-0 z-10 mb-4 flex min-h-11 items-center justify-center border-b border-[#ededeb] bg-white pb-5">
      <SheetTitle className="font-sans text-[18px] font-semibold uppercase tracking-[.17em]">EURO PERFUME</SheetTitle>
     </header>
     <div className="flex-1">
      {categories.map((category,index)=><MenuDrawerItem key={category.id} setOpen={setOpen} category={category} locale={locale} featured={featured} showFeatured={index===0}/>)}
      <nav aria-label={locale==="ru"?"Информация":"Information"} className="grid grid-cols-2 gap-x-5 gap-y-5 border-b border-[#e9e8e6] py-7">
       {links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)} className="text-[13px] leading-relaxed text-[#646464] hover:text-black hover:underline">{link.label[locale]}</Link>)}
      </nav>
     </div>
     <footer className="mt-7">
      <p className="text-center text-[13px] text-[#555]">{locale==="ru"?"Мы в социальных сетях":"Folgen Sie uns"}</p>
      <SocialMediaBar className="mx-auto mt-4"/>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#e9e8e6] pt-5">
       <span className="text-[13px] font-medium">{locale==="ru"?"Язык":"Sprache"}</span>
       <Suspense><LanguageSwitcher className="text-[14px]"/></Suspense>
      </div>
     </footer>
    </SheetContent>
   </Sheet>
  </Suspense>
 </div>;
};
