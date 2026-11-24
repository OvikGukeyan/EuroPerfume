import { offerPrices, type PriceSource } from './day-offer';
import type { BottleOption } from './full-bottle';

export function cataloguePrice(product: PriceSource & { available:boolean; productGroup:{onTap:boolean|null}; bottles?:BottleOption[] }, bottlesOnly=false, now=Date.now()) {
  const bottles=product.bottles ?? [];
  const useBottles=bottlesOnly || !product.productGroup.onTap || !product.available;
  const cheapest=useBottles ? [...bottles].sort((a,b)=>
    offerPrices({...a,price:a.regularPrice ?? a.price},1,false,now).effective-
    offerPrices({...b,price:b.regularPrice ?? b.price},1,false,now).effective || a.id-b.id)[0] : undefined;
  const prices=offerPrices(cheapest ? {...cheapest,price:cheapest.regularPrice ?? cheapest.price} : product,
    cheapest ? 1 : product.productGroup.onTap ? 2 : 1, !cheapest && Boolean(product.productGroup.onTap),now);
  const volumeMl=cheapest?.ml ?? (product.productGroup.onTap ? 2 : undefined);
  return { bottle:cheapest, ...prices, volumeMl,
    pricePerLitre: volumeMl && volumeMl>0 ? prices.effective / volumeMl * 1000 : undefined };
}
