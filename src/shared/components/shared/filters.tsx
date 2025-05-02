"use client";

import React, { FC, startTransition } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Input, RangeSlider } from "../ui";
import {
  Brand,
  Classifications,
  Gender,
  Note,
  PerfumeConcentration,
} from "@prisma/client";
import { classifications, genders, perfumeAromas } from "@/../../prisma/constants";
import { useFiltersStore } from "../../store/filters";
import { useUpdateFiltersQuery } from "../../hooks";
import { cn } from "@/src/lib/utils";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  notes: Note[];
  brands: Brand[];
  className?: string;
}

export const Filters: FC<Props> = ({ notes, brands, className }) => {
  const t = useTranslations("Filters");
  const locale = useLocale() as "ru" | "de";

  const filters = useFiltersStore(); // актуальные фильтры
  const updateQuery = useUpdateFiltersQuery();

  // Обёртка для изменения фильтра и обновления URL
  const handleFilterChange = (setter: (value: string) => void, key: string) => {
    startTransition(() => {
      setter(key);
      const updatedFilters = useFiltersStore.getState();
      updateQuery(updatedFilters);
    });
  };

  const updatePrices = (prices: number[]) => {
    startTransition(() => {
      filters.setPrices("priceFrom", prices[0]);
      filters.setPrices("priceTo", prices[1]);
      const updatedFilters = useFiltersStore.getState();
      updateQuery(updatedFilters);
    });
  };

  return (
    <div className={cn(className)}>
      <Title text={t("title")} className="mb-5 font-bold" />

      <CheckboxFiltersGroup
        title={t("brands")}
        name="brands"
        className="mb-5"
        limit={3}
        onClickCheckbox={(key) => handleFilterChange(filters.setSelectedBrands, key)}
        selected={filters.brands}
        items={brands.map((item) => ({
          text: item.name,
          value: item.id.toString(),
        }))}
      />

      <CheckboxFiltersGroup
        title={t("gender")}
        name="gender"
        className="mb-5"
        onClickCheckbox={(key) => handleFilterChange(filters.setSelectedGender, key)}
        selected={filters.gender}
        items={genders.map((item) => ({
          text: item.label[locale],
          value: item.value,
        }))}
      />

      <CheckboxFiltersGroup
        title={t("concentration")}
        name="concentration"
        className="mb-5"
        limit={3}
        onClickCheckbox={(key) => handleFilterChange(filters.setSelectedConcentration, key)}
        selected={filters.concentration}
        items={[
          { text: "Extrait de Parfum", value: PerfumeConcentration.EXTRAIT },
          { text: "Perfume", value: PerfumeConcentration.PERFUME },
          { text: "Eau de Parfum", value: PerfumeConcentration.EAU_DE_PARFUM },
          { text: "Eau de Toilette", value: PerfumeConcentration.EAU_DE_TOILETTE },
          { text: "Eau de Cologne", value: PerfumeConcentration.EAU_DE_COLOGNE },
        ]}
      />

      <CheckboxFiltersGroup
        title={t("classification")}
        name="categories"
        className="mb-5"
        limit={3}
        onClickCheckbox={(key) => handleFilterChange(filters.setSelectedClassification, key)}
        selected={filters.classification}
        items={classifications.map((item) => ({
          text: item.label[locale],
          value: item.value,
        }))}
      />

      <div className="mt-10 pb-7 pr-5">
        <p className="font-bold mb-3">{t("priceLabel")}</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={500}
            value={String(filters.prices.priceFrom)}
            onChange={(e) => updatePrices([Number(e.target.value), filters.prices.priceTo || 500])}
          />
          <Input
            type="number"
            min={0}
            max={500}
            placeholder="500"
            value={String(filters.prices.priceTo)}
            onChange={(e) => updatePrices([filters.prices.priceFrom || 0, Number(e.target.value)])}
          />
        </div>
        <RangeSlider
          min={0}
          max={500}
          step={1}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 500]}
          onValueChange={updatePrices}
        />
      </div>

      <CheckboxFiltersGroup
        title={t("aromasGroup")}
        name="aromas"
        className="my-5"
        limit={3}
        items={perfumeAromas.map((item) => ({
          text: item.label[locale],
          value: item.value,
        }))}
        onClickCheckbox={(key) => handleFilterChange(filters.setSelectedAromas, key)}
        selected={filters.aromas}
      />

      <CheckboxFiltersGroup
        title={t("topNotes")}
        name="topNotes"
        limit={3}
        items={notes.map((note) => ({
          text: locale === "de" ? note.labelDe : note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={(key) => handleFilterChange(filters.setTopNotes, key)}
        selected={filters.topNotes}
      />

      <CheckboxFiltersGroup
        className="my-5"
        title={t("heartNotes")}
        name="heartNotes"
        limit={3}
        items={notes.map((note) => ({
          text: locale === "de" ? note.labelDe : note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={(key) => handleFilterChange(filters.setHeartNotes, key)}
        selected={filters.heartNotes}
      />

      <CheckboxFiltersGroup
        title={t("baseNotes")}
        name="baseNotes"
        limit={3}
        items={notes.map((note) => ({
          text: locale === "de" ? note.labelDe : note.labelRu,
          value: String(note.id),
        }))}
        onClickCheckbox={(key) => handleFilterChange(filters.setBaseNotes, key)}
        selected={filters.baseNotes}
      />
    </div>
  );
};