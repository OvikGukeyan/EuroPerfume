import { z } from "zod";
import { Gender, PerfumeConcentration } from "@prisma/client";

export const CreateProductSchema = z
  .object({
    productName: z.string().min(1, { message: "Name is required" }),
    image: z.array(z.instanceof(File)).optional(),
    variations: z.array(z.instanceof(File)).optional(),
    video: z.string().url({ message: "Invalid video URL" }).optional(),

    descriptionRu: z
      .string()
      .min(10, { message: "Description should be at least 10 characters" }),
    descriptionDe: z
      .string()
      .min(10, { message: "Description should be at least 10 characters" }),

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
    gender: z.nativeEnum(Gender).optional(),
    brand: z.string().min(1, { message: "Brand is required" }),

    releaseYear: z
      .preprocess(
        (val) => (typeof val === "string" ? Number(val) : val),
        z
          .number()
          .int()
          .min(1900, { message: "Release year must be 1900 or later" })
          .max(new Date().getFullYear(), {
            message: "Release year cannot be in the future",
          })
      )
      .optional(),

    categoryId: z.coerce.number().int(),
    age: z.coerce.number().int().optional(),
    series: z.string().optional(),
    productGroupId: z.coerce.number().int(),

    purpose: z.array(z.string()).optional(),
    finish: z.array(z.string()).optional(),
    texture: z.array(z.string()).optional(),
    formula: z.array(z.string()).optional(),
    effect: z.array(z.string()).optional(),
    effectDuration: z.coerce.number().int().optional(),
    hypoallergenic: z.string().optional(),
    applicationMethod: z.array(z.string()).optional(),
    packagingFormat: z.array(z.string()).optional(),
    volume: z.string().optional(),
    skinType: z.array(z.string()).optional(),

    classification: z.array(z.string()).optional(),
    concentration: z.nativeEnum(PerfumeConcentration).optional(),
    perfumer: z.string().optional(),
    aromas: z.array(z.string()).optional(),

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
      message:
        "You must provide either an image or at least one variation image.",
      path: ["image"],
    }
  );

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
