"use client";
import NativeLink from "next/link";
import React, { FC, Suspense, useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";
import { LanguageSwitcher, MenuDrawerItem, SocialMediaBar } from ".";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "../ui/sheet";
import { Button } from "..";
import { Menu, X, Heart } from "lucide-react";
import { useCategories } from "@/src/shared/hooks";
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
    <SheetContent side="left" className="flex h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden border-0 bg-white p-0 text-[#202020] shadow-none sm:w-[620px] sm:max-w-none xl:hidden [&>button]:hidden">
     <header className="relative z-20 flex min-h-[78px] shrink-0 items-center justify-center border-b border-[#ededeb] bg-white px-16 py-4 sm:min-h-[88px]">
      <SheetTitle asChild><Link href="/" onClick={()=>{setOpen(false);window.scrollTo({top:0,behavior:"auto"});}} aria-label={locale==="ru"?"EURO PERFUME — на главную":"EURO PERFUME – zur Startseite"} className="font-sans text-[18px] font-semibold uppercase tracking-[.17em] text-[#202020] transition-opacity hover:opacity-65">EURO PERFUME</Link></SheetTitle>
      <SheetClose asChild>
       <button type="button" aria-label={locale==="ru"?"Закрыть меню":"Menü schließen"} className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#202020] transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
        <X size={24} strokeWidth={1.8} aria-hidden="true"/>
       </button>
      </SheetClose>
     </header>
     <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 [-webkit-overflow-scrolling:touch] sm:px-8">
      <div>
      {categories.filter(category=>category.id===1).map(category=><MenuDrawerItem key={category.id} setOpen={setOpen} category={category} locale={locale} featured={featured} showFeatured/>)}
      <Link href="/items?category=1&gender=FEMALE" onClick={()=>setOpen(false)} className="flex min-h-16 items-center border-b border-[#e5e5e5] py-5 text-[21px] font-normal">{locale==="ru"?"Женские":"Damen"}</Link>
      <Link href="/items?category=1&gender=MALE" onClick={()=>setOpen(false)} className="flex min-h-16 items-center border-b border-[#e5e5e5] py-5 text-[21px] font-normal">{locale==="ru"?"Мужские":"Herren"}</Link>
      <Link href="/items?category=1&gender=UNISEX" onClick={()=>setOpen(false)} className="flex min-h-16 items-center border-b border-[#e5e5e5] py-5 text-[21px] font-normal">{locale==="ru"?"Унисекс":"Unisex Düfte"}</Link>
      <NativeLink href="/discovery/index.html" prefetch={false} onClick={()=>setOpen(false)} className="flex min-h-16 items-center border-b border-[#e5e5e5] py-5 text-[21px] font-normal">Discovery Box</NativeLink>
      <Link href="/sale" onClick={()=>setOpen(false)} className="flex min-h-16 items-center justify-between border-b border-[#e5e5e5] py-5 text-[21px] font-medium text-[#923a40]" aria-label={locale==="ru"?"SALE — Скидки":"SALE — Reduzierte Artikel"}>
       <span>SALE</span>
      </Link>
      <Link href="/favorites" onClick={()=>setOpen(false)} className="flex min-h-16 items-center gap-3 border-b border-[#e5e5e5] py-5 text-[21px] font-normal"><Heart size={24} strokeWidth={1.7} aria-hidden="true"/>{locale==="ru"?"Избранное":"Favoriten"}</Link>
     </div>
     <footer className="mt-4">
      <p className="text-center text-[13px] text-[#555]">{locale==="ru"?"Мы в социальных сетях":"Folgen Sie uns"}</p>
      <SocialMediaBar className="mx-auto mt-4"/>
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#e9e8e6] pt-5">
       <span className="text-[13px] font-medium">{locale==="ru"?"Язык":"Sprache"}</span>
       <Suspense><LanguageSwitcher className="text-[14px]"/></Suspense>
      </div>
     </footer>
     </div>
    </SheetContent>
   </Sheet>
  </Suspense>
 </div>;
};
