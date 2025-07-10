import { z } from "zod";

export const CreatePromocodeSchema = z.object({
    code: z.string().min(1, { message: "Code is required" }),
    discount: z.coerce.number().int().min(1, { message: "Discount is required" }),
    expirationDate: z.date(),
});

export type CreatePromocodeValues = z.infer<typeof CreatePromocodeSchema>;