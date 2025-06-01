import { NoteType } from "@prisma/client";
import { ProductDTO } from "../services/dto/product.dto";
import { concentrations, genders } from "@/prisma/constants";

export const getAvailableFilters = (products: ProductDTO[]) => {
  function getUniqueBy<T>(arr: T[], key: keyof T): T[] {
    const map = new Map<string, T>();
    for (const item of arr) {
      const keyValue = item[key];
      if (typeof keyValue === "string" || typeof keyValue === "number") {
        map.set(String(keyValue), item);
      }
    }
    return Array.from(map.values());
  }
  const uniqueBrands = getUniqueBy(
    products.map((p) => ({
      text: p.brand.name,
      value: p.brand.id.toString(),
    })),
    "value"
  );

  const uniqueClassifications = getUniqueBy(
    products
      .flatMap((p) =>
        p.classification.map((a) => ({
          text: a.labelRu,
          value: a.id.toString(),
        }))
      )
      .filter((item) => item.text.trim() !== ""),
    "value"
  );
  const uniqueConcentrations = getUniqueBy(
    products.flatMap((p) =>
      p.concentration
        ? [
            {
              text:
                concentrations.find((el) => el.value === p.concentration)
                  ?.name || "",
              value: p.concentration.toString(),
            },
          ]
        : []
    ),
    "value"
  );

  const uniqueGenders = getUniqueBy(
    products.flatMap((p) =>
      p.gender
        ? [
            {
              text: genders.find((el) => el.value === p.gender)?.label.de || "",
              value: p.gender.toString(),
            },
          ]
        : []
    ),
    "value"
  );

  const uniqueTopNotes = getUniqueBy(
    products.flatMap((p) =>
      p.productNotes
        .filter((pn) => pn.noteType === NoteType.TOP)
        .map((pn) => ({
          text: pn.note.labelRu,
          value: pn.note.id.toString(),
        }))
    ),
    "value"
  );
  const uniqueHeartNotes = getUniqueBy(
    products.flatMap((p) =>
      p.productNotes
        .filter((pn) => pn.noteType === NoteType.HEART)
        .map((pn) => ({
          text: pn.note.labelRu,
          value: pn.note.id.toString(),
        }))
    ),
    "value"
  );
  const uniqueBaseNotes = getUniqueBy(
    products.flatMap((p) =>
      p.productNotes
        .filter((pn) => pn.noteType === NoteType.BASE)
        .map((pn) => ({
          text: pn.note.labelRu,
          value: pn.note.id.toString(),
        }))
    ),
    "value"
  );
  const uniqueAromas = getUniqueBy(
    products.flatMap((p) =>
      p.aromas.map((a) => ({ text: a.labelRu, value: a.id.toString() }))
    ),
    "value"
  );
  const availableFilters = {
    brands: uniqueBrands.length > 0 ? uniqueBrands : null,
    classifications:
      uniqueClassifications.length > 0 ? uniqueClassifications : null,
    concentrations:
      uniqueConcentrations.length > 0 ? uniqueConcentrations : null,
    genders: uniqueGenders.length > 0 ? uniqueGenders : null,
    topNotes: uniqueTopNotes.length > 0 ? uniqueTopNotes : null,
    aromas: uniqueAromas.length > 0 ? uniqueAromas : null,
    heartNotes: uniqueHeartNotes.length > 0 ? uniqueHeartNotes : null,
    baseNotes: uniqueBaseNotes.length > 0 ? uniqueBaseNotes : null,
  };
  return availableFilters;
};
