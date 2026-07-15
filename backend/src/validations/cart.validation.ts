import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z
    .string({
      message: "Product id is required",
    })
    .uuid("Invalid product id"),

  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(10, "Maximum 10 items can be added at once")
    .default(1),
});

export const updateCartItemSchema = z.object({
  itemId: z.coerce
    .string({ message:"product Id Not found"}),

  quantity: z.coerce
    .number()
    .int()
    .min(1)
    .max(10),
});

export const removeCartItemSchema = z.object({
  itemId: z
    .string({
      message: "Cart item id is required",
    })
    .uuid("Invalid cart item id"),
});