"use client";
import NativeLink from "next/link";
import React from "react";
import { ChevronDown } from "lucide-react";
import { Category, ProductGroup } from "@prisma/client";
import { Link } from "@/src/i18n/navigation";
type Featured={id:number;name:string;brand:string;image:string;price:number};
type Props={category:Category & {productGroups:ProductGroup[]};setOpen:(v:boolean)=>void;locale:"ru"|"de";className?:string;featured?:Featured[];showFeatured?:boolean};
export const MenuDrawerItem:React.FC<Props>=({category,setOpen,locale,featured=[],showFeatured=false,className})=>{
 const [expanded,setExpanded]=React.useState(false);
 const title=locale==="ru"?category.labelRu:category.labelDe;
 const pickCategory=()=>setOpen(false);
 const pickGroup=(group:ProductGroup)=>setOpen(false);
 return <section className={`border-b border-[#e9e8e6] ${className||""}`}>
  <button type="button" onClick={()=>setExpanded(v=>!v)} aria-expanded={expanded} aria-controls={`menu-category-${category.id}`} className="flex min-h-[68px] w-full items-center justify-between gap-4 py-4 text-left text-[22px] font-normal tracking-[-.025em] text-[#222] transition-colors hover:text-[#746455] sm:text-[25px]">
   <span>{title}</span><ChevronDown size={21} strokeWidth={1.8} className={`shrink-0 transition-transform duration-200 ${expanded?"rotate-180":""}`}/>
  </button>
  {expanded&&<div id={`menu-category-${category.id}`} className="pb-7 pt-2">
   <div className="grid grid-cols-2 gap-x-4 gap-y-5">
    <Link href={`/items/?category=${category.id}`} onClick={pickCategory} className="text-[15px] font-medium leading-snug text-[#282828] hover:underline">{locale==="ru"?"Все товары":"Alle Produkte"}</Link>
    {category.productGroups.filter(group=>group.id!==30).map(group=>group.id===30?
      <NativeLink href="/discovery/index.html" prefetch={false} key={group.id} onClick={()=>setOpen(false)} className="text-[15px] leading-snug text-[#282828] hover:underline">Discovery Box</NativeLink>
      :<Link key={group.id} href={`/items/?productGroup=${group.id}`} onClick={()=>pickGroup(group)} className="text-[15px] leading-snug text-[#282828] hover:underline">{locale==="ru"?group.labelRu:group.labelDe}</Link>)}
   </div>
   {showFeatured&&featured.length>0&&<div className="mt-9">
    <h3 className="mb-4 font-serif text-[23px] leading-tight text-[#252525]">{locale==="ru"?"Новинки парфюмерии":"Neu eingetroffen"}</h3>
    <div className="grid grid-cols-3 gap-3">
      {featured.map(p=><Link key={p.id} href={`/product/${p.id}`} onClick={()=>setOpen(false)} className="group min-w-0">
       <div className="flex aspect-[4/4.5] items-center justify-center rounded-sm bg-[#f7f6f4] p-2">
        {p.image&&<img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain mix-blend-multiply transition-transform group-hover:scale-105"/>}
       </div>
       <p className="mt-2 line-clamp-2 text-[10px] uppercase leading-tight tracking-[.035em] text-[#777]">{p.brand}</p>
       <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-[#222]">{p.name}</p>
       <p className="mt-1 text-[12px] text-[#555]">{locale==="ru"?"от":"ab"} {p.price.toFixed(2).replace(".",",")} €</p>
      </Link>)}
    </div>
   </div>}
  </div>}
 </section>;
};
