"use client";
import { X } from "lucide-react";
import { Button } from "@/src/shared/components/ui/button";
import { cn } from "@/src/shared/lib/utils";
import { useTranslations } from "next-intl";

export type FilterToken =
  | { type: "price"; value: { priceFrom?: number; priceTo?: number }; label: string; key: string }
  | { type: "category"; value: number; label: string; key: string }
  | { type: "productGroup"; value: number; label: string; key: string }
  | { type: "brand" | "classification" | "concentration" | "gender" | "topNote" | "heartNote" | "baseNote" | "aroma"; value: string; label: string; key: string };

export function SelectedFiltersBar({
  tokens,
  onRemove,
  onClearAll,
  className,
}: {
  tokens: FilterToken[];
  onRemove: (t: FilterToken) => void;
  onClearAll?: () => void;
  className?: string;
}) {
  const t = useTranslations("SelectedFiltersBar");
  if (!tokens.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2 items-center border rounded-lg p-3 bg-white", className)}>
      {tokens.map((t) => (
        <div
          key={t.key}
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-muted/50 hover:bg-muted transition"
          title={t.label}
        >
          <span className="truncate max-w-[220px]">{t.label}</span>
          <button
            type="button"
            aria-label={`Remove ${t.label}`}
            className="ml-2 inline-flex items-center justify-center rounded-full hover:bg-black/10"
            onClick={() => onRemove(t)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {onClearAll && (
        <Button type="button" variant="ghost" className="ml-auto h-8 px-2 text-sm" onClick={onClearAll}>
          {t("clearAll")}
        </Button>
      )}
    </div>
  );
}