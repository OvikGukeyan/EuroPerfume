"use client";

import { cn } from "@/shared/lib/utils";
import React, { FC } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import { useQueryFilters } from "@/shared/hooks";
import {
  Brand,
  Classifications,
  Gender,
  Note,
  PerfumeConcentration,
} from "@prisma/client";
import { useFiltersStore } from "@/shared/store/filters";
import { perfumeAromas } from "@/prisma/constants";

interface Props {
  notes: Note[];
  brands: Brand[];
  className?: string;
}

export const Filters: FC<Props> = ({ notes, brands, className }) => {
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
        limit={3}
        onClickCheckbox={filters.setSelectedBrands}
        selected={filters.brands}
        items={brands.map((item) => ({
          text: item.name,
          value: item.id.toString(),
        }))}
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
        limit={3}
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
        limit={3}
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
        title="Aromas group"
        name="aromas"
        className="my-5"
        limit={3}
        // defaultItems={items.slice(0, 6)}
        items={perfumeAromas.map((item) => ({
          text: item.label.ru,
          value: item.value,
        }))}
        onClickCheckbox={filters.setSelectedAromas}
        selected={filters.aromas}
      />

      <CheckboxFiltersGroup
        title="Top Notes"
        name="topNotes"
        limit={3}
        // defaultItems={items.slice(0, 6)}
        items={notes.map((note) => ({
          text: note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={filters.setTopNotes}
        selected={filters.topNotes}
      />

      <CheckboxFiltersGroup
      className="my-5"
        title="Heart Notes"
        name="heartNotes"
        limit={3}
        // defaultItems={items.slice(0, 6)}
        items={notes.map((note) => ({
          text: note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={filters.setHeartNotes}
        selected={filters.heartNotes}
      />

      <CheckboxFiltersGroup
        title="Base Notes"
        name="baseNotes"
        limit={3}
        // defaultItems={items.slice(0, 6)}
        items={notes.map((note) => ({
          text: note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={filters.setBaseNotes}
        selected={filters.baseNotes}
      />
    </div>
  );
};
