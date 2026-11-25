import {canOrderQuantity,type OrderableProduct} from "./orderability";

type BrandListingProduct=OrderableProduct & {
 id:number;
 createdAt:Date;
 productGroup:{onTap:boolean|null};
 saleBottleOnly?:boolean;
};

export function hasDefaultBrandOrder(brands:readonly number[]|undefined,orderBy:{name?:string;price?:string}|null) {
 return Boolean(brands?.some(id=>Number.isSafeInteger(id)&&id>0) && !orderBy?.name && !orderBy?.price);
}

export function isOrderableBrandDecant(product:BrandListingProduct) {
 return product.bottleParentId===null && product.productGroup.onTap===true && !product.saleBottleOnly &&
  canOrderQuantity(product,1);
}

export function compareBrandProducts(a:BrandListingProduct,b:BrandListingProduct,bottleOnly=false) {
 return (bottleOnly?0:Number(isOrderableBrandDecant(b))-Number(isOrderableBrandDecant(a))) ||
  b.createdAt.getTime()-a.createdAt.getTime() || b.id-a.id;
}
