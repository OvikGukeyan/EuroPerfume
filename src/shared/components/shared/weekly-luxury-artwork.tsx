"use client";

import {ArrowUpRight} from "lucide-react";

const money=(value:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(value);

/**
 * Visual component shared by storefront and weekly-offer admin preview.
 * The photographic architecture is an empty scene; never use baked-in fragrance images or text.
 * Dynamic bottle images are composited as multiply to eliminate ordinary white packshot backgrounds.
 */
export function WeeklyLuxuryArtwork({
 name,brand,image,productId,salePrice,regularPrice,volume,ru,until,preview=false
}:{
 name:string;brand:string;image:string;productId:number;salePrice:number;regularPrice:number;
 volume:number;ru:boolean;until?:string;preview?:boolean
}){
 return <div className={`weekly-luxury-artwork storefront-desktop-hero relative isolate w-full overflow-hidden text-[#fff5e9] ${preview?"weekly-luxury-preview":""}`}>
  <img src="/assets/day-offers/initio-desktop-wide-scene.webp" alt="" aria-hidden="true"
   className="weekly-luxury-scene pointer-events-none absolute inset-0 h-full w-full object-cover"/>
  <div aria-hidden="true" className="weekly-luxury-vignette pointer-events-none absolute inset-0"/>
  <div className="weekly-luxury-copy relative z-20 flex min-w-0 flex-col items-start justify-center">
   <p className="weekly-luxury-eyebrow">EURO PERFUME <span aria-hidden="true">·</span> {ru?"АРОМАТ НЕДЕЛИ":"DUFT DER WOCHE"}</p>
   <h2 className="weekly-luxury-title font-serif" title={name}>{name}</h2>
   <p className="weekly-luxury-brand">{brand}</p>
   <div className="weekly-luxury-price">
    <p className="weekly-luxury-discount font-serif">−10%</p>
    <div className="weekly-luxury-amount">
     <strong>{money(salePrice)}</strong><del>{money(regularPrice)}</del><span>{volume} ml</span>
    </div>
   </div>
   <span className="weekly-luxury-action">
    {ru?"ОТКРЫТЬ АРОМАТ":"DUFT ENTDECKEN"} <ArrowUpRight aria-hidden="true" size={16}/>
   </span>
   {until&&<p className="weekly-luxury-until">{ru?"Акция до":"Angebot bis"} {until}</p>}
  </div>
  <div className="weekly-luxury-bottle-wrap pointer-events-none absolute z-10 flex items-center justify-center" aria-hidden="true">
   {image&&productId>0?<img key={productId} src={`/api/weekly-bottle/${productId}`} alt="" loading={preview?"lazy":"eager"}
    onError={event=>{event.currentTarget.style.opacity="0"}}
    className="weekly-luxury-bottle h-full w-full object-contain"/>:<span className="weekly-luxury-placeholder"/>}
  </div>
 </div>;
}
