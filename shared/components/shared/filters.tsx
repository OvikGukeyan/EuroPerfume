"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import { useFilters, useIngredients, useQueryFilters } from "@/shared/hooks";

interface Props {
  className?: string;
}

export const Filters: FC<Props> = () => {
  const { loading, ingredients } = useIngredients();
  const filters = useFilters();

  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  useQueryFilters(filters);

  const updatePreces = (prices: number[]) => {
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  };

  return (
    <div className={cn("")}>
      <Title text="Filters" className="mb-5 font-bold" />

      <CheckboxFiltersGroup
        title="Brands"
        name="brands"
        className="mb-5"
        onClickCheckbox={filters.setSelectedBrands}
        selected={filters.brands}
        items={[
          { text: "Chanel", value: "chanel" },
          { text: "Dior", value: "dior" },
          { text: "Gucci", value: "gucci" },
          { text: "Yves Saint Laurent", value: "ysl" },
          { text: "Versace", value: "versace" },
          { text: "Calvin Klein", value: "calvin_klein" },
          { text: "Tom Ford", value: "tom_ford" },
        ]}
      />

      <CheckboxFiltersGroup
        title="Gender"
        name="gender"
        className="mb-5"
        onClickCheckbox={filters.setSelectedGender}
        selected={filters.gender}
        items={[
          { text: "Women", value: "women" },
          { text: "Men", value: "men" },
          { text: "Unisex", value: "unisex" },
        ]}
      />

      <CheckboxFiltersGroup
        title="Perfume Concentrations "
        name="concentration"
        className="mb-5"
        onClickCheckbox={filters.setSelectedConcentration}
        selected={filters.concentration}
        items={[
          { text: "Extrait de Parfum", value: "extrait_de_parfum" },
          { text: "Perfume", value: "perfume" },
          { text: "Eau de Parfum", value: "eau_de_parfum" },
          { text: "Eau de Toilette", value: "eau_de_toilette" },
          { text: "Eau de Cologne", value: "eau_de_cologne" },
        ]}
      />

      <CheckboxFiltersGroup
        title="Perfume Categories"
        name="categories"
        className="mb-5"
        onClickCheckbox={filters.setSelectedCategories}
        selected={filters.categories}
        items={[
          { text: "Niche", value: "niche" },
          { text: "Arabian", value: "arabian" },
          { text: "Designer", value: "designer" },
          { text: "Celebrity", value: "celebrity" },
          { text: "Indie", value: "indie" },
        ]}
      />

      <div className="mt-10 pb-7">
        <p className="font-bold mb-3">Price from to:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={0}
            max={50}
            placeholder="50"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={50}
          step={1}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 50]}
          onValueChange={updatePreces}
        />
      </div>

      <CheckboxFiltersGroup
        title="Fragrance Notes"
        name="notes"
        className="mt-50"
        limit={6}
        // defaultItems={items.slice(0, 6)}
        items={[
          { text: "Citrus", value: "citrus" },
          { text: "Floral", value: "floral" },
          { text: "Green", value: "green" },
          { text: "Fruity", value: "fruity" },
          { text: "Spicy", value: "spicy" },
          { text: "Woody", value: "woody" },
          { text: "Oriental", value: "oriental" },
          { text: "Musk", value: "musk" },
          { text: "Aquatic", value: "aquatic" },
        ]}
        // loading={loading}
        onClickCheckbox={filters.setSelectedNotes}
        selected={filters.notes}
        
      />
    </div>
  );
};
