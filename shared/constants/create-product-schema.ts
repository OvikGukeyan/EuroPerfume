import { z } from "zod";
import {
  Gender,
  PerfumeConcentration,
  Brands,
  Notes,
  Types,
  Aromas,
} from "@prisma/client";

export const CreateProductSchema = z.object({
  productName: z.string().min(1, { message: "Name is required" }),
  image: z.instanceof(File, { message: "Image must be a valid file" }),
  descriptionRu: z
    .string()
    .min(10, { message: "Description should be at least 10 characters" }),
  descriptionDe: z
    .string()
    .min(10, { message: "Description should be at least 10 characters" }),
  price: z.coerce.number().int().positive({ message: "Price must be positive" }),

  gender: z.nativeEnum(Gender),

  concentration: z.nativeEnum(PerfumeConcentration),
  brand: z.nativeEnum(Brands),
  brandCountry: z.string(),
  manufacturingCountry: z.string(),
  perfumer: z.string(),
  aromas: z.array(z.nativeEnum(Aromas)),
  topNotes: z.array(z.nativeEnum(Notes)),
  heartNotes: z.array(z.nativeEnum(Notes)),
  baseNotes: z.array(z.nativeEnum(Notes)),
  types: z.array(z.nativeEnum(Types)),
  releaseYear: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number()
      .int()
      .min(1900, { message: "Release year must be 1900 or later" })
      .max(new Date().getFullYear(), {
        message: "Release year cannot be in the future",
      })
  ),
  categoryId: z.number().int(),
});

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;

