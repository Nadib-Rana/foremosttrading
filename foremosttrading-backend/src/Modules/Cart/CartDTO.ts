import { z } from "zod";

export const addItemSchema = {
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().min(1).default(1),
  })
};
export type AddItemDTO = z.infer<typeof addItemSchema.body>;

export const updateItemSchema = {
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
  })
};
export type UpdateItemDTO = z.infer<typeof updateItemSchema.body>;
