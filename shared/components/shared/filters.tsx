"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import { useFilters, useIngredients, useQueryFilters } from "@/shared/hooks";
import { Brand, Gender } from "@prisma/client";

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
          { text: "Chanel", value: Brand.CHANEL },
          { text: "Dior", value: Brand.DIOR },
          { text: "Gucci", value: Brand.GUCCI },
          { text: "Yves Saint Laurent", value: Brand.YSL },
          { text: "Versace", value: Brand.VERSACE },
          { text: "Calvin Klein", value: Brand.CALVIN_KLEIN },
          { text: "Tom Ford", value: Brand.TOM_FORD },
        ]}
      />

      <CheckboxFiltersGroup
        title="Gender"
        name="gender"
        className="mb-5"
        onClickCheckbox={filters.setSelectedGender}
        selected={filters.gender}
        items={[
          { text: "Women", value: Gender.FEMALE },
          { text: "Men", value: Gender.MALE },
          { text: "Unisex", value: Gender.UNISEX },
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
