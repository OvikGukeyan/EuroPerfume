import { StockUnit } from "@prisma/client";
import { z } from "zod";

export const CreateSupplyItemSchema = z.object({
  productId: z.number().int().positive(),
  variationId: z.number().int().positive().optional(),

  quantity: z.number().positive(),
  unit: z.nativeEnum(StockUnit),

  costPrice: z.number().positive().optional(),
  reason: z.string().optional(),
});

export const CreateSupplySchema = z.object({
  supplier: z.string().optional(),
  comment: z.string().optional(),

  items: z.array(CreateSupplyItemSchema).min(1),
});

export type CreateSupplyInput = z.infer<typeof CreateSupplySchema>;