"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import { useQueryFilters } from "@/shared/hooks";
import {
  Brands,
  Classifications,
  Gender,
  Notes,
  PerfumeConcentration,
} from "@prisma/client";
import { useFiltersStore } from "@/shared/store/filters";

interface Props {
  className?: string;
}

export const Filters: FC<Props> = () => {
  // const filters = useFilters();
  const filters = useFiltersStore();

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
          { text: "Chanel", value: Brands.CHANEL },
          { text: "Dior", value: Brands.DIOR },
          { text: "Gucci", value: Brands.GUCCI },
          { text: "Yves Saint Laurent", value: Brands.YSL },
          { text: "Versace", value: Brands.VERSACE },
          { text: "Calvin Klein", value: Brands.CALVIN_KLEIN },
          { text: "Tom Ford", value: Brands.TOM_FORD },
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
          { text: "Extrait de Parfum", value: PerfumeConcentration.EXTRAIT },
          { text: "Perfume", value: PerfumeConcentration.PERFUME },
          { text: "Eau de Parfum", value: PerfumeConcentration.EAU_DE_PARFUM },
          {
            text: "Eau de Toilette",
            value: PerfumeConcentration.EAU_DE_TOILETTE,
          },
          {
            text: "Eau de Cologne",
            value: PerfumeConcentration.EAU_DE_COLOGNE,
          },
        ]}
      />

      <CheckboxFiltersGroup
        title="Classification"
        name="categories"
        className="mb-5"
        onClickCheckbox={filters.setSelectedClassification}
        selected={filters.classification}
        items={[
          { text: "Niche", value: Classifications.NICHE },
          { text: "Arabian", value: Classifications.ARABIAN },
          { text: "Designer", value: Classifications.DESIGNER },
          { text: "Celebrity", value: Classifications.CELEBRITY },
          { text: "Indie", value: Classifications.INDIE },
        ]}
      />

      <div className="mt-10 pb-7 pr-5">
        <p className="font-bold mb-3">Price from to:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={500}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={0}
            max={500}
            placeholder="500"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={500}
          step={1}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 500]}
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
          { text: "Citrus", value: Notes.CITRUS },
          { text: "Floral", value: Notes.FLORAL },
          { text: "Green", value: Notes.GREEN },
          { text: "Fruity", value: Notes.FRUITY },
          { text: "Spicy", value: Notes.SPICY },
          { text: "Woody", value: Notes.WOODY },
          { text: "Oriental", value: Notes.ORIENTAL },
          { text: "Musk", value: Notes.MUSK },
          { text: "Aquatic", value: Notes.AQUATIC },
        ]}
        onClickCheckbox={filters.setSelectedNotes}
        selected={filters.notes}
      />
    </div>
  );
};
