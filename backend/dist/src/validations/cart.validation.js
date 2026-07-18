"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItemSchema = exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productId: zod_1.z
        .string({
        message: "Product id is required",
    })
        .uuid("Invalid product id"),
    quantity: zod_1.z.coerce
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1")
        .max(10, "Maximum 10 items can be added at once")
        .default(1),
});
exports.updateCartItemSchema = zod_1.z.object({
    itemId: zod_1.z.coerce
        .string({ message: "product Id Not found" }),
    quantity: zod_1.z.coerce
        .number()
        .int()
        .min(1)
        .max(10),
});
exports.removeCartItemSchema = zod_1.z.object({
    itemId: zod_1.z
        .string({
        message: "Cart item id is required",
    })
        .uuid("Invalid cart item id"),
});
