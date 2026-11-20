import { prisma } from "@/prisma/prisma-client";
import { getLocale } from "next-intl/server";
import { ProductDTO } from "../../services/dto/product.dto";
import { fullBottleInclude, withBottleOptions } from "../../lib/full-bottle";
import { ProductsSelectionList } from "./products-selection-list";
import { HomePriceProvider, HomePriceNote } from "./home-price-note";
import "./fragrance-detail.css";

// Match actual catalogue notes and fragrance families; never recommend the current scent again.
export async function ProductRecommendations({searchParams: product, className}:{searchParams:ProductDTO;className?:string}) {
  const ru=(await getLocale())==="ru";
  const include={productGroup:true,brand:true,reviews:true,variations:{where:{available:true}},fullBottles:fullBottleInclude,productNotes:true,aromas:true};
  const where={bottleParentId:null,available:true,categoryId:product.categoryId,id:{not:product.id}};
  const notes=product.productNotes.map(n=>n.noteId), aromas=product.aromas.map(a=>a.id);
  const candidates=await prisma.product.findMany({where:{...where,OR:[{brandId:product.brandId},{productNotes:{some:{noteId:{in:notes}}}},{aromas:{some:{id:{in:aromas}}}}]},include,take:48,orderBy:{id:"desc"}});
  const score=(p:typeof candidates[number])=>p.productNotes.filter(n=>notes.includes(n.noteId)).length*3+p.aromas.filter(a=>aromas.includes(a.id)).length*2+(p.brandId===product.brandId?1:0);
  const ranked=candidates.sort((a,b)=>score(b)-score(a)||b.id-a.id);
  const similar=ranked.slice(0,8);
  if(similar.length<4){
    const extra=await prisma.product.findMany({where:{...where,id:{notIn:[product.id,...similar.map(p=>p.id)]}},include,take:8-similar.length,orderBy:[{isBestseller:"desc"},{id:"desc"}]});
    similar.push(...extra);
  }
  const ownBrand=await prisma.product.findMany({where:{...where,brandId:product.brandId,id:{notIn:[product.id,...similar.map(p=>p.id)]}},include,take:4,orderBy:{id:"desc"}});
  const safe=(rows:typeof candidates)=>rows.map(p=>({...withBottleOptions(p),price:p.price.toNumber(),discountPrice:p.discountPrice?.toNumber()??null}));
  return <HomePriceProvider><div className={className}>
    {similar.length>0 && <section className="fragrance-recommendations"><h2 className="text-2xl font-normal tracking-tight md:text-[30px]">{ru?"Вам также могут понравиться":"Diese Düfte könnten dir auch gefallen"}</h2><HomePriceNote/><ProductsSelectionList products={safe(similar)}/></section>}
    {ownBrand.length>0 && <section className="fragrance-recommendations"><h2 className="text-2xl font-normal tracking-tight md:text-[30px]">{ru?"Больше от ":"Mehr von "}{product.brand.name}</h2><HomePriceNote/><ProductsSelectionList products={safe(ownBrand)}/></section>}
  </div></HomePriceProvider>;
}
