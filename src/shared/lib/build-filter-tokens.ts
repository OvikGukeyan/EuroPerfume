
import { categories, productGroups } from "@/prisma/constants";
import { FilterToken } from "../components/shared/selected-filters-bar";
import { Filters } from "../store/filters";
import { AvailableFilters } from "../store/product";
import { useLocale } from "next-intl";


export function buildFilterTokens(
  f: Filters,
  availableFilters: AvailableFilters,
  locale: 'ru' | 'de'
): FilterToken[] {
  const tokens: FilterToken[] = [];
  const add = (t: FilterToken) => tokens.push(t);
  

  // price
  if (f.prices.priceFrom != null || f.prices.priceTo != null) {
    const parts: string[] = [];
    if (f.prices.priceFrom != null) parts.push(`${f.prices.priceFrom}€`);
    if (f.prices.priceTo != null) parts.push(`${f.prices.priceTo}€`);
    add({ type: "price", value: { ...f.prices }, label: parts.join(" - "), key: `price:${f.prices.priceFrom}-${f.prices.priceTo}` });
  }





  if(f.brands.size > 0){
    f.brands.forEach((val) => {
        const label = availableFilters.brands ? availableFilters.brands.find((f) => f.value === val)?.text : val;
        add({ type: "brand", value: val, label: label || val, key: `brand:${val}` });
    })
  }

  if(f.classification.size > 0){
    f.classification.forEach((val) => {
      const label = availableFilters.classifications ? availableFilters.classifications.find((f) => f.value === val)?.[locale] : val;
      add({ type: "classification", value: val, label: label || val, key: `classification:${val}` });
    })
  }

  if(f.concentration.size > 0){
    f.concentration.forEach((val) => {
      const label = availableFilters?.concentrations ? availableFilters.concentrations.find((f) => f.value === val)?.text : val;
      add({ type: "concentration", value: val, label: label || val, key: `concentration:${val}` });
    })
  }

  if(f.gender.size > 0){
    f.gender.forEach((val) => {
      const label = availableFilters?.genders ? availableFilters.genders.find((f) => f.value === val)?.[locale] : val;
      add({ type: "gender", value: val, label: label || val, key: `gender:${val}` });
    })
  }

  if(f.aromas.size > 0){
    f.aromas.forEach((val) => {
      const label = availableFilters?.aromas ? availableFilters.aromas.find((f) => f.value === val)?.[locale] : val;
      add({ type: "aroma", value: val, label: label || val, key: `aroma:${val}` });
    })
  }

  if(f.baseNotes.size > 0){
    f.baseNotes.forEach((val) => {
      const label = availableFilters?.baseNotes ? availableFilters.baseNotes.find((f) => f.value === val)?.[locale] : val;
      add({ type: "baseNote", value: val, label: label || val, key: `baseNote:${val}` });
    })
  }

  if(f.topNotes.size ){
    f.topNotes.forEach((val) => {
      const label = availableFilters?.topNotes ? availableFilters.topNotes.find((f) => f.value === val)?.[locale] : val;
      add({ type: "topNote", value: val, label: label || val, key: `topNote:${val}` });
    })
  }
  if(f.heartNotes.size > 0){
    f.heartNotes.forEach((val) => {
      const label = availableFilters?.heartNotes ? availableFilters.heartNotes.find((f) => f.value === val)?.[locale] : val;
      add({ type: "heartNote", value: val, label: label || val, key: `heartNote:${val}` });
    })
  }
  
 const language = locale === "de" ? "labelDe" : "labelRu";

  if (f.category != null) {
    add({
      type: "category",
      value: f.category,
      label: categories.find((c) => c.id === f.category)?.[language] ?? "",
      key: `category:${f.category}`,
    });
  }
  if (f.productGroup != null) {
    add({
      type: "productGroup",
      value: f.productGroup,
      label: productGroups.find((c) => c.id === f.productGroup)?.[language] ?? "",
      key: `productGroup:${f.productGroup}`,
    });
  }

  return tokens;
}