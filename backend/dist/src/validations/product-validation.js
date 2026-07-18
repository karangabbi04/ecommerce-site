"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIdParamsSchema = exports.productQuerySchema = void 0;
const zod_1 = require("zod");
const product_constants_1 = require("../constants/product.constants");
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .default(product_constants_1.DEFAULT_PAGE),
    limit: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(product_constants_1.MAX_LIMIT)
        .default(product_constants_1.DEFAULT_LIMIT),
    search: zod_1.z
        .string()
        .trim()
        .optional(),
    category: zod_1.z
        .string()
        .trim()
        .optional(),
    featured: zod_1.z.coerce
        .boolean()
        .optional(),
    sort: zod_1.z
        .enum(product_constants_1.PRODUCT_SORT_VALUES)
        .optional(),
});
exports.productIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("invalid product id")
});
