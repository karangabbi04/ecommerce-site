import { z } from "zod";

import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    MAX_LIMIT,
    PRODUCT_SORT_VALUES,
} from "../constants/product.constants.js";



export const productQuerySchema = z.object({

    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(DEFAULT_PAGE),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(MAX_LIMIT)
        .default(DEFAULT_LIMIT),

    search: z
        .string()
        .trim()
        .optional(),

    category: z
        .string()
        .trim()
        .optional(),

    featured: z.coerce
        .boolean()
        .optional(),

    sort: z
        .enum(PRODUCT_SORT_VALUES as [string, ...string[]])
        .optional(),

});

export type ProductQueryDto =
    z.infer<typeof productQuerySchema>;

export const adminProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  status: z.enum(["ALL", "ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  stockStatus: z.enum(["LOW_STOCK", "OUT_OF_STOCK", "IN_STOCK"]).optional(),
  categoryId: z.string().trim().min(1).optional(),
  search: z.string().trim().optional(),
  lowStockThreshold: z.coerce.number().int().min(1).default(10),
});

export type AdminProductQueryDto = z.infer<typeof adminProductQuerySchema>;


export const productIdParamsSchema = z.object({

    id: z.string().uuid("invalid product id")
})
export type productId = z.infer<typeof productIdParamsSchema>;


export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters"),

  description: z
    .string()
    .min(3, "Description must be at least 10 characters"),

  price: z
    .coerce.number()
    .positive("Price must be greater than 0"),

  stock: z
    .coerce.number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  category: z
    .string()
    .min(2, "Category is required"),
    
    status:z.enum(["ACTIVE", "DRAFT","ARCHIVED"]),

    tag: z.string().optional(),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;