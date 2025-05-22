import { NoteType } from "@prisma/client";
import { ProductDTO } from "../services/dto/product.dto";

export const getAvailableFilters = (products: ProductDTO[]) => {
  const uniqueBrands = [
    ...new Set(
      products.map((p) => ({
        text: p.brand.name,
        value: p.brand.id.toString(),
      }))
    ),
  ];

  const uniqueClassifications = [
    ...new Set(
      products.flatMap((p) =>
        p.classification.length > 0
          ? {
              text: p.classification.toString(),
              value: p.classification.toString(),
            }
          : []
      )
    ),
  ];
  const uniqueConcentrations = [
    ...new Set(
      products.flatMap((p) =>
        p.classification.length > 0
          ? {
              text: p.concentration?.toString() || "",
              value: p.concentration?.toString() || "",
            }
          : []
      )
    ),
  ];

  const uniqueGenders = [
    ...new Set(
      products.flatMap((p) =>
        p.gender
          ? {
              text: p.gender.toString(),
              value: p.gender.toString(),
            }
          : []
      )
    ),
  ];

  const uniqueTopNotes = [
    ...new Set(
      products.flatMap((p) =>
        p.productNotes
          .filter((pn) => pn.noteType === NoteType.TOP)
          .map((pn) => ({
            text: pn.note.labelRu,
            value: pn.note.id.toString(),
          }))
      )
    ),
  ];
  const uniqueHeartNotes = [
    ...new Set(
      products.flatMap((p) =>
        p.productNotes
          .filter((pn) => pn.noteType === NoteType.HEART)
          .map((pn) => ({
            text: pn.note.labelRu,
            value: pn.note.id.toString(),
          }))
      )
    ),
  ];
  const uniqueBaseNotes = [
    ...new Set(
      products.flatMap((p) =>
        p.productNotes
          .filter((pn) => pn.noteType === NoteType.BASE)
          .map((pn) => ({
            text: pn.note.labelRu,
            value: pn.note.id.toString(),
          }))
      )
    ),
  ];
  const uniqueAromas = [
    ...new Set(
      products.flatMap((p) =>
        p.aromas.map((a) => ({ text: a.labelRu, value: a.id.toString() }))
      )
    ),
  ];
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
