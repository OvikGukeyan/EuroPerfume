import { z } from "zod";
import {
  Gender,
  Classifications,
  PerfumeConcentration,
  Purpose,
  Finish,
  Texture,
  Formula,
  Effects,
  ApplicationMethod,
  PackagingFormat,
  SkinType,
  Aromas,
} from "@prisma/client";

export const CreateProductSchema = z
  .object({
    productName: z.string().min(1, { message: "Name is required" }),
    image: z.array(z.instanceof(File)).optional(),
    variations: z.array(z.instanceof(File)).optional(),

    descriptionRu: z.string().min(10, { message: "Description should be at least 10 characters" }),
    descriptionDe: z.string().min(10, { message: "Description should be at least 10 characters" }),

    brandCountryRu: z.string(),
    brandCountryDe: z.string(),
    manufacturingCountryRu: z.string(),
    manufacturingCountryDe: z.string(),

    compositionFeaturesRu: z.string().optional(),
    compositionFeaturesDe: z.string().optional(),
    activeIngredientsRu: z.string().optional(),
    activeIngredientsDe: z.string().optional(),
    materialRu: z.string().optional(),
    materialDe: z.string().optional(),
    colorPaletteRu: z.string().optional(),
    colorPaletteDe: z.string().optional(),
    certificatesRu: z.string().optional(),
    certificatesDe: z.string().optional(),
    ethicsRu: z.string().optional(),
    ethicsDe: z.string().optional(),

    price: z.coerce.number().positive({ message: "Price must be positive" }),
    gender: z.nativeEnum(Gender),
    brand: z.string().min(1, { message: "Brand is required" }),

    releaseYear: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z
        .number()
        .int()
        .min(1900, { message: "Release year must be 1900 or later" })
        .max(new Date().getFullYear(), { message: "Release year cannot be in the future" })
    ),

    categoryId: z.coerce.number().int(),
    age: z.coerce.number().int().optional(),
    series: z.string().optional(),
    productGroupId: z.coerce.number().int(),

    purpose: z.nativeEnum(Purpose).optional(),
    finish: z.nativeEnum(Finish).optional(),
    texture: z.nativeEnum(Texture).optional(),
    formula: z.nativeEnum(Formula).optional(),
    effect: z.nativeEnum(Effects).optional(),
    effectDuration: z.coerce.number().int().optional(),
    hypoallergenic: z.string().optional(),
    applicationMethod: z.nativeEnum(ApplicationMethod).optional(),
    packagingFormat: z.nativeEnum(PackagingFormat).optional(),
    volume: z.string().optional(),
    skinType: z.nativeEnum(SkinType).optional(),

    classification: z.array(z.nativeEnum(Classifications)).optional(),
    concentration: z.nativeEnum(PerfumeConcentration).optional(),
    perfumer: z.string().optional(),
    aromas: z.array(z.nativeEnum(Aromas)).optional(),

    topNotes: z.array(z.string()).optional(),
    heartNotes: z.array(z.string()).optional(),
    baseNotes: z.array(z.string()).optional(),

    size: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.image && data.image.length > 0) ||
      (data.variations && data.variations.length > 0),
    {
      message: "You must provide either an image or at least one variation image.",
      path: ["image"],
    }
  );

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;