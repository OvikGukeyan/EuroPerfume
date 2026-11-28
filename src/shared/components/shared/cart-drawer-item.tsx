"use client";
import React, { FC } from "react";
import { cn } from "@/src/shared/lib/utils";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import * as CartDetail from "./cart-item-details";
import { Trash2 } from "lucide-react";
import { CountButton } from ".";
import { useLocale } from "next-intl";
import { ProductGroup } from "@prisma/client";

interface Props extends CartItemProps {
 packMl?:number|null;
 lockedCount?:boolean;
 options?:React.ReactNode;
 onClickCountButton:(type:"plus"|"minus")=>void;
 onClickRemove:()=>void;
 variation?:string;
 productGroup?:ProductGroup;
 className?:string;
}
export const CartDrawerItem:FC<Props>=({imageUrl,name,price,brand,quantity,disabled,variation,packMl,lockedCount,options,productGroup,onClickCountButton,onClickRemove,className})=>{
 const ru=useLocale()==="ru";
 return <div className={cn("flex w-full items-start gap-3 bg-white py-4 sm:gap-4",{"pointer-events-none opacity-50":disabled},className)}>
   <div className="flex h-[102px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f7f7f6] sm:h-[116px] sm:w-[108px]">
     <CartDetail.Image src={imageUrl}/>
   </div>
   <div className="min-w-0 flex-1">
     <p className="mb-0.5 text-[10px] uppercase tracking-[.12em] text-[#777]">{brand?.name}</p>
     <p className="break-words text-[14px] font-medium leading-snug text-[#262626]">{name}</p>
     <p className="mt-1 text-[12px] text-[#777]">{variation || (ru?productGroup?.labelRu:productGroup?.labelDe) || (ru?"Объём выбирается в карточке":"Größe gemäß Produktauswahl")}</p>
     <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
       {lockedCount ? <span>{quantity} {ru?"мл":"ml"}</span> :
         <CountButton onTap={Boolean(productGroup?.onTap)} packMl={packMl} onClick={onClickCountButton} value={packMl ? quantity/packMl : quantity}/>}
       <span className="text-[15px] font-semibold tabular-nums"><CartDetail.Price value={price}/></span>
     </div>
     {options}
     <button type="button" onClick={onClickRemove} className="mt-2 inline-flex min-h-8 items-center gap-1 text-[11px] text-[#747474] underline underline-offset-4 hover:text-black" aria-label={(ru?"Удалить ":"Entfernen ")+name}><Trash2 size={13}/>{ru?"Удалить":"Entfernen"}</button>
   </div>
 </div>;
};
