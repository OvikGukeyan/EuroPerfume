"use client";

import React, { FC } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import { Aroma, Brand, Note } from "@prisma/client";
import { useFiltersStore } from "../../store/filters";
import { cn } from "@/src/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useProductStore } from "../../store/product";
import { concentrations } from "@/prisma/constants";
interface Props {
  notes: Note[];
  brands: Brand[];
  aromas: Aroma[];
  className?: string;
}

export const Filters: FC<Props> = ({ notes, brands, aromas, className }) => {
  const filters = useFiltersStore();
  const [availableFilters] = useProductStore((state) => [
    state.availableFilters,
  ]);



  

  const updatePreces = (prices: number[]) => {
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  };
  const locale = useLocale() as "ru" | "de";
  const t = useTranslations("Filters");
  return (
    <div className={cn("")}>
      <Title text={t("title")} className="mb-5 font-bold" />

      {availableFilters?.brands && (
        <CheckboxFiltersGroup
          title={t("brands")}
          name="brands"
          className="mb-5"
          limit={3}
          onClickCheckbox={filters.setSelectedBrands}
          selected={filters.brands}
          items={availableFilters.brands}
        />
      )}

      {availableFilters?.genders && (
        <CheckboxFiltersGroup
          title={t("gender")}
          name="gender"
          className="mb-5"
          onClickCheckbox={filters.setSelectedGender}
          selected={filters.gender}
          items={availableFilters?.genders.map((gender) => ({
            text: gender[locale],
            value: gender.value,
          }))}
        />
      )}

      {availableFilters?.classifications && (
        <CheckboxFiltersGroup
          title={t("classification")}
          name="categories"
          className="mb-5"
          limit={3}
          onClickCheckbox={filters.setSelectedClassification}
          selected={filters.classification}
          items={availableFilters.classifications.map((classification) => ({
            text: classification[locale],
            value: classification.value,
          }))}
        />
      )}

      <div className="mt-10 pb-7 pr-5">
        <p className="font-bold mb-3">{t("priceLabel")}</p>
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

      {availableFilters?.concentrations && (
        <CheckboxFiltersGroup
          title={t("concentration")}
          name="concentration"
          className="mb-5"
          onClickCheckbox={filters.setSelectedConcentration}
          selected={filters.concentration}
          limit={3}
          items={availableFilters.concentrations}
        />
      )}
      {availableFilters?.aromas && (
        <CheckboxFiltersGroup
          title={t("aromasGroup")}
          name="aromas"
          className="my-5"
          limit={3}
          // defaultItems={items.slice(0, 6)}
          items={availableFilters.aromas.map((aroma) => ({
            text: aroma[locale],
            value: aroma.value,
          }))}
          onClickCheckbox={filters.setSelectedAromas}
          selected={filters.aromas}
        />
      )}
      {availableFilters?.topNotes && (
        <CheckboxFiltersGroup
          title={t("topNotes")}
          name="topNotes"
          limit={3}
          // defaultItems={items.slice(0, 6)}
          items={availableFilters.topNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={filters.setTopNotes}
          selected={filters.topNotes}
        />
      )}

      {availableFilters?.heartNotes && (
        <CheckboxFiltersGroup
          className="my-5"
          title={t("heartNotes")}
          name="heartNotes"
          limit={3}
          // defaultItems={items.slice(0, 6)}
          items={availableFilters.heartNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={filters.setHeartNotes}
          selected={filters.heartNotes}
        />
      )}

      {availableFilters?.baseNotes && (
        <CheckboxFiltersGroup
          title={t("baseNotes")}
          name="baseNotes"
          limit={3}
          // defaultItems={items.slice(0, 6)}
          items={availableFilters.baseNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={filters.setBaseNotes}
          selected={filters.baseNotes}
        />
      )}
    </div>
  );
};
