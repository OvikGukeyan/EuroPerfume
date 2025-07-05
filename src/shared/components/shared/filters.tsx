"use client";

import React, { FC, useState } from "react";
import { Title, CheckboxFiltersGroup } from ".";
import { Button, Input, RangeSlider } from "../ui";
import { useFiltersStore } from "../../store/filters";
import { cn } from "@/src/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useProductStore } from "../../store/product";
interface Props {
  className?: string;
}

export const Filters: FC<Props> = () => {
  const filters = useFiltersStore();
  const [availableFilters] = useProductStore((state) => [
    state.availableFilters,
  ]);

  const [localFilters, setLocalFilters] = useState({
    brands: filters.brands,
    gender: filters.gender,
    prices: {
      priceFrom: filters.prices.priceFrom,
      priceTo: filters.prices.priceTo,
    },
    classification: filters.classification,
    aromas: filters.aromas,
    topNotes: filters.topNotes,
    heartNotes: filters.heartNotes,
    baseNotes: filters.baseNotes,
    concentration: filters.concentration,
  });

  const updateLocalFilter = <
    T extends Record<string, string>,
    K extends keyof T
  >(
    setState: React.Dispatch<React.SetStateAction<T>>,
    key: K,
    value: string
  ) => {
    setState((prev) => {
      const currentValues = new Set(prev[key] || []);

      if (currentValues.has(value)) {
        currentValues.delete(value);
      } else {
        currentValues.add(value);
      }

      return { ...prev, [key]: currentValues };
    });
  };

  const createFilterUpdater =
    (setState: React.Dispatch<React.SetStateAction<any>>) =>
    (key: string, value: string) => {
      updateLocalFilter(setState, key, value);
    };

  const applyFilters = () => {
    filters.setFilters({
      ...filters,
      ...localFilters,
    });
  };

  const resetFilters = () => {
    filters.resetFilters();
    setLocalFilters({
      brands: new Set(),
      gender: new Set(),
      prices: {
        priceFrom: 0,
        priceTo: 0,
      },
      classification: new Set(),
      aromas: new Set(),
      topNotes: new Set(),
      heartNotes: new Set(),
      baseNotes: new Set(),
      concentration: new Set(),
    });
  };
  const updatePrices = (prices: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      prices: {
        priceFrom: prices[0],
        priceTo: prices[1],
      },
    }));
  };
  const locale = useLocale() as "ru" | "de";
  const t = useTranslations("Filters");
  const isFittersEmpty = Object.values(localFilters).every((value) => {
    if (typeof value === "object" && "priceFrom" in value) {
      return (
        (!value.priceFrom || value.priceFrom === 0) &&
        (!value.priceTo || value.priceTo === 500)
      );
    }
    return value.size === 0;
  });

  return (
    <div className={cn("")}>
      <Title text={t("title")} className="mb-5 font-bold" />

      {availableFilters?.brands && (
        <CheckboxFiltersGroup
          title={t("brands")}
          name="brands"
          className="mb-5"
          limit={3}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.brands}
          items={availableFilters.brands}
        />
      )}

      {availableFilters?.genders && (
        <CheckboxFiltersGroup
          title={t("gender")}
          name="gender"
          className="mb-5"
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.gender}
          items={availableFilters?.genders.map((gender) => ({
            text: gender[locale],
            value: gender.value,
          }))}
        />
      )}

      {availableFilters?.classifications && (
        <CheckboxFiltersGroup
          title={t("classification")}
          name="classification"
          className="mb-5"
          limit={3}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.classification}
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
            value={String(localFilters.prices.priceFrom)}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                prices: {
                  ...localFilters.prices,
                  priceFrom: Number(e.target.value),
                },
              })
            }
          />
          <Input
            type="number"
            min={0}
            max={500}
            placeholder="500"
            value={String(localFilters.prices.priceTo)}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                prices: {
                  ...localFilters.prices,
                  priceTo: Number(e.target.value),
                },
              })
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={500}
          step={1}
          value={[
            localFilters.prices.priceFrom || 0,
            localFilters.prices.priceTo || 500,
          ]}
          onValueChange={updatePrices}
        />
      </div>

      {availableFilters?.concentrations && (
        <CheckboxFiltersGroup
          title={t("concentration")}
          name="concentration"
          className="mb-5"
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.concentration}
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
          items={availableFilters.aromas.map((aroma) => ({
            text: aroma[locale],
            value: aroma.value,
          }))}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.aromas}
        />
      )}
      {availableFilters?.topNotes && (
        <CheckboxFiltersGroup
          title={t("topNotes")}
          name="topNotes"
          limit={3}
          items={availableFilters.topNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.topNotes}
        />
      )}

      {availableFilters?.heartNotes && (
        <CheckboxFiltersGroup
          className="my-5"
          title={t("heartNotes")}
          name="heartNotes"
          limit={3}
          items={availableFilters.heartNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.heartNotes}
        />
      )}

      {availableFilters?.baseNotes && (
        <CheckboxFiltersGroup
          title={t("baseNotes")}
          name="baseNotes"
          limit={3}
          items={availableFilters.baseNotes.map((note) => ({
            text: note[locale],
            value: note.value,
          }))}
          onClickCheckbox={createFilterUpdater(setLocalFilters)}
          selected={localFilters.baseNotes}
        />
      )}
      <div
        className={`
    sticky bottom-0 xl:top-[230px] z-10 transition-all duration-500 mt-5 flex justify-around
    ${
      isFittersEmpty
        ? "opacity-0 translate-y-4 pointer-events-none"
        : "opacity-100 -translate-y-4"
    }
  `}
      >
        <Button onClick={resetFilters} className="mb-5">
          {t("reset")}
        </Button>
        <Button onClick={applyFilters} className="mb-5 ">
          {t("apply")}
        </Button>
      </div>
    </div>
  );
};
