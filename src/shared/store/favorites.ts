import { create } from "zustand";
import { Api } from "../services/api-client";
import { Brand, ProductGroup } from "@prisma/client";
import { FavoritesDTO } from "../services/dto/favorites.dto";
import toast from "react-hot-toast";

export type FavoritesStateItem = {
  productGroup:ProductGroup; id:number; productId:number; name:string;
  imageUrl?:string; price:number; disabled:boolean; brand:Brand;
};
export interface FavoritesState {
  favoritesLoading:boolean; error:boolean; items:FavoritesStateItem[];
  favoriteIds:number[]; pending:Record<number,boolean>; initialized:boolean;
  fetchFavoritesItems:()=>Promise<void>; addFavoritesItem:(id:number)=>Promise<void>;
}
const mapItems=(data:FavoritesDTO):FavoritesStateItem[]=>(data?.items??[]).map(i=>({
  id:i.id,productId:i.productId,name:i.product.name,price:Number(i.product.price),
  productGroup:i.product.productGroup,brand:i.product.brand,disabled:false,
  imageUrl:i.product.imageUrl[0] || i.product.variations?.[0]?.imageUrl,
}));
let fetchPromise:Promise<void>|null=null;
let writes:Promise<void>=Promise.resolve();
export const useFavoritesStore=create<FavoritesState>((set,get)=>({
  items:[],favoriteIds:[],pending:{},initialized:false,favoritesLoading:true,error:false,
  fetchFavoritesItems:async()=>{
    if(get().initialized)return;
    if(fetchPromise)return fetchPromise;
    fetchPromise=(async()=>{
      try{
        const items=mapItems(await Api.favorites.getFavorites());
        if(get().initialized)return;
        const ids=new Set(items.map(i=>i.productId));
        for(const [id,value] of Object.entries(get().pending)){if(value)ids.add(Number(id));else ids.delete(Number(id));}
        set({items,favoriteIds:[...ids],initialized:true,error:false});
      }catch{set({error:true});}
      finally{set({favoritesLoading:false});fetchPromise=null;}
    })();
    return fetchPromise;
  },
  addFavoritesItem:async(productId)=>{
    if(Object.hasOwn(get().pending,productId))return;
    const was=get().favoriteIds.includes(productId),desired=!was;
    set(s=>({favoriteIds:desired?[...s.favoriteIds,productId]:s.favoriteIds.filter(id=>id!==productId),
      pending:{...s.pending,[productId]:desired},error:false}));
    const operation=async()=>{
      try{
        const items=mapItems(await Api.favorites.addFavoritesItem(productId));
        const pending={...get().pending};delete pending[productId];
        const ids=new Set(items.map(i=>i.productId));
        for(const [id,value] of Object.entries(pending)){if(value)ids.add(Number(id));else ids.delete(Number(id));}
        set({items,favoriteIds:[...ids],pending,error:false,initialized:true});
      }catch{
        const pending={...get().pending};delete pending[productId];
        set(s=>({pending,error:true,favoriteIds:was?[...new Set([...s.favoriteIds,productId])]:s.favoriteIds.filter(id=>id!==productId)}));
        toast.error(document.documentElement.lang==="ru"?"Не удалось сохранить избранное. Попробуйте ещё раз.":"Favorit konnte nicht gespeichert werden. Bitte erneut versuchen.");
      }
    };
    writes=writes.then(operation,operation);await writes;
  },
}));
