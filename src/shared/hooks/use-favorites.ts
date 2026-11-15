import {useEffect} from "react";
import {useFavoritesStore} from "../store/favorites";
export const useFavorites=()=>{
  const state=useFavoritesStore();
  const fetch=useFavoritesStore(s=>s.fetchFavoritesItems);
  useEffect(()=>{void fetch();},[fetch]);
  return state;
};
