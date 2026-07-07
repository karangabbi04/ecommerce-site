import { z } from "zod";

import {
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    MAX_LIMIT,
    PRODUCT_SORT_VALUES,
} from "../constants/product.constants";



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


export const productIdParamsSchema = z.object({

    id: z.string().uuid("invalid product id")
})
export type productId = z.infer<typeof productIdParamsSchema>;