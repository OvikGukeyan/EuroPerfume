import { z } from "zod";

export const CreateSupplySchema = z.object({
  supplier: z.string(),
  invoiceNumber: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number(),
      amountMl: z.number().min(1),
    })
  ),
});

export type CreateSupplyInput = z.infer<typeof CreateSupplySchema>;